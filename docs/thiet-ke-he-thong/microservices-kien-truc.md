# Kiến trúc Microservices — Góc thiết kế hệ thống (Microservices: A System-Design View)

> **Lưu ý:** Trang này tập trung vào các **mẫu và quyết định thiết kế** khi dùng microservices. Phần tổng quan, ưu/nhược điểm, triển khai và bộ câu hỏi chi tiết nằm ở trang [Kiến trúc Microservices (di cư & vận hành)](../kien-truc-he-thong/microservices.md). Đọc chéo cả hai để có bức tranh đầy đủ.

## Khái niệm
Từ góc thiết kế hệ thống, microservices là cách phân rã một ứng dụng thành nhiều dịch vụ nhỏ, tự chủ, liên kết lỏng lẻo (loosely coupled), mỗi dịch vụ sở hữu dữ liệu riêng. Trọng tâm thiết kế nằm ở việc **các dịch vụ phối hợp, giao tiếp và duy trì tính nhất quán** ra sao khi không còn một cơ sở dữ liệu và giao dịch dùng chung.

## Khi nào dùng / Vì sao quan trọng
Khi hệ thống lớn dần, cần cho phép các nhóm phát triển và triển khai độc lập, mở rộng từng phần theo nhu cầu, và cô lập lỗi. Nhưng chia nhỏ dịch vụ đẻ ra các thách thức phân tán: giao dịch trải nhiều dịch vụ, lỗi lan truyền dây chuyền, độ trễ mạng. Các mẫu dưới đây là công cụ tiêu chuẩn để xử lý những thách thức đó.

## Cách hoạt động

### Vũ đạo vs. Điều phối (Choreography vs. Orchestration)
Hai cách phối hợp một quy trình nghiệp vụ trải nhiều dịch vụ:

| | Vũ đạo (Choreography) | Điều phối (Orchestration) |
|---|------------------------|----------------------------|
| Kiểm soát | Phi tập trung — mỗi dịch vụ tự phản ứng với sự kiện | Tập trung — một "nhạc trưởng" (orchestrator) ra lệnh |
| Giao tiếp | Hướng sự kiện (event-driven), qua message broker | Lệnh gọi trực tiếp từ bộ điều phối |
| Ưu điểm | Liên kết lỏng, dễ mở rộng, không nghẽn trung tâm | Luồng rõ ràng, dễ theo dõi và gỡ lỗi |
| Nhược điểm | Khó theo dõi luồng tổng thể | Điểm phụ thuộc/lỗi trung tâm, dễ thành nghẽn |

*Kinh nghiệm:* quy trình đơn giản → vũ đạo; quy trình phức tạp cần điều phối chặt và giám sát → orchestration.

### API Gateway
Một cổng (API gateway) đứng trước các dịch vụ, làm điểm vào duy nhất cho client. Nó đảm nhận các mối quan tâm xuyên suốt (cross-cutting concerns): định tuyến yêu cầu, xác thực/phân quyền, giới hạn tốc độ (rate limiting), tổng hợp phản hồi (aggregation), SSL termination, ghi nhật ký. Nhờ đó, client không cần biết địa chỉ và cấu trúc bên trong của từng dịch vụ. Ví dụ: Kong, NGINX, AWS API Gateway. Mẫu mở rộng: **Backend for Frontend (BFF)** — mỗi loại client (web, mobile) có một gateway riêng phù hợp nhu cầu.

### Circuit Breaker (Bộ ngắt mạch)
Ngăn lỗi của một dịch vụ lan truyền dây chuyền (cascading failure). Hoạt động như cầu dao điện với ba trạng thái:
- **Closed (đóng)**: yêu cầu đi qua bình thường, đếm số lỗi.
- **Open (mở)**: khi lỗi vượt ngưỡng, chặn ngay mọi yêu cầu (fail fast) và trả về cơ chế dự phòng (fallback), cho dịch vụ lỗi thời gian phục hồi.
- **Half-open (nửa mở)**: sau một khoảng chờ, cho vài yêu cầu thử; nếu thành công thì đóng lại, nếu vẫn lỗi thì mở tiếp.

Thường kết hợp với **timeout**, **retry với exponential backoff** và **bulkhead** (cô lập tài nguyên). Ví dụ: Resilience4j, Netflix Hystrix (đã ngừng phát triển).

### Saga Pattern (Giao dịch phân tán)
Vì giao dịch ACID không trải được nhiều cơ sở dữ liệu độc lập, **saga** chia một giao dịch nghiệp vụ thành chuỗi các giao dịch cục bộ (local transaction), mỗi bước có một **hành động bù (compensating transaction)** để hoàn tác nếu bước sau thất bại. Hai kiểu triển khai tương ứng hai cách phối hợp ở trên:
- **Choreography-based saga**: mỗi dịch vụ phát/nghe sự kiện để kích hoạt bước kế tiếp hoặc bước bù.
- **Orchestration-based saga**: một orchestrator điều khiển toàn bộ chuỗi và ra lệnh bù khi cần.

Saga đảm bảo **nhất quán cuối cùng (eventual consistency)** thay vì nhất quán tức thời.

Ví dụ đơn hàng: Đặt hàng → Trừ kho → Thanh toán. Nếu thanh toán lỗi, chạy bù ngược: hoàn kho → huỷ đơn.

### Chiến lược bộ nhớ đệm (Caching Strategies)
Bộ nhớ đệm giảm độ trễ và tải cho dịch vụ/CSDL backend. Các mẫu chính:
- **Cache-aside (lazy loading)**: ứng dụng đọc cache trước; nếu trượt (miss) thì đọc CSDL rồi ghi vào cache. Phổ biến nhất.
- **Read-through**: cache tự nạp từ CSDL khi trượt (client chỉ nói chuyện với cache).
- **Write-through**: ghi đồng thời vào cache và CSDL, đảm bảo nhất quán nhưng chậm hơn khi ghi.
- **Write-behind (write-back)**: ghi vào cache trước, ghi xuống CSDL bất đồng bộ sau; nhanh nhưng có rủi ro mất dữ liệu.

Cần chính sách **hết hạn (TTL)** và **loại bỏ (eviction — LRU/LFU)**, cùng cách xử lý **vô hiệu hoá cache (cache invalidation)**. Bộ nhớ đệm phân tán phổ biến: Redis, Memcached. Lưu ý các vấn đề: cache stampede, thrashing, dữ liệu cũ (stale data).

## Ví dụ
```text
Saga theo điều phối (orchestration) cho đơn hàng:

   ┌──────────────┐   1. tạo đơn    ┌───────────────┐
   │  Orchestrator│ ───────────────▶│ Dịch vụ Đơn   │
   │  (Saga)      │                 └───────────────┘
   │              │   2. trừ kho    ┌───────────────┐
   │              │ ───────────────▶│ Dịch vụ Kho   │
   │              │                 └───────────────┘
   │              │   3. thanh toán ┌───────────────┐
   │              │ ───────────────▶│ Dịch vụ TT    │──✘ lỗi
   │              │ ◀───────────────  (thất bại)     
   │  BÙ NGƯỢC:   │   hoàn kho → huỷ đơn
   └──────────────┘
```

## Các mẫu bổ trợ khác

- **Bulkhead (Vách ngăn)**: cô lập tài nguyên (nhóm luồng, kết nối) cho từng dịch vụ/tính năng, để một phần quá tải không kéo sập toàn hệ thống — như các khoang kín trên tàu.
- **Retry với Exponential Backoff**: thử lại yêu cầu thất bại với khoảng trễ tăng dần và **jitter** (nhiễu ngẫu nhiên) để tránh "bão thử lại" đồng loạt. Chỉ thử lại thao tác bất biến (idempotent).
- **Service Discovery (Khám phá dịch vụ)**: cho phép dịch vụ tự tìm địa chỉ của nhau động qua sổ đăng ký (Consul, Eureka) thay vì cấu hình cứng.
- **Sidecar**: gắn một tiến trình phụ cạnh dịch vụ chính để xử lý mối quan tâm xuyên suốt (logging, TLS, metrics) — nền tảng của service mesh (Istio, Linkerd).
- **Event Sourcing & CQRS**: lưu trạng thái dưới dạng chuỗi sự kiện bất biến; tách mô hình đọc và ghi để tối ưu độc lập.

## Quản lý dữ liệu trong microservices

Nguyên tắc **Database per Service (mỗi dịch vụ một CSDL)** đảm bảo liên kết lỏng lẻo, nhưng đẻ ra thách thức truy vấn/giao dịch xuyên dịch vụ:

| Vấn đề | Giải pháp |
|--------|-----------|
| Giao dịch xuyên dịch vụ | Saga pattern (nhất quán cuối cùng) |
| Truy vấn dữ liệu từ nhiều dịch vụ | API Composition hoặc CQRS với view tổng hợp |
| Đồng bộ dữ liệu giữa dịch vụ | Event-driven, Change Data Capture (CDC) |
| Nhất quán tham chiếu | Chấp nhận nhất quán cuối cùng, tránh khoá ngoại xuyên dịch vụ |

## Ranh giới dịch vụ (Service Boundaries)
Chia dịch vụ đúng ranh giới là quyết định thiết kế quan trọng nhất. Dùng **Domain-Driven Design (DDD)** với khái niệm **bounded context** để xác định ranh giới theo miền nghiệp vụ. Chia sai (quá nhỏ → "nanoservices" giao tiếp quá nhiều; quá lớn → mini-monolith) đều gây hại. Nguyên tắc: dịch vụ nên **gắn kết cao bên trong (high cohesion)** và **liên kết lỏng bên ngoài (loose coupling)**.

## Ưu / nhược điểm
- **Ưu:** phối hợp linh hoạt, cô lập lỗi (circuit breaker), xử lý giao dịch phân tán (saga), giảm độ trễ (cache), che giấu độ phức tạp khỏi client (gateway).
- **Nhược:** tăng độ phức tạp vận hành và gỡ lỗi; nhất quán cuối cùng khó suy luận; cache invalidation là bài toán khó; gateway/orchestrator có thể thành nghẽn cổ chai.

## So sánh choreography và orchestration qua một tình huống
Giả sử quy trình "đăng ký người dùng mới" gồm: tạo tài khoản → gửi email chào mừng → khởi tạo hồ sơ → cấp điểm thưởng.

- **Choreography:** dịch vụ Tài khoản phát sự kiện `UserCreated`; các dịch vụ Email, Hồ sơ, Điểm thưởng cùng lắng nghe và tự hành động. Thêm bước mới chỉ cần thêm một consumer, không đụng dịch vụ cũ — nhưng không ai "nhìn thấy" toàn bộ luồng.
- **Orchestration:** một orchestrator gọi tuần tự từng dịch vụ, biết rõ trạng thái từng bước, dễ xử lý lỗi và bù — nhưng orchestrator trở thành điểm phụ thuộc trung tâm.

## Kết nối với các chủ đề khác
Trang này bổ sung góc thiết kế cho [Kiến trúc Microservices (di cư & vận hành)](../kien-truc-he-thong/microservices.md). Các mẫu ở đây dựa trên nền tảng [Hệ phân tán](he-phan-tan.md) (nhất quán cuối cùng, chịu lỗi) và [Khả năng mở rộng](scalability.md) (cân bằng tải, cache), đồng thời liên quan chặt tới [Thiết kế CSDL](thiet-ke-csdl.md) qua nguyên tắc Database per Service.

## Câu hỏi phỏng vấn thường gặp
1. Khi nào chọn choreography, khi nào chọn orchestration?
2. Giải thích ba trạng thái của circuit breaker.
3. Saga pattern giải quyết vấn đề gì mà giao dịch ACID không làm được? Nêu hai kiểu saga.
4. So sánh cache-aside và write-through; ưu nhược của mỗi cách.
5. API Gateway đảm nhận những trách nhiệm nào? Rủi ro của nó là gì?
6. Làm sao tránh cascading failure trong hệ microservices?
7. Mẫu Bulkhead khác Circuit Breaker ở điểm nào?
8. Vì sao dùng "Database per Service"? Kéo theo thách thức gì?
9. Làm sao xác định ranh giới dịch vụ (bounded context) theo DDD?
10. Change Data Capture (CDC) dùng để làm gì trong đồng bộ dữ liệu?

## Tham khảo
- *Microservices Patterns* — Chris Richardson (microservices.io)
- *Release It!* — Michael Nygard (circuit breaker, bulkhead)
- Xem thêm: [Hệ phân tán](he-phan-tan.md), [Kiến trúc Microservices (di cư & vận hành)](../kien-truc-he-thong/microservices.md)
