# REST API/Kiến trúc REST

**REST (Representational State Transfer)** là một phong cách kiến trúc (architectural style) dùng để thiết kế các ứng dụng mạng. Nó dựa trên một giao thức truyền thông không trạng thái (stateless), theo mô hình client-server và có thể lưu vào bộ nhớ đệm (cacheable) — chính là HTTP. REST là một phong cách kiến trúc, không phải một chuẩn (standard), và nó định nghĩa một tập các ràng buộc (constraints) cùng các thuộc tính dựa trên cách các thành phần của một hệ thống mạng nên giao tiếp với nhau.

## Mục lục

1. [Các nguyên tắc chính của kiến trúc REST](#cac-nguyen-tac-chinh-cua-kien-truc-rest)
2. [Dịch vụ web RESTful](#dich-vu-web-restful)
3. [Các thành phần của kiến trúc REST](#cac-thanh-phan-cua-kien-truc-rest)
4. [Các phương pháp tốt nhất khi thiết kế REST API](#cac-phuong-phap-tot-nhat-khi-thiet-ke-rest-api)
5. [Ví dụ về luồng làm việc của REST API](#vi-du-ve-luong-lam-viec-cua-rest-api)
6. [Top 75 câu hỏi về kiến trúc RESTful](#top-75-cau-hoi-ve-kien-truc-restful)

## Các nguyên tắc chính của kiến trúc REST

1. **Tính không trạng thái (Statelessness)**: Mỗi yêu cầu (request) từ client tới server phải chứa toàn bộ thông tin cần thiết để hiểu và xử lý yêu cầu đó. Server không nên lưu trữ bất kỳ ngữ cảnh (context) nào giữa các yêu cầu. Điều này giúp đơn giản hóa thiết kế server và tăng độ tin cậy cũng như khả năng mở rộng (scalability) của ứng dụng.

2. **Kiến trúc client-server (Client-Server Architecture)**: Nguyên tắc này tách biệt mối quan tâm giữa client và server. Client xử lý giao diện người dùng (user interface) và trải nghiệm người dùng (user experience), trong khi server quản lý việc lưu trữ dữ liệu và logic nghiệp vụ (business logic). Sự tách biệt này cho phép linh hoạt và khả năng mở rộng cao hơn.

3. **Giao diện đồng nhất (Uniform Interface)**: Đây là một nguyên tắc then chốt giúp đơn giản hóa và tách rời (decouple) kiến trúc, cho phép mỗi phần phát triển độc lập. Giao diện đồng nhất bao gồm:
   - **Định danh tài nguyên (Resource Identification)**: Tài nguyên được định danh trong các yêu cầu bằng URI (Uniform Resource Identifiers).
   - **Thao tác tài nguyên thông qua biểu diễn (Manipulation of Resources through Representations)**: Khi client nắm giữ một biểu diễn (representation) của tài nguyên, bao gồm bất kỳ siêu dữ liệu (metadata) đi kèm nào, nó có đủ thông tin để sửa đổi hoặc xóa tài nguyên trên server, miễn là nó có quyền.
   - **Thông điệp tự mô tả (Self-descriptive Messages)**: Mỗi thông điệp chứa đủ thông tin để mô tả cách xử lý thông điệp đó. Điều này bao gồm thông tin về cách phân tích (parse) phần thân (payload) của thông điệp, định dạng của nó (ví dụ: JSON, XML) và hành động cần thực hiện.
   - **Siêu phương tiện là động cơ của trạng thái ứng dụng (HATEOAS - Hypermedia as the Engine of Application State)**: Client tương tác với tài nguyên thông qua siêu phương tiện (hypermedia) được ứng dụng cung cấp một cách động. Các liên kết siêu phương tiện cho phép client khám phá các hành động mà chúng có thể thực hiện một cách động.

4. **Khả năng lưu vào bộ nhớ đệm (Cacheability)**: Các phản hồi (response) phải tự xác định là có thể lưu vào bộ nhớ đệm hay không. Nếu phản hồi có thể lưu vào bộ nhớ đệm, client có thể tái sử dụng chúng cho các yêu cầu tiếp theo, giúp cải thiện hiệu năng và khả năng mở rộng.

5. **Hệ thống phân lớp (Layered System)**: Thông thường, client không thể biết được liệu nó đang kết nối trực tiếp tới server đích hay tới một máy trung gian (intermediary) trên đường đi. Các server trung gian có thể cải thiện khả năng mở rộng của hệ thống bằng cách cho phép cân bằng tải (load balancing) và chia sẻ bộ nhớ đệm.

6. **Mã theo yêu cầu (Code on Demand - tùy chọn)**: Server có thể tạm thời mở rộng hoặc tùy chỉnh chức năng của client bằng cách truyền mã thực thi (executable code). Ví dụ bao gồm JavaScript và applets.

## Dịch vụ web RESTful

Một dịch vụ web (web service) tuân theo các nguyên tắc của REST có thể được gọi là một dịch vụ web RESTful. Các dịch vụ web RESTful thường sử dụng các phương thức HTTP một cách tường minh:

- **GET**: Lấy thông tin từ server (thao tác đọc).
- **POST**: Gửi dữ liệu tới server (thao tác tạo mới).
- **PUT**: Cập nhật tài nguyên hiện có trên server.
- **DELETE**: Xóa tài nguyên khỏi server.

## Các thành phần của kiến trúc REST

1. **Tài nguyên (Resources)**: Khái niệm trừu tượng cốt lõi trong REST là tài nguyên, có thể là bất kỳ loại đối tượng, dữ liệu hay dịch vụ nào có thể truy cập trên server. Mỗi tài nguyên được định danh bằng một URI duy nhất.

2. **Biểu diễn (Representations)**: Tài nguyên được biểu diễn bằng một dạng dữ liệu nào đó (thường là JSON hoặc XML). Biểu diễn này chính là thứ được trao đổi giữa client và server.

3. **Chuyển đổi trạng thái (State Transitions)**: Client tiến triển qua ứng dụng bằng cách chọn các liên kết (siêu phương tiện) và đi theo chúng. Những chuyển đổi này được điều khiển bởi các phản hồi của server.

## Các phương pháp tốt nhất khi thiết kế REST API

1. **Dùng danh từ cho URI**: URI nên dựa trên danh từ (tài nguyên) thay vì động từ (hành động). Ví dụ, dùng `/users` thay vì `/getUsers`.

2. **Phân cấp tài nguyên hợp lý**: Sắp xếp URI theo thứ bậc để biểu diễn các mối quan hệ. Ví dụ, `/users/{userId}/orders` cho các đơn hàng thuộc về một người dùng cụ thể.

3. **Dùng đúng các phương thức HTTP**:
   - GET để lấy dữ liệu
   - POST để tạo mới
   - PUT để cập nhật
   - DELETE để xóa

4. **Thao tác không trạng thái (Stateless Operations)**: Đảm bảo mỗi yêu cầu từ client tới server phải chứa toàn bộ thông tin cần thiết để hiểu và xử lý yêu cầu.

5. **Xử lý lỗi (Error Handling)**: Dùng các mã trạng thái HTTP tiêu chuẩn để biểu diễn kết quả của các thao tác. Ví dụ:
   - `200 OK` cho các yêu cầu thành công
   - `201 Created` cho việc tạo tài nguyên thành công
   - `400 Bad Request` cho lỗi phía client
   - `401 Unauthorized` cho lỗi xác thực (authentication)
   - `404 Not Found` cho tài nguyên không tồn tại
   - `500 Internal Server Error` cho lỗi phía server

6. **Đánh phiên bản (Versioning)**: Đưa phiên bản vào URI để xử lý các thay đổi theo thời gian, ví dụ `/api/v1/users`.

7. **Siêu phương tiện (Hypermedia)**: Sử dụng HATEOAS để hướng dẫn client đi qua ứng dụng bằng cách cung cấp các liên kết liên quan trong phản hồi.

## Ví dụ về luồng làm việc của REST API

1. **Định danh tài nguyên**:
   - URI: `https://api.example.com/users/{userId}`
   - URI này định danh duy nhất một tài nguyên người dùng.

2. **Yêu cầu GET**:
   - Yêu cầu: `GET https://api.example.com/users/123`
   - Phản hồi: `{ "id": 123, "name": "Aastha Shukla", "email": "aastha@example.com" }`
   - Server trả về một biểu diễn của tài nguyên người dùng.

3. **Yêu cầu POST**:
   - Yêu cầu: `POST https://api.example.com/users`
   - Payload: `{ "name": "Aastha Shukla", "email": "aastha@example.com" }`
   - Phản hồi: `201 Created`, header Location: `https://api.example.com/users/123`
   - Server tạo một tài nguyên người dùng mới và trả về vị trí của tài nguyên mới.

4. **Yêu cầu PUT**:
   - Yêu cầu: `PUT https://api.example.com/users/123`
   - Payload: `{ "name": "Aastha S.", "email": "aastha@example.com" }`
   - Phản hồi: `200 OK`
   - Server cập nhật tài nguyên người dùng hiện có.

5. **Yêu cầu DELETE**:
   - Yêu cầu: `DELETE https://api.example.com/users/123`
   - Phản hồi: `204 No Content`
   - Server xóa tài nguyên người dùng.

## Top 75 câu hỏi về kiến trúc RESTful

### Các khái niệm cơ bản

1. **REST API là gì?**
   - **Trả lời:** REST (Representational State Transfer) API là một phong cách kiến trúc sử dụng các yêu cầu HTTP để truy cập và thao tác tài nguyên. Nó dùng các phương thức HTTP tiêu chuẩn như GET, POST, PUT, DELETE và PATCH. REST API là không trạng thái và có thể lưu vào bộ nhớ đệm, cho phép tương tác với các tài nguyên được định danh bằng URL.

2. **Các nguyên tắc của REST là gì?**
   - **Trả lời:** Các nguyên tắc của REST bao gồm:
     - **Tính không trạng thái (Statelessness):** Mỗi yêu cầu từ client tới server phải chứa toàn bộ thông tin cần thiết để hiểu và xử lý yêu cầu.
     - **Kiến trúc client-server:** Client và server tách biệt và có thể phát triển độc lập.
     - **Khả năng lưu vào bộ nhớ đệm (Cacheability):** Các phản hồi phải tự xác định là có thể lưu vào bộ nhớ đệm hay không để ngăn client tái sử dụng dữ liệu cũ hoặc không phù hợp.
     - **Hệ thống phân lớp (Layered System):** Kiến trúc có thể được cấu thành từ nhiều lớp, mỗi lớp có trách nhiệm riêng.
     - **Giao diện đồng nhất (Uniform Interface):** Một cách chuẩn để tương tác với tài nguyên bằng các phương thức và quy ước HTTP.
     - **Mã theo yêu cầu (Code on Demand - tùy chọn):** Server có thể mở rộng chức năng của client bằng cách truyền mã thực thi.

3. **Các phương thức HTTP và mục đích của chúng là gì?**
   - **Trả lời:**
     - **GET:** Lấy dữ liệu từ server.
     - **POST:** Gửi dữ liệu tới server để tạo một tài nguyên mới.
     - **PUT:** Cập nhật một tài nguyên hiện có hoặc tạo mới nếu chưa tồn tại.
     - **DELETE:** Xóa một tài nguyên.
     - **PATCH:** Áp dụng các sửa đổi một phần lên một tài nguyên.

4. **Các mã trạng thái liên quan đến REST API là gì?**
   - **Trả lời:**
     - **1xx Thông tin (Informational):** Yêu cầu đã được nhận, quá trình đang tiếp tục.
     - **2xx Thành công (Success):** Hành động đã được nhận, hiểu và chấp nhận thành công.
       - 200 OK
       - 201 Created
       - 204 No Content
     - **3xx Chuyển hướng (Redirection):** Cần thực hiện thêm hành động để hoàn thành yêu cầu.
       - 301 Moved Permanently
       - 302 Found
       - 304 Not Modified
     - **4xx Lỗi client (Client Error):** Yêu cầu chứa cú pháp sai hoặc không thể được thực hiện.
       - 400 Bad Request
       - 401 Unauthorized
       - 403 Forbidden
       - 404 Not Found
     - **5xx Lỗi server (Server Error):** Server không thể thực hiện một yêu cầu hợp lệ.
       - 500 Internal Server Error
       - 502 Bad Gateway
       - 503 Service Unavailable

### Các khái niệm nâng cao

5. **Giải thích tính bất biến (idempotency) và tầm quan trọng của nó trong REST API.**
   - **Trả lời:** Tính bất biến (idempotency) nghĩa là nhiều yêu cầu giống nhau có cùng tác động như một yêu cầu duy nhất. Điều này rất quan trọng để đảm bảo độ tin cậy, đặc biệt trong trường hợp gặp sự cố mạng khiến các yêu cầu có thể bị lặp lại. Các phương thức như GET, PUT và DELETE là bất biến, trong khi POST thì không.

6. **HATEOAS là gì?**
   - **Trả lời:** HATEOAS (Hypermedia as the Engine of Application State) là một ràng buộc của REST, cung cấp cho client thông tin về những gì họ có thể làm tiếp theo. Tài nguyên trả về các liên kết đến các tài nguyên liên quan, giúp client điều hướng API một cách động.

7. **Sự khác biệt giữa PUT và PATCH là gì?**
   - **Trả lời:** PUT cập nhật toàn bộ một tài nguyên, yêu cầu client gửi một biểu diễn hoàn chỉnh của tài nguyên. PATCH, ngược lại, áp dụng các cập nhật một phần, cho phép client chỉ gửi những thay đổi.

8. **Bạn xử lý việc đánh phiên bản trong REST API như thế nào?**
   - **Trả lời:** Việc đánh phiên bản có thể được quản lý theo nhiều cách:
     - **Đánh phiên bản qua URL:** Đưa phiên bản vào đường dẫn URL (ví dụ: `/v1/resource`).
     - **Tham số truy vấn (Query Parameters):** Dùng tham số truy vấn để chỉ định phiên bản (ví dụ: `/resource?version=1`).
     - **Header:** Đưa phiên bản vào header HTTP (ví dụ: `Accept: application/vnd.example.v1+json`).

9. **Mục đích của giới hạn tốc độ (rate limiting) là gì và nó được triển khai như thế nào?**
   - **Trả lời:** Giới hạn tốc độ (rate limiting) kiểm soát số lượng yêu cầu mà một client có thể gửi tới API trong một khoảng thời gian nhất định, ngăn chặn lạm dụng và đảm bảo sử dụng công bằng. Nó có thể được triển khai bằng các kỹ thuật như:
     - **Cửa sổ cố định (Fixed Window):** Giới hạn yêu cầu dựa trên các khoảng thời gian cố định.
     - **Cửa sổ trượt (Sliding Window):** Giới hạn yêu cầu dựa trên một khoảng thời gian trượt.
     - **Xô token (Token Bucket):** Dùng token để cho phép một số lượng yêu cầu nhất định.

### Bảo mật

10. **Các phương pháp bảo mật phổ biến cho REST API là gì?**
    - **Trả lời:**
      - **Xác thực và Phân quyền (Authentication and Authorization):** Dùng OAuth, JWT hoặc các cơ chế khác để đảm bảo chỉ người dùng được ủy quyền mới có thể truy cập API.
      - **HTTPS:** Mã hóa toàn bộ dữ liệu khi truyền bằng SSL/TLS.
      - **Kiểm tra đầu vào (Input Validation):** Kiểm tra tất cả đầu vào để ngăn chặn tấn công SQL injection, XSS và các tấn công khác.
      - **Giới hạn tốc độ (Rate Limiting):** Triển khai để ngăn chặn tấn công từ chối dịch vụ (denial-of-service).
      - **Mã hóa dữ liệu (Data Encryption):** Mã hóa dữ liệu nhạy cảm khi lưu trữ (at rest).
      - **CORS:** Dùng Cross-Origin Resource Sharing để kiểm soát truy cập từ các miền (domain) khác nhau.

11. **Giải thích cách dùng OAuth để bảo mật REST API.**
    - **Trả lời:** OAuth là một chuẩn mở cho việc ủy quyền truy cập (access delegation), thường được dùng như một cách cấp cho các website hoặc ứng dụng quyền truy cập giới hạn vào thông tin người dùng mà không để lộ mật khẩu. Nó dùng các token truy cập (access token) để cấp quyền cho các yêu cầu tới API, đảm bảo kiểm soát truy cập an toàn.

12. **JWT là gì và nó được dùng như thế nào trong REST API?**
    - **Trả lời:** JSON Web Token (JWT) là một token nhỏ gọn, an toàn với URL, biểu diễn các tuyên bố (claims) cần truyền giữa hai bên. Nó được dùng để xác thực và trao đổi thông tin, trong đó token được truyền trong header HTTP để xác minh danh tính của client.

### Triển khai thực tế

13. **Bạn thiết kế một REST API cho một nền tảng viết blog như thế nào?**
    - **Trả lời:**
      - **Tài nguyên (Resources):** Định nghĩa các tài nguyên như bài viết (posts), bình luận (comments), người dùng (users) và danh mục (categories).
      - **Điểm cuối (Endpoints):**
        - `GET /posts` - Lấy tất cả bài viết.
        - `POST /posts` - Tạo một bài viết mới.
        - `GET /posts/{id}` - Lấy một bài viết cụ thể.
        - `PUT /posts/{id}` - Cập nhật một bài viết cụ thể.
        - `DELETE /posts/{id}` - Xóa một bài viết cụ thể.
        - `GET /posts/{id}/comments` - Lấy các bình luận của một bài viết cụ thể.
      - **Phản hồi (Responses):** Dùng các mã trạng thái tiêu chuẩn và phần thân phản hồi để chỉ ra thành công hay thất bại.

14. **Bạn sẽ xử lý phân trang (pagination) trong một REST API như thế nào?**
    - **Trả lời:** Phân trang có thể được triển khai bằng các tham số truy vấn:
      - **Phân trang theo trang (Page-based Pagination):** `GET /resources?page=2&size=50` - Lấy trang thứ hai với 50 mục mỗi trang.
      - **Phân trang theo Limit-Offset:** `GET /resources?limit=50&offset=100` - Lấy 50 mục bắt đầu từ mục thứ 100.
      - **Phân trang theo con trỏ (Cursor-based Pagination):** `GET /resources?cursor=xyz` - Lấy các mục sau con trỏ (cursor) được chỉ định.

15. **Biểu diễn tài nguyên (resource representation) của một RESTful API là gì và tại sao nó quan trọng?**
    - **Trả lời:** Biểu diễn tài nguyên đề cập đến cách tài nguyên được định dạng khi truyền qua mạng. Các định dạng phổ biến bao gồm JSON, XML và HTML. Biểu diễn đúng cách đảm bảo khả năng tương tác (interoperability) và giúp client dễ dàng tiêu thụ và hiểu API hơn.

### Khắc phục sự cố và các phương pháp tốt nhất

16. **Bạn gỡ lỗi (debug) và kiểm thử (test) REST API như thế nào?**
    - **Trả lời:**
      - **Công cụ:** Dùng các công cụ như Postman, Curl hoặc Insomnia để kiểm thử các điểm cuối một cách thủ công.
      - **Kiểm thử đơn vị (Unit Tests):** Viết các bài kiểm thử tự động dùng các framework như JUnit (Java), Mocha (Node.js) hoặc Pytest (Python).
      - **Nhật ký (Logs):** Triển khai ghi nhật ký để theo dõi các yêu cầu và phản hồi API nhằm khắc phục sự cố.
      - **Máy chủ giả lập (Mock Servers):** Dùng máy chủ giả lập để mô phỏng các phản hồi API trong quá trình kiểm thử.

17. **Các phương pháp tốt nhất để thiết kế RESTful API là gì?**
    - **Trả lời:**
      - **Dùng danh từ cho các điểm cuối:** Dùng các danh từ mô tả (ví dụ: `/users`, `/orders`) thay vì động từ.
      - **Dùng đúng các phương thức HTTP:** Gắn các hành động với đúng phương thức HTTP (ví dụ: GET để lấy dữ liệu, POST để tạo mới).
      - **Tính không trạng thái (Statelessness):** Đảm bảo mỗi yêu cầu là tự chứa (self-contained).
      - **Đánh phiên bản (Versioning):** Đưa phiên bản vào để quản lý thay đổi mà không làm hỏng client.
      - **Tài liệu (Documentation):** Cung cấp tài liệu rõ ràng và toàn diện (ví dụ: dùng Swagger/OpenAPI).

18. **Bạn đảm bảo tính tương thích ngược (backward compatibility) trong REST API như thế nào?**
    - **Trả lời:**
      - **Ngừng sử dụng các điểm cuối (Deprecate Endpoints):** Dần loại bỏ các điểm cuối cũ trong khi thông báo cho người dùng.
      - **Đánh phiên bản (Versioning):** Dùng đánh phiên bản để đưa ra thay đổi mà không ảnh hưởng đến các client hiện có.
      - **Thay đổi không phá vỡ (Non-Breaking Changes):** Thêm các trường mới vào phản hồi mà không xóa hoặc thay đổi các trường hiện có.

### Mở rộng quy mô và hiệu năng

19. **Bạn cải thiện hiệu năng của REST API như thế nào?**
    - **Trả lời:**
      - **Bộ nhớ đệm (Caching):** Dùng các header bộ nhớ đệm HTTP và reverse proxy (ví dụ: Varnish) để giảm tải.
      - **Tối ưu cơ sở dữ liệu:** Tối ưu các truy vấn cơ sở dữ liệu và dùng chỉ mục (indexing).
      - **Cân bằng tải (Load Balancing):** Phân phối lưu lượng trên nhiều server.
      - **Xử lý bất đồng bộ (Asynchronous Processing):** Dùng các tác vụ nền (background jobs) cho các nhiệm vụ tốn thời gian.

20. **Vai trò của API gateway trong kiến trúc REST là gì?**
    - **Trả lời:** API gateway đóng vai trò là một điểm vào duy nhất (single entry point) cho tất cả client, cung cấp các tính năng như định tuyến yêu cầu (request routing), giới hạn tốc độ, xác thực và cân bằng tải. Chúng giúp đơn giản hóa và tập trung hóa việc quản lý API.

### Các câu hỏi bổ sung đi sâu vào chi tiết

21. **Giải thích sự khác biệt giữa REST và SOAP API.**
    - **Trả lời:** REST là một phong cách kiến trúc sử dụng các phương thức HTTP tiêu chuẩn và thường là không trạng thái, trong khi SOAP là một giao thức (protocol) với các chuẩn nghiêm ngặt hơn, dùng XML để truyền thông điệp và có thể có trạng thái (stateful) hoặc không trạng thái. REST linh hoạt và nhẹ hơn so với SOAP vốn phức tạp hơn.

22. **Webhook là gì và chúng hoạt động như thế nào?**
    - **Trả lời:** Webhook là các callback HTTP do người dùng định nghĩa, được kích hoạt bởi các sự kiện cụ thể trong một ứng dụng web. Chúng cho phép thông báo và cập nhật theo thời gian thực. Khi một sự kiện xảy ra, trang nguồn thực hiện một yêu cầu HTTP tới URL do người dùng cấu hình, chứa thông tin về sự kiện đó.

23. **Bạn xử lý lỗi trong REST API như thế nào?**
    - **Trả lời:** Chuẩn hóa các phản hồi lỗi với các mã trạng thái và thông điệp nhất quán. Bao gồm thông tin lỗi chi tiết trong phần thân phản hồi, chẳng hạn như mã lỗi, thông điệp và các giải pháp khả thi.

24. **Ý nghĩa của phương thức HTTP `OPTIONS` là gì?**
    - **Trả lời:** Phương thức `OPTIONS` được dùng để mô tả các tùy chọn giao tiếp cho tài nguyên đích. Nó giúp client hiểu server hỗ trợ những phương thức nào cho một điểm cuối cụ thể.

25. **Giải thích cách Cross-Origin Resource Sharing (CORS) hoạt động.**
    - **Trả lời:** CORS là một cơ chế cho phép hoặc hạn chế các tài nguyên được yêu cầu trên một web server dựa trên nguồn gốc (origin) của yêu cầu. Nó dùng các header HTTP như `Access-Control-Allow-Origin` để kiểm soát những miền nào có thể truy cập tài nguyên.

26. **Bạn thiết kế một API để nó không trạng thái như thế nào?**
    - **Trả lời:** Đảm bảo mỗi yêu cầu API chứa toàn bộ thông tin cần thiết để hiểu và xử lý nó, tránh lưu trữ phiên (session) phía server. Dùng token (ví dụ: JWT) để xác thực nhằm duy trì tính không trạng thái.

27. **Phương thức HTTP `HEAD` là gì và khi nào nó được dùng?**
    - **Trả lời:** Phương thức `HEAD` tương tự như `GET`, nhưng chỉ trả về các header mà không trả về phần thân. Nó hữu ích để kiểm tra xem một tài nguyên có tồn tại hay không, hoặc để lấy siêu dữ liệu mà không cần truyền toàn bộ tài nguyên.

28. **Làm thế nào để đảm bảo tính nhất quán và chuẩn hóa của API?**
    - **Trả lời:** Thiết lập các hướng dẫn và quy ước cho việc thiết kế API, bao gồm quy ước đặt tên, định dạng phản hồi và xử lý lỗi. Dùng các công cụ như OpenAPI để lập tài liệu và thực thi các chuẩn này.

29. **Giải thích khái niệm siêu phương tiện RESTful (RESTful hypermedia).**
    - **Trả lời:** Siêu phương tiện RESTful (HATEOAS) là việc sử dụng các liên kết siêu phương tiện trong phản hồi để hướng dẫn client cách tương tác với API. Nó cung cấp khả năng khám phá (discoverability) và điều hướng động các tài nguyên.

30. **Tầm quan trọng của thương lượng nội dung (content negotiation) trong REST API là gì?**
    - **Trả lời:** Thương lượng nội dung (content negotiation) cho phép client và server thống nhất về biểu diễn tốt nhất của một tài nguyên, hỗ trợ nhiều định dạng (ví dụ: JSON, XML). Nó tăng cường tính linh hoạt và khả năng tương tác.

31. **Bạn xử lý xác thực và phân quyền trong REST API như thế nào?**
    - **Trả lời:** Triển khai các cơ chế xác thực như OAuth2 hoặc JWT để xác minh danh tính người dùng. Dùng kiểm soát truy cập dựa trên vai trò (RBAC - role-based access control) hoặc kiểm soát truy cập dựa trên thuộc tính (ABAC - attribute-based access control) để phân quyền nhằm quản lý các quyền hạn.

32. **Vai trò của tài liệu API là gì và bạn tạo nó như thế nào?**
    - **Trả lời:** Tài liệu API cung cấp thông tin chi tiết về cách sử dụng API, bao gồm các điểm cuối, định dạng yêu cầu/phản hồi và ví dụ. Các công cụ như Swagger/OpenAPI, Postman hoặc Apiary có thể được dùng để tạo và duy trì tài liệu.

33. **Bạn thiết kế RESTful API cho kiến trúc microservices như thế nào?**
    - **Trả lời:** Thiết kế các API sao cho liên kết lỏng lẻo (loosely coupled), với mỗi microservice có REST API riêng của nó. Dùng API gateway để quản lý giao tiếp giữa các dịch vụ và đảm bảo mỗi dịch vụ có thể triển khai độc lập.

34. **Sự khác biệt giữa các lệnh gọi API đồng bộ và bất đồng bộ là gì?**
    - **Trả lời:** Các lệnh gọi API đồng bộ (synchronous) chờ phản hồi trước khi tiếp tục, đảm bảo phản hồi ngay lập tức. Các lệnh gọi API bất đồng bộ (asynchronous) cho phép client tiếp tục xử lý và xử lý phản hồi sau, cải thiện hiệu năng và trải nghiệm người dùng.

35. **Bạn triển khai phân trang bằng kỹ thuật dựa trên con trỏ (cursor-based) như thế nào?**
    - **Trả lời:** Phân trang dựa trên con trỏ dùng một con trỏ (cursor) để theo dõi vị trí trong tập dữ liệu. Server trả về một con trỏ cho tập kết quả tiếp theo, cho phép phân trang hiệu quả, đặc biệt với các tập dữ liệu lớn.

36. **Lợi ích của việc dùng JSON thay vì XML trong REST API là gì?**
    - **Trả lời:** JSON nhẹ, dễ đọc và dễ viết, đồng thời được hỗ trợ tốt hơn trong các công nghệ web hiện đại. Nó giảm băng thông và chi phí phân tích (parsing overhead) so với XML, khiến nó hiệu quả hơn cho các ứng dụng web.

37. **Bạn xử lý việc tải lên và tải xuống tệp lớn trong REST API như thế nào?**
    - **Trả lời:** Dùng luồng (streaming) để xử lý tệp lớn một cách hiệu quả, giảm mức sử dụng bộ nhớ. Triển khai tải lên và tải xuống có thể tiếp tục (resumable) để cho phép client tiếp tục từ vị trí đã dừng trong trường hợp bị gián đoạn.

38. **Mục đích của mã trạng thái `429 Too Many Requests` là gì?**
    - **Trả lời:** Mã trạng thái `429 Too Many Requests` cho biết người dùng đã gửi quá nhiều yêu cầu trong một khoảng thời gian nhất định, kích hoạt giới hạn tốc độ. Nó giúp ngăn chặn lạm dụng và đảm bảo sử dụng API công bằng.

39. **Giải thích khái niệm điều tiết API (API throttling).**
    - **Trả lời:** Điều tiết API (API throttling) giới hạn số lượng yêu cầu mà một client có thể gửi trong một khoảng thời gian cụ thể. Nó giúp quản lý việc sử dụng tài nguyên, ngăn chặn lạm dụng và đảm bảo tính khả dụng của dịch vụ.

40. **Bạn triển khai các điểm cuối API an toàn như thế nào?**
    - **Trả lời:** Dùng HTTPS để giao tiếp được mã hóa, triển khai các cơ chế xác thực và phân quyền, kiểm tra và làm sạch (sanitize) đầu vào, và tuân theo các phương pháp bảo mật tốt nhất như dùng các header bảo mật và thường xuyên cập nhật các phụ thuộc (dependencies).

41. **API mocking là gì và tại sao nó hữu ích?**
    - **Trả lời:** API mocking bao gồm việc tạo các phản hồi mô phỏng cho các điểm cuối API. Nó cho phép các nhà phát triển kiểm thử và phát triển ứng dụng mà không phụ thuộc vào backend thực, cải thiện hiệu quả phát triển và giảm sự phụ thuộc.

42. **Bạn quản lý các thay đổi phá vỡ (breaking changes) trong REST API như thế nào?**
    - **Trả lời:** Dùng đánh phiên bản để đưa ra các thay đổi phá vỡ mà không ảnh hưởng đến các client hiện có. Cung cấp thông tin rõ ràng và kế hoạch ngừng sử dụng (deprecation), cho client thời gian để chuyển sang phiên bản mới.

43. **Lợi ích của việc dùng API gateway là gì?**
    - **Trả lời:** API gateway cung cấp một điểm vào duy nhất để quản lý nhiều API, cung cấp các tính năng như định tuyến yêu cầu, cân bằng tải, xác thực, giới hạn tốc độ và giám sát. Chúng đơn giản hóa việc quản lý API và cải thiện bảo mật cũng như khả năng mở rộng.

44. **Bạn xử lý tính đồng thời (concurrency) trong REST API như thế nào?**
    - **Trả lời:** Dùng các kỹ thuật như khóa lạc quan (optimistic locking), trong đó client kèm theo một số phiên bản (version number) với các cập nhật của họ. Server kiểm tra số phiên bản trước khi áp dụng thay đổi, đảm bảo tính nhất quán dữ liệu và ngăn chặn xung đột.

45. **Sự khác biệt giữa REST và GraphQL là gì?**
    - **Trả lời:** REST dùng các điểm cuối cố định và phản hồi được định nghĩa trước, trong khi GraphQL cho phép client chỉ định cấu trúc của phản hồi, lấy chính xác dữ liệu họ cần. GraphQL cung cấp tính linh hoạt và hiệu quả cao hơn nhưng làm tăng độ phức tạp cho việc triển khai.

46. **Bạn triển khai việc kiểm tra hợp lệ (validation) trong REST API như thế nào?**
    - **Trả lời:** Dùng middleware hoặc các thư viện kiểm tra hợp lệ để kiểm tra dữ liệu yêu cầu so với các schema đã định nghĩa. Đảm bảo tất cả đầu vào được kiểm tra về kiểu, định dạng và ràng buộc để ngăn dữ liệu không hợp lệ tới được server.

47. **Vai trò của yêu cầu preflight `OPTIONS` trong CORS là gì?**
    - **Trả lời:** Yêu cầu preflight `OPTIONS` được trình duyệt dùng để xác định xem yêu cầu thực có an toàn để gửi hay không. Nó kiểm tra sự tuân thủ chính sách CORS trước khi thực hiện yêu cầu thực, đảm bảo giao tiếp cross-origin an toàn.

48. **Bạn xử lý các thao tác bất đồng bộ trong REST API như thế nào?**
    - **Trả lời:** Dùng xử lý nền (background processing) và hàng đợi tác vụ (job queues) để xử lý các nhiệm vụ chạy lâu. Cung cấp cho client các điểm cuối trạng thái hoặc webhook để thông báo cho họ khi tác vụ hoàn thành, cải thiện trải nghiệm người dùng và hiệu năng hệ thống.

49. **Những thách thức khi triển khai REST API cho ứng dụng di động là gì?**
    - **Trả lời:** Ứng dụng di động thường có băng thông hạn chế và kết nối chập chờn. Thiết kế API sao cho hiệu quả, dùng các kỹ thuật như nén dữ liệu (data compression), phân trang và bộ nhớ đệm ngoại tuyến (offline caching) để cải thiện hiệu năng và độ tin cậy.

50. **Bạn xử lý các loại nội dung (content types) khác nhau trong REST API như thế nào?**
    - **Trả lời:** Dùng header `Content-Type` để chỉ định định dạng của phần thân yêu cầu (ví dụ: `application/json`). Dùng header `Accept` để chỉ ra định dạng phản hồi mong muốn, cho phép server trả về đúng loại nội dung.

51. **Giải thích khái niệm đánh phiên bản API bằng header.**
    - **Trả lời:** Đánh phiên bản API bằng header bao gồm việc chỉ định phiên bản trong header `Accept` hoặc các header tùy chỉnh (ví dụ: `Accept: application/vnd.example.v1+json`). Nó cho phép đánh phiên bản mà không thay đổi cấu trúc URL, duy trì các điểm cuối sạch và nhất quán.

52. **Vai trò của phân tích và giám sát API (API analytics and monitoring) là gì?**
    - **Trả lời:** Phân tích và giám sát API cung cấp thông tin chuyên sâu về việc sử dụng, hiệu năng và lỗi của API. Chúng giúp xác định vấn đề, tối ưu hiệu năng và đảm bảo API đáp ứng nhu cầu người dùng. Các công cụ như Google Analytics, New Relic hoặc các giải pháp ghi nhật ký tùy chỉnh có thể được dùng.

53. **Bạn đảm bảo tính sẵn sàng cao (high availability) cho REST API như thế nào?**
    - **Trả lời:** Triển khai các cơ chế dự phòng (redundancy) và chuyển đổi dự phòng (failover), dùng cân bằng tải, và triển khai trên nhiều trung tâm dữ liệu hoặc vùng đám mây (cloud regions). Thường xuyên giám sát và kiểm thử hệ thống để xác định và giải quyết các vấn đề tiềm ẩn.

54. **Lợi ích của việc dùng RESTful API trong kiến trúc microservices là gì?**
    - **Trả lời:** RESTful API thúc đẩy sự liên kết lỏng lẻo (loose coupling) và tính mô-đun, cho phép các microservice giao tiếp độc lập. Chúng cho phép khả năng mở rộng, bảo trì dễ dàng hơn và khả năng dùng các công nghệ khác nhau cho các dịch vụ khác nhau.

55. **Bạn xử lý việc ngừng sử dụng API (API deprecation) như thế nào?**
    - **Trả lời:** Cung cấp tài liệu và thông tin rõ ràng về các điểm cuối bị ngừng sử dụng, bao gồm mốc thời gian và các lựa chọn thay thế. Triển khai cảnh báo trong phản hồi và dần loại bỏ các điểm cuối bị ngừng sử dụng, cho client thời gian để chuyển đổi.

56. **Tầm quan trọng của việc dùng các mã trạng thái HTTP trong REST API là gì?**
    - **Trả lời:** Các mã trạng thái HTTP cung cấp các phản hồi được chuẩn hóa cho biết kết quả của một yêu cầu API. Chúng giúp client hiểu kết quả và thực hiện các hành động phù hợp, cải thiện trải nghiệm API tổng thể.

57. **Giải thích khái niệm khám phá dịch vụ (service discovery) trong microservices.**
    - **Trả lời:** Khám phá dịch vụ (service discovery) cho phép các microservice tìm và giao tiếp với nhau một cách động. Nó dùng một sổ đăng ký (registry) để theo dõi các dịch vụ có sẵn và vị trí của chúng, cho phép các dịch vụ định vị và tương tác với nhau mà không cần mã hóa cứng (hardcoding) các điểm cuối.

58. **Bạn triển khai giao tiếp an toàn trong REST API như thế nào?**
    - **Trả lời:** Dùng HTTPS để mã hóa dữ liệu khi truyền, đảm bảo giao tiếp an toàn giữa client và server. Triển khai các header bảo mật như `Strict-Transport-Security` và thường xuyên cập nhật cấu hình SSL/TLS để duy trì bảo mật.

59. **Vai trò của middleware trong REST API là gì?**
    - **Trả lời:** Middleware được dùng để xử lý các mối quan tâm xuyên suốt (cross-cutting concerns) như xác thực, ghi nhật ký và biến đổi yêu cầu/phản hồi. Nó nằm giữa client và server, xử lý các yêu cầu và phản hồi để thêm hoặc sửa đổi chức năng.

60. **Bạn xử lý phản hồi một phần (partial responses) trong REST API như thế nào?**
    - **Trả lời:** Dùng các tham số truy vấn hoặc header để cho phép client chỉ định các trường họ cần (ví dụ: `GET /resources?fields=name,description`). Điều này giảm lượng dữ liệu được truyền và cải thiện hiệu năng.

61. **Lợi ích của việc dùng OpenAPI/Swagger cho REST API là gì?**
    - **Trả lời:** OpenAPI/Swagger cung cấp một cách chuẩn để định nghĩa và lập tài liệu cho REST API. Nó cải thiện tính nhất quán, tạo điều kiện cho kiểm thử tự động và sinh mã (code generation), đồng thời tăng cường sự hợp tác giữa các nhà phát triển và các bên liên quan.

62. **Bạn xử lý việc đánh phiên bản trong REST API bằng đường dẫn URL như thế nào?**
    - **Trả lời:** Đưa số phiên bản vào đường dẫn URL (ví dụ: `/v1/resources`). Cách tiếp cận này làm rõ phiên bản nào của API đang được dùng và cho phép nhiều phiên bản cùng tồn tại.

63. **Mục đích của phương thức HTTP `OPTIONS` trong các yêu cầu preflight của CORS là gì?**
    - **Trả lời:** Phương thức `OPTIONS` được dùng trong các yêu cầu preflight của CORS để kiểm tra xem server có cho phép phương thức và header của yêu cầu thực hay không. Nó đảm bảo các yêu cầu cross-origin an toàn bằng cách xác minh quyền trước khi thực hiện yêu cầu thực.

64. **Bạn triển khai HATEOAS trong REST API như thế nào?**
    - **Trả lời:** Bao gồm các liên kết siêu phương tiện trong phản hồi để hướng dẫn client về các hành động có sẵn. Dùng các quan hệ liên kết (link relations) để mô tả mối quan hệ giữa các tài nguyên và cung cấp một cách động để điều hướng API.

65. **Vai trò của các client API và SDK là gì?**
    - **Trả lời:** Các client API và SDK cung cấp một cách thuận tiện cho các nhà phát triển tương tác với API, che giấu độ phức tạp và giảm công sức cần thiết để tích hợp với API. Chúng cung cấp các hàm và phương thức dựng sẵn để xử lý các tác vụ phổ biến.

66. **Bạn xử lý CORS trong REST API như thế nào?**
    - **Trả lời:** Cấu hình server để bao gồm các header CORS phù hợp (ví dụ: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`) trong phản hồi. Điều này cho phép các yêu cầu cross-origin từ các miền được chỉ định.

67. **Lợi ích của việc dùng REST API trong các kiến trúc dựa trên đám mây (cloud-based) là gì?**
    - **Trả lời:** REST API cung cấp một cách chuẩn hóa để tương tác với các dịch vụ đám mây, cho phép tích hợp và tự động hóa dễ dàng. Chúng hỗ trợ khả năng mở rộng, tính linh hoạt và khả năng tương tác, khiến chúng lý tưởng cho các kiến trúc dựa trên đám mây.

68. **Bạn triển khai phân trang trong REST API bằng kỹ thuật limit-offset như thế nào?**
    - **Trả lời:** Dùng các tham số truy vấn để chỉ định số lượng mục cần lấy (`limit`) và điểm bắt đầu (`offset`). Ví dụ, `GET /resources?limit=50&offset=100` lấy 50 mục bắt đầu từ mục thứ 100.

69. **Tầm quan trọng của việc dùng JSON schema để kiểm tra hợp lệ trong REST API là gì?**
    - **Trả lời:** JSON schema cung cấp một cách chuẩn để định nghĩa cấu trúc và ràng buộc của dữ liệu JSON. Nó đảm bảo các payload yêu cầu và phản hồi tuân theo các định dạng mong đợi, cải thiện tính toàn vẹn dữ liệu và giảm lỗi.

70. **Bạn xử lý các tập dữ liệu lớn trong REST API như thế nào?**
    - **Trả lời:** Dùng phân trang, lọc (filtering) và sắp xếp (sorting) để quản lý các tập dữ liệu lớn. Triển khai bộ nhớ đệm và dùng các kỹ thuật truy xuất dữ liệu hiệu quả để tối ưu hiệu năng và giảm tải cho server.

71. **Các phương pháp tốt nhất để thiết kế RESTful API là gì?**
    - **Trả lời:** Dùng quy ước đặt tên nhất quán, các phương thức HTTP tiêu chuẩn và tài liệu rõ ràng. Đảm bảo tính không trạng thái, triển khai xử lý lỗi đúng cách, và thiết kế để có khả năng mở rộng và hiệu năng.

72. **Bạn triển khai giới hạn tốc độ trong REST API như thế nào?**
    - **Trả lời:** Dùng middleware hoặc API gateway để thực thi giới hạn tốc độ dựa trên IP của client, người dùng hoặc khóa API (API key). Trả về mã trạng thái phù hợp (`429 Too Many Requests`) và cung cấp thông tin về thời điểm thử lại.

73. **Vai trò của việc đánh phiên bản API trong REST API là gì?**
    - **Trả lời:** Đánh phiên bản API cho phép thực hiện các thay đổi không tương thích ngược mà không làm gián đoạn các client hiện có. Nó cung cấp một cách để quản lý và phát triển API theo thời gian, đảm bảo tính ổn định và tương thích.

74. **Bạn xử lý các thao tác tốn thời gian trong REST API như thế nào?**
    - **Trả lời:** Dùng xử lý bất đồng bộ với các tác vụ nền hoặc hàng đợi tác vụ. Cung cấp cho client các điểm cuối trạng thái hoặc webhook để thông báo cho họ khi tác vụ hoàn thành, cải thiện trải nghiệm người dùng và hiệu năng hệ thống.

75. **Lợi ích của việc dùng RESTful API trong kiến trúc microservices là gì?**
    - **Trả lời:** RESTful API thúc đẩy sự liên kết lỏng lẻo, khả năng mở rộng và tính mô-đun trong kiến trúc microservices. Chúng cho phép phát triển và triển khai độc lập các dịch vụ, cải thiện tính linh hoạt và khả năng bảo trì.
