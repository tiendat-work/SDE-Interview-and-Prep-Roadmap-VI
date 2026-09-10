# Kiến trúc hướng sự kiện (EDA - Event-Driven Architecture)

## Khái niệm

**Kiến trúc hướng sự kiện (EDA - Event-Driven Architecture)** là một phong cách thiết kế phần mềm trong đó các thành phần giao tiếp với nhau bằng cách sản sinh và phản ứng với các **sự kiện (events)**. Một sự kiện là bản ghi bất biến (immutable) mô tả một điều gì đó **đã xảy ra** trong hệ thống (ví dụ: "ĐơnHàngĐãĐặt", "ThanhToánThànhCông"). Thay vì gọi trực tiếp lẫn nhau, các dịch vụ phát sự kiện và các dịch vụ khác quan tâm sẽ lắng nghe và phản ứng.

## Khi nào dùng / Vì sao quan trọng

- Khi cần **liên kết lỏng lẻo (loose coupling)** cao giữa các thành phần: bên phát không cần biết ai tiêu thụ sự kiện.
- Khi hệ thống cần **phản ứng theo thời gian thực** với các thay đổi trạng thái.
- Khi cần **mở rộng độc lập** và bổ sung tính năng mới bằng cách thêm consumer mới mà không sửa producer.
- Trong microservices, IoT, hệ thống phân tích thời gian thực, và các luồng dữ liệu lớn.

## Thành phần

1. **Nguồn sự kiện / Producer (Event Producer)**: Thành phần phát ra sự kiện khi có điều gì xảy ra.
2. **Sự kiện (Event)**: Thông điệp bất biến mô tả sự việc đã xảy ra kèm dữ liệu liên quan.
3. **Bộ định tuyến / Kênh sự kiện (Event Broker / Channel)**: Trung gian nhận, lưu và chuyển sự kiện (ví dụ: Kafka, AWS EventBridge).
4. **Bên tiêu thụ / Consumer (Event Consumer)**: Thành phần lắng nghe và phản ứng với sự kiện.

```
[Producer] --phát sự kiện--> [ EVENT BROKER (Kafka) ] --> [Consumer A: Kho]
                                        |                --> [Consumer B: Email]
                                        \                --> [Consumer C: Phân tích]
```

## Các mô hình xử lý sự kiện

- **Đơn sự kiện (Simple Event Processing)**: Mỗi sự kiện kích hoạt một hành động trực tiếp.
- **Xử lý luồng/phức hợp (Complex Event Processing - CEP)**: Phân tích nhiều sự kiện theo thời gian để phát hiện mẫu (pattern), ví dụ phát hiện gian lận.

## Event Sourcing

**Event Sourcing** là mẫu thiết kế lưu trữ trạng thái của hệ thống dưới dạng một **chuỗi sự kiện tuần tự** thay vì chỉ lưu trạng thái hiện tại. Trạng thái hiện tại được tái dựng bằng cách phát lại (replay) toàn bộ sự kiện từ đầu.

- **Ưu điểm**: Có lịch sử đầy đủ (audit log), có thể tái dựng trạng thái tại bất kỳ thời điểm nào, dễ gỡ lỗi và phân tích.
- **Nhược điểm**: Phức tạp hơn, cần xử lý việc phát lại và **snapshot (ảnh chụp)** để tối ưu hiệu năng.

## CQRS (Command Query Responsibility Segregation)

**CQRS (Command Query Responsibility Segregation)** là mẫu tách riêng đường **ghi (command)** và đường **đọc (query)** thành hai mô hình khác nhau.

- **Lệnh (Command)**: Thay đổi trạng thái (ghi), thường phát sinh sự kiện.
- **Truy vấn (Query)**: Chỉ đọc, dùng mô hình dữ liệu được tối ưu riêng cho đọc.

CQRS thường kết hợp với Event Sourcing: lệnh sinh sự kiện, sự kiện cập nhật mô hình đọc (read model). Điều này cho phép tối ưu độc lập hai phía và mở rộng phần đọc riêng biệt.

```
[Command] --> [Write Model] --phát sự kiện--> [Event Store]
                                                    |
                                          cập nhật read model
                                                    v
[Query]   <-- [Read Model (tối ưu cho đọc)] <-------
```

## Triển khai với Kafka

```python
# Minh hoạ producer/consumer sự kiện với Kafka dùng thư viện kafka-python
from kafka import KafkaProducer, KafkaConsumer
import json

# --- Producer: phát sự kiện "ĐơnHàngĐãĐặt" ---
producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode(),  # tuần tự hóa sang JSON
)
su_kien = {"loai": "DonHangDaDat", "ma_don": "DH001", "so_tien": 500000}
producer.send("don-hang", su_kien)   # phát vào topic "don-hang"
producer.flush()

# --- Consumer: lắng nghe và phản ứng ---
consumer = KafkaConsumer(
    "don-hang",
    bootstrap_servers="localhost:9092",
    group_id="dich-vu-kho",          # nhóm consumer để chia tải
    value_deserializer=lambda b: json.loads(b.decode()),
    auto_offset_reset="earliest",     # đọc lại từ đầu nếu chưa có offset
)
for msg in consumer:
    su_kien = msg.value
    print("Kho nhan su kien:", su_kien)  # phản ứng: trừ tồn kho...
```

## Ưu / nhược điểm

- **Ưu:**
  - **Liên kết lỏng lẻo** tối đa: producer và consumer độc lập hoàn toàn.
  - **Khả năng mở rộng**: thêm consumer mới không ảnh hưởng producer.
  - **Phản ứng thời gian thực** với thay đổi trạng thái.
  - Chịu lỗi tốt: sự kiện được lưu bền vững, có thể phát lại.
- **Nhược:**
  - **Khó theo dõi luồng** (khó biết toàn bộ hệ quả của một sự kiện).
  - **Nhất quán cuối cùng (eventual consistency)** thay vì nhất quán tức thời.
  - Gỡ lỗi và kiểm thử phức tạp.
  - Cần xử lý sự kiện trùng lặp (idempotency) và thứ tự.

## Câu hỏi phỏng vấn thường gặp

1. **EDA là gì và khác gì so với kiến trúc gọi trực tiếp (request-response)?**
   - EDA giao tiếp qua sự kiện bất đồng bộ, liên kết lỏng lẻo; request-response gọi trực tiếp và đồng bộ, gắn kết chặt hơn.
2. **Event Sourcing là gì?**
   - Là mẫu lưu trạng thái dưới dạng chuỗi sự kiện; trạng thái hiện tại được tái dựng bằng cách phát lại các sự kiện.
3. **CQRS giải quyết vấn đề gì?**
   - Tách đường đọc và ghi thành hai mô hình để tối ưu và mở rộng độc lập, thường kết hợp với Event Sourcing.
4. **Nhất quán cuối cùng (eventual consistency) là gì và vì sao xuất hiện trong EDA?**
   - Do sự kiện được xử lý bất đồng bộ nên các thành phần đạt trạng thái nhất quán sau một khoảng trễ, không tức thời.
5. **Vì sao consumer trong EDA cần idempotent?**
   - Vì sự kiện có thể được giao lại nhiều lần; xử lý bất biến tránh tác dụng phụ trùng lặp.

## Tham khảo

- Martin Fowler — Event Sourcing, CQRS
- Confluent — Event-Driven Architecture with Kafka
