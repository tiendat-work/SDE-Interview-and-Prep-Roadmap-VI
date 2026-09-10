# Kiến trúc Microservices

Kiến trúc microservices (microservices architecture) là một phương pháp thiết kế trong đó một ứng dụng được xây dựng dưới dạng một tập hợp các dịch vụ liên kết lỏng lẻo (loosely coupled). Mỗi dịch vụ là tự chủ (autonomous), chịu trách nhiệm cho một chức năng nghiệp vụ (business function) cụ thể, và có thể được phát triển, triển khai và mở rộng một cách độc lập.

### Mục lục

1. [Các đặc điểm chính](#cac-ac-iem-chinh)
2. [Ưu điểm](#uu-iem)
3. [Nhược điểm](#nhuoc-iem)
4. [Các mẫu thiết kế trong Microservices](#cac-mau-thiet-ke-trong-microservices)
5. [Triển khai](#trien-khai)
6. [Top 76 câu hỏi về kiến trúc Microservices](#top-76-cau-hoi-ve-kien-truc-microservices)

## Các đặc điểm chính

1. **Trách nhiệm đơn (Single Responsibility)**: Mỗi microservice được thiết kế để thực hiện một nhiệm vụ hoặc chức năng nghiệp vụ cụ thể. Điều này thúc đẩy Nguyên tắc Trách nhiệm Đơn (SRP - Single Responsibility Principle), đảm bảo mỗi dịch vụ chỉ có một lý do để thay đổi.

2. **Quản lý dữ liệu phi tập trung (Decentralized Data Management)**: Các microservice thường có cơ sở dữ liệu riêng để đảm bảo liên kết lỏng lẻo. Điều này cho phép mỗi dịch vụ độc lập và duy trì dữ liệu liên quan đến chức năng của nó.

3. **Tính độc lập (Independence)**: Các microservice có thể được phát triển, triển khai và mở rộng độc lập. Các nhóm có thể làm việc trên các dịch vụ khác nhau đồng thời mà không ảnh hưởng đến toàn bộ hệ thống.

4. **Giao tiếp giữa các dịch vụ (Inter-Service Communication)**: Các microservice giao tiếp với nhau bằng các giao thức nhẹ như HTTP/HTTPS, REST, gRPC, hoặc các message broker như RabbitMQ, Kafka, v.v. Giao tiếp có thể là đồng bộ (request/response) hoặc bất đồng bộ (hướng sự kiện - event-driven).

5. **Cô lập lỗi (Fault Isolation)**: Nếu một microservice gặp lỗi, nó không nhất thiết làm sập toàn bộ hệ thống. Các cơ chế chịu lỗi (fault tolerance) và circuit breaker phù hợp (như Hystrix của Netflix) có thể cô lập các lỗi và duy trì sự ổn định của hệ thống.

6. **Lập trình đa ngôn ngữ (Polyglot Programming)**: Các microservice khác nhau có thể được phát triển bằng các ngôn ngữ lập trình, framework hoặc công nghệ khác nhau phù hợp nhất với nhiệm vụ cụ thể của chúng.

## Ưu điểm

1. **Khả năng mở rộng (Scalability)**: Microservices cho phép các thành phần riêng lẻ được mở rộng độc lập dựa trên nhu cầu của chúng. Điều này dẫn đến việc sử dụng tài nguyên hiệu quả hơn.

2. **Linh hoạt trong triển khai (Flexibility in Deployment)**: Các thực hành triển khai liên tục (continuous deployment) trở nên dễ thực hiện hơn. Các dịch vụ có thể được cập nhật, triển khai hoặc khôi phục (rollback) độc lập.

3. **Cải thiện khả năng chịu lỗi (Improved Fault Tolerance)**: Vì các microservice liên kết lỏng lẻo, sự cố của một dịch vụ không dẫn đến sự cố của toàn bộ hệ thống. Các dịch vụ có thể được thiết kế để suy giảm một cách nhẹ nhàng (degrade gracefully).

4. **Đa dạng công nghệ (Technology Diversity)**: Các nhóm có thể chọn ngăn xếp công nghệ (technology stack) tốt nhất cho dịch vụ cụ thể của họ, thúc đẩy sự đổi mới và linh hoạt.

5. **Bảo trì đơn giản hơn (Simplified Maintenance)**: Các cơ sở mã (codebase) nhỏ hơn dễ quản lý và bảo trì hơn. Việc sửa lỗi và triển khai tính năng có thể được thực hiện nhanh hơn.

## Nhược điểm

1. **Độ phức tạp (Complexity)**: Quản lý nhiều dịch vụ làm tăng độ phức tạp về mặt triển khai, giám sát và khắc phục sự cố.

2. **Tính nhất quán dữ liệu (Data Consistency)**: Đảm bảo tính nhất quán dữ liệu giữa các dịch vụ có thể là một thách thức. Các giao dịch phân tán (distributed transactions) rất phức tạp và thường bị tránh.

3. **Độ trễ mạng (Network Latency)**: Việc tăng giao tiếp giữa các dịch vụ có thể dẫn đến độ trễ mạng cao hơn so với kiến trúc nguyên khối (monolithic).

4. **Kiểm thử (Testing)**: Kiểm thử đầu cuối (end-to-end testing) trở nên phức tạp hơn do số lượng dịch vụ liên quan.

5. **Bảo mật (Security)**: Mỗi dịch vụ cần được bảo mật, làm tăng bề mặt tấn công cho các lỗ hổng tiềm ẩn.

## Các mẫu thiết kế trong Microservices

1. **Khám phá dịch vụ (Service Discovery)**: Trong một môi trường động nơi các dịch vụ có thể di chuyển giữa các server hoặc container khác nhau, các cơ chế khám phá dịch vụ (ví dụ: Eureka, Consul) giúp định vị các dịch vụ.

2. **API Gateway**: Một API Gateway (ví dụ: Zuul, NGINX) đóng vai trò là một reverse proxy, xử lý các yêu cầu từ client, định tuyến chúng tới các dịch vụ phù hợp và tổng hợp các phản hồi.

3. **Circuit Breaker**: Circuit Breaker (ví dụ: Hystrix) ngăn chặn các lỗi lan truyền dây chuyền (cascading failures) bằng cách phát hiện lỗi và cung cấp các cơ chế dự phòng (fallback).

4. **Service Mesh**: Một service mesh (ví dụ: Istio, Linkerd) cung cấp một lớp hạ tầng chuyên dụng để quản lý giao tiếp giữa các dịch vụ, bao gồm cân bằng tải, bảo mật và khả năng quan sát (observability).

5. **Event Sourcing**: Ghi lại tất cả các thay đổi đối với trạng thái của ứng dụng dưới dạng một chuỗi các sự kiện, cung cấp một nhật ký kiểm toán (audit log) đáng tin cậy và tạo điều kiện cho các kiến trúc hướng sự kiện.

6. **CQRS (Command Query Responsibility Segregation)**: Tách biệt các thao tác đọc và ghi của một kho dữ liệu để tối ưu hóa hiệu năng, khả năng mở rộng và bảo mật.

### Triển khai

Việc triển khai microservices bao gồm nhiều giai đoạn:

1. **Phân rã khối nguyên khối (Decomposing the Monolith)**: Xác định và tách các chức năng có thể được cô lập thành các microservice. Bắt đầu với các dịch vụ ít quan trọng hơn để giảm thiểu rủi ro.

2. **Định nghĩa các API (Defining APIs)**: Thiết lập các API rõ ràng, được lập tài liệu tốt cho giao tiếp giữa các dịch vụ. Dùng các chuẩn như REST, gRPC hoặc GraphQL.

3. **Chọn ngăn xếp công nghệ (Choosing Technology Stack)**: Chọn ngôn ngữ, framework và công cụ phù hợp cho mỗi dịch vụ, cân nhắc các yếu tố như hiệu năng, khả năng mở rộng và chuyên môn của nhóm.

4. **Hạ tầng và DevOps (Infrastructure and DevOps)**: Thiết lập các pipeline tích hợp liên tục/triển khai liên tục (CI/CD), container hóa (ví dụ: Docker), điều phối (orchestration - ví dụ: Kubernetes), và các công cụ giám sát.

5. **Chiến lược kiểm thử (Testing Strategy)**: Triển khai kiểm thử đơn vị, kiểm thử tích hợp và kiểm thử đầu cuối. Dùng kiểm thử hợp đồng (contract testing) để đảm bảo tính tương thích giữa các dịch vụ.

6. **Giám sát và ghi nhật ký (Monitoring and Logging)**: Sử dụng truy vết phân tán (distributed tracing - ví dụ: Jaeger, Zipkin), ghi nhật ký tập trung (centralized logging - ví dụ: ELK Stack), và giám sát (ví dụ: Prometheus, Grafana) để có cái nhìn sâu sắc về hành vi và hiệu năng của hệ thống.

## Top 76 câu hỏi về kiến trúc Microservices

Tất nhiên rồi! Dưới đây là các câu trả lời chi tiết cho từng câu hỏi:

### 1. Microservices là gì?
Microservices là một phong cách kiến trúc phần mềm trong đó một ứng dụng được cấu thành từ các dịch vụ nhỏ, độc lập, giao tiếp qua các API được định nghĩa rõ ràng. Mỗi dịch vụ chịu trách nhiệm cho một chức năng nghiệp vụ cụ thể và có thể được phát triển, triển khai và mở rộng độc lập. Kiến trúc này thúc đẩy tính mô-đun, cho phép các nhóm phát triển, triển khai và mở rộng các dịch vụ độc lập, cải thiện tính linh hoạt và tăng tốc quá trình phát triển.

### 2. Microservices khác với kiến trúc nguyên khối (monolithic) như thế nào?
Kiến trúc nguyên khối (monolithic) liên quan đến việc xây dựng một ứng dụng như một khối duy nhất, thống nhất, nơi tất cả các thành phần liên kết chặt chẽ (tightly coupled). Bất kỳ thay đổi nào cũng yêu cầu triển khai lại toàn bộ ứng dụng, việc này có thể chậm và rủi ro. Kiến trúc microservices, ngược lại, chia nhỏ ứng dụng thành các dịch vụ nhỏ hơn, độc lập. Mỗi dịch vụ có thể được phát triển, triển khai và mở rộng độc lập, dẫn đến khả năng mở rộng, tính linh hoạt và cô lập lỗi tốt hơn. Điều này giảm rủi ro triển khai và cho phép lặp lại nhanh hơn.

### 3. Ưu điểm của việc dùng microservices là gì?
Các ưu điểm bao gồm:
- **Khả năng mở rộng (Scalability)**: Các dịch vụ có thể được mở rộng độc lập dựa trên nhu cầu, dẫn đến việc sử dụng tài nguyên hiệu quả.
- **Linh hoạt trong triển khai (Flexibility in Deployment)**: Các thực hành triển khai liên tục trở nên dễ thực hiện hơn, cho phép cập nhật và khôi phục nhanh chóng mà không ảnh hưởng đến toàn bộ hệ thống.
- **Cải thiện khả năng chịu lỗi (Improved Fault Tolerance)**: Vì các dịch vụ liên kết lỏng lẻo, sự cố của một dịch vụ không dẫn đến sự cố của toàn bộ hệ thống. Các dịch vụ có thể được thiết kế để suy giảm nhẹ nhàng.
- **Đa dạng công nghệ (Technology Diversity)**: Các nhóm có thể chọn ngăn xếp công nghệ tốt nhất cho dịch vụ cụ thể của họ, thúc đẩy đổi mới và linh hoạt.
- **Bảo trì đơn giản hơn (Simplified Maintenance)**: Các cơ sở mã nhỏ hơn dễ quản lý và bảo trì hơn, cho phép sửa lỗi và triển khai tính năng nhanh hơn.

### 4. Nhược điểm của việc dùng microservices là gì?
Các nhược điểm bao gồm:
- **Tăng độ phức tạp (Increased Complexity)**: Quản lý nhiều dịch vụ làm tăng độ phức tạp về mặt triển khai, giám sát và khắc phục sự cố.
- **Thách thức về tính nhất quán dữ liệu (Challenges in Data Consistency)**: Đảm bảo tính nhất quán dữ liệu giữa các dịch vụ có thể là một thách thức. Các giao dịch phân tán rất phức tạp và thường bị tránh.
- **Khả năng độ trễ mạng cao hơn (Potential for Higher Network Latency)**: Việc tăng giao tiếp giữa các dịch vụ có thể dẫn đến độ trễ mạng cao hơn so với kiến trúc nguyên khối.
- **Kiểm thử phức tạp (Complicated Testing)**: Kiểm thử đầu cuối trở nên phức tạp hơn do số lượng dịch vụ liên quan.
- **Tăng mối lo ngại về bảo mật (Increased Security Concerns)**: Mỗi dịch vụ cần được bảo mật, làm tăng bề mặt tấn công cho các lỗ hổng tiềm ẩn.

### 5. Các microservice giao tiếp với nhau như thế nào?
Các microservice giao tiếp bằng các giao thức nhẹ như HTTP/HTTPS, REST, gRPC, hoặc các message broker như RabbitMQ, Kafka. Giao tiếp có thể là:
- **Đồng bộ (Synchronous)**: Các lệnh gọi trực tiếp trong đó client chờ phản hồi (ví dụ: REST, gRPC).
- **Bất đồng bộ (Asynchronous)**: Giao tiếp gián tiếp trong đó các thông điệp được xếp hàng đợi để xử lý sau (ví dụ: dùng các message broker như RabbitMQ hoặc Kafka), cho phép các dịch vụ tiếp tục xử lý các tác vụ khác.

### 6. API Gateway là gì?
API Gateway là một reverse proxy xử lý các yêu cầu từ client, định tuyến chúng tới các microservice phù hợp và tổng hợp các phản hồi. Nó có thể quản lý các mối quan tâm xuyên suốt (cross-cutting concerns) như:
- **Xác thực và Phân quyền (Authentication and Authorization)**: Đảm bảo chỉ người dùng được ủy quyền mới có thể truy cập các dịch vụ.
- **Giới hạn tốc độ (Rate Limiting)**: Kiểm soát số lượng yêu cầu mà một client có thể gửi trong một khoảng thời gian nhất định.
- **Ghi nhật ký và Giám sát (Logging and Monitoring)**: Ghi lại nhật ký yêu cầu và phản hồi để giám sát và gỡ lỗi.
- **Cân bằng tải (Load Balancing)**: Phân phối các yêu cầu đến trên nhiều instance dịch vụ để có hiệu năng và độ tin cậy tốt hơn.

### 7. Khám phá dịch vụ (service discovery) trong microservices là gì?
Khám phá dịch vụ (service discovery) là một cơ chế để tự động phát hiện và theo dõi các dịch vụ trong một kiến trúc microservices. Nó giúp các dịch vụ tìm và giao tiếp với nhau một cách động. Các công cụ như Eureka và Consul thường được dùng, cung cấp:
- **Đăng ký dịch vụ (Service Registration)**: Các dịch vụ tự đăng ký khi khởi động và hủy đăng ký khi tắt.
- **Tra cứu dịch vụ (Service Lookup)**: Client truy vấn sổ đăng ký dịch vụ (service registry) để định vị các instance dịch vụ.
- **Kiểm tra tình trạng (Health Checking)**: Thường xuyên kiểm tra tình trạng của các dịch vụ đã đăng ký để đảm bảo chỉ các instance khỏe mạnh được trả về.

### 8. Circuit breaker trong microservices là gì?
Circuit breaker là một mẫu thiết kế được dùng để phát hiện lỗi và ngăn chặn các lỗi lan truyền dây chuyền giữa các dịch vụ. Nó hoạt động bằng cách:
- **Giám sát các yêu cầu (Monitoring Requests)**: Theo dõi số lượng yêu cầu thất bại tới một dịch vụ.
- **Mở mạch (Opening the Circuit)**: Tạm thời dừng các yêu cầu tới dịch vụ đang lỗi khi đạt đến ngưỡng lỗi, cho nó thời gian để phục hồi.
- **Cơ chế dự phòng (Fallback Mechanisms)**: Cung cấp các phản hồi hoặc hành động thay thế khi mạch đang mở.
- **Đóng mạch (Closing the Circuit)**: Cho phép các yêu cầu đi qua trở lại khi dịch vụ đã phục hồi.

### 9. Mục đích của service mesh là gì?
Một service mesh cung cấp một lớp hạ tầng chuyên dụng để quản lý giao tiếp giữa các dịch vụ. Nó xử lý:
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng giữa các instance dịch vụ.
- **Bảo mật (Security)**: Thực thi các chính sách như mutual TLS để giao tiếp an toàn.
- **Khả năng quan sát (Observability)**: Cung cấp các số liệu (metrics), nhật ký và truy vết để giám sát các tương tác dịch vụ.
Ví dụ bao gồm Istio và Linkerd, giúp giảm tải các trách nhiệm này khỏi mã ứng dụng, đơn giản hóa việc phát triển và vận hành.

### 10. Event sourcing là gì?
Event sourcing ghi lại tất cả các thay đổi đối với trạng thái của ứng dụng dưới dạng một chuỗi các sự kiện bất biến (immutable events). Cách tiếp cận này:
- **Khả năng kiểm toán (Auditability)**: Cung cấp một nhật ký kiểm toán đáng tin cậy về tất cả các thay đổi.
- **Tái tạo trạng thái (State Reconstruction)**: Cho phép tái tạo trạng thái hệ thống bằng cách phát lại (replay) các sự kiện.
- **Kiến trúc hướng sự kiện (Event-Driven Architectures)**: Tạo điều kiện cho việc xây dựng các hệ thống phản ứng với thay đổi và kích hoạt các hành động dựa trên sự kiện.

### 11. CQRS là gì?
CQRS (Command Query Responsibility Segregation) là một mẫu thiết kế tách biệt các thao tác đọc và ghi của một kho dữ liệu:
- **Lệnh (Commands)**: Các thao tác thay đổi trạng thái của ứng dụng (ví dụ: tạo hoặc cập nhật bản ghi).
- **Truy vấn (Queries)**: Các thao tác lấy dữ liệu mà không sửa đổi nó.
Sự tách biệt này tối ưu hóa hiệu năng, khả năng mở rộng và bảo mật, vì mỗi thao tác có thể được xử lý độc lập, thường dùng các mô hình hoặc cơ sở dữ liệu khác nhau.

### 12. Bạn xử lý tính nhất quán dữ liệu trong microservices như thế nào?
Tính nhất quán dữ liệu có thể được quản lý bằng cách:
- **Nhất quán cuối cùng (Eventual Consistency)**: Cho phép các thay đổi lan truyền bất đồng bộ, đảm bảo tất cả các dịch vụ cuối cùng đạt đến trạng thái nhất quán.
- **Giao dịch phân tán (Distributed Transactions)**: Dùng các mẫu như saga pattern để quản lý các giao dịch phức tạp trên nhiều dịch vụ.
- **Kiến trúc hướng sự kiện (Event-Driven Architectures)**: Dùng các sự kiện để kích hoạt cập nhật trong các dịch vụ khác, đảm bảo tính nhất quán dữ liệu thông qua các cập nhật cuối cùng.

### 13. Lập trình đa ngôn ngữ (polyglot programming) trong microservices là gì?
Lập trình đa ngôn ngữ (polyglot programming) đề cập đến việc dùng các ngôn ngữ lập trình, framework và công nghệ khác nhau cho các microservice khác nhau dựa trên các yêu cầu cụ thể của chúng và chuyên môn của nhóm. Cách tiếp cận này:
- **Tính linh hoạt (Flexibility)**: Cho phép chọn công cụ tốt nhất cho công việc của mỗi dịch vụ.
- **Đổi mới (Innovation)**: Khuyến khích thử nghiệm các công nghệ mới mà không ảnh hưởng đến toàn bộ hệ thống.
- **Chuyên môn hóa (Specialization)**: Cho phép tận dụng các thế mạnh cụ thể của ngôn ngữ cho các tác vụ khác nhau (ví dụ: Python cho xử lý dữ liệu, Java cho các dịch vụ backend).

### 14. Bạn mở rộng quy mô microservices như thế nào?
Các microservice có thể được mở rộng độc lập dựa trên nhu cầu của chúng. Điều này có thể đạt được bằng cách:
- **Container hóa (Containerization)**: Chạy các dịch vụ trong container (ví dụ: Docker) mà có thể dễ dàng nhân bản.
- **Điều phối (Orchestration)**: Dùng các nền tảng như Kubernetes để quản lý việc triển khai, mở rộng và vận hành các dịch vụ được container hóa.
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng trên nhiều instance của một dịch vụ để đảm bảo tải đồng đều và ngăn chặn nghẽn cổ chai (bottleneck).

### 15. Vai trò của container trong microservices là gì?
Các container, như Docker, cung cấp một môi trường nhất quán và cô lập để chạy các microservice. Lợi ích bao gồm:
- **Tính di động (Portability)**: Đảm bảo các ứng dụng chạy nhất quán trên các môi trường khác nhau (phát triển, kiểm thử, sản xuất).
- **Cô lập (Isolation)**: Đóng gói một ứng dụng và các phụ thuộc của nó, ngăn chặn xung đột với các dịch vụ khác.
- **Hiệu quả tài nguyên (Resource Efficiency)**: Dùng ít tài nguyên hơn máy ảo (virtual machine), cho phép mật độ dịch vụ cao hơn trên cùng một phần cứng.

### 16. Docker là gì?
Docker là một nền tảng để phát triển, vận chuyển và chạy các ứng dụng trong container. Nó cho phép:
- **Container hóa (Containerization)**: Đóng gói một ứng dụng với các phụ thuộc của nó thành một image container duy nhất.
- **Tính di động (Portability)**: Đảm bảo hành vi nhất quán trên các môi trường khác nhau.
- **Khả năng mở rộng (Scalability)**: Dễ dàng nhân bản các container để mở rộng ứng dụng theo chiều ngang (horizontally).

### 17. Kubernetes là gì?
Kubernetes là một nền tảng điều phối container (container orchestration) mã nguồn mở tự động hóa việc triển khai, mở rộng và quản lý các ứng dụng được container hóa. Nó cung cấp:
- **Quản lý cụm (Cluster Management)**: Quản lý các cụm (cluster) node (máy) chạy container.
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng trên nhiều instance container.
- **Tự phục hồi (Self-Healing)**: Tự động khởi động lại các container bị lỗi và lên lịch lại chúng trên các node khỏe mạnh.
- **Mở rộng (Scaling)**: Mở rộng động lên hoặc xuống dựa trên nhu cầu.

### 18. Các thành phần chính của Kubernetes là gì?
Các thành phần chính bao gồm:
- **API Server**: Quản lý API của Kubernetes, đóng vai trò là frontend của control plane.
- **etcd**: Một kho lưu trữ key-value phân tán được dùng để lưu trữ cấu hình và trạng thái của cụm.
- **Scheduler (Bộ lập lịch)**: Gán các khối lượng công việc (pods) cho các node dựa trên tính khả dụng của tài nguyên và các chính sách.
- **Controller Manager (Trình quản lý bộ điều khiển)**: Quản lý các bộ điều khiển (controller) khác nhau xử lý các tác vụ thường xuyên như nhân bản, quản lý node và cập nhật endpoint.
- **Kubelet**: Chạy trên mỗi node, quản lý các container và đảm bảo chúng chạy như mong đợi.
- **Kube-Proxy**: Duy trì các quy tắc mạng và xử lý giao tiếp giữa các dịch vụ.

### 19. Bạn đảm bảo bảo mật trong một kiến trúc microservices như thế nào?
Bảo mật có thể được đảm bảo thông qua các thực hành như:
- **Xác thực và Phân quyền API (API Authentication and Authorization)**: Dùng OAuth, JWT hoặc API key để kiểm soát truy cập.
- **Giao tiếp an toàn (Secure Communication)**: Thực thi TLS/SSL cho việc truyền dữ liệu.
- **Cô lập dịch vụ (Service Isolation)**: Chạy các dịch vụ trong các môi trường cô lập (container) và dùng các chính sách mạng (network policies) để kiểm soát giao tiếp giữa các dịch vụ.
- **Quản lý bí mật (Secrets Management)**: Dùng các công cụ như HashiCorp Vault, AWS Secrets Manager, hoặc Kubernetes Secrets để quản lý thông tin nhạy cảm.
- **Các phương pháp bảo mật tốt nhất (Security Best Practices)**: Triển khai các kiểm tra bảo mật trong pipeline CI/CD, thường xuyên cập nhật các phụ thuộc và tiến hành kiểm toán bảo mật.

### 20. Tích hợp liên tục và triển khai liên tục (CI/CD) là gì?
CI/CD là một thực hành bao gồm:
- **Tích hợp liên tục (Continuous Integration)**: Tự động xây dựng và kiểm thử các thay đổi mã khi chúng được commit, đảm bảo các thay đổi tích hợp trơn tru với cơ sở mã hiện có.
- **Triển khai liên tục (Continuous Deployment)**: Tự động triển khai các thay đổi mã lên môi trường sản xuất sau khi vượt qua các bài kiểm thử, cho phép phát hành nhanh và đáng tin cậy.
Thực hành này giúp duy trì chất lượng mã, tăng tốc phát triển và đảm bảo triển khai nhất quán.

### 21. Bạn xử lý ghi nhật ký trong microservices như thế nào?
Ghi nhật ký trong microservices có thể được quản lý bằng các hệ thống ghi nhật ký tập trung như ELK Stack (Elasticsearch, Logstash, Kibana), Fluentd hoặc Splunk. Các công cụ này:
- **Tổng hợp nhật ký (Aggregate Logs)**: Thu thập nhật ký từ các dịch vụ khác nhau vào một kho lưu trữ trung tâm.
- **Phân tích và Trực quan hóa (Analyze and Visualize)**: Cung cấp các công cụ để tìm kiếm, phân tích và trực quan hóa nhật ký nhằm giám sát hành vi ứng dụng và chẩn đoán vấn đề.
- **Cảnh báo (Alerting)**: Thiết lập cảnh báo cho các mẫu nhật ký cụ thể cho biết lỗi hoặc vấn đề hiệu năng.

### 22. Truy vết phân tán (distributed tracing) là gì?
Truy vết phân tán (distributed tracing) là một kỹ thuật được dùng để theo dõi các yêu cầu khi chúng chạy qua các microservice khác nhau. Các công cụ như Jaeger và Zipkin giúp:
- **Truy vết yêu cầu (Tracing Requests)**: Ghi lại thông tin chi tiết về mỗi yêu cầu, bao gồm thời gian và các phụ thuộc.
- **Xác định nghẽn cổ chai (Identifying Bottlenecks)**: Phân tích dữ liệu truy vết để tìm các nghẽn cổ chai về hiệu năng và các vấn đề độ trễ.
- **Trực quan hóa các tương tác dịch vụ (Visualizing Service Interactions)**: Cung cấp các biểu diễn trực quan về các phụ thuộc và tương tác của dịch vụ để hỗ trợ gỡ lỗi và tối ưu hiệu năng.

### 23. Mẫu sidecar (sidecar pattern) là gì?
Mẫu sidecar (sidecar pattern) bao gồm việc triển khai một dịch vụ trợ giúp (sidecar) bên cạnh một microservice để quản lý các mối quan tâm xuyên suốt như ghi nhật ký, giám sát và bảo mật. Sidecar chạy trong một container riêng biệt nhưng chia sẻ cùng vòng đời với dịch vụ chính, cung cấp:
- **Cô lập (Isolation)**: Giữ chức năng bổ sung tách biệt khỏi logic ứng dụng chính.
- **Khả năng tái sử dụng (Reusability)**: Cho phép cùng một sidecar được dùng với nhiều dịch vụ.
- **Tính mô-đun (Modularity)**: Cho phép phát triển và triển khai độc lập sidecar và dịch vụ chính.

### 24. Bạn triển khai đánh phiên bản API trong microservices như thế nào?
Đánh phiên bản API có thể được triển khai bằng cách:
- **Đánh phiên bản qua URI (URI Versioning)**: Đưa số phiên bản vào URL (ví dụ: /v1/resource).
- **Tham số truy vấn (Query Parameters)**: Thêm một tham số phiên bản vào chuỗi truy vấn (ví dụ: ?version=1).
- **Header tùy chỉnh (Custom Headers)**: Dùng các header HTTP tùy chỉnh để chỉ định phiên bản API.
Cách tiếp cận này đảm bảo tính tương thích ngược, cho phép client tiếp tục dùng các phiên bản cũ trong khi các tính năng mới được thêm vào các phiên bản mới hơn.

### 25. Saga pattern là gì?
Saga pattern được dùng để quản lý các giao dịch phân tán trong microservices. Nó chia nhỏ một giao dịch thành một chuỗi các bước nhỏ hơn, với mỗi bước có một hành động bù (compensating action) trong trường hợp thất bại. Có hai loại saga:
- **Saga dựa trên vũ đạo (Choreography-Based Sagas)**: Mỗi dịch vụ tham gia vào saga bằng cách lắng nghe các sự kiện và kích hoạt bước tiếp theo.
- **Saga dựa trên điều phối (Orchestration-Based Sagas)**: Một bộ điều phối trung tâm (orchestrator) điều phối các bước, gọi các dịch vụ và xử lý các hành động bù khi cần.
Mẫu này đảm bảo tính nhất quán dữ liệu và cho phép xử lý các giao dịch phức tạp trên nhiều dịch vụ.

### 26. Bạn xử lý các sự cố dịch vụ trong microservices như thế nào?
Các sự cố dịch vụ có thể được xử lý bằng cách:
- **Circuit Breaker**: Ngăn chặn các lỗi lan truyền dây chuyền bằng cách dừng các yêu cầu tới một dịch vụ đang lỗi và cung cấp các cơ chế dự phòng.
- **Thử lại với Exponential Backoff (Retries with Exponential Backoff)**: Thử lại các yêu cầu thất bại với các khoảng trễ tăng dần để xử lý các vấn đề tạm thời (transient).
- **Cơ chế dự phòng (Fallback Mechanisms)**: Cung cấp các phản hồi hoặc hành động thay thế khi một dịch vụ gặp lỗi, chẳng hạn như trả về dữ liệu từ bộ nhớ đệm hoặc gọi một dịch vụ phụ.
- **Giám sát và Cảnh báo (Monitoring and Alerts)**: Dùng các công cụ giám sát để phát hiện lỗi và thiết lập cảnh báo để phản ứng ngay lập tức.

### 27. Message broker là gì?
Message broker là một middleware tạo điều kiện cho giao tiếp giữa các dịch vụ bằng cách quản lý các hàng đợi thông điệp (message queues). Ví dụ bao gồm RabbitMQ, Kafka và Amazon SQS. Các message broker:
- **Tách rời dịch vụ (Decouple Services)**: Cho phép các dịch vụ giao tiếp bất đồng bộ mà không có phụ thuộc trực tiếp.
- **Lưu trữ thông điệp (Store Messages)**: Tạm thời lưu trữ thông điệp cho đến khi chúng có thể được xử lý, đảm bảo giao tiếp đáng tin cậy.
- **Hỗ trợ nhiều mẫu giao tiếp (Support Multiple Communication Patterns)**: Cho phép các mẫu nhắn tin publish/subscribe, point-to-point và request/reply.

### 28. Giao tiếp bất đồng bộ (asynchronous communication) trong microservices là gì?
Giao tiếp bất đồng bộ liên quan đến việc các dịch vụ giao tiếp mà không chờ phản hồi ngay lập tức. Điều này có thể đạt được bằng cách:
- **Message Broker**: Các dịch vụ gửi thông điệp tới một broker, broker này chuyển chúng tới các consumer phù hợp (ví dụ: RabbitMQ, Kafka).
- **Kiến trúc hướng sự kiện (Event-Driven Architectures)**: Các dịch vụ phát ra các sự kiện mà các dịch vụ khác lắng nghe và phản ứng.
Giao tiếp bất đồng bộ cải thiện khả năng mở rộng và tách rời nhưng đòi hỏi xử lý cẩn thận tính nhất quán cuối cùng và thứ tự thông điệp.

### 29. Giao tiếp đồng bộ (synchronous communication) trong microservices là gì?
Giao tiếp đồng bộ liên quan đến việc các dịch vụ gọi trực tiếp lẫn nhau và chờ phản hồi. Điều này thường được triển khai bằng cách:
- **HTTP/REST**: Các dịch vụ cung cấp các RESTful API mà client gọi qua HTTP.
- **gRPC**: Một framework RPC hiệu năng cao dùng HTTP/2 để giao tiếp và Protocol Buffers để tuần tự hóa dữ liệu (data serialization).
Giao tiếp đồng bộ đơn giản hơn để triển khai nhưng có thể dẫn đến liên kết chặt chẽ hơn và các nghẽn cổ chai tiềm ẩn do phải chờ phản hồi.

### 30. Bạn kiểm thử microservices như thế nào?
Kiểm thử microservices bao gồm nhiều cấp độ kiểm thử:
- **Kiểm thử đơn vị (Unit Tests)**: Kiểm thử các thành phần hoặc hàm riêng lẻ trong một dịch vụ.
- **Kiểm thử tích hợp (Integration Tests)**: Kiểm thử các tương tác giữa các dịch vụ, đảm bảo chúng hoạt động cùng nhau đúng cách.
- **Kiểm thử đầu cuối (End-to-End Tests)**: Kiểm thử toàn bộ hệ thống, mô phỏng các kịch bản người dùng thực để xác minh chức năng tổng thể.
- **Kiểm thử hợp đồng (Contract Testing)**: Đảm bảo các tương tác giữa các dịch vụ tuân theo các hợp đồng được định nghĩa trước, ngăn chặn các thay đổi phá vỡ.
- **Kiểm thử hiệu năng (Performance Testing)**: Đánh giá hiệu năng và khả năng mở rộng của các dịch vụ trong các điều kiện tải khác nhau.

### 31. Kiểm thử hợp đồng (contract testing) là gì?
Kiểm thử hợp đồng (contract testing) đảm bảo rằng các tương tác giữa các microservice tuân theo một hợp đồng được định nghĩa trước. Điều này giúp xác minh rằng các thay đổi đối với một dịch vụ không làm hỏng các tương tác của nó với các dịch vụ khác. Kiểm thử hợp đồng bao gồm:
- **Hợp đồng do consumer điều khiển (Consumer-Driven Contracts)**: Bên tiêu thụ (consumer) của một dịch vụ định nghĩa hợp đồng, chỉ định các định dạng yêu cầu và phản hồi mong đợi.
- **Xác minh phía provider (Provider Verification)**: Bên cung cấp dịch vụ xác minh rằng nó có thể thực hiện hợp đồng, đảm bảo tính tương thích với consumer.
Cách tiếp cận này giảm rủi ro của các thay đổi phá vỡ và đảm bảo tích hợp trơn tru giữa các dịch vụ.

### 32. Bạn quản lý cấu hình trong microservices như thế nào?
Cấu hình có thể được quản lý bằng các công cụ quản lý cấu hình tập trung như Spring Cloud Config, Consul hoặc etcd. Các công cụ này cung cấp:
- **Lưu trữ tập trung (Centralized Storage)**: Lưu trữ dữ liệu cấu hình trong một kho lưu trữ trung tâm mà tất cả các dịch vụ có thể truy cập.
- **Cập nhật động (Dynamic Updates)**: Cho phép áp dụng các thay đổi cấu hình mà không cần triển khai lại các dịch vụ.
- **Đánh phiên bản và Khôi phục (Versioning and Rollback)**: Duy trì lịch sử phiên bản của các thay đổi cấu hình và cho phép khôi phục về các phiên bản trước.
Cách tiếp cận này đơn giản hóa việc quản lý cấu hình và đảm bảo tính nhất quán giữa các dịch vụ.

### 33. Phương pháp luận 12-factor app là gì?
Phương pháp luận 12-factor app là một tập hợp các phương pháp tốt nhất để xây dựng các ứng dụng web có khả năng mở rộng và dễ bảo trì. Nó bao gồm các nguyên tắc như:
- **Cơ sở mã (Codebase)**: Một cơ sở mã được theo dõi trong kiểm soát phiên bản, nhiều lần triển khai.
- **Phụ thuộc (Dependencies)**: Khai báo và cô lập các phụ thuộc một cách tường minh.
- **Cấu hình (Configuration)**: Lưu trữ cấu hình trong môi trường.
- **Dịch vụ hỗ trợ (Backing Services)**: Coi các dịch vụ hỗ trợ như các tài nguyên đính kèm.
- **Build, Release, Run**: Tách biệt nghiêm ngặt các giai đoạn build và run.
- **Tiến trình (Processes)**: Thực thi ứng dụng như một hoặc nhiều tiến trình không trạng thái.
- **Ràng buộc cổng (Port Binding)**: Xuất các dịch vụ thông qua ràng buộc cổng.
- **Tính đồng thời (Concurrency)**: Mở rộng theo chiều ngang thông qua mô hình tiến trình.
- **Khả năng loại bỏ (Disposability)**: Tối đa hóa độ bền vững với khởi động nhanh và tắt máy nhẹ nhàng.
- **Tương đồng Dev/Prod (Dev/Prod Parity)**: Giữ cho môi trường phát triển, dàn dựng (staging) và sản xuất càng giống nhau càng tốt.
- **Nhật ký (Logs)**: Coi nhật ký như các luồng sự kiện.
- **Tiến trình quản trị (Admin Processes)**: Chạy các tác vụ quản trị/quản lý như các tiến trình một lần (one-off).
Các nguyên tắc này thúc đẩy các phương pháp tốt nhất cho việc phát triển và triển khai ứng dụng hiện đại.

### 34. Bạn đảm bảo tính sẵn sàng cao (high availability) trong microservices như thế nào?
Tính sẵn sàng cao có thể được đảm bảo thông qua:
- **Dự phòng (Redundancy)**: Chạy nhiều instance của các dịch vụ để xử lý các sự cố.
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng trên các instance dịch vụ để đảm bảo tải đồng đều và ngăn chặn nghẽn cổ chai.
- **Tự động mở rộng (Auto-Scaling)**: Tự động mở rộng lên hoặc xuống dựa trên nhu cầu để xử lý tải biến động.
- **Cơ chế chuyển đổi dự phòng (Failover Mechanisms)**: Tự động chuyển sang các instance dự phòng trong trường hợp gặp sự cố.
- **Cơ sở dữ liệu phân tán (Distributed Databases)**: Dùng các cơ sở dữ liệu hỗ trợ tính sẵn sàng cao và chuyển đổi dự phòng tự động (ví dụ: Cassandra, MongoDB).
- **Giám sát và Cảnh báo (Monitoring and Alerts)**: Liên tục giám sát tình trạng của các dịch vụ và thiết lập cảnh báo để phản ứng ngay lập tức với các vấn đề.

### 35. Vai trò của DevOps trong microservices là gì?
DevOps đóng một vai trò quan trọng trong microservices bằng cách:
- **Tự động hóa các pipeline CI/CD (Automating CI/CD Pipelines)**: Đảm bảo các quy trình build, test và triển khai nhất quán và đáng tin cậy.
- **Hạ tầng dưới dạng mã (Infrastructure as Code)**: Quản lý hạ tầng bằng mã để cho phép khả năng tái tạo và mở rộng.
- **Giám sát và Ghi nhật ký (Monitoring and Logging)**: Triển khai các giải pháp giám sát và ghi nhật ký để có cái nhìn sâu sắc về hiệu năng và tình trạng hệ thống.
- **Cộng tác (Collaboration)**: Tạo điều kiện cho sự cộng tác giữa các nhóm phát triển và vận hành, thúc đẩy văn hóa trách nhiệm chung.
- **Cải tiến liên tục (Continuous Improvement)**: Liên tục tối ưu hóa các quy trình và công cụ để cải thiện hiệu quả và giảm thời gian ngừng hoạt động.

### 36. Strangler pattern là gì?
Strangler pattern được dùng để dần thay thế các phần của một ứng dụng nguyên khối bằng các microservice. Nó bao gồm:
- **Xây dựng tính năng mới dưới dạng microservice (Building New Features as Microservices)**: Chức năng mới được phát triển dưới dạng microservice, trong khi khối nguyên khối xử lý chức năng hiện có.
- **Di cư dần dần (Gradual Migration)**: Chức năng hiện có được di cư dần sang microservice, thường bắt đầu với các thành phần ít quan trọng hơn.
- **Định tuyến lưu lượng (Routing Traffic)**: Dùng một API gateway hoặc reverse proxy để định tuyến lưu lượng tới dịch vụ phù hợp (khối nguyên khối hoặc microservice).
- **Ngừng hoạt động khối nguyên khối (Decommissioning the Monolith)**: Theo thời gian, khối nguyên khối được loại bỏ dần khi nhiều chức năng được di cư sang microservice.
Cách tiếp cận này giảm rủi ro và cho phép chuyển đổi từng bước mà không làm gián đoạn các hoạt động hiện có.

### 37. Bạn quản lý các phụ thuộc trong microservices như thế nào?
Các phụ thuộc có thể được quản lý bằng cách:
- **Trình quản lý gói (Package Managers)**: Dùng các trình quản lý gói như npm, pip, Maven để quản lý các phụ thuộc cho mỗi dịch vụ.
- **Image container (Container Images)**: Đóng gói ứng dụng với các phụ thuộc của nó trong các image container (ví dụ: Docker), đảm bảo tính nhất quán giữa các môi trường.
- **Pipeline CI/CD (CI/CD Pipelines)**: Tự động hóa việc quản lý và cập nhật các phụ thuộc trong pipeline CI/CD để đảm bảo tính nhất quán và ngăn chặn xung đột.
- **Hợp đồng dịch vụ (Service Contracts)**: Định nghĩa các hợp đồng rõ ràng giữa các dịch vụ để quản lý các phụ thuộc và đảm bảo tính tương thích.

### 38. Blue-green deployment là gì?
Blue-green deployment là một chiến lược để giảm thiểu thời gian ngừng hoạt động và giảm rủi ro trong quá trình triển khai. Nó bao gồm:
- **Hai môi trường giống hệt nhau (Two Identical Environments)**: Duy trì hai môi trường giống hệt nhau (blue và green), một môi trường phục vụ lưu lượng trực tiếp trong khi môi trường kia được cập nhật.
- **Chuyển đổi lưu lượng (Switching Traffic)**: Sau khi cập nhật và kiểm thử phiên bản mới trong môi trường green, lưu lượng được chuyển từ blue sang green, làm cho phiên bản mới hoạt động.
- **Khả năng khôi phục (Rollback Capability)**: Trong trường hợp gặp vấn đề, lưu lượng có thể nhanh chóng được chuyển lại về môi trường blue.
Cách tiếp cận này đảm bảo triển khai không có thời gian ngừng hoạt động (zero-downtime) và cung cấp một cơ chế khôi phục nhanh.

### 39. Canary deployment là gì?
Canary deployment là một chiến lược trong đó một phiên bản mới của dịch vụ được triển khai dần cho một nhóm nhỏ người dùng. Nó bao gồm:
- **Triển khai từng bước (Incremental Rollout)**: Dần tăng tỷ lệ lưu lượng được hướng tới phiên bản mới trong khi giám sát hiệu năng và độ ổn định của nó.
- **Giám sát (Monitoring)**: Liên tục giám sát các số liệu chính và phản hồi của người dùng để phát hiện bất kỳ vấn đề nào.
- **Triển khai đầy đủ (Full Deployment)**: Nếu không phát hiện vấn đề nào, phiên bản mới được triển khai dần cho tất cả người dùng.
- **Khả năng khôi phục (Rollback Capability)**: Nếu phát hiện vấn đề, việc triển khai có thể được khôi phục về phiên bản trước.
Cách tiếp cận này cho phép kiểm thử và xác thực có kiểm soát các phiên bản mới trong môi trường sản xuất.

### 40. Bạn xử lý di cư dữ liệu (data migration) trong microservices như thế nào?
Di cư dữ liệu có thể được xử lý bằng cách:
- **Công cụ di cư cơ sở dữ liệu (Database Migration Tools)**: Dùng các công cụ như Flyway hoặc Liquibase để quản lý các thay đổi schema và di cư.
- **Di cư theo giai đoạn (Phased Migration)**: Thực hiện di cư theo từng giai đoạn để giảm thiểu rủi ro và đảm bảo tính nhất quán dữ liệu.
- **Tương thích ngược (Backward Compatibility)**: Đảm bảo các thay đổi schema mới tương thích ngược để tránh làm hỏng các dịch vụ hiện có.
- **Nhân bản dữ liệu (Data Replication)**: Dùng các kỹ thuật nhân bản dữ liệu để giữ dữ liệu đồng bộ giữa cơ sở dữ liệu cũ và mới trong quá trình di cư.
- **Kiểm thử và Xác thực (Testing and Validation)**: Kiểm thử và xác thực kỹ lưỡng quá trình di cư để đảm bảo tính toàn vẹn dữ liệu.

### 41. Bộ nhớ đệm phân tán (distributed cache) là gì?
Một bộ nhớ đệm phân tán (distributed cache) lưu trữ dữ liệu trên nhiều node để cải thiện khả năng mở rộng và hiệu năng. Ví dụ bao gồm Redis, Memcached và Hazelcast. Bộ nhớ đệm phân tán:
- **Giảm độ trễ (Reduce Latency)**: Bằng cách lưu trữ dữ liệu thường xuyên truy cập trong bộ nhớ, giảm nhu cầu truy cập cơ sở dữ liệu bên dưới.
- **Cải thiện khả năng mở rộng (Improve Scalability)**: Bằng cách phân phối bộ nhớ đệm trên nhiều node, xử lý các tập dữ liệu lớn hơn và tải lưu lượng cao hơn.
- **Cung cấp khả năng chịu lỗi (Provide Fault Tolerance)**: Bằng cách nhân bản dữ liệu trên các node, đảm bảo tính khả dụng của dữ liệu trong trường hợp node gặp sự cố.

### 42. Bạn đảm bảo quản lý giao dịch (transaction management) trong microservices như thế nào?
Quản lý giao dịch có thể đạt được bằng các mẫu như:
- **Saga Pattern**: Quản lý các giao dịch phân tán bằng cách chia chúng thành các bước nhỏ hơn, mỗi bước có một hành động bù trong trường hợp thất bại.
- **Nhất quán cuối cùng (Eventual Consistency)**: Cho phép các thay đổi lan truyền bất đồng bộ, đảm bảo tất cả các dịch vụ cuối cùng đạt đến trạng thái nhất quán.
- **Giao dịch bù (Compensating Transactions)**: Triển khai các cơ chế để hoàn tác các thay đổi nếu một giao dịch thất bại, duy trì tính toàn vẹn dữ liệu.
- **Giao dịch phân tán (Distributed Transactions)**: Dùng các giao thức như two-phase commit (2PC) cho các giao dịch được điều phối, mặc dù cách này ít phổ biến hơn do độ phức tạp và mối lo ngại về hiệu năng.

### 43. Sổ đăng ký dịch vụ (service registry) là gì?
Sổ đăng ký dịch vụ (service registry) là một cơ sở dữ liệu về các dịch vụ có sẵn và các instance của chúng. Nó được các cơ chế khám phá dịch vụ dùng để định vị các dịch vụ. Ví dụ bao gồm Eureka và Consul. Một sổ đăng ký dịch vụ cung cấp:
- **Đăng ký dịch vụ (Service Registration)**: Các dịch vụ tự đăng ký khi khởi động và hủy đăng ký khi tắt.
- **Tra cứu dịch vụ (Service Lookup)**: Client truy vấn sổ đăng ký dịch vụ để định vị các instance dịch vụ.
- **Kiểm tra tình trạng (Health Checking)**: Thường xuyên kiểm tra tình trạng của các dịch vụ đã đăng ký để đảm bảo chỉ các instance khỏe mạnh được trả về.

### 44. Điều phối dịch vụ (service orchestration) là gì?
Điều phối dịch vụ (service orchestration) liên quan đến việc phối hợp nhiều dịch vụ để đạt được một quy trình nghiệp vụ. Nó thường được quản lý bởi một công cụ điều phối (orchestration engine) hoặc một trình quản lý luồng công việc (workflow manager), mà:
- **Quản lý thứ tự thực thi (Manages Execution Order)**: Đảm bảo các dịch vụ được gọi theo đúng trình tự.
- **Xử lý lỗi (Handles Errors)**: Quản lý các lỗi và thử lại, đảm bảo quy trình tổng thể hoàn thành thành công.
- **Cung cấp giám sát và ghi nhật ký (Provides Monitoring and Logging)**: Theo dõi tiến trình của các luồng công việc được điều phối và ghi lại các sự kiện chính để giám sát và gỡ lỗi.

### 45. Vũ đạo dịch vụ (service choreography) là gì?
Vũ đạo dịch vụ (service choreography) liên quan đến việc nhiều dịch vụ làm việc cùng nhau theo cách phi tập trung để đạt được một quy trình nghiệp vụ. Mỗi dịch vụ biết cách phản hồi các sự kiện mà không cần một bộ điều phối trung tâm. Cách tiếp cận này:
- **Kiểm soát phi tập trung (Decentralized Control)**: Mỗi dịch vụ độc lập quản lý các tương tác và trạng thái của nó.
- **Hướng sự kiện (Event-Driven)**: Các dịch vụ giao tiếp thông qua các sự kiện, phản ứng với thay đổi và kích hoạt các hành động.
- **Khả năng mở rộng (Scalability)**: Vũ đạo có thể cải thiện khả năng mở rộng bằng cách giảm nhu cầu về một bộ điều phối trung tâm.

### 46. Bạn xử lý giới hạn tốc độ (rate limiting) trong microservices như thế nào?
Giới hạn tốc độ có thể được xử lý bằng cách:
- **API Gateway**: Triển khai giới hạn tốc độ ở cấp API gateway (ví dụ: Kong, Apigee).
- **Reverse Proxy**: Dùng reverse proxy (ví dụ: NGINX, HAProxy) để kiểm soát tốc độ yêu cầu.
- **Triển khai tùy chỉnh (Custom Implementations)**: Triển khai logic giới hạn tốc độ trong các dịch vụ, theo dõi và giới hạn số lượng yêu cầu mà một client có thể gửi trong một khoảng thời gian xác định.
Giới hạn tốc độ giúp ngăn chặn lạm dụng, đảm bảo sử dụng tài nguyên công bằng và bảo vệ các dịch vụ khỏi bị quá tải.

### 47. Xác thực giữa các dịch vụ (service-to-service authentication) là gì?
Xác thực giữa các dịch vụ (service-to-service authentication) đảm bảo rằng chỉ các dịch vụ được ủy quyền mới có thể giao tiếp với nhau. Điều này có thể được triển khai bằng cách:
- **Mutual TLS**: Dùng mutual TLS để xác thực và mã hóa giao tiếp giữa các dịch vụ.
- **OAuth**: Dùng các token OAuth để xác thực các yêu cầu dịch vụ.
- **API Key**: Dùng các khóa API để kiểm soát truy cập vào các dịch vụ.
Cách tiếp cận này đảm bảo giao tiếp an toàn và ngăn chặn truy cập trái phép vào các dịch vụ.

### 48. Vai trò của giám sát (monitoring) trong microservices là gì?
Giám sát (monitoring) cung cấp khả năng nhìn thấy hiệu năng và tình trạng của các microservice. Nó giúp:
- **Phát hiện vấn đề (Detecting Issues)**: Xác định và phản ứng với các vấn đề trước khi chúng ảnh hưởng đến người dùng.
- **Hiểu hành vi hệ thống (Understanding System Behavior)**: Có cái nhìn sâu sắc về cách các dịch vụ đang hoạt động và tương tác.
- **Tối ưu hiệu năng (Optimizing Performance)**: Xác định các nghẽn cổ chai và các khu vực cần cải thiện.
- **Đảm bảo SLA (Ensuring SLAs)**: Giám sát các số liệu chính để đảm bảo các dịch vụ đáp ứng các thỏa thuận mức dịch vụ (SLA - service level agreements) đã thống nhất.
Các công cụ như Prometheus, Grafana và New Relic thường được dùng để giám sát microservices.

### 49. Bạn xử lý ghi nhật ký phân tán (distributed logging) trong microservices như thế nào?
Ghi nhật ký phân tán có thể được quản lý bằng các hệ thống ghi nhật ký tập trung như ELK Stack (Elasticsearch, Logstash, Kibana), Fluentd hoặc Splunk. Các công cụ này:
- **Tổng hợp nhật ký (Aggregate Logs)**: Thu thập nhật ký từ các dịch vụ khác nhau vào một kho lưu trữ trung tâm.
- **Phân tích và Trực quan hóa (Analyze and Visualize)**: Cung cấp các công cụ để tìm kiếm, phân tích và trực quan hóa nhật ký nhằm giám sát hành vi ứng dụng và chẩn đoán vấn đề.
- **Cảnh báo (Alerting)**: Thiết lập cảnh báo cho các mẫu nhật ký cụ thể cho biết lỗi hoặc vấn đề hiệu năng.
Cách tiếp cận này đơn giản hóa việc quản lý nhật ký và cung cấp một cái nhìn toàn diện về hệ thống.

### 50. Sự khác biệt giữa microservices và SOA là gì?
Microservices và SOA (Service-Oriented Architecture - Kiến trúc hướng dịch vụ) đều liên quan đến việc xây dựng ứng dụng như một tập hợp các dịch vụ. Tuy nhiên, chúng khác nhau ở:
- **Độ chi tiết của dịch vụ (Service Granularity)**: Microservices là các dịch vụ nhỏ hơn, chi tiết hơn tập trung vào các chức năng nghiệp vụ cụ thể, trong khi SOA thường liên quan đến các dịch vụ lớn hơn, thô hơn.
- **Quản lý dữ liệu (Data Management)**: Microservices thường có quản lý dữ liệu phi tập trung với mỗi dịch vụ quản lý cơ sở dữ liệu riêng của nó, trong khi SOA có thể liên quan đến lưu trữ dữ liệu chung.
- **Đa dạng công nghệ (Technology Diversity)**: Microservices khuyến khích dùng các công nghệ khác nhau cho các dịch vụ khác nhau, trong khi SOA thường chuẩn hóa trên một ngăn xếp công nghệ cụ thể.
- **Triển khai và Mở rộng (Deployment and Scaling)**: Microservices có thể được triển khai và mở rộng độc lập, trong khi SOA có thể yêu cầu các triển khai được phối hợp.
Nhìn chung, microservices cung cấp tính linh hoạt và khả năng mở rộng cao hơn nhưng cũng đưa ra thêm độ phức tạp.

### 51. Bạn đảm bảo tính tương thích ngược (backward compatibility) trong microservices như thế nào?
Tính tương thích ngược có thể được đảm bảo bằng cách:
- **Đánh phiên bản API (Versioning APIs)**: Duy trì nhiều phiên bản của API để hỗ trợ các client hiện có trong khi giới thiệu chức năng mới.
- **Feature Toggle (Công tắc tính năng)**: Dùng feature toggle để kiểm soát việc triển khai các tính năng mới mà không làm hỏng chức năng hiện có.
- **Thay đổi tương thích ngược (Backward-Compatible Changes)**: Thực hiện các thay đổi không phá vỡ các hợp đồng hiện có, chẳng hạn như thêm các trường tùy chọn thay vì xóa hoặc sửa đổi các trường hiện có.
- **Kiểm thử kỹ lưỡng (Extensive Testing)**: Kiểm thử kỹ lưỡng các thay đổi để đảm bảo chúng không làm hỏng chức năng hiện có hoặc các tích hợp của client.

### 52. Hợp đồng dịch vụ (service contract) là gì?
Một hợp đồng dịch vụ (service contract) định nghĩa sự tương tác giữa các dịch vụ, bao gồm các định dạng yêu cầu và phản hồi, các điểm cuối và các giao thức được dùng. Nó đảm bảo giao tiếp nhất quán giữa các dịch vụ và thường bao gồm:
- **Đặc tả API (API Specification)**: Định nghĩa các điểm cuối, phương thức, tham số yêu cầu và định dạng phản hồi.
- **Mô hình dữ liệu (Data Models)**: Chỉ định các cấu trúc dữ liệu được dùng trong các yêu cầu và phản hồi.
- **Xử lý lỗi (Error Handling)**: Định nghĩa cách các lỗi được truyền đạt và xử lý.
Hợp đồng dịch vụ cung cấp một thỏa thuận rõ ràng giữa các nhà cung cấp dịch vụ và người tiêu thụ, đảm bảo tính tương thích và giảm các vấn đề tích hợp.

### 53. Bạn xử lý các mối quan tâm xuyên suốt (cross-cutting concerns) trong microservices như thế nào?
Các mối quan tâm xuyên suốt như ghi nhật ký, bảo mật và giám sát có thể được xử lý bằng cách:
- **Thư viện chung (Shared Libraries)**: Tạo các thư viện hoặc mô-đun chung cung cấp chức năng chung và có thể được tái sử dụng trên các dịch vụ.
- **Middleware**: Triển khai middleware chặn các yêu cầu và phản hồi để xử lý các mối quan tâm xuyên suốt.
- **Container Sidecar (Sidecar Containers)**: Dùng các container sidecar trong một service mesh để quản lý các mối quan tâm xuyên suốt bên ngoài logic ứng dụng chính.
- **API Gateway**: Dùng một API gateway để xử lý các mối quan tâm như xác thực, giới hạn tốc độ và ghi nhật ký ở biên (edge) của hệ thống.
Cách tiếp cận này tập trung hóa chức năng chung, giảm sự trùng lặp và đơn giản hóa việc bảo trì.

### 54. Sự khác biệt giữa REST và gRPC là gì?
REST là một phong cách kiến trúc dùng HTTP/HTTPS để giao tiếp và thường trao đổi dữ liệu ở định dạng JSON. gRPC là một framework RPC hiệu năng cao dùng HTTP/2 để giao tiếp và trao đổi dữ liệu ở định dạng Protocol Buffers. Các khác biệt chính bao gồm:
- **Hiệu năng (Performance)**: gRPC nhìn chung nhanh hơn và hiệu quả hơn nhờ việc dùng HTTP/2 và Protocol Buffers.
- **Truyền luồng (Streaming)**: gRPC hỗ trợ truyền luồng hai chiều (bi-directional streaming), cho phép giao tiếp thời gian thực, trong khi REST thường bị giới hạn ở request-response.
- **Công cụ (Tooling)**: gRPC cung cấp hỗ trợ công cụ mạnh cho sinh mã và an toàn kiểu (type safety), trong khi REST dựa vào các quy ước và tài liệu.
- **Khả năng tương tác (Interoperability)**: REST được áp dụng rộng rãi hơn và tương tác được với nhiều client và nền tảng, trong khi gRPC chủ yếu được dùng trong các môi trường mà hiệu năng và hiệu quả là quan trọng.
Cả hai đều có thế mạnh riêng và được chọn dựa trên nhu cầu cụ thể của ứng dụng.

### 55. Bạn xử lý các thay đổi schema (schema changes) trong microservices như thế nào?
Các thay đổi schema có thể được quản lý bằng cách:
- **Công cụ di cư cơ sở dữ liệu (Database Migration Tools)**: Dùng các công cụ như Flyway hoặc Liquibase để quản lý các thay đổi schema và di cư.
- **Thay đổi tương thích ngược (Backward-Compatible Changes)**: Thực hiện các thay đổi không phá vỡ chức năng hiện có, chẳng hạn như thêm các cột hoặc bảng mới thay vì sửa đổi các cột/bảng hiện có.
- **Schema được đánh phiên bản (Versioned Schemas)**: Duy trì nhiều phiên bản của schema để hỗ trợ các phiên bản khác nhau của dịch vụ.
- **Triển khai theo giai đoạn (Phased Rollout)**: Triển khai các thay đổi schema theo từng giai đoạn để giảm thiểu rủi ro và đảm bảo tính nhất quán dữ liệu.
- **Kiểm thử và Xác thực (Testing and Validation)**: Kiểm thử kỹ lưỡng các thay đổi schema để đảm bảo chúng không làm hỏng chức năng hiện có hoặc tính toàn vẹn dữ liệu.

### 56. Cơ chế dự phòng (fallback mechanism) trong microservices là gì?
Một cơ chế dự phòng (fallback mechanism) cung cấp một phản hồi hoặc hành động thay thế khi một dịch vụ gặp lỗi. Điều này có thể bao gồm:
- **Dữ liệu từ bộ nhớ đệm (Cached Data)**: Trả về dữ liệu đã lưu trong bộ nhớ đệm trước đó nếu dịch vụ trực tiếp không khả dụng.
- **Phản hồi mặc định (Default Response)**: Cung cấp một phản hồi mặc định hoặc thông điệp lỗi khi dịch vụ không thể thực hiện yêu cầu.
- **Dịch vụ phụ (Secondary Service)**: Gọi một dịch vụ phụ hoặc instance dự phòng để xử lý yêu cầu.
Các cơ chế dự phòng giúp duy trì sự ổn định của hệ thống và cung cấp trải nghiệm người dùng tốt hơn trong quá trình dịch vụ gặp sự cố.

### 57. Bạn triển khai việc thử lại (retries) trong microservices như thế nào?
Việc thử lại có thể được triển khai bằng các thư viện hoặc framework hỗ trợ logic thử lại với exponential backoff. Điều này bao gồm:
- **Logic thử lại (Retry Logic)**: Tự động thử lại các yêu cầu thất bại một số lần xác định.
- **Exponential Backoff**: Tăng độ trễ giữa các lần thử lại để tránh làm quá tải dịch vụ.
- **Tính bất biến (Idempotency)**: Đảm bảo các lần thử lại không gây ra các tác dụng phụ ngoài ý muốn, làm cho các thao tác trở nên bất biến khi có thể.
Việc thử lại giúp xử lý các sự cố tạm thời và cải thiện khả năng phục hồi (resilience) của hệ thống.

### 58. Hàng đợi thư chết (dead letter queue) là gì?
Một hàng đợi thư chết (dead letter queue - DLQ) được dùng để lưu trữ các thông điệp không thể được xử lý thành công. Điều này giúp:
- **Cô lập các thông điệp có vấn đề (Isolating Problematic Messages)**: Ngăn chúng chặn việc xử lý các thông điệp khác.
- **Gỡ lỗi và Phân tích (Debugging and Analysis)**: Phân tích các thông điệp thất bại để hiểu và khắc phục các vấn đề cơ bản.
- **Thử lại (Retries)**: Cho phép thử lại thủ công hoặc tự động các thông điệp thất bại sau khi giải quyết các vấn đề.
Hàng đợi thư chết cải thiện độ tin cậy và khả năng bảo trì của các hệ thống xử lý thông điệp.

### 59. Thao tác bất biến (idempotent operation) là gì?
Một thao tác bất biến (idempotent operation) là một thao tác tạo ra cùng kết quả bất kể nó được thực thi bao nhiêu lần. Tính bất biến quan trọng trong microservices để đảm bảo rằng các yêu cầu lặp lại không gây ra các tác dụng phụ ngoài ý muốn. Ví dụ:
- **Yêu cầu GET (GET Requests)**: Lấy dữ liệu mà không sửa đổi nó.
- **Yêu cầu PUT (PUT Requests)**: Cập nhật một tài nguyên về một trạng thái cụ thể, bất kể số lượng yêu cầu.
- **Yêu cầu DELETE (DELETE Requests)**: Xóa một tài nguyên, đảm bảo các yêu cầu lặp lại không dẫn đến lỗi.
Các thao tác bất biến cải thiện độ tin cậy và khả năng dự đoán của hệ thống.

### 60. Bạn xử lý quản lý bí mật (secrets management) trong microservices như thế nào?
Quản lý bí mật có thể được xử lý bằng các công cụ như HashiCorp Vault, AWS Secrets Manager hoặc Kubernetes Secrets. Các công cụ này:
- **Lưu trữ an toàn (Secure Storage)**: Mã hóa và lưu trữ an toàn các thông tin nhạy cảm như khóa API, mật khẩu và chứng chỉ.
- **Kiểm soát truy cập (Access Control)**: Triển khai kiểm soát truy cập chi tiết để hạn chế ai và cái gì có thể truy cập các bí mật.
- **Xoay vòng tự động (Automated Rotation)**: Tự động xoay vòng các bí mật để giảm rủi ro bị lộ.
- **Kiểm toán (Auditing)**: Cung cấp các nhật ký kiểm toán để theo dõi việc truy cập và sử dụng các bí mật.
Quản lý bí mật đúng cách đảm bảo tính bảo mật và toàn vẹn của thông tin nhạy cảm.

### 61. Vai trò của reverse proxy trong microservices là gì?
Một reverse proxy nằm phía trước các microservice, xử lý các yêu cầu của client và cung cấp một số lợi ích:
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng đến trên nhiều instance dịch vụ để có hiệu năng và độ tin cậy tốt hơn.
- **Bảo mật (Security)**: Đóng vai trò là rào cản giữa client và các dịch vụ, cung cấp SSL termination, xác thực và phân quyền.
- **Bộ nhớ đệm (Caching)**: Lưu các phản hồi vào bộ nhớ đệm để giảm tải cho các dịch vụ backend và cải thiện thời gian phản hồi.
- **Định tuyến yêu cầu (Request Routing)**: Định tuyến các yêu cầu tới các dịch vụ phù hợp dựa trên các mẫu URL hoặc các tiêu chí khác.
Ví dụ về reverse proxy bao gồm NGINX và HAProxy.

### 62. Bạn triển khai kiểm tra tình trạng (health checks) trong microservices như thế nào?
Kiểm tra tình trạng có thể được triển khai bằng các điểm cuối báo cáo trạng thái của một dịch vụ. Các điểm cuối này là:
- **Điểm cuối HTTP (HTTP Endpoints)**: Cung cấp các điểm cuối (ví dụ: /health) trả về trạng thái tình trạng của dịch vụ (ví dụ: HTTP 200 cho khỏe mạnh, HTTP 500 cho không khỏe mạnh).
- **Kiểm tra phụ thuộc (Dependency Checks)**: Bao gồm các kiểm tra cho các phụ thuộc như cơ sở dữ liệu, dịch vụ bên ngoài và message broker.
- **Tích hợp điều phối (Orchestration Integration)**: Cấu hình các nền tảng điều phối container (ví dụ: Kubernetes) để định kỳ kiểm tra các điểm cuối tình trạng và thực hiện hành động (ví dụ: khởi động lại các container không khỏe mạnh).
Kiểm tra tình trạng đảm bảo chỉ các instance khỏe mạnh nhận lưu lượng và giúp duy trì tình trạng tổng thể của hệ thống.

### 63. Mục đích của bộ cân bằng tải (load balancer) trong microservices là gì?
Một bộ cân bằng tải (load balancer) phân phối lưu lượng đến trên nhiều instance của một dịch vụ để đảm bảo:
- **Phân phối tải đồng đều (Even Load Distribution)**: Ngăn bất kỳ instance đơn lẻ nào bị quá tải bởi lưu lượng.
- **Cải thiện hiệu năng (Improved Performance)**: Đảm bảo các yêu cầu được xử lý hiệu quả, giảm độ trễ và cải thiện thời gian phản hồi.
- **Khả năng chịu lỗi (Fault Tolerance)**: Tự động định tuyến lại lưu lượng khỏi các instance bị lỗi tới các instance khỏe mạnh.
- **Khả năng mở rộng (Scalability)**: Cho phép hệ thống xử lý lưu lượng tăng bằng cách thêm nhiều instance hơn.
Ví dụ về bộ cân bằng tải bao gồm NGINX, HAProxy và các giải pháp dựa trên đám mây như AWS Elastic Load Balancing (ELB).

### 64. Bạn đảm bảo khả năng phục hồi (resilience) trong microservices như thế nào?
Khả năng phục hồi có thể được đảm bảo bằng các mẫu như:
- **Circuit Breaker**: Ngăn chặn các lỗi lan truyền dây chuyền bằng cách dừng các yêu cầu tới một dịch vụ đang lỗi và cung cấp các cơ chế dự phòng.
- **Thử lại với Exponential Backoff (Retries with Exponential Backoff)**: Thử lại các yêu cầu thất bại với các khoảng trễ tăng dần để xử lý các vấn đề tạm thời.
- **Bulkhead (Vách ngăn)**: Cô lập các phần khác nhau của hệ thống để ngăn các lỗi lan rộng.
- **Cơ chế dự phòng (Fallbacks)**: Cung cấp các phản hồi hoặc hành động thay thế khi một dịch vụ gặp lỗi, chẳng hạn như trả về dữ liệu từ bộ nhớ đệm hoặc gọi một dịch vụ phụ.
- **Giám sát và Cảnh báo (Monitoring and Alerts)**: Dùng các công cụ giám sát để phát hiện lỗi và thiết lập cảnh báo để phản ứng ngay lập tức.
Các mẫu này giúp xử lý các sự cố một cách nhẹ nhàng và duy trì sự ổn định của hệ thống.

### 65. Sự khác biệt giữa giao tiếp đồng bộ và bất đồng bộ là gì?
- **Giao tiếp đồng bộ (Synchronous Communication)**: Liên quan đến việc các dịch vụ gọi trực tiếp lẫn nhau và chờ phản hồi. Thường được triển khai bằng HTTP/REST hoặc gRPC. Nó đơn giản hơn nhưng có thể dẫn đến liên kết chặt chẽ hơn và các nghẽn cổ chai tiềm ẩn do phải chờ phản hồi.
- **Giao tiếp bất đồng bộ (Asynchronous Communication)**: Liên quan đến việc các dịch vụ giao tiếp mà không chờ phản hồi ngay lập tức. Đạt được bằng các message broker (ví dụ: RabbitMQ, Kafka) hoặc các kiến trúc hướng sự kiện. Nó cải thiện khả năng mở rộng và tách rời nhưng đòi hỏi xử lý cẩn thận tính nhất quán cuối cùng và thứ tự thông điệp.
Cả hai cách tiếp cận đều có các trường hợp sử dụng riêng và có thể được kết hợp trong một kiến trúc microservices.

### 66. Bạn triển khai đánh phiên bản dịch vụ (service versioning) như thế nào?
Đánh phiên bản dịch vụ có thể được triển khai bằng cách:
- **Đánh phiên bản qua URI (URI Versioning)**: Đưa số phiên bản vào URL (ví dụ: /v1/resource).
- **Tham số truy vấn (Query Parameters)**: Thêm một tham số phiên bản vào chuỗi truy vấn (ví dụ: ?version=1).
- **Header tùy chỉnh (Custom Headers)**: Dùng các header HTTP tùy chỉnh để chỉ định phiên bản API.
Đánh phiên bản đảm bảo tính tương thích ngược, cho phép client tiếp tục dùng các phiên bản cũ trong khi các tính năng mới được thêm vào các phiên bản mới hơn. Nó cũng giúp quản lý các cập nhật và việc ngừng sử dụng (deprecation).

### 67. Vai trò của hàng đợi thông điệp (message queue) trong microservices là gì?
Một hàng đợi thông điệp (message queue) tạo điều kiện cho giao tiếp bất đồng bộ giữa các dịch vụ bằng cách:
- **Tách rời dịch vụ (Decoupling Services)**: Cho phép các dịch vụ giao tiếp mà không có phụ thuộc trực tiếp.
- **Lưu trữ thông điệp (Storing Messages)**: Tạm thời lưu trữ thông điệp cho đến khi chúng có thể được xử lý, đảm bảo giao tiếp đáng tin cậy.
- **Hỗ trợ nhiều mẫu giao tiếp (Supporting Multiple Communication Patterns)**: Cho phép các mẫu nhắn tin publish/subscribe, point-to-point và request/reply.
Ví dụ bao gồm RabbitMQ, Kafka và Amazon SQS. Các hàng đợi thông điệp cải thiện khả năng mở rộng, độ tin cậy và khả năng chịu lỗi.

### 68. Bạn xử lý các phụ thuộc dịch vụ (service dependencies) trong microservices như thế nào?
Các phụ thuộc dịch vụ có thể được quản lý bằng cách:
- **Khám phá dịch vụ (Service Discovery)**: Tự động phát hiện và theo dõi các dịch vụ trong kiến trúc (ví dụ: Eureka, Consul).
- **Tiêm phụ thuộc (Dependency Injection)**: Tiêm các phụ thuộc tại thời điểm chạy (runtime) để đảm bảo liên kết lỏng lẻo.
- **Tài liệu và Hợp đồng (Documentation and Contracts)**: Lập tài liệu rõ ràng về các hợp đồng và phụ thuộc dịch vụ để đảm bảo tính tương thích.
- **Giám sát và Cảnh báo (Monitoring and Alerts)**: Liên tục giám sát các phụ thuộc và thiết lập cảnh báo để phản ứng ngay lập tức với các vấn đề.
Quản lý đúng cách các phụ thuộc dịch vụ đảm bảo các tương tác trơn tru và giảm rủi ro sự cố.

### 69. Nhất quán cuối cùng (eventual consistency) là gì?
Nhất quán cuối cùng (eventual consistency) là một mô hình nhất quán trong đó các cập nhật đối với một hệ thống phân tán có thể không ngay lập tức hiển thị cho tất cả các node, nhưng hệ thống cuối cùng sẽ đạt đến trạng thái nhất quán. Nó cho phép:
- **Tính sẵn sàng cao hơn (Higher Availability)**: Bằng cách cho phép các sự không nhất quán tạm thời, hệ thống có thể vẫn khả dụng ngay cả trong các phân vùng mạng (network partitions).
- **Khả năng mở rộng (Scalability)**: Giảm nhu cầu về các cập nhật đồng bộ cải thiện khả năng mở rộng.
- **Nhân bản bất đồng bộ (Asynchronous Replication)**: Các cập nhật được lan truyền bất đồng bộ tới các node khác, đảm bảo nhất quán cuối cùng.
Nhất quán cuối cùng thường được dùng trong các hệ thống phân tán và microservices để cân bằng giữa tính sẵn sàng và tính nhất quán.

### 70. Nền tảng điều phối container (container orchestration platform) là gì?
Một nền tảng điều phối container (container orchestration platform) tự động hóa việc triển khai, mở rộng và quản lý các ứng dụng được container hóa. Ví dụ bao gồm Kubernetes, Docker Swarm và Apache Mesos. Các nền tảng này cung cấp:
- **Quản lý cụm (Cluster Management)**: Quản lý các cụm node (máy) chạy container.
- **Cân bằng tải (Load Balancing)**: Phân phối lưu lượng trên nhiều instance container để có hiệu năng và độ tin cậy tốt hơn.
- **Tự phục hồi (Self-Healing)**: Tự động khởi động lại các container bị lỗi và lên lịch lại chúng trên các node khỏe mạnh.
- **Mở rộng (Scaling)**: Mở rộng động lên hoặc xuống dựa trên nhu cầu.
- **Giám sát và Ghi nhật ký (Monitoring and Logging)**: Cung cấp các công cụ để giám sát và ghi nhật ký các ứng dụng được container hóa.
Các nền tảng điều phối container đơn giản hóa việc quản lý các kiến trúc microservices phức tạp.

### 71. Bạn xử lý sự tiến hóa của schema (schema evolution) trong microservices như thế nào?
Sự tiến hóa của schema có thể được xử lý bằng cách:
- **Công cụ di cư cơ sở dữ liệu (Database Migration Tools)**: Dùng các công cụ như Flyway hoặc Liquibase để quản lý các thay đổi schema và di cư.
- **Thay đổi tương thích ngược (Backward-Compatible Changes)**: Thực hiện các thay đổi không phá vỡ chức năng hiện có, chẳng hạn như thêm các cột hoặc bảng mới thay vì sửa đổi các cột/bảng hiện có.
- **Schema được đánh phiên bản (Versioned Schemas)**: Duy trì nhiều phiên bản của schema để hỗ trợ các phiên bản khác nhau của dịch vụ.
- **Triển khai theo giai đoạn (Phased Rollout)**: Triển khai các thay đổi schema theo từng giai đoạn để giảm thiểu rủi ro và đảm bảo tính nhất quán dữ liệu.
- **Kiểm thử và Xác thực (Testing and Validation)**: Kiểm thử kỹ lưỡng các thay đổi schema để đảm bảo chúng không làm hỏng chức năng hiện có hoặc tính toàn vẹn dữ liệu.

### 72. Microservices chassis là gì?
Một microservices chassis là một framework hoặc một tập các thư viện cung cấp chức năng chung cho các microservice, chẳng hạn như ghi nhật ký, cấu hình và giám sát. Ví dụ bao gồm:
- **Spring Boot**: Một framework để xây dựng microservice trong Java, cung cấp các tính năng như tiêm phụ thuộc, quản lý cấu hình và bảo mật.
- **Go Kit**: Một bộ công cụ để xây dựng microservice trong Go, cung cấp các thành phần mô-đun cho khám phá dịch vụ, ghi nhật ký và truy vết.
- **Micronaut**: Một framework để xây dựng microservice trong Java, Groovy và Kotlin, tập trung vào dấu chân bộ nhớ (memory footprint) thấp và thời gian khởi động nhanh.
Việc dùng một microservices chassis giúp chuẩn hóa chức năng chung, giảm sự trùng lặp và đơn giản hóa việc phát triển.

### 73. Bạn triển khai phân quyền (authorization) trong microservices như thế nào?
Phân quyền có thể được triển khai bằng cách:
- **OAuth**: Dùng các token OAuth để kiểm soát truy cập dựa trên vai trò và quyền hạn.
- **JWT (JSON Web Tokens)**: Dùng JWT để truyền thông tin an toàn giữa các dịch vụ, bao gồm vai trò và quyền hạn của người dùng.
- **API Gateway**: Triển khai kiểm soát truy cập ở cấp API gateway, thực thi các chính sách dựa trên vai trò và quyền hạn.
- **Phân quyền cấp dịch vụ (Service-Level Authorization)**: Triển khai logic phân quyền trong mỗi dịch vụ, đảm bảo chỉ người dùng được ủy quyền mới có thể truy cập các tài nguyên cụ thể.
Cách tiếp cận này đảm bảo truy cập an toàn vào các dịch vụ và bảo vệ dữ liệu nhạy cảm.

### 74. Mục đích của hợp đồng API (API contract) là gì?
Một hợp đồng API (API contract) định nghĩa sự tương tác giữa các dịch vụ, bao gồm các định dạng yêu cầu và phản hồi, các điểm cuối và các giao thức được dùng. Nó đảm bảo giao tiếp nhất quán giữa các dịch vụ và thường bao gồm:
- **Đặc tả API (API Specification)**: Định nghĩa các điểm cuối, phương thức, tham số yêu cầu và định dạng phản hồi.
- **Mô hình dữ liệu (Data Models)**: Chỉ định các cấu trúc dữ liệu được dùng trong các yêu cầu và phản hồi.
- **Xử lý lỗi (Error Handling)**: Định nghĩa cách các lỗi được truyền đạt và xử lý.
Hợp đồng dịch vụ cung cấp một thỏa thuận rõ ràng giữa các nhà cung cấp dịch vụ và người tiêu thụ, đảm bảo tính tương thích và giảm các vấn đề tích hợp.

### 75. Bạn xử lý thời gian chờ (timeouts) trong microservices như thế nào?
Thời gian chờ có thể được xử lý bằng cách:
- **Thiết lập giá trị thời gian chờ (Setting Timeout Values)**: Cấu hình các giá trị thời gian chờ phù hợp cho các yêu cầu và phản hồi để ngăn chờ đợi vô thời hạn.
- **Circuit Breaker**: Dùng circuit breaker để dừng các yêu cầu tới một dịch vụ liên tục bị hết thời gian chờ (timing out), cung cấp các cơ chế dự phòng.
- **Thử lại với Exponential Backoff (Retries with Exponential Backoff)**: Triển khai việc thử lại với các khoảng trễ tăng dần để xử lý các vấn đề tạm thời.
- **Giám sát và Cảnh báo (Monitoring and Alerts)**: Liên tục giám sát thời gian phản hồi và thiết lập cảnh báo cho các vấn đề thời gian chờ.
Xử lý thời gian chờ đúng cách đảm bảo hệ thống vẫn phản hồi tốt và có thể phục hồi từ các dịch vụ chậm hoặc không phản hồi.

### 76. Sự khác biệt giữa một bộ điều phối (orchestrator) và một bộ lập lịch (scheduler) là gì?
- **Bộ điều phối (Orchestrator)**: Quản lý toàn bộ vòng đời của các ứng dụng được container hóa, bao gồm triển khai, mở rộng, mạng và giám sát (ví dụ: Kubernetes).
- **Bộ lập lịch (Scheduler)**: Phân bổ tài nguyên và lên lịch các tác vụ để chạy trên các node có sẵn, tập trung vào việc tối ưu hóa việc sử dụng tài nguyên và đáp ứng các yêu cầu tác vụ (ví dụ: Kubernetes scheduler, Mesos).
Cả hai thành phần làm việc cùng nhau trong một nền tảng điều phối container để quản lý việc triển khai và vận hành các ứng dụng.
