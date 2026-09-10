# System Design Interview — Alex Xu (Tóm tắt theo chương)

*System Design Interview: An Insider's Guide* của Alex Xu là cuốn sách kinh điển giúp
chuẩn bị cho vòng phỏng vấn thiết kế hệ thống (system design interview). Sách không chỉ
cung cấp kiến thức nền về xây dựng hệ thống có khả năng mở rộng (scalable) mà còn đưa ra
một khung tư duy (framework) 4 bước để giải quyết các bài toán mở, mơ hồ đặc trưng của
dạng phỏng vấn này. Bản tóm tắt dưới đây trình bày cô đọng từng chương với: (a) vấn đề/yêu
cầu, (b) các quyết định thiết kế chính, (c) đánh đổi (trade-off) và (d) mô tả kiến trúc.
Đây là tài liệu ôn tập nhanh, không thay thế việc đọc bản gốc.

## Mục lục

1. [Scale từ 0 đến hàng triệu người dùng](#chuong-1-scale-tu-0-den-hang-trieu-nguoi-dung-scale-from-zero-to-millions-of-users)
2. [Ước lượng back-of-the-envelope](#chuong-2-uoc-luong-back-of-the-envelope-back-of-the-envelope-estimation)
3. [Khung 4 bước cho phỏng vấn thiết kế hệ thống](#chuong-3-khung-4-buoc-cho-phong-van-thiet-ke-he-thong-a-framework-for-system-design-interviews)
4. [Thiết kế Rate Limiter](#chuong-4-thiet-ke-rate-limiter-design-a-rate-limiter)
5. [Consistent Hashing](#chuong-5-consistent-hashing-design-consistent-hashing)
6. [Kho lưu trữ Key-Value](#chuong-6-kho-luu-tru-key-value-design-a-key-value-store)
7. [Bộ sinh ID duy nhất phân tán](#chuong-7-bo-sinh-id-duy-nhat-phan-tan-unique-id-generator-in-distributed-systems)
8. [URL Shortener](#chuong-8-url-shortener-design-a-url-shortener)
9. [Web Crawler](#chuong-9-web-crawler-design-a-web-crawler)
10. [Hệ thống thông báo](#chuong-10-he-thong-thong-bao-design-a-notification-system)
11. [News Feed](#chuong-11-news-feed-design-a-news-feed-system)
12. [Hệ thống chat](#chuong-12-he-thong-chat-design-a-chat-system)
13. [Gợi ý tìm kiếm tự động](#chuong-13-goi-y-tim-kiem-tu-dong-design-a-search-autocomplete-system)
14. [Thiết kế YouTube](#chuong-14-thiet-ke-youtube-design-youtube)
15. [Thiết kế Google Drive](#chuong-15-thiet-ke-google-drive-design-google-drive)
16. [Học tiếp](#chuong-16-hoc-tiep-the-learning-continues)

---

## Chương 1: Scale từ 0 đến hàng triệu người dùng (Scale From Zero to Millions of Users)

**Vấn đề:** Xây dựng một hệ thống khởi đầu chỉ phục vụ một người dùng rồi mở rộng dần lên
hàng triệu người dùng, minh họa các kỹ thuật mở rộng cơ bản.

**Các quyết định thiết kế chính:** Bắt đầu từ máy chủ đơn (single server) chứa cả web, cơ
sở dữ liệu (database) và cache. Khi tải tăng: (1) tách tầng web và tầng dữ liệu để mở rộng
độc lập; (2) chọn cơ sở dữ liệu quan hệ (RDBMS) hoặc phi quan hệ (NoSQL) tùy đặc điểm dữ
liệu; (3) thêm bộ cân bằng tải (load balancer) để chống lỗi và phân phối lưu lượng; (4)
nhân bản cơ sở dữ liệu (database replication) theo mô hình master-slave — master ghi,
slave đọc; (5) thêm tầng cache và mạng phân phối nội dung (CDN) cho tài nguyên tĩnh; (6)
làm tầng web không trạng thái (stateless) bằng cách đưa session ra kho lưu trữ dùng chung;
(7) triển khai nhiều trung tâm dữ liệu (data center) định tuyến bằng geoDNS; (8) dùng hàng
đợi thông điệp (message queue) để tách rời (decouple) các thành phần; (9) mở rộng tầng dữ
liệu bằng sharding.

**Đánh đổi:** Mở rộng dọc (vertical scaling) đơn giản nhưng có giới hạn phần cứng và không
chống lỗi; mở rộng ngang (horizontal scaling) phức tạp hơn nhưng bền vững. Sharding gây khó
join, vấn đề hotspot key (celebrity problem) và tái phân mảnh (resharding).

**Kiến trúc tổng quát (mô tả):** Client → geoDNS → Load Balancer → cụm web stateless →
(Cache/Redis, cụm DB master-slave đã shard); tài nguyên tĩnh phục vụ qua CDN; các tác vụ
nặng đẩy qua message queue cho worker xử lý bất đồng bộ; kèm logging, metrics, automation.

---

## Chương 2: Ước lượng back-of-the-envelope (Back-of-the-Envelope Estimation)

**Vấn đề:** Trong phỏng vấn, ứng viên thường phải ước lượng nhanh dung lượng hoặc hiệu năng
hệ thống để đánh giá tính khả thi của thiết kế.

**Các quyết định/kiến thức nền chính:** Nắm vững ba nhóm số liệu — lũy thừa của 2 (đơn vị
dữ liệu: KB, MB, GB, TB, PB), các con số độ trễ (latency numbers every programmer should
know) của Jeff Dean, và các con số về tính sẵn sàng (availability). Hiểu QPS (query per
second), peak QPS, dung lượng lưu trữ, cache, số máy chủ. Ví dụ điển hình: ước lượng QPS và
storage của Twitter — với 300 triệu MAU, 50% dùng hằng ngày, mỗi người 2 tweet/ngày → DAU
150 triệu, tweet QPS ≈ 3500, peak ≈ 7000; storage media 5 năm ≈ 55 PB.

**Đánh đổi:** Trọng tâm là *quá trình* chứ không phải con số chính xác. Nên làm tròn
(rounding/approximation) để tính nhanh, ghi rõ giả định (assumptions) và ghi kèm đơn vị
(labels) để tránh nhầm lẫn.

**Các mốc quan trọng:** Bộ nhớ nhanh, đĩa chậm — tránh disk seek; nén dữ liệu trước khi
truyền qua mạng; truyền dữ liệu giữa các data center tốn thời gian. Tính sẵn sàng đo bằng
"số chín" (99.9%, 99.99%...) và ràng buộc bởi SLA (service level agreement).

---

## Chương 3: Khung 4 bước cho phỏng vấn thiết kế hệ thống (A Framework for System Design Interviews)

**Vấn đề:** Câu hỏi thiết kế hệ thống mơ hồ, phạm vi rộng, không có đáp án đúng duy nhất.
Người phỏng vấn đánh giá khả năng cộng tác, xử lý sự mơ hồ và bảo vệ lựa chọn thiết kế.

**Khung 4 bước:**

- **Bước 1 — Hiểu vấn đề và xác định phạm vi (scope):** Đặt câu hỏi làm rõ; không vội đưa
  giải pháp. Xác định tính năng, quy mô, ràng buộc, giả định.
- **Bước 2 — Đề xuất thiết kế cấp cao và lấy đồng thuận (get buy-in):** Vẽ sơ đồ khối các
  thành phần chính, thống nhất hướng đi với người phỏng vấn, làm phép tính back-of-the-envelope.
- **Bước 3 — Đào sâu thiết kế (design deep dive):** Cùng người phỏng vấn đi sâu vào các
  thành phần/nút thắt cổ chai quan trọng.
- **Bước 4 — Tổng kết (wrap up):** Nêu điểm nghẽn, hướng cải tiến, mở rộng, xử lý lỗi,
  monitoring.

**Đánh đổi/cảnh báo:** Tránh "red flag" như over-engineering (thiết kế thừa, bỏ qua
trade-off), bảo thủ, hẹp hòi. Phân bổ thời gian hợp lý, không sa đà chi tiết quá sớm.

**Kiến trúc/quy trình:** Đây là chương khung tư duy, được áp dụng lặp lại xuyên suốt các
chương thiết kế sau (chương 4 trở đi).

---

## Chương 4: Thiết kế Rate Limiter (Design a Rate Limiter)

**Vấn đề:** Xây dựng bộ giới hạn tốc độ (rate limiter) để chặn bớt request vượt ngưỡng,
chống lạm dụng/DoS, giảm chi phí và tránh quá tải máy chủ; cần chính xác, ít tốn bộ nhớ,
hoạt động phân tán, chịu lỗi tốt.

**Quyết định thiết kế:** Đặt rate limiter phía server hoặc trong API gateway (middleware)
thay vì client (dễ bị giả mạo). Lựa chọn thuật toán:

- **Token bucket:** nạp token định kỳ, mỗi request tiêu một token; cho phép burst; Amazon,
  Stripe dùng.
- **Leaking bucket:** hàng đợi FIFO xử lý tốc độ cố định; đầu ra ổn định nhưng burst cũ có
  thể chặn request mới.
- **Fixed window counter:** đơn giản nhưng burst ở rìa cửa sổ có thể vượt quota gấp đôi.
- **Sliding window log:** chính xác tuyệt đối nhưng tốn bộ nhớ.
- **Sliding window counter:** lai hai loại trên, mượt và tiết kiệm bộ nhớ, chỉ là xấp xỉ.

**Đánh đổi:** Độ chính xác đổi lấy bộ nhớ; token/leaking bucket khó tinh chỉnh hai tham số.
Trong môi trường phân tán có race condition (giải bằng Lua script hoặc sorted set của Redis)
và vấn đề đồng bộ (dùng kho tập trung Redis, mô hình eventual consistency).

**Kiến trúc:** Client → Rate limiter middleware → (Redis lưu counter với INCR/EXPIRE). Nếu
vượt ngưỡng trả HTTP 429 kèm header `X-Ratelimit-Remaining/Limit/Retry-After`; luật lưu ở
file cấu hình, worker nạp vào cache.

---

## Chương 5: Consistent Hashing (Design Consistent Hashing)

**Vấn đề:** Khi phân phối key qua N server bằng `hash % N`, thêm/bớt server làm hầu hết key
bị ánh xạ lại, gây khối lượng di chuyển dữ liệu khổng lồ. Cần kỹ thuật giảm thiểu việc này.

**Quyết định thiết kế:** Dùng consistent hashing — ánh xạ cả server lẫn key lên một "vòng
băm" (hash ring). Mỗi key thuộc về server đầu tiên gặp khi đi theo chiều kim đồng hồ từ vị
trí key. Khi thêm/bớt server, chỉ một phần nhỏ key giữa server đó và server liền trước cần
tái phân bố. Để khắc phục hai nhược điểm (phân vùng không đều và phân phối key lệch), dùng
**nút ảo (virtual nodes/replicas)**: mỗi server đại diện bởi nhiều điểm trên vòng.

**Đánh đổi:** Càng nhiều virtual node, phân phối càng cân bằng (độ lệch chuẩn giảm) nhưng
tốn thêm bộ nhớ lưu metadata — cần tinh chỉnh số lượng phù hợp.

**Kiến trúc/ứng dụng:** Vòng băm với các server (mỗi server có nhiều virtual node) và key
được đặt lên. Consistent hashing được dùng rộng rãi: phân vùng của Amazon Dynamo, Cassandra,
Discord, CDN Akamai, load balancer Maglev của Google. Lợi ích: giảm key phải di chuyển, dễ
mở rộng ngang, giảm vấn đề hotspot key.

---

## Chương 6: Kho lưu trữ Key-Value (Design a Key-Value Store)

**Vấn đề:** Thiết kế kho key-value phân tán hỗ trợ `put(key, value)` và `get(key)`, lưu dữ
liệu lớn, độ trễ thấp, sẵn sàng cao, mở rộng tự động và độ nhất quán (consistency) điều
chỉnh được.

**Quyết định thiết kế:** Vì một server không đủ, chuyển sang kho phân tán (distributed hash
table). Áp dụng **định lý CAP** để chọn ưu tiên (thường là hệ AP — sẵn sàng + chịu phân
vùng, hy sinh nhất quán tức thời). Các thành phần: phân vùng dữ liệu bằng consistent
hashing; nhân bản (replication) trên N server; nhất quán bằng **quorum** (N, W, R) — nếu
`W + R > N` đảm bảo strong consistency; giải quyết bất nhất bằng **versioning + vector
clock**; xử lý lỗi tạm thời bằng **hinted handoff**, lỗi lâu dài bằng đồng bộ **Merkle
tree**; lưu trữ theo mô hình SSTable/LSM, dùng Bloom filter để tăng tốc đọc.

**Đánh đổi:** Cấu hình N/W/R cân bằng giữa độ trễ và độ nhất quán (R=1 tối ưu đọc nhanh, W=1
tối ưu ghi nhanh). Eventual consistency (như Dynamo, Cassandra) cho sẵn sàng cao nhưng client
phải hòa giải (reconcile) các phiên bản.

**Kiến trúc:** Coordinator làm proxy giữa client và các node trên vòng băm; write path ghi
vào commit log → memtable → SSTable; read path kiểm tra memtable/Bloom filter rồi đọc SSTable.

---

## Chương 7: Bộ sinh ID duy nhất phân tán (Unique ID Generator in Distributed Systems)

**Vấn đề:** Sinh ID duy nhất trên nhiều máy chủ; ID phải duy nhất, chỉ chứa số, vừa 64-bit,
sắp xếp được theo thời gian, và đạt trên 10.000 ID/giây.

**Quyết định thiết kế — so sánh các phương án:**

- **Multi-master replication:** dùng auto_increment tăng theo bước k = số server; khó mở
  rộng nhiều data center, ID không tăng theo thời gian.
- **UUID:** 128-bit, sinh độc lập không cần phối hợp; nhưng không vừa 64-bit, không sắp theo
  thời gian, có thể phi số.
- **Ticket server:** một server auto_increment tập trung (Flickr); đơn giản, ID là số nhưng
  là điểm lỗi đơn (SPOF).
- **Twitter Snowflake (chọn):** chia 64-bit thành sign(1) + timestamp(41) + datacenter ID(5)
  + machine ID(5) + sequence(12). Sắp theo thời gian, đủ 4096 ID/ms/máy, ~69 năm tuổi thọ.

**Đánh đổi:** Snowflake đáp ứng mọi yêu cầu nhưng phụ thuộc đồng bộ đồng hồ (clock sync — giải
bằng NTP). Có thể tinh chỉnh độ dài các trường (nhiều bit timestamp hơn cho ứng dụng dài hạn,
ít concurrency).

**Kiến trúc:** Mỗi máy sinh ID độc lập từ cấu trúc bit; datacenter ID và machine ID cố định
lúc khởi động, timestamp và sequence sinh lúc chạy.

---

## Chương 8: URL Shortener (Design a URL Shortener)

**Vấn đề:** Thiết kế dịch vụ rút gọn URL kiểu TinyURL: rút gọn URL dài và chuyển hướng
(redirect) URL ngắn về URL gốc; quy mô ~100 triệu URL/ngày, URL ngắn dùng ký tự [0-9a-zA-Z].

**Quyết định thiết kế:** Hai API chính — `POST` tạo shortURL, `GET` chuyển hướng. Cho việc
sinh hash có hai hướng: (1) **hash + giải va chạm** (hash rồi lấy 7 ký tự đầu, kiểm tra
va chạm, dùng Bloom filter tăng tốc); (2) **base-62 conversion** (chọn) — sinh ID số duy nhất
bằng bộ sinh ID (chương 7) rồi đổi sang base 62. Redirect dùng HTTP 301 (cache lâu, giảm tải
server) hoặc 302 (theo dõi click tốt hơn).

**Đánh đổi:** Base-62 cho độ dài URL thay đổi theo ID, dễ đoán tuần tự nhưng không cần truy
vấn kiểm tra va chạm; hash cho độ dài cố định nhưng phải xử lý va chạm và tốn truy vấn DB.
Redirect 301 tối ưu tải nhưng khó thống kê; 302 ngược lại.

**Kiến trúc:** Client → Load Balancer → Web servers → (Cache <shortURL, longURL> cho đọc
nhanh vì đọc nhiều hơn ghi) → DB. Luồng rút gọn: kiểm tra longURL đã tồn tại → sinh ID →
base-62 → lưu (ID, shortURL, longURL). Tổng kết bàn thêm về rate limiter, mở rộng DB, analytics.

---

## Chương 9: Web Crawler (Design a Web Crawler)

**Vấn đề:** Thiết kế web crawler thu thập nội dung web (cho lập chỉ mục tìm kiếm), quy mô ~1
tỷ trang/tháng, chỉ HTML, có xử lý trang mới/cập nhật, lưu tối đa 5 năm. Cần khả năng mở
rộng, lịch sự (politeness), mở rộng chức năng và bền vững (robustness).

**Quyết định thiết kế:** Thuật toán nền: tải trang từ danh sách URL → trích link → thêm URL
mới → lặp lại (BFS). Thành phần: seed URLs → **URL Frontier** (hàng đợi quản lý ưu tiên
bằng front queues và lịch sự bằng back queues) → HTML Downloader → DNS Resolver → Content
Parser → "Content Seen?" (khử trùng lặp bằng hash/checksum) → Content Storage → URL Extractor
→ "URL Filter" → "URL Seen?" → quay lại Frontier.

**Đánh đổi/kỹ thuật:** Lịch sự bằng cách mỗi host chỉ một luồng tải, có delay giữa các lần
tải. Ưu tiên URL theo PageRank/traffic/tần suất cập nhật. Freshness: recrawl theo lịch sử cập
nhật. Lưu Frontier theo mô hình lai (phần lớn trên đĩa, đệm trên bộ nhớ). Tối ưu hiệu năng:
crawl phân tán, cache DNS, đặt server gần host (locality), timeout ngắn. Bền vững: consistent
hashing, lưu trạng thái crawl, xử lý ngoại lệ. Tránh bẫy nhện (spider trap), nội dung trùng
lặp, dữ liệu nhiễu; tôn trọng robots.txt.

---

## Chương 10: Hệ thống thông báo (Design a Notification System)

**Vấn đề:** Thiết kế hệ thống gửi thông báo đa kênh — push notification (iOS/Android), SMS,
email — ở quy mô lớn, đáng tin cậy, tôn trọng cài đặt người dùng.

**Quyết định thiết kế:** Thu thập thông tin thiết bị (device token) khi người dùng cài app,
lưu vào DB. Luồng: các dịch vụ (services) → **Notification servers** (xác thực, rate limiting,
lấy device token, đưa thông báo vào hàng đợi) → **message queue** cho từng kênh (tách rời,
đệm) → **workers** kéo từ queue → dịch vụ bên thứ ba (APNs, FCM, Twilio/Nexmo cho SMS,
SendGrid/Mailchimp cho email) → thiết bị người dùng.

**Đánh đổi:** Message queue giúp tách rời và co giãn độc lập nhưng khó đảm bảo "exactly-once"
delivery — hệ thống chấp nhận "at-least-once" và khử trùng lặp bằng dedupe. Cần cân bằng độ
tin cậy (retry) với nguy cơ gửi trùng.

**Cải tiến/kiến trúc chi tiết:** Thêm cơ chế **retry** (thất bại thì đưa lại queue, quá số
lần thì cảnh báo dev); bảo mật bằng appKey/appSecret; **notification template** cho nhất quán;
bảng cài đặt để tôn trọng opt-out của người dùng; **rate limiting** giới hạn tần suất; giám
sát số thông báo tồn đọng trong queue (nếu lớn thì thêm worker); events tracking (open rate,
click rate) tích hợp analytics.

---

## Chương 11: News Feed (Design a News Feed System)

**Vấn đề:** Thiết kế bảng tin (news feed) kiểu Facebook/Instagram/Twitter — người dùng đăng
bài và xem bài của bạn bè sắp theo thứ tự thời gian đảo ngược; ~10 triệu DAU, mỗi người tối
đa 5000 bạn, hỗ trợ ảnh/video.

**Quyết định thiết kế:** Chia làm hai luồng:

- **Feed publishing:** User → Load Balancer → Web servers (xác thực, rate limiting) → Post
  service (lưu DB + cache) → **Fanout service** (đẩy bài vào feed của bạn bè) → Notification
  service.
- **Newsfeed building:** User → Web servers → Newsfeed service (đọc từ Newsfeed cache lưu
  các post ID) → hydrate nội dung từ cache.

**Đánh đổi — hai mô hình fanout:**

- **Fanout on write (push):** tính sẵn feed lúc ghi; đọc feed rất nhanh, cập nhật realtime;
  nhưng tốn kém với người nhiều bạn (hotkey problem) và lãng phí với user không hoạt động.
- **Fanout on read (pull):** tính feed lúc đọc; tránh lãng phí, tốt cho người nhiều bạn;
  nhưng đọc chậm.
- **Giải pháp lai:** đa số dùng push; với người nổi tiếng (nhiều follower) dùng pull.

**Kiến trúc:** Dùng cache nhiều tầng (news feed, content, social graph, action, counters).
Bàn thêm về mở rộng DB, dedupe, sắp xếp feed.

---

## Chương 12: Hệ thống chat (Design a Chat System)

**Vấn đề:** Thiết kế ứng dụng chat hỗ trợ chat 1-1 và nhóm nhỏ, chỉ báo trực tuyến (online
presence), gửi nhận realtime độ trễ thấp, đồng bộ trên nhiều thiết bị.

**Quyết định thiết kế:** Client dùng HTTP để gửi tin (client khởi tạo), nhưng nhận tin realtime
qua **WebSocket** (kết nối bền, hai chiều). Dịch vụ tách thành: stateless services (đăng nhập,
đăng ký, hồ sơ qua API servers + KV store), **stateful chat service** (giữ WebSocket), và
third-party integration (push notification). Lưu tin nhắn trong **key-value store** (HBase như
Messenger, Cassandra như Discord) vì lượng dữ liệu khổng lồ và cần truy cập ngẫu nhiên nhanh.

**Message ID:** phải duy nhất và sắp theo thời gian — dùng Snowflake (toàn cục) hoặc bộ sinh
ID cục bộ trong từng kênh/nhóm.

**Đánh đổi:** Chat nhóm nhỏ sao chép tin vào "inbox" (message sync queue) của mỗi thành viên —
đơn giản nhưng chỉ hợp nhóm nhỏ (WeChat giới hạn 500); nhóm lớn không thể sao chép cho từng
người. Online presence dùng heartbeat để tránh đổi trạng thái liên tục khi mạng chập chờn.

**Kiến trúc:** Service discovery (Zookeeper) chọn chat server tốt nhất; luồng 1-1: chat server
lấy message ID → message sync queue → KV store → nếu người nhận online thì đẩy qua chat server
của họ, offline thì gửi push notification. Presence servers dùng mô hình publish-subscribe cho
fanout trạng thái.

---

## Chương 13: Gợi ý tìm kiếm tự động (Design a Search Autocomplete System)

**Vấn đề:** Thiết kế hệ thống gợi ý (autocomplete/typeahead) trả về top 5 truy vấn phổ biến
nhất theo tiền tố (prefix) người dùng gõ; độ trễ cực thấp, quy mô lớn.

**Quyết định thiết kế:** Chia hai phần — **thu thập dữ liệu (data gathering)** tổng hợp tần
suất truy vấn từ analytics log, và **truy vấn (query)** trả gợi ý. Cấu trúc lõi là **trie**
(cây tiền tố); để đạt tốc độ, lưu sẵn top-k truy vấn tại mỗi nút trie (thay vì duyệt toàn bộ
cây con). Trie được worker dựng offline định kỳ (ví dụ hằng tuần) từ dữ liệu tổng hợp, lưu vào
Trie DB (document store như MongoDB, hoặc key-value store) và cache (Trie Cache).

**Đánh đổi:** Lưu top-k tại mỗi nút tăng tốc đọc nhưng tốn bộ nhớ và cập nhật đắt (đổi một nút
phải cập nhật tổ tiên) — nên dựng lại toàn bộ trie định kỳ thay vì cập nhật từng nút. Data
sampling (chỉ log 1/N request) để giảm tải. Không hỗ trợ realtime/trending trong thiết kế cơ bản.

**Kiến trúc:** Client → Load Balancer → API servers → Trie Cache (miss thì nạp lại từ Trie DB).
Tối ưu: AJAX request, browser caching (Google cache 1 giờ). Mở rộng lưu trữ bằng sharding theo
tiền tố với shard map manager để cân bằng phân phối lệch (nhiều từ bắt đầu 'c' hơn 'x').

---

## Chương 14: Thiết kế YouTube (Design YouTube)

**Vấn đề:** Thiết kế nền tảng chia sẻ video (áp dụng cả cho Netflix/Hulu): tải lên (upload) và
phát trực tuyến (streaming) video mượt, quy mô hàng tỷ người dùng, đa thiết bị, chi phí hợp lý.

**Quyết định thiết kế:** Tận dụng dịch vụ đám mây (CDN, blob storage như S3) thay vì tự xây tất
cả. Hai luồng chính:

- **Upload:** video lên original storage → **transcoding servers** chuyển mã (encode) sang
  nhiều định dạng/độ phân giải/bitrate → transcoded storage → phân phối lên **CDN**; song song
  cập nhật metadata (tên, kích thước, URL...) vào metadata DB/cache qua completion queue.
- **Streaming:** phát trực tiếp từ **CDN** (edge server gần người xem nhất) qua giao thức
  streaming (MPEG-DASH, HLS...), tải dần từng phần thay vì tải toàn bộ.

**Video transcoding:** dùng mô hình **DAG (directed acyclic graph)** để định nghĩa pipeline
xử lý linh hoạt (inspection, encoding, thumbnail, watermark) và song song hóa. Kiến trúc
transcoding gồm preprocessor (chia video theo GOP), DAG scheduler, resource manager (task/worker/
running queue + task scheduler), task workers, temporary storage.

**Đánh đổi:** Adaptive bitrate streaming đổi chất lượng theo băng thông cho trải nghiệm mượt.
Tối ưu chi phí: chỉ đẩy video phổ biến lên CDN, video ít xem phục vụ từ server; phân tầng lưu
trữ. Xử lý lỗi ở từng tầng, upload nối tiếp (resumable).

---

## Chương 15: Thiết kế Google Drive (Design Google Drive)

**Vấn đề:** Thiết kế dịch vụ lưu trữ và đồng bộ file (Google Drive/Dropbox): upload/download,
đồng bộ nhiều thiết bị, lịch sử phiên bản (revision), chia sẻ, thông báo thay đổi; tối ưu băng
thông và đảm bảo nhất quán.

**Quyết định thiết kế:** Chuyển từ single server sang: sharding metadata theo user_id, lưu file
trên **Amazon S3** (nhân bản same-region và cross-region chống mất dữ liệu), thêm load balancer,
tách web/metadata DB/file storage. Điểm cốt lõi là **block servers**: file được chia thành các
block nhỏ (Dropbox dùng tối đa 4MB), mỗi block được nén (compression) và mã hóa (encryption)
trước khi lên cloud. Dùng **delta sync** — chỉ đồng bộ block bị thay đổi thay vì cả file — để
tiết kiệm băng thông.

**Đánh đổi:** Hệ yêu cầu **strong consistency** cho metadata (không chấp nhận file hiển thị khác
nhau giữa các client) → chọn cơ sở dữ liệu quan hệ (hỗ trợ ACID sẵn) và vô hiệu hóa cache khi
ghi, thay vì eventual consistency. Xung đột đồng bộ (sync conflict) xử lý theo nguyên tắc "phiên
bản xử lý trước thắng", phiên bản sau nhận conflict để người dùng merge/override.

**Kiến trúc:** Client ↔ (Block servers → cloud storage/S3, cold storage cho dữ liệu ít dùng);
API servers (xác thực, quản lý metadata); metadata DB + cache; **notification service**
(publish-subscribe báo client kéo thay đổi); offline backup queue cho client offline. Schema
metadata gồm bảng User, Device, Namespace, File, File_version (read-only giữ lịch sử), Block.

---

## Chương 16: Học tiếp (The Learning Continues)

**Nội dung:** Chương cuối không phải một bài thiết kế mà là định hướng học tập tiếp tục. Thiết
kế hệ thống là kỹ năng rèn luyện lâu dài; cách hiệu quả nhất là nghiên cứu kiến trúc thực tế của
các công ty lớn và đọc kỹ thuật của các hệ thống nổi tiếng.

**Gợi ý của tác giả:**

- Đọc **engineering blog** của các công ty lớn (Facebook, Twitter, Netflix, Amazon, Google,
  Uber, Airbnb, Dropbox...) để học cách họ giải quyết vấn đề thực tế.
- Tìm hiểu sâu các kiến trúc và công nghệ nền tảng: cân bằng tải, cơ sở dữ liệu (SQL/NoSQL),
  caching, sharding, replication, hệ thống phân tán, xử lý dòng dữ liệu (stream processing),
  đồng thuận (consensus), microservices, message queue.
- Đọc các paper kinh điển được trích dẫn xuyên suốt sách: Dynamo, Bigtable, Cassandra, GFS,
  MapReduce, Kafka...

**Thông điệp chính:** Không có thiết kế "đúng" duy nhất; điều quan trọng là hiểu **trade-off**,
biết đặt câu hỏi, và liên tục thực hành. Kiến thức nền vững cùng khung tư duy 4 bước (chương 3)
là hành trang để giải quyết mọi câu hỏi thiết kế hệ thống mới.
