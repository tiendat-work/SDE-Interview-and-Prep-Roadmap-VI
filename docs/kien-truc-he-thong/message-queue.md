# Hàng đợi thông điệp (Message Queue)

## Khái niệm

**Hàng đợi thông điệp (Message Queue)** là một cơ chế giao tiếp bất đồng bộ (asynchronous communication) giữa các thành phần trong hệ thống phân tán. Bên gửi (producer) đặt thông điệp (message) vào hàng đợi, và bên nhận (consumer) lấy thông điệp ra để xử lý sau đó. Producer và consumer không cần hoạt động cùng lúc, cũng không cần biết đến nhau — chúng được **tách rời (decoupled)** thông qua một hệ thống trung gian gọi là **message broker (bộ môi giới thông điệp)**.

## Khi nào dùng / Vì sao quan trọng

- **Tách rời các dịch vụ (decoupling)**: Producer và consumer phát triển, mở rộng và triển khai độc lập.
- **Cân bằng tải và điều tiết (load leveling)**: Hàng đợi hấp thụ đỉnh tải (burst), consumer xử lý theo nhịp độ của mình.
- **Xử lý bất đồng bộ**: Tác vụ tốn thời gian (gửi email, xử lý ảnh, xuất báo cáo) được đẩy vào hàng đợi để xử lý nền, người dùng không phải chờ.
- **Độ tin cậy (reliability)**: Thông điệp được lưu bền vững (persistence), không mất khi consumer tạm ngừng.

### Use case tiêu biểu

- Xử lý đơn hàng thương mại điện tử (đặt hàng → hàng đợi → kho, thanh toán, giao vận).
- Gửi thông báo/email hàng loạt.
- Thu thập và xử lý nhật ký (log), sự kiện (event), dữ liệu IoT.
- Truyền dữ liệu giữa các microservice.

## Cách hoạt động

```
[Producer] --gửi msg--> [ MESSAGE BROKER / QUEUE ] --lấy msg--> [Consumer]
                              |  msg1 | msg2 | msg3 |
```

Sơ đồ dưới đây minh hoạ luồng bất đồng bộ producer → hàng đợi → consumer:

```mermaid
flowchart LR
    P["Producer (bên gửi)"] -->|"Gửi thông điệp"| Q["Message Broker / Hàng đợi"]
    Q -->|"Lấy thông điệp"| C["Consumer (bên nhận)"]
    C -->|"Ack (xác nhận)"| Q
    Q -.->|"Lỗi sau nhiều lần thử"| DLQ["Dead Letter Queue"]
```

1. Producer gửi thông điệp tới broker.
2. Broker lưu thông điệp (có thể bền vững trên đĩa).
3. Consumer lấy thông điệp ra (pull) hoặc được đẩy (push) và xử lý.
4. Sau khi xử lý xong, consumer gửi **xác nhận (acknowledgement / ack)**; broker mới xóa thông điệp. Nếu không có ack, thông điệp được giao lại (redelivery).

### Hai mô hình phân phối

| Mô hình | Mô tả |
|---------|-------|
| **Point-to-Point (hàng đợi)** | Mỗi thông điệp được đúng **một** consumer xử lý. Dùng để phân chia công việc. |
| **Publish/Subscribe (pub/sub)** | Mỗi thông điệp được gửi tới **tất cả** subscriber đăng ký một chủ đề (topic). Dùng để phát tán sự kiện. |

Trong mô hình point-to-point, nhiều consumer có thể cùng lấy từ một hàng đợi để chia tải — gọi là **competing consumers (consumer cạnh tranh)**. Broker phân phối mỗi thông điệp cho đúng **một** consumer rảnh, giúp xử lý song song và mở rộng ngang:

```mermaid
flowchart LR
    P["Producer"] -->|"Gửi thông điệp"| Q["Hàng đợi don-hang"]
    Q -->|"msg 1, 4"| C1["Consumer 1"]
    Q -->|"msg 2, 5"| C2["Consumer 2"]
    Q -->|"msg 3, 6"| C3["Consumer 3"]
```

Trong Kafka, cơ chế tương tự được gọi là **consumer group**: mỗi partition của topic được gán cho đúng một consumer trong group, nên các consumer trong cùng group chia nhau các partition để xử lý song song (không trùng lặp):

```mermaid
flowchart LR
    T["Topic don-hang"] --> PA["Partition 0"]
    T --> PB["Partition 1"]
    T --> PC["Partition 2"]
    subgraph G["Consumer Group: dich-vu-kho"]
        CA["Consumer A"]
        CB["Consumer B"]
    end
    PA --> CA
    PB --> CA
    PC --> CB
```

### Các khái niệm quan trọng

- **Ack / Nack**: Xác nhận xử lý thành công/thất bại.
- **Dead Letter Queue (DLQ)**: Hàng đợi chứa thông điệp lỗi/không xử lý được sau nhiều lần thử.
- **At-least-once / At-most-once / Exactly-once**: Các mức đảm bảo giao nhận.
- **Idempotency (tính bất biến)**: Consumer nên xử lý an toàn khi cùng một thông điệp bị giao lại.

### Publish/Subscribe (pub/sub) chi tiết

Trong pub/sub, producer (publisher) không gửi tới một hàng đợi cụ thể mà **phát tới một chủ đề (topic)**; mọi consumer (subscriber) đăng ký topic đó đều nhận được một **bản sao riêng** của thông điệp. Điều này khác point-to-point (mỗi thông điệp chỉ một consumer nhận).

```mermaid
flowchart LR
    PUB["Publisher"] -->|"Phát sự kiện"| T{"Topic: don-hang"}
    T --> S1["Subscriber: Kho"]
    T --> S2["Subscriber: Email"]
    T --> S3["Subscriber: Phân tích"]
```

Trong RabbitMQ, pub/sub được cài đặt qua **exchange kiểu fanout** (gửi tới mọi hàng đợi ràng buộc) hoặc **topic** (định tuyến theo mẫu routing key như `don.*.vip`). Trong Kafka, mọi consumer thuộc các **consumer group khác nhau** đều nhận toàn bộ thông điệp của topic; consumer trong cùng một group thì chia nhau các partition (mô hình chia tải).

### Dead Letter Queue (DLQ) chi tiết

Khi một thông điệp không xử lý được, thay vì lặp lại vô hạn hoặc mất, nó được chuyển sang DLQ. Thông điệp rơi vào DLQ khi:

- Bị từ chối (nack/reject) và không yêu cầu giao lại.
- Vượt quá **số lần thử lại tối đa (max retries)**.
- Hết hạn TTL trong hàng đợi.
- Vượt quá giới hạn độ dài hàng đợi.

**Quy trình xử lý DLQ điển hình:** giám sát DLQ → cảnh báo → phân tích nguyên nhân (dữ liệu hỏng, lỗi tạm thời, bug) → sửa và **phát lại (replay)** hoặc loại bỏ. Nên dùng cơ chế **retry với backoff lũy thừa** trước khi đưa vào DLQ, tránh dồn tải khi lỗi tạm thời.

## Ví dụ

```python
# Minh hoạ producer/consumer với RabbitMQ dùng thư viện pika

import pika

# --- Producer: gửi thông điệp ---
conn = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
ch = conn.channel()
ch.queue_declare(queue="don_hang", durable=True)  # hàng đợi bền vững

ch.basic_publish(
    exchange="",
    routing_key="don_hang",
    body="DON_HANG_001",
    properties=pika.BasicProperties(delivery_mode=2),  # lưu bền vững msg
)
print("Da gui don hang vao hang doi")

# --- Consumer: nhận và xử lý ---
def xu_ly(ch, method, props, body):
    print("Dang xu ly:", body.decode())
    ch.basic_ack(delivery_tag=method.delivery_tag)  # xác nhận sau khi xong

ch.basic_qos(prefetch_count=1)  # mỗi lần chỉ nhận 1 msg để cân bằng tải
ch.basic_consume(queue="don_hang", on_message_callback=xu_ly)
ch.start_consuming()
```

## RabbitMQ vs Kafka

| Tiêu chí | RabbitMQ | Apache Kafka |
|----------|----------|--------------|
| Bản chất | Message broker truyền thống (hàng đợi) | Nền tảng streaming/log phân tán (distributed log) |
| Mô hình | Đẩy (push) tới consumer, xóa sau khi ack | Consumer tự đọc theo offset, log được giữ lại |
| Lưu trữ | Xóa msg sau khi xử lý | Giữ msg theo thời gian/kích thước, cho phép đọc lại (replay) |
| Định tuyến | Linh hoạt (exchange: direct, topic, fanout) | Theo topic + partition |
| Thông lượng | Trung bình đến cao | Rất cao (hàng triệu msg/giây) |
| Thứ tự | Theo hàng đợi | Đảm bảo trong từng partition |
| Use case | Tác vụ nền, RPC, định tuyến phức tạp | Log, event streaming, phân tích dữ liệu lớn, event sourcing |

**Tóm tắt lựa chọn:** Dùng **RabbitMQ** khi cần định tuyến linh hoạt và mô hình tác vụ truyền thống với độ trễ thấp. Dùng **Kafka** khi cần thông lượng cực cao, lưu và phát lại luồng sự kiện, hoặc xây dựng đường ống dữ liệu (data pipeline).

### Kiến trúc RabbitMQ vs Kafka chi tiết

**RabbitMQ** hoạt động theo mô hình **broker thông minh, consumer đơn giản**:

- Trung tâm là **exchange** nhận thông điệp từ producer và định tuyến tới các **queue** theo **binding** và **routing key**.
- Bốn kiểu exchange: `direct` (khớp routing key chính xác), `topic` (khớp mẫu), `fanout` (gửi tất cả), `headers` (khớp theo header).
- Broker đẩy (push) thông điệp tới consumer, theo dõi ack, và **xóa thông điệp sau khi được ack**.
- Phù hợp: hàng đợi tác vụ, RPC, định tuyến phức tạp, ưu tiên thông điệp, độ trễ thấp.

**Kafka** hoạt động theo mô hình **log phân tán, consumer thông minh**:

- Mỗi **topic** chia thành nhiều **partition**; thông điệp được ghi tuần tự (append-only log) và **giữ lại theo thời gian/kích thước** (retention), không xóa sau khi đọc.
- Consumer tự quản lý **offset** (vị trí đọc), có thể tua lại để **phát lại (replay)** dữ liệu.
- Thứ tự chỉ đảm bảo **trong từng partition**; khóa phân vùng (partition key) quyết định thông điệp vào partition nào.
- Nhân bản partition (replication) qua nhiều broker để chịu lỗi.
- Phù hợp: streaming sự kiện, event sourcing, đường ống dữ liệu, phân tích thời gian thực, thông lượng hàng triệu msg/giây.

| Khía cạnh | RabbitMQ | Apache Kafka |
|-----------|----------|--------------|
| Mô hình lưu trữ | Hàng đợi, xóa sau ack | Log append-only, giữ theo retention |
| Cơ chế nhận | Push tới consumer | Consumer pull theo offset |
| Phát lại (replay) | Không (đã xóa) | Có (đọc lại từ offset bất kỳ) |
| Định tuyến | Linh hoạt (4 kiểu exchange) | Theo topic + partition key |
| Thứ tự | Theo hàng đợi | Trong từng partition |
| Thông lượng | Chục nghìn msg/giây | Hàng triệu msg/giây |
| Mở rộng ngang | Khó hơn (mirror queue) | Dễ (thêm partition/broker) |
| Độ trễ | Rất thấp | Thấp, tối ưu cho throughput |
| Tình huống điển hình | Tác vụ nền, RPC, ưu tiên | Event streaming, log, analytics |

## Ưu / nhược điểm

- **Ưu:**
  - Tách rời dịch vụ, tăng khả năng chịu lỗi và mở rộng.
  - Hấp thụ đỉnh tải, làm mượt lưu lượng.
  - Xử lý bất đồng bộ, cải thiện trải nghiệm người dùng.
- **Nhược:**
  - Tăng độ phức tạp vận hành (thêm một hệ thống phải giám sát).
  - Khó đảm bảo thứ tự và "exactly-once" tuyệt đối.
  - Khó gỡ lỗi luồng bất đồng bộ; cần giám sát DLQ và độ trễ.

## Playground: Mô phỏng hàng đợi producer/consumer

Demo dưới đây mô phỏng một producer đẩy nhiều thông điệp vào hàng đợi FIFO, và consumer lấy ra xử lý **đúng thứ tự vào trước ra trước**. Một thông điệp bị lỗi sẽ được thử lại; nếu quá số lần thử sẽ chuyển sang **DLQ**.

<div class="js-demo" data-title="Hàng đợi producer/consumer + DLQ">
<textarea class="js-demo-src">
// Mô phỏng message queue FIFO với ack, retry và DLQ
class MessageQueue {
  constructor() { this.queue = []; this.dlq = []; }
  publish(msg) {                         // producer đẩy vào cuối hàng đợi
    this.queue.push({ ...msg, tries: 0 });
    print(`[Producer] gửi: ${msg.id} (${msg.noi_dung})`);
  }
  consume(xuLy, maxRetries = 2) {        // consumer lấy ra từ đầu hàng đợi
    while (this.queue.length > 0) {
      const msg = this.queue.shift();    // FIFO: vào trước ra trước
      try {
        xuLy(msg);                       // thử xử lý
        print(`[Consumer] ack: ${msg.id}`);
      } catch (e) {
        msg.tries++;
        if (msg.tries > maxRetries) {
          this.dlq.push(msg);
          print(`[Consumer] ${msg.id} lỗi ${msg.tries} lần -> chuyển DLQ`);
        } else {
          this.queue.push(msg);          // đẩy lại để thử tiếp
          print(`[Consumer] ${msg.id} lỗi, thử lại lần ${msg.tries}`);
        }
      }
    }
  }
}

const mq = new MessageQueue();
mq.publish({ id: 'M1', noi_dung: 'don hang 1' });
mq.publish({ id: 'M2', noi_dung: 'LOI' });      // thông điệp gây lỗi
mq.publish({ id: 'M3', noi_dung: 'don hang 3' });

print('--- Consumer bắt đầu xử lý ---');
mq.consume(msg => {
  if (msg.noi_dung === 'LOI') throw new Error('xử lý thất bại');
  // xử lý thành công thì không làm gì thêm
});

print(`--- DLQ chứa ${mq.dlq.length} thông điệp: ${mq.dlq.map(m => m.id).join(', ')}`);
</textarea>
</div>

## Câu hỏi phỏng vấn thường gặp

1. **Message queue giải quyết vấn đề gì?**
   - Tách rời producer/consumer, cho phép giao tiếp bất đồng bộ, hấp thụ đỉnh tải và tăng độ tin cậy.
2. **Phân biệt point-to-point và pub/sub.**
   - Point-to-point: mỗi msg tới đúng một consumer. Pub/sub: mỗi msg tới tất cả subscriber của topic.
3. **RabbitMQ khác Kafka thế nào?**
   - RabbitMQ là broker hàng đợi truyền thống, xóa msg sau ack; Kafka là log phân tán giữ msg lại, cho phép phát lại, thông lượng rất cao.
4. **Đảm bảo giao nhận "at-least-once" nghĩa là gì và hệ quả?**
   - Msg có thể được giao lại nhiều lần; consumer phải xử lý bất biến (idempotent) để tránh xử lý trùng.
5. **Dead Letter Queue dùng làm gì?**
   - Chứa các thông điệp lỗi/không xử lý được để phân tích và xử lý riêng, tránh chặn hàng đợi chính.

## Tham khảo

- RabbitMQ Documentation — Tutorials
- Apache Kafka Documentation — Design
