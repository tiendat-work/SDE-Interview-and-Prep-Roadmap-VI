# Kiến trúc Client-Server (Client-Server Architecture)

## Khái niệm

**Kiến trúc Client-Server (Client-Server Architecture)** là một mô hình tính toán phân tán (distributed computing) trong đó các tác vụ được phân chia giữa hai vai trò: **client (máy khách)** — bên gửi yêu cầu (request) và tiêu thụ dịch vụ, và **server (máy chủ)** — bên nhận yêu cầu, xử lý và trả về phản hồi (response). Client và server thường chạy trên các máy khác nhau và giao tiếp qua mạng.

Mô hình này là nền tảng của gần như toàn bộ ứng dụng web hiện đại: trình duyệt (client) gửi yêu cầu HTTP, máy chủ web (server) trả về HTML/JSON.

## Khi nào dùng / Vì sao quan trọng

- **Tập trung hóa tài nguyên**: Dữ liệu và logic nghiệp vụ (business logic) được đặt tại server, dễ quản lý, sao lưu và bảo mật.
- **Chia sẻ tài nguyên cho nhiều client**: Một server phục vụ hàng nghìn client cùng lúc (ví dụ: một API backend phục vụ web, mobile, desktop).
- **Tách biệt mối quan tâm (separation of concerns)**: Giao diện người dùng (client) tách khỏi xử lý dữ liệu (server), cho phép hai phía phát triển độc lập.

Hầu hết các hệ thống doanh nghiệp, ứng dụng web, cơ sở dữ liệu (database) và email đều dựa trên mô hình này.

## Cách hoạt động

Luồng giao tiếp cơ bản theo mô hình **yêu cầu - phản hồi (request-response)**:

```
[Client]  --- (1) Gửi request --->  [Server]
                                        |
                                   (2) Xử lý:
                                   - Xác thực
                                   - Logic nghiệp vụ
                                   - Truy vấn DB
                                        |
[Client]  <--- (3) Trả response ---  [Server]
```

1. Client mở kết nối tới server (thường qua TCP/IP).
2. Client gửi yêu cầu theo một giao thức (protocol) đã thống nhất.
3. Server xử lý yêu cầu, có thể truy vấn cơ sở dữ liệu hoặc gọi các dịch vụ khác.
4. Server trả về phản hồi; client hiển thị hoặc xử lý kết quả.

### Các tầng (tier) phổ biến

| Mô hình | Mô tả |
|---------|-------|
| 2 tầng (2-tier) | Client giao tiếp trực tiếp với server chứa cả logic và dữ liệu. |
| 3 tầng (3-tier) | Tách thành tầng trình bày (presentation), tầng logic (application), và tầng dữ liệu (data). |
| N tầng (N-tier) | Nhiều tầng trung gian: cân bằng tải, cache, hàng đợi... |

### Các giao thức giao tiếp (communication protocols)

- **HTTP/HTTPS**: Giao thức phổ biến nhất cho web, không trạng thái (stateless), dựa trên request-response.
- **TCP/IP**: Giao thức truyền tải tin cậy, có thứ tự, nền tảng cho hầu hết các giao thức tầng trên.
- **UDP**: Không tin cậy nhưng nhanh, dùng cho streaming, game, DNS.
- **WebSocket**: Kết nối hai chiều (full-duplex) liên tục, phù hợp cho ứng dụng thời gian thực (chat, thông báo).
- **gRPC**: Giao thức hiệu năng cao dựa trên HTTP/2 và Protocol Buffers, dùng nhiều trong giao tiếp giữa các dịch vụ (service-to-service).

## Ví dụ

```python
# Ví dụ tối giản một client và server dùng thư viện chuẩn của Python

# --- server.py ---
from http.server import BaseHTTPRequestHandler, HTTPServer

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Server nhận yêu cầu GET và trả về phản hồi
        self.send_response(200)                 # Mã trạng thái 200 OK
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"message": "Xin chao tu server"}')

# Khởi động server lắng nghe tại cổng 8000
HTTPServer(("localhost", 8000), MyHandler).serve_forever()


# --- client.py ---
import urllib.request

# Client gửi yêu cầu tới server và nhận phản hồi
with urllib.request.urlopen("http://localhost:8000") as resp:
    print(resp.read().decode())   # In ra: {"message": "Xin chao tu server"}
```

## Ưu / nhược điểm

- **Ưu:**
  - **Quản lý tập trung**: Dễ bảo trì, cập nhật, sao lưu và bảo mật dữ liệu tại server.
  - **Khả năng mở rộng (scalability)**: Có thể nâng cấp server hoặc thêm nhiều server sau bộ cân bằng tải (load balancer).
  - **Tách biệt vai trò**: Client và server phát triển, triển khai độc lập.
  - **Chia sẻ tài nguyên**: Nhiều client dùng chung một server, tiết kiệm chi phí.
- **Nhược:**
  - **Điểm lỗi đơn (single point of failure)**: Nếu server ngừng hoạt động, toàn bộ client bị ảnh hưởng (cần dự phòng, cân bằng tải).
  - **Nghẽn cổ chai (bottleneck)**: Server quá tải khi lượng client tăng đột biến.
  - **Phụ thuộc mạng**: Chất lượng dịch vụ phụ thuộc vào độ trễ (latency) và độ ổn định của mạng.
  - **Chi phí vận hành**: Cần hạ tầng, giám sát và bảo trì server.

## So sánh với mô hình ngang hàng (Peer-to-Peer)

| Tiêu chí | Client-Server | Peer-to-Peer (P2P) |
|----------|---------------|--------------------|
| Vai trò | Phân biệt rõ client và server | Mọi nút vừa là client vừa là server |
| Quản lý | Tập trung | Phân tán |
| Điểm lỗi đơn | Có (tại server) | Không |
| Ví dụ | Web, email, database | BitTorrent, blockchain |

## Câu hỏi phỏng vấn thường gặp

1. **Kiến trúc client-server là gì và nêu các thành phần chính?**
   - Là mô hình trong đó client gửi yêu cầu và server xử lý, trả về phản hồi. Thành phần gồm client, server và mạng kết nối cùng một giao thức chung.
2. **Phân biệt kiến trúc 2 tầng và 3 tầng.**
   - 2 tầng: client nối trực tiếp với server chứa cả logic lẫn dữ liệu. 3 tầng: tách tầng trình bày, tầng logic ứng dụng và tầng dữ liệu, giúp mở rộng và bảo trì tốt hơn.
3. **Làm sao xử lý điểm lỗi đơn của server?**
   - Dùng nhiều server sau bộ cân bằng tải, cơ chế chuyển đổi dự phòng (failover), sao chép dữ liệu (replication) và triển khai đa vùng.
4. **Sự khác biệt giữa client-server và peer-to-peer?**
   - Client-server phân biệt rõ vai trò và quản lý tập trung; P2P thì mọi nút bình đẳng, không có điểm điều khiển trung tâm.
5. **Khi nào chọn WebSocket thay vì HTTP thông thường?**
   - Khi cần giao tiếp hai chiều theo thời gian thực với độ trễ thấp như chat, bảng giá chứng khoán, thông báo đẩy.

## Tham khảo

- MDN Web Docs — Client-Server overview
- Tanenbaum, *Distributed Systems: Principles and Paradigms*
