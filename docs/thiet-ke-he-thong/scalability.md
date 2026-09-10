# Khả năng mở rộng (Scalability)

## Khái niệm
Khả năng mở rộng (scalability) là năng lực của một hệ thống xử lý được lượng công việc tăng lên (nhiều người dùng, nhiều dữ liệu, nhiều yêu cầu hơn) bằng cách bổ sung tài nguyên, mà vẫn giữ hiệu năng chấp nhận được. Một hệ thống mở rộng tốt cho phép tăng thông lượng gần tuyến tính với tài nguyên được thêm vào.

## Khi nào dùng / Vì sao quan trọng
Khi ứng dụng phát triển, một máy chủ đơn lẻ nhanh chóng chạm giới hạn về CPU, bộ nhớ, băng thông hay số kết nối. Thiết kế có tính mở rộng ngay từ đầu giúp tránh việc phải viết lại toàn bộ hệ thống khi lượng tải bùng nổ, đồng thời đảm bảo tính sẵn sàng cao (high availability) và độ trễ (latency) thấp.

## Cách hoạt động

### Mở rộng dọc vs. mở rộng ngang

| Tiêu chí | Mở rộng dọc (Vertical / Scale Up) | Mở rộng ngang (Horizontal / Scale Out) |
|----------|-----------------------------------|-----------------------------------------|
| Cách làm | Nâng cấp một máy mạnh hơn (thêm CPU, RAM) | Thêm nhiều máy chạy song song |
| Giới hạn | Bị chặn bởi phần cứng tối đa | Gần như không giới hạn |
| Chi phí | Tăng theo cấp số nhân | Tăng tuyến tính, dùng máy phổ thông |
| Điểm lỗi đơn | Có (single point of failure) | Giảm nhờ dư thừa (redundancy) |
| Độ phức tạp | Thấp | Cao (cần phối hợp, cân bằng tải) |

### Nhân bản (Replication) vs. phân mảnh (Partitioning)

- **Nhân bản (replication)**: Tạo nhiều bản sao giống nhau của cùng dữ liệu trên nhiều node. Tăng khả năng đọc (read scalability) và tính sẵn sàng. Mô hình phổ biến: **master-slave** (một node ghi, nhiều node đọc) và **multi-master**. Thách thức: giữ các bản sao đồng bộ (consistency).
- **Phân mảnh / phân vùng (partitioning / sharding)**: Chia tập dữ liệu lớn thành các mảnh (shard) nhỏ, mỗi mảnh nằm trên một node khác nhau. Tăng khả năng ghi (write scalability) và cho phép lưu tập dữ liệu vượt dung lượng một máy. Thách thức: chọn khoá phân mảnh (shard key) tốt để tránh "điểm nóng" (hotspot) và xử lý truy vấn liên mảnh.

Trong thực tế, hệ thống lớn kết hợp cả hai: dữ liệu được phân mảnh rồi mỗi mảnh lại được nhân bản.

### Băm nhất quán (Consistent Hashing)
Khi thêm/bớt node trong hệ phân tán, cách băm đơn giản `hash(key) % N` buộc phải sắp xếp lại gần như toàn bộ dữ liệu. **Băm nhất quán (consistent hashing)** đặt cả node và khoá lên một "vòng tròn băm" (hash ring); mỗi khoá thuộc về node kế tiếp theo chiều kim đồng hồ. Khi thêm/bớt một node, chỉ một phần nhỏ khoá bị dịch chuyển. **Node ảo (virtual nodes)** được dùng để phân bố tải đều hơn. Đây là nền tảng của DynamoDB, Cassandra, và nhiều bộ nhớ đệm phân tán.

### Cân bằng tải (Load Balancing)
Bộ cân bằng tải (load balancer) phân phối yêu cầu đến nhiều instance dịch vụ để không máy nào bị quá tải. Các thuật toán phổ biến:
- **Round Robin**: luân phiên lần lượt.
- **Least Connections**: gửi tới node đang có ít kết nối nhất.
- **IP Hash / Sticky Session**: cùng một client luôn tới cùng node (giữ phiên).
- **Weighted**: node mạnh hơn nhận nhiều tải hơn.

Load balancer hoạt động ở tầng 4 (TCP/UDP) hoặc tầng 7 (HTTP), thường kèm kiểm tra tình trạng (health check) để loại bỏ node hỏng. Ví dụ: NGINX, HAProxy, AWS ELB.

### Tự động mở rộng (Auto-Scaling)
Tự động mở rộng tự thêm hoặc bớt instance dựa trên số liệu thời gian thực (CPU, số yêu cầu, độ dài hàng đợi):
- **Reactive scaling**: phản ứng khi tải vượt ngưỡng.
- **Predictive / scheduled scaling**: dự đoán trước theo lịch (ví dụ giờ cao điểm).

Auto-scaling tiết kiệm chi phí (chỉ trả cho tài nguyên đang dùng) và duy trì hiệu năng khi tải biến động. Nó đòi hỏi dịch vụ phải **không trạng thái (stateless)** để instance mới có thể phục vụ ngay.

## Ví dụ
```text
Sơ đồ mở rộng ngang có cân bằng tải:

                    ┌──────────────┐
   Người dùng ───▶  │ Load Balancer│
                    └──────┬───────┘
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        ┌────────┐    ┌────────┐    ┌────────┐
        │ App #1 │    │ App #2 │    │ App #3 │   ◀─ Auto-scaling thêm/bớt
        └───┬────┘    └───┬────┘    └───┬────┘
            └─────────────┼─────────────┘
                          ▼
                 ┌──────────────────┐
                 │  CSDL: 1 master  │  (ghi)
                 │  + N replica     │  (đọc)  ◀─ Nhân bản
                 └──────────────────┘
```

## Các kỹ thuật hỗ trợ mở rộng

- **Bộ nhớ đệm (caching)**: lưu kết quả hay truy cập vào bộ nhớ nhanh (Redis, Memcached) để giảm tải CSDL và độ trễ. Có nhiều tầng: cache trình duyệt, CDN, cache ứng dụng, cache CSDL.
- **Mạng phân phối nội dung (CDN)**: đặt bản sao nội dung tĩnh gần người dùng về mặt địa lý, giảm độ trễ và tải cho máy chủ gốc.
- **Hàng đợi thông điệp (message queue)**: tách rời (decouple) và làm mượt tải đột biến bằng cách xử lý bất đồng bộ (Kafka, RabbitMQ). Tác vụ nặng đưa vào hàng đợi để xử lý dần.
- **Kiến trúc không trạng thái (stateless)**: đẩy trạng thái phiên ra kho ngoài (Redis, DB) để mọi instance đều tương đương, sẵn sàng cho auto-scaling và cân bằng tải.

## Các chỉ số đo lường khả năng mở rộng

| Chỉ số | Ý nghĩa |
|--------|---------|
| Thông lượng (throughput) | Số yêu cầu/giao dịch xử lý được mỗi giây (RPS/TPS) |
| Độ trễ (latency) | Thời gian phản hồi một yêu cầu; quan tâm p50, p95, p99 |
| Khả năng chịu tải (capacity) | Tải tối đa trước khi hiệu năng suy giảm |
| Độ co giãn (elasticity) | Tốc độ hệ thống thích ứng khi tải thay đổi |

**Định luật Amdahl (Amdahl's Law)** nhắc rằng phần tuần tự (không song song hoá được) của chương trình đặt giới hạn trần cho lợi ích khi thêm tài nguyên — không phải cứ thêm máy là nhanh gấp bội.

## Các bẫy thường gặp
- **Điểm nóng (hotspot)**: khoá phân mảnh chọn sai khiến một shard nhận phần lớn tải.
- **Trạng thái phiên dính (sticky session)**: gắn người dùng vào một máy làm khó cân bằng lại tải khi máy đó quá tải hoặc chết.
- **Nghẽn cổ chai ở CSDL**: mở rộng tầng ứng dụng nhưng quên CSDL vẫn là điểm nghẽn chung.
- **Nhất quán bộ nhớ đệm**: dữ liệu cache cũ (stale) khi nguồn thay đổi mà không vô hiệu hoá kịp thời.

## Ưu / nhược điểm
- **Ưu:** xử lý được lượng tải tăng, tăng tính sẵn sàng và độ tin cậy, tối ưu chi phí với auto-scaling.
- **Nhược:** mở rộng ngang tăng độ phức tạp (phối hợp, nhất quán dữ liệu); consistent hashing và sharding khó thiết kế đúng; trạng thái phiên gây khó khi scale.

## Chiến lược khi thiết kế cho khả năng mở rộng
Một quy trình tư duy thường dùng trong phỏng vấn thiết kế hệ thống:

1. **Ước lượng tải (capacity estimation)**: số người dùng, QPS, dung lượng dữ liệu, tỉ lệ đọc/ghi.
2. **Xác định nghẽn cổ chai (bottleneck)**: CPU, bộ nhớ, I/O đĩa, băng thông mạng hay CSDL?
3. **Áp dụng theo thứ tự chi phí tăng dần**: tối ưu mã & truy vấn → thêm cache → nhân bản đọc → mở rộng dọc → mở rộng ngang & sharding.
4. **Đo và lặp lại**: mở rộng là quá trình liên tục, không phải quyết định một lần.

Nguyên tắc vàng: **"đừng tối ưu sớm"** — chỉ mở rộng khi có dữ liệu đo lường chứng minh nhu cầu, tránh phức tạp hoá không cần thiết (đúng tinh thần YAGNI).

## Kết nối với các chủ đề khác
Khả năng mở rộng gắn chặt với [Hệ phân tán](he-phan-tan.md) (nhân bản, quorum, đánh đổi CAP), [Thiết kế CSDL](thiet-ke-csdl.md) (sharding, chỉ mục, cache) và [Microservices](microservices-kien-truc.md) (mở rộng độc lập từng dịch vụ). Consistent hashing xuất hiện lại ở cả bộ nhớ đệm phân tán lẫn sharding CSDL.

## Câu hỏi phỏng vấn thường gặp
1. Phân biệt mở rộng dọc và mở rộng ngang; ưu nhược của mỗi cách.
2. Khi nào chọn nhân bản, khi nào chọn phân mảnh?
3. Tại sao consistent hashing tốt hơn `hash % N` khi cụm thay đổi số node?
4. Các thuật toán cân bằng tải phổ biến và trường hợp dùng.
5. Vì sao dịch vụ cần stateless để auto-scaling hiệu quả?
6. Làm sao xử lý "hotspot" khi phân mảnh dữ liệu?
7. Định luật Amdahl nói gì về giới hạn của việc thêm tài nguyên?
8. Phân biệt latency p50, p95, p99 và vì sao quan tâm phần đuôi (tail latency)?
9. CDN giúp mở rộng như thế nào?
10. Vai trò của message queue trong việc làm mượt tải đột biến.

## Tham khảo
- *Designing Data-Intensive Applications* — Martin Kleppmann
- Xem thêm: [Hệ phân tán](he-phan-tan.md), [Thiết kế & tối ưu cơ sở dữ liệu](thiet-ke-csdl.md)
