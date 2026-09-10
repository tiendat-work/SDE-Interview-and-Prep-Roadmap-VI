# Giao thức HTTP (HyperText Transfer Protocol)

## Khái niệm
HTTP (HyperText Transfer Protocol) là giao thức tầng ứng dụng theo mô hình
yêu cầu - phản hồi (request - response) dùng để truyền tài nguyên (trang
web, ảnh, API...) giữa máy khách (client, thường là trình duyệt) và máy chủ
(server). HTTP là giao thức phi trạng thái (stateless): mỗi yêu cầu độc lập,
server không tự nhớ các yêu cầu trước.

## Khi nào dùng / Vì sao quan trọng
- Nền tảng của World Wide Web và hầu hết các API hiện đại (REST API).
- Hiểu HTTP giúp thiết kế API đúng chuẩn, gỡ lỗi bằng công cụ như DevTools,
  curl, Postman, và tối ưu hiệu năng web.

## Cách hoạt động
Một giao dịch HTTP gồm client gửi yêu cầu (request) và server trả về phản
hồi (response), mỗi bên có dòng khởi đầu, các tiêu đề (header) và phần thân
(body) tuỳ chọn.
```
GET /index.html HTTP/1.1        <- dòng yêu cầu (method, path, version)
Host: example.com               <- header
Accept: text/html
                                <- dòng trống ngăn cách header và body

HTTP/1.1 200 OK                 <- dòng trạng thái (version, code, lý do)
Content-Type: text/html
Content-Length: 128

<html>...</html>                <- body
```

Sơ đồ dưới tách rõ các phần cấu trúc của một HTTP request và response:

```mermaid
flowchart LR
    subgraph REQ["HTTP Request"]
        direction TB
        R1["Dòng yêu cầu: Method + Path + Version"]
        R2["Các header: Host, Accept, Cookie..."]
        R3["Dòng trống"]
        R4["Body (tuỳ chọn): dữ liệu gửi lên"]
        R1 --> R2 --> R3 --> R4
    end
    subgraph RES["HTTP Response"]
        direction TB
        S1["Dòng trạng thái: Version + Code + Lý do"]
        S2["Các header: Content-Type, Set-Cookie..."]
        S3["Dòng trống"]
        S4["Body (tuỳ chọn): nội dung trả về"]
        S1 --> S2 --> S3 --> S4
    end
    REQ -->|"gửi/nhận"| RES
```

Sơ đồ tuần tự vòng đời một yêu cầu/phản hồi HTTP (qua HTTPS):

```mermaid
sequenceDiagram
    participant B as Trình duyệt
    participant S as Máy chủ web
    B->>S: Mở kết nối TCP + bắt tay TLS (nếu HTTPS)
    B->>S: GET /index.html HTTP/1.1
    Note right of B: Kèm header: Host, Accept, Cookie...
    S->>S: Xử lý yêu cầu, dựng phản hồi
    S->>B: HTTP/1.1 200 OK + body
    Note left of S: Kèm header: Content-Type, Set-Cookie...
    B->>B: Kết xuất (render) trang cho người dùng
```

### Các phương thức (HTTP Methods)
| Phương thức | Ý nghĩa | An toàn (Safe) | Idempotent |
|-------------|---------|----------------|------------|
| GET | Lấy tài nguyên | Có | Có |
| POST | Tạo mới / gửi dữ liệu | Không | Không |
| PUT | Thay thế toàn bộ tài nguyên | Không | Có |
| PATCH | Cập nhật một phần | Không | Không |
| DELETE | Xoá tài nguyên | Không | Có |
| HEAD | Như GET nhưng chỉ lấy header | Có | Có |
| OPTIONS | Hỏi các phương thức được hỗ trợ | Có | Có |

- **Safe:** không làm thay đổi dữ liệu trên server.
- **Idempotent:** gọi nhiều lần cho kết quả giống gọi một lần.

Ghi chú thực dụng: GET không nên mang body và có thể bị cache; POST **không**
idempotent nên nếu gửi lại (F5, retry) có thể tạo trùng bản ghi — dùng
**idempotency key** để chống trùng. PUT gửi **toàn bộ** biểu diễn tài nguyên,
PATCH chỉ gửi phần thay đổi. DELETE idempotent vì xoá lần 2 vẫn cho trạng thái
"đã xoá" (dù có thể trả 404).

### Mã trạng thái (Status Code)
| Nhóm | Ý nghĩa | Ví dụ tiêu biểu |
|------|---------|-----------------|
| 1xx | Thông tin (Informational) | 100 Continue, 101 Switching Protocols |
| 2xx | Thành công (Success) | 200 OK, 201 Created, 204 No Content |
| 3xx | Chuyển hướng (Redirection) | 301 Moved Permanently, 302 Found, 304 Not Modified |
| 4xx | Lỗi phía client | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests |
| 5xx | Lỗi phía server | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable |

Sơ đồ dưới nhóm các mã trạng thái theo 5 nhóm chính:

```mermaid
flowchart TB
    ROOT["Mã trạng thái HTTP"]
    ROOT --> G1["1xx — Thông tin"]
    ROOT --> G2["2xx — Thành công"]
    ROOT --> G3["3xx — Chuyển hướng"]
    ROOT --> G4["4xx — Lỗi phía client"]
    ROOT --> G5["5xx — Lỗi phía server"]
    G1 --> E1["100 Continue"]
    G2 --> E2["200 OK · 201 Created · 204 No Content"]
    G3 --> E3["301 Moved · 302 Found · 304 Not Modified"]
    G4 --> E4["400 · 401 · 403 · 404 · 429"]
    G5 --> E5["500 · 502 · 503 · 504"]
```

Vài phân biệt hay hỏi:

- **301 vs 302 vs 307/308:** 301 = chuyển hẳn (permanent, trình duyệt/SEO nhớ
  URL mới); 302 = tạm thời; 307/308 giữ nguyên method + body khi chuyển hướng
  (302/301 có thể đổi POST thành GET).
- **304 Not Modified:** dùng với cache có điều kiện (`If-None-Match`/ETag,
  `If-Modified-Since`); server không gửi lại body, tiết kiệm băng thông.
- **401 vs 403:** 401 = **chưa xác thực** (thiếu/hết hạn token → cần đăng nhập);
  403 = **đã xác thực nhưng không đủ quyền** (đăng nhập rồi vẫn bị cấm).
- **400 vs 422:** 400 = cú pháp yêu cầu sai; 422 = cú pháp đúng nhưng dữ liệu
  không hợp lệ về mặt nghiệp vụ (thường dùng khi validate form/JSON).
- **429 Too Many Requests:** vượt giới hạn tần suất (rate limit), thường kèm
  header `Retry-After`.
- **502 vs 503 vs 504:** 502 = gateway/proxy nhận phản hồi hỏng từ upstream;
  503 = server quá tải/bảo trì; 504 = gateway chờ upstream quá lâu (timeout).

!!! question "Tại sao cần mã trạng thái chuẩn hoá?"
    Vì client và server thường do **những người/tổ chức khác nhau** viết, bằng
    **ngôn ngữ khác nhau**, và giữa chúng có nhiều tầng trung gian (proxy, CDN,
    load balancer, trình duyệt). Cần một "ngôn ngữ chung" 3 chữ số để **máy tự
    hiểu kết quả mà không cần đọc phần thân** — vốn có thể là HTML, JSON, hay
    dữ liệu nhị phân tuỳ ứng dụng.

    Mã chuẩn cho phép **hành vi tự động** ở các tầng không hề biết logic nghiệp
    vụ của bạn:

    - **Chữ số đầu phân nhóm ngay lập tức:** chỉ cần nhìn `2xx/3xx/4xx/5xx` là
      biết thành công / chuyển hướng / lỗi client / lỗi server — không cần tra
      từng mã. Trình duyệt, thư viện, công cụ giám sát dựa vào đó để quyết định.
    - **Máy móc phản ứng đúng mà không cần người:** trình duyệt gặp **301** tự
      cập nhật URL và cache; gặp **304** thì **dùng lại bản cache**, tiết kiệm
      băng thông; thư viện HTTP gặp **429/503** biết **thử lại sau** (thường
      theo header `Retry-After`); load balancer gặp **5xx** đánh dấu node hỏng
      và chuyển hướng đi nơi khác.
    - **Phân biệt "lỗi tại ai":** `4xx` nói "lỗi ở phía **bạn** (client) — sửa
      request đi, gửi lại y hệt cũng vô ích", còn `5xx` nói "lỗi ở phía **tôi**
      (server) — request của bạn ổn, cứ thử lại". Chỉ một chữ số đã định đoạt
      client nên retry hay bỏ cuộc.

    **Trực giác:** hãy tưởng tượng mỗi server tự chế mã riêng — client phải học
    lại từ đầu cho mọi API, proxy không thể cache, monitor không thể đếm tỉ lệ
    lỗi. Mã chuẩn (RFC) chính là **giao ước** để cả hệ sinh thái tỉ tỉ request
    mỗi ngày hợp tác được với nhau. Đó cũng là lý do **dùng sai mã rất tai hại**:
    trả `200 OK` kèm thông báo lỗi trong body khiến monitor tưởng mọi thứ ổn,
    còn client thì retry vô ích một thứ đã hỏng.

### HTTP/1.1 vs HTTP/2 vs HTTP/3
| Tiêu chí | HTTP/1.1 | HTTP/2 | HTTP/3 |
|----------|----------|--------|--------|
| Năm | 1997 | 2015 | 2022 |
| Giao thức nền | TCP | TCP | QUIC (trên UDP) |
| Định dạng | Văn bản (text) | Nhị phân (binary) | Nhị phân |
| Đa luồng (Multiplexing) | Không (mỗi kết nối 1 request) | Có, trên 1 kết nối | Có |
| Head-of-line blocking | Có (tầng ứng dụng) | Còn ở tầng TCP | Loại bỏ (mỗi stream độc lập) |
| Nén header | Không | HPACK | QPACK |
| Server Push | Không | Có (ít dùng) | Có |

- **HTTP/1.1:** dùng keep-alive để tái sử dụng kết nối; vẫn bị nghẽn đầu
  hàng (head-of-line blocking).
- **HTTP/2:** ghép nhiều luồng (stream) trên một kết nối TCP, nén header.
- **HTTP/3:** chạy trên QUIC (UDP), thiết lập kết nối nhanh, không bị nghẽn
  do mất gói ở tầng TCP.

!!! question "Tại sao HTTP/2 nhanh hơn HTTP/1.1?"
    Nút thắt của HTTP/1.1 là **nghẽn đầu hàng (head-of-line blocking) ở tầng
    ứng dụng**: trên một kết nối TCP, HTTP/1.1 xử lý request theo **thứ tự tuần
    tự** — request sau phải đợi response của request trước xong mới được gửi
    tiếp. Một trang web hiện đại cần hàng trăm tài nguyên (CSS, JS, ảnh); nếu
    một response chậm, mọi thứ phía sau **xếp hàng chờ**.

    Trình duyệt HTTP/1.1 lách bằng cách mở **6 kết nối TCP song song** mỗi tên
    miền, nhưng cách này tốn kém: mỗi kết nối phải bắt tay TCP (+ TLS) riêng,
    mỗi kết nối tự dò băng thông (slow start) lại từ đầu, và 6 vẫn là quá ít cho
    hàng trăm tài nguyên.

    **HTTP/2 giải bằng đa luồng (multiplexing):** cắt mỗi request/response thành
    các **khung (frame) nhị phân** nhỏ có đánh số stream, rồi **trộn lẫn** chúng
    trên **một** kết nối TCP duy nhất. Bên nhận dựa vào số stream để ráp lại.
    Nhờ đó:

    - Nhiều request "bay" **đồng thời** trên một kết nối — không request nào
      phải đợi request khác xong (**hết nghẽn đầu hàng ở tầng ứng dụng**).
    - Chỉ **một** lần bắt tay TCP/TLS, một lần slow start → tận dụng băng thông
      tốt hơn hẳn 6 kết nối rời rạc.
    - **Nén header (HPACK):** các header lặp đi lặp lại (Cookie, User-Agent...)
      chỉ gửi một lần rồi tham chiếu, thay vì gửi lại nguyên si mỗi request như
      HTTP/1.1 (dạng văn bản, không nén).

    **Trực giác:** HTTP/1.1 giống một quầy thu ngân duy nhất, ai xong mới tới
    người sau; HTTP/2 giống một quầy nhưng nhận **đồng thời** giỏ hàng của nhiều
    khách, quét xen kẽ từng món rồi trả đúng giỏ. **Lưu ý HTTP/2 chưa hết hẳn
    nghẽn đầu hàng:** nó vẫn nằm trên **một** kết nối TCP, nên nếu **một gói TCP
    bị mất**, TCP giữ lại **mọi** stream để chờ truyền lại gói đó — nghẽn đầu
    hàng bị đẩy xuống **tầng TCP**. Đây chính là lý do HTTP/3 bỏ TCP, chạy trên
    QUIC (UDP) với các stream **độc lập**: mất gói của stream này không chặn
    stream kia.

### HTTPS và TLS
HTTPS là HTTP chạy trên TLS (Transport Layer Security), mã hoá dữ liệu để
đảm bảo bảo mật (confidentiality), toàn vẹn (integrity) và xác thực
(authentication) server qua chứng chỉ số (certificate).
- **Bắt tay TLS (TLS handshake):** client và server thoả thuận phiên bản,
  bộ mã hoá (cipher suite), trao đổi khoá và xác minh chứng chỉ.
- Dùng mã hoá bất đối xứng (asymmetric) để trao khoá, rồi chuyển sang mã
  hoá đối xứng (symmetric) cho dữ liệu vì nhanh hơn.

### Cookie và Session
Vì HTTP phi trạng thái, cần cơ chế để duy trì trạng thái đăng nhập:
- **Cookie:** đoạn dữ liệu nhỏ server gửi qua header `Set-Cookie`, trình
  duyệt lưu lại và tự gửi kèm trong các yêu cầu sau (`Cookie` header).
- **Session:** server lưu trạng thái người dùng (giỏ hàng, đăng nhập) và
  gắn với một session ID; ID này thường được lưu trong cookie.
- Thuộc tính bảo mật cookie: `HttpOnly` (chống JS đọc), `Secure` (chỉ gửi
  qua HTTPS), `SameSite` (chống CSRF).

### CORS (Cross-Origin Resource Sharing)
Trình duyệt áp **Same-Origin Policy**: mã JS chỉ được đọc phản hồi từ cùng
"origin" (giao thức + tên miền + cổng). CORS là cơ chế server dùng header để
**cho phép** origin khác truy cập tài nguyên:
- **Origin:** ví dụ `https://app.com:443` khác `http://app.com` (khác giao
  thức) và khác `https://api.app.com` (khác tên miền).
- **Yêu cầu đơn giản (simple request):** GET/POST/HEAD với header/kiểu nội
  dung cơ bản → gửi thẳng, server trả `Access-Control-Allow-Origin`.
- **Preflight:** với method/header "không đơn giản" (PUT, DELETE, header tuỳ
  biến, `Content-Type: application/json`), trình duyệt gửi trước một yêu cầu
  `OPTIONS` hỏi quyền; server trả `Access-Control-Allow-Methods`,
  `Access-Control-Allow-Headers`. Nếu đạt, yêu cầu thật mới được gửi.
- Để gửi kèm cookie qua origin khác: client đặt `credentials: 'include'`,
  server phải trả `Access-Control-Allow-Credentials: true` và **không** dùng
  `Allow-Origin: *`.
- Lưu ý: CORS **không phải** cơ chế bảo mật server — nó chỉ ràng buộc trình
  duyệt. Công cụ như curl/Postman bỏ qua CORS.

!!! tip "Chạy được ngay — phân tích URL & tra ý nghĩa mã trạng thái"
    Đoạn dưới tự viết một hàm phân tích URL (không dùng thư viện ngoài) và một
    bảng tra mã trạng thái HTTP. Bấm **▶ Chạy**; đổi `url` hoặc mảng `codes` để
    thử URL/mã khác.

<div class="js-demo" data-title="Phân tích URL + tra mã trạng thái HTTP">
<textarea class="js-demo-src">
// --- Phần 1: tự phân tích URL bằng regex (không dùng URL API) ---
function parseUrl(url) {
  const re = /^(\w+):\/\/([^/:?#]+)(?::(\d+))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?$/;
  const m = url.match(re);
  if (!m) return null;
  const [, scheme, host, port, path, query, hash] = m;
  const params = {};
  if (query) for (const kv of query.split('&')) {
    const [k, v = ''] = kv.split('=');
    params[decodeURIComponent(k)] = decodeURIComponent(v);
  }
  return {
    scheme, host,
    port: port || (scheme === 'https' ? '443' : '80'),
    path: path || '/',
    params, hash: hash || ''
  };
}

const url = 'https://shop.example.com:8443/san-pham/list?danh_muc=sach&trang=2#top';
const p = parseUrl(url);
print('== Phân tích URL ==');
print('URL   :', url);
print('Scheme:', p.scheme);
print('Host  :', p.host);
print('Port  :', p.port);
print('Path  :', p.path);
print('Query :', JSON.stringify(p.params));
print('Hash  :', p.hash);

// --- Phần 2: map mã trạng thái -> ý nghĩa tiếng Việt ---
const STATUS = {
  200: 'OK — thành công',
  201: 'Created — đã tạo tài nguyên',
  204: 'No Content — thành công, không có body',
  301: 'Moved Permanently — chuyển hẳn',
  302: 'Found — chuyển tạm thời',
  304: 'Not Modified — dùng lại bản cache',
  400: 'Bad Request — yêu cầu sai cú pháp',
  401: 'Unauthorized — chưa xác thực',
  403: 'Forbidden — không đủ quyền',
  404: 'Not Found — không tìm thấy',
  429: 'Too Many Requests — quá nhiều yêu cầu',
  500: 'Internal Server Error — lỗi máy chủ',
  502: 'Bad Gateway — gateway nhận phản hồi hỏng',
  503: 'Service Unavailable — máy chủ quá tải/bảo trì',
};
function nhomCua(code) {
  const g = Math.floor(code / 100);
  return {1:'Thông tin',2:'Thành công',3:'Chuyển hướng',4:'Lỗi client',5:'Lỗi server'}[g] || '?';
}

print('');
print('== Tra mã trạng thái ==');
const codes = [200, 301, 404, 403, 500, 503];
for (const c of codes) {
  print(c + ' [' + nhomCua(c) + '] → ' + (STATUS[c] || 'không rõ'));
}
</textarea>
</div>

## Ví dụ
```python
import requests

# Gửi yêu cầu GET và đọc mã trạng thái, header, body
r = requests.get("https://httpbin.org/get", params={"q": "http"})
print(r.status_code)          # 200
print(r.headers["Content-Type"])
print(r.json()["args"])       # {'q': 'http'}

# Gửi POST kèm dữ liệu JSON
r2 = requests.post("https://httpbin.org/post", json={"ten": "an"})
print(r2.status_code)         # 200

# Cookie được lưu và tự gửi lại nhờ Session
s = requests.Session()
s.get("https://httpbin.org/cookies/set/sid/abc123")
print(s.get("https://httpbin.org/cookies").json())  # {'sid': 'abc123'}
```

## Ưu / nhược điểm
- **Ưu:** đơn giản, phổ biến, dễ mở rộng qua header; stateless giúp dễ
  scale ngang (horizontal scaling).
- **Nhược:** stateless nên phải tự quản lý trạng thái (cookie/session);
  HTTP/1.1 kém hiệu quả với nhiều tài nguyên nhỏ.

## Câu hỏi phỏng vấn thường gặp
1. HTTP là stateless nghĩa là gì? Làm sao duy trì trạng thái đăng nhập?
2. Phân biệt GET và POST; PUT và PATCH. Idempotent là gì?
3. Kể ý nghĩa các nhóm mã trạng thái. 301 khác 302 ra sao? 401 khác 403?
4. HTTP/2 cải tiến gì so với HTTP/1.1? HTTP/3 dùng giao thức nền nào?
5. HTTPS hoạt động thế nào? Bắt tay TLS gồm những bước gì?
6. Cookie khác session ra sao? SameSite dùng để làm gì?

## Tham khảo
- RFC 9110 (HTTP Semantics), RFC 9114 (HTTP/3)
- MDN Web Docs — HTTP
