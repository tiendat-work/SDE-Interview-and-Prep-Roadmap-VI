# Hệ thống tên miền (DNS – Domain Name System)

## Khái niệm
DNS (Domain Name System) là hệ thống phân tán, phân cấp giúp chuyển đổi tên
miền dễ nhớ (ví dụ `example.com`) thành địa chỉ IP mà máy tính dùng để kết
nối (ví dụ `93.184.216.34`). DNS được ví như "danh bạ điện thoại" của
Internet.

## Khi nào dùng / Vì sao quan trọng
- Con người nhớ tên miền dễ hơn nhớ dãy số IP; DNS làm cầu nối này.
- Cho phép đổi địa chỉ IP máy chủ mà không cần đổi tên miền.
- Hỗ trợ cân bằng tải (load balancing), CDN, và định tuyến theo vùng địa lý.
- Hiểu DNS giúp gỡ lỗi kết nối và tối ưu độ trễ (latency) truy cập web.

## Cách hoạt động

### Cấu trúc phân cấp (Hierarchy)
Không gian tên miền có dạng cây, đọc từ phải sang trái:
```
                    . (Root)
                    |
      ┌─────────────┼─────────────┐
     .com          .org          .vn        <- TLD (Top-Level Domain)
      |
   example.com                              <- Domain
      |
   www.example.com                          <- Subdomain
```

### Các loại máy chủ DNS
| Loại | Vai trò |
|------|---------|
| DNS Resolver (đệ quy) | Nhận truy vấn từ client, đi hỏi thay và trả kết quả |
| Root Name Server | Trỏ tới máy chủ TLD tương ứng |
| TLD Name Server | Quản lý `.com`, `.vn`... trỏ tới máy chủ có thẩm quyền |
| Authoritative Name Server | Nắm bản ghi chính thức của tên miền |

### Quy trình phân giải (Resolution) `www.example.com`
```
Client -> Resolver: www.example.com = ?
Resolver -> Root:   -> "hỏi TLD .com tại a.gtld-servers.net"
Resolver -> TLD:    -> "hỏi authoritative ns.example.com"
Resolver -> Auth:   -> "93.184.216.34"
Resolver -> Client: 93.184.216.34  (kèm TTL để cache)
```
Đầu tiên hệ thống luôn kiểm tra bộ đệm (cache) ở nhiều cấp trước khi đi hỏi.

Sơ đồ tuần tự minh hoạ phân giải đệ quy (client) kết hợp lặp (resolver):

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Resolver (đệ quy)
    participant Root as Root Server
    participant TLD as TLD Server (.com)
    participant Auth as Authoritative Server
    C->>R: www.example.com = ?
    R->>Root: Hỏi www.example.com
    Root->>R: Hỏi TLD .com
    R->>TLD: Hỏi www.example.com
    TLD->>R: Hỏi authoritative ns.example.com
    R->>Auth: Hỏi www.example.com
    Auth->>R: 93.184.216.34
    R->>C: 93.184.216.34 (kèm TTL để cache)
```

### Các loại bản ghi (Record Types)
| Bản ghi | Ý nghĩa |
|---------|---------|
| A | Ánh xạ tên miền sang địa chỉ IPv4 |
| AAAA | Ánh xạ tên miền sang địa chỉ IPv6 |
| CNAME | Bí danh (alias) trỏ tên này tới tên khác |
| MX | Mail Exchange – máy chủ nhận email cho tên miền |
| NS | Name Server – khai báo máy chủ tên có thẩm quyền |
| TXT | Văn bản tuỳ ý (SPF, xác minh miền, DKIM) |
| SOA | Start of Authority – thông tin quản trị vùng (zone) |
| PTR | Phân giải ngược IP -> tên miền (reverse DNS) |
| SRV | Định vị dịch vụ (host + port) |

Ví dụ một zone thực tế (định dạng file zone):
```
; TTL tính bằng giây (300 = 5 phút)
example.com.        300  IN  SOA   ns1.example.com. admin.example.com. (2024010101 7200 3600 1209600 300)
example.com.        300  IN  NS    ns1.example.com.
example.com.       3600  IN  A     93.184.216.34
example.com.       3600  IN  AAAA  2606:2800:220:1:248:1893:25c8:1946
www.example.com.   3600  IN  CNAME example.com.        ; www là bí danh của gốc
example.com.        300  IN  MX    10 mail.example.com. ; số 10 là mức ưu tiên
example.com.        300  IN  TXT   "v=spf1 include:_spf.example.com ~all"
```
- **CNAME không đặt ở đỉnh (apex) tên miền** cùng bản ghi khác (vi phạm RFC);
  do đó `example.com` gốc thường dùng A/AAAA, còn `www` mới dùng CNAME.
- **MX** kèm số ưu tiên: số nhỏ hơn được ưu tiên trước.

### Caching và TTL
- Mỗi bản ghi có TTL (Time To Live) tính bằng giây, quy định thời gian được
  lưu cache trước khi phải truy vấn lại.
- Cache tồn tại ở nhiều tầng: trình duyệt, hệ điều hành, resolver của ISP.
- TTL thấp: cập nhật nhanh nhưng tải truy vấn cao. TTL cao: giảm tải nhưng
  chậm phản ánh thay đổi.
- **Negative caching:** kết quả "không tồn tại" (NXDOMAIN) cũng được cache theo
  giá trị TTL tối thiểu trong bản ghi SOA, tránh hỏi lại liên tục.
- **Mẹo đổi IP không gián đoạn:** hạ TTL xuống thấp (ví dụ 60s) **trước** vài
  ngày, rồi mới đổi bản ghi; sau khi ổn định thì nâng TTL lại.
- Vì DNS phân tán nhiều tầng cache, một thay đổi bản ghi có thể mất tới bằng
  giá trị TTL cũ để lan hết ("DNS propagation").

### DNS đệ quy vs lặp (Recursive vs Iterative)
| Tiêu chí | Truy vấn đệ quy (Recursive) | Truy vấn lặp (Iterative) |
|----------|-----------------------------|--------------------------|
| Ai làm việc | Resolver đi hỏi hết thay client | Client/resolver tự hỏi từng máy chủ |
| Phản hồi | Trả thẳng kết quả cuối cùng | Trả về "hỏi tiếp máy chủ này" (referral) |
| Chủ thể dùng | Client -> Resolver | Resolver -> Root/TLD/Auth |
| Gánh nặng | Dồn về resolver | Chia đều, nhẹ cho máy chủ gốc |

Thực tế: client gửi truy vấn **đệ quy** tới resolver; resolver dùng truy vấn
**lặp** để lần lượt hỏi Root, TLD rồi Authoritative.

### Mô phỏng phân giải DNS bằng code
Dưới đây mô phỏng bảng bản ghi DNS bằng một object/dict và hàm tra cứu có
xử lý CNAME (bí danh) — minh hoạ ý tưởng "danh bạ" của DNS:

=== "JavaScript"
    ```js
    // Bảng bản ghi DNS mô phỏng (thay cho authoritative server)
    const zone = {
      "example.com":     { A: "93.184.216.34" },
      "www.example.com": { CNAME: "example.com" },   // bí danh
      "mail.example.com":{ A: "93.184.216.40" },
    };

    // Tra cứu, tự lần theo CNAME (tối đa 10 bước tránh vòng lặp)
    function resolve(name, type = "A", depth = 0) {
      if (depth > 10) throw new Error("Vòng lặp CNAME");
      const rec = zone[name];
      if (!rec) return { name, type, ket_qua: "NXDOMAIN" };
      if (rec.CNAME) {
        console.log(`${name} --CNAME--> ${rec.CNAME}`);
        return resolve(rec.CNAME, type, depth + 1);
      }
      return { name, type, ket_qua: rec[type] ?? "không có bản ghi" };
    }

    console.log(resolve("www.example.com"));
    // www.example.com --CNAME--> example.com
    // { name: 'example.com', type: 'A', ket_qua: '93.184.216.34' }
    console.log(resolve("khong-ton-tai.com"));  // NXDOMAIN
    ```
=== "Python"
    ```python
    # Bảng bản ghi DNS mô phỏng (thay cho authoritative server)
    zone = {
        "example.com":      {"A": "93.184.216.34"},
        "www.example.com":  {"CNAME": "example.com"},   # bí danh
        "mail.example.com": {"A": "93.184.216.40"},
    }

    def resolve(name, type_="A", depth=0):
        if depth > 10:
            raise RuntimeError("Vòng lặp CNAME")
        rec = zone.get(name)
        if rec is None:
            return {"name": name, "type": type_, "ket_qua": "NXDOMAIN"}
        if "CNAME" in rec:
            print(f"{name} --CNAME--> {rec['CNAME']}")
            return resolve(rec["CNAME"], type_, depth + 1)
        return {"name": name, "type": type_, "ket_qua": rec.get(type_, "không có bản ghi")}

    print(resolve("www.example.com"))
    # www.example.com --CNAME--> example.com
    # {'name': 'example.com', 'type': 'A', 'ket_qua': '93.184.216.34'}
    print(resolve("khong-ton-tai.com"))  # NXDOMAIN
    ```

!!! tip "Chạy được ngay — mô phỏng phân giải qua các tầng cache & server"
    Đoạn dưới mô phỏng resolver: kiểm tra cache trước, nếu trượt thì "hỏi" lần
    lượt Root → TLD → Authoritative rồi lưu cache. Bấm **▶ Chạy**; chú ý lần
    tra thứ hai của cùng tên miền sẽ trúng cache (nhanh hơn).

<div class="js-demo" data-title="Mô phỏng phân giải DNS có cache">
<textarea class="js-demo-src">
// Dữ liệu authoritative mô phỏng: tên miền -> IP
const AUTH = {
  'example.com': '93.184.216.34',
  'openai.com': '104.18.32.115',
};
const cache = {};   // cache của resolver: tên -> {ip, hetHan}
let now = 0;        // đồng hồ giả lập (giây)

function resolve(name, ttl = 60) {
  now += 1;
  const c = cache[name];
  if (c && c.hetHan > now) {
    print(`[t=${now}] "${name}" → ${c.ip}  (TRÚNG CACHE, còn ${c.hetHan - now}s)`);
    return c.ip;
  }
  // Cache trượt → đi hỏi tuần tự các tầng
  print(`[t=${now}] "${name}" TRƯỢT CACHE → hỏi Root → TLD → Authoritative`);
  const ip = AUTH[name];
  if (!ip) { print(`         → NXDOMAIN (không tồn tại)`); return null; }
  cache[name] = { ip, hetHan: now + ttl };
  print(`         → ${ip}  (lưu cache TTL=${ttl}s)`);
  return ip;
}

resolve('example.com');   // trượt, đi hỏi
resolve('openai.com');    // trượt, đi hỏi
now += 5;                 // 5 giây sau
resolve('example.com');   // trúng cache
resolve('khong-ton-tai.vn'); // NXDOMAIN
</textarea>
</div>

## Ví dụ
```python
import socket

# Phân giải cơ bản: tên miền -> IP (dùng resolver của hệ điều hành)
ip = socket.gethostbyname("example.com")
print(ip)   # ví dụ: 93.184.216.34

# Lấy nhiều thông tin địa chỉ (hỗ trợ cả IPv4 và IPv6)
for info in socket.getaddrinfo("example.com", 443):
    print(info[4])   # (địa chỉ, cổng)
```
```bash
# Công cụ dòng lệnh thông dụng để tra cứu DNS
dig www.example.com A       # tra bản ghi A
dig example.com MX +short   # tra máy chủ mail
nslookup example.com        # tra cứu nhanh
```

## Ưu / nhược điểm
- **Ưu:** phân tán và có cache nên chịu tải và độ trễ tốt; phân cấp giúp
  quản lý dễ dàng.
- **Nhược:** cache khiến thay đổi lan chậm (theo TTL); dễ bị tấn công như
  DNS spoofing/cache poisoning nếu không dùng DNSSEC.

## Câu hỏi phỏng vấn thường gặp
1. Mô tả quy trình phân giải DNS khi gõ một tên miền vào trình duyệt.
2. Phân biệt truy vấn đệ quy và truy vấn lặp.
3. Bản ghi A khác AAAA và CNAME thế nào? Khi nào dùng MX?
4. TTL trong DNS là gì? Cache DNS xảy ra ở những đâu?
5. DNS dùng TCP hay UDP? Vì sao (cổng 53)?
6. DNS spoofing là gì và DNSSEC giải quyết ra sao?

## Tham khảo
- RFC 1034, RFC 1035 (DNS)
- Cloudflare Learning — What is DNS?
