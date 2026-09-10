# Designing Data-Intensive Applications — Martin Kleppmann

**Tóm tắt học tập tiếng Việt theo từng chương.** Cuốn *Designing Data-Intensive Applications* (DDIA, 2017) không dạy một công nghệ cụ thể mà xây dựng nền tảng tư duy để đánh giá và kết hợp các hệ thống dữ liệu (cơ sở dữ liệu, hàng đợi, cache, công cụ tìm kiếm, xử lý theo lô và luồng). Kleppmann tổ chức nội dung quanh ba mục tiêu xuyên suốt: **tin cậy (reliability)**, **mở rộng được (scalability)** và **bảo trì được (maintainability)**, rồi phân tích các đánh đổi (trade-off) mà mọi kiến trúc phải đối mặt. Bản tóm tắt này diễn giải lại các ý tưởng cốt lõi để ôn tập phỏng vấn SDE, **không chép nguyên văn** sách gốc.

> Quy ước: thuật ngữ tiếng Anh được ghi trong ngoặc ở lần xuất hiện đầu tiên để dễ tra cứu tài liệu gốc.

## Mục lục

- [Chương 1 — Ứng dụng tin cậy, mở rộng được, bảo trì được](#chuong-1)
- [Chương 2 — Mô hình dữ liệu & ngôn ngữ truy vấn](#chuong-2)
- [Chương 3 — Lưu trữ và truy xuất](#chuong-3)
- [Chương 4 — Mã hoá và tiến hoá](#chuong-4)
- [Chương 5 — Nhân bản](#chuong-5)
- [Chương 6 — Phân mảnh](#chuong-6)
- [Chương 7 — Giao dịch](#chuong-7)
- [Chương 8 — Những rắc rối của hệ phân tán](#chuong-8)
- [Chương 9 — Nhất quán và đồng thuận](#chuong-9)
- [Chương 10 — Xử lý theo lô](#chuong-10)
- [Chương 11 — Xử lý luồng](#chuong-11)
- [Chương 12 — Tương lai của hệ thống dữ liệu](#chuong-12)

---

## Chương 1 — Ứng dụng tin cậy, mở rộng được, bảo trì được (Reliable, Scalable, and Maintainable Applications) {#chuong-1}

Chương mở đầu định nghĩa "ứng dụng thâm dụng dữ liệu" (data-intensive) — nơi khối lượng, độ phức tạp và tốc độ thay đổi của dữ liệu, chứ không phải sức mạnh CPU, mới là ràng buộc chính. Một hệ thống hiện đại thường ghép nhiều thành phần chuẩn: cơ sở dữ liệu, cache, chỉ mục tìm kiếm (search index), hàng đợi thông điệp (message queue) và các khung xử lý. Kỹ sư phải xem toàn bộ tổ hợp này như một "hệ thống dữ liệu" duy nhất và bảo đảm ba thuộc tính.

**Tin cậy (reliability)** là khả năng hoạt động đúng ngay cả khi có nghịch cảnh (adversity). Tác giả phân biệt **lỗi (fault)** — một thành phần lệch khỏi đặc tả — với **hỏng hệ thống (failure)** — cả hệ ngừng phục vụ. Mục tiêu là xây dựng hệ **chịu lỗi (fault-tolerant)** để fault không leo thang thành failure. Nguồn lỗi gồm phần cứng (đĩa hỏng, mất điện), phần mềm (bug lan truyền) và con người (cấu hình sai — nguyên nhân phổ biến nhất). Netflix Chaos Monkey được nêu như cách chủ động kích hoạt lỗi để kiểm chứng.

**Mở rộng được (scalability)** là khả năng đối phó khi tải tăng. Cần mô tả tải bằng **tham số tải (load parameters)** (ví dụ fan-out của Twitter timeline) và đo hiệu năng bằng **phân vị (percentiles)** như p95, p99 thay vì trung bình, vì đuôi trễ (tail latency) ảnh hưởng trực tiếp tới người dùng. Cần phân biệt độ trễ (latency) và thời gian phản hồi (response time), cùng hiện tượng khuếch đại hàng đợi (head-of-line blocking).

**Bảo trì được (maintainability)** gồm ba khía cạnh: **vận hành được (operability)** giúp đội ngũ dễ giữ hệ khỏe mạnh, **đơn giản (simplicity)** thông qua trừu tượng hoá tốt để giảm phức tạp phát sinh (accidental complexity), và **tiến hoá được (evolvability)** để dễ thay đổi. Đánh đổi cốt lõi của chương: không có giải pháp vạn năng; mọi lựa chọn (mở rộng dọc hay ngang, tối ưu đọc hay ghi) đều phải xét theo bối cảnh tải và yêu cầu cụ thể.

---

## Chương 2 — Mô hình dữ liệu & ngôn ngữ truy vấn (Data Models and Query Languages) {#chuong-2}

Mô hình dữ liệu định hình cách ta suy nghĩ về bài toán, nên việc chọn mô hình là quyết định sâu sắc. Chương so sánh ba họ lớn.

**Mô hình quan hệ (relational)** tổ chức dữ liệu thành bảng gồm hàng và cột, truy vấn bằng SQL — một ngôn ngữ **khai báo (declarative)**: ta nói *muốn gì*, còn bộ tối ưu (query optimizer) tự quyết định *cách lấy*. Ưu điểm là hỗ trợ tốt quan hệ nhiều-nhiều và phép nối (join).

**Mô hình tài liệu (document)** (MongoDB, CouchDB) lưu dữ liệu dạng cây JSON tự chứa, hợp với dữ liệu có tính cục bộ cao (locality) và quan hệ một-nhiều. Nó khắc phục **lệch trở kháng đối tượng-quan hệ (object-relational impedance mismatch)** và cho **linh hoạt lược đồ (schema flexibility)** — thực chất là **schema-on-read** (lược đồ áp lúc đọc) trái với **schema-on-write** của quan hệ. Nhược điểm: join yếu, phải xử lý quan hệ nhiều-nhiều ở tầng ứng dụng.

**Mô hình đồ thị (graph)** (Neo4j, Datomic; ngôn ngữ Cypher, SPARQL, Datalog) phù hợp khi kết nối nhiều-nhiều dày đặc và tuỳ biến, ví dụ mạng xã hội hay bản đồ đường. Đồ thị thuộc tính (property graph) và bộ ba (triple-store) là hai biến thể.

Chương cũng nhắc lịch sử: mô hình phân cấp (hierarchical) và mạng (network — CODASYL) từng dùng truy vấn **mệnh lệnh (imperative)** buộc lập trình viên tự đi theo con trỏ đường dẫn, khiến khó thay đổi. Mô hình quan hệ thắng thế nhờ tính khai báo. Đánh đổi trung tâm: chọn mô hình theo hình dạng quan hệ dữ liệu — tài liệu cho cây, đồ thị cho mạng lưới, quan hệ cho dữ liệu đều đặn nhiều join. Ngày nay các CSDL hội tụ (relational hỗ trợ JSON, document hỗ trợ join), làm ranh giới mờ dần. MapReduce cũng được giới thiệu như mô hình truy vấn lai giữa khai báo và mệnh lệnh.

---

## Chương 3 — Lưu trữ và truy xuất (Storage and Retrieval) {#chuong-3}

Chương mở "nắp ca-pô" để xem CSDL lưu và tìm dữ liệu ra sao, chia làm hai họ động cơ lưu trữ (storage engine).

**Họ log-structured** dựa trên ý tưởng chỉ ghi nối tiếp (append-only). Ví dụ đơn giản nhất là hash index trong bộ nhớ trỏ tới offset trong file log. Nâng cao hơn là **LSM-tree (Log-Structured Merge-Tree)** dùng trong LevelDB, RocksDB, Cassandra: dữ liệu ghi vào **memtable** trong RAM, định kỳ đổ xuống đĩa thành **SSTable (Sorted String Table)** đã sắp xếp, rồi hợp nhất nền (compaction/merge). Ghi tuần tự nên throughput ghi cao; đọc dùng **bộ lọc Bloom (Bloom filter)** để bỏ qua SSTable không chứa khoá.

**Họ cập nhật tại chỗ (update-in-place)** đại diện là **B-tree** — cấu trúc chuẩn của hầu hết CSDL quan hệ. B-tree chia dữ liệu thành trang (page) cố định, cân bằng cây, cập nhật đè lên trang cũ và dùng **write-ahead log (WAL)** để phục hồi sau sự cố. Đánh đổi giữa hai họ: LSM-tree thường ghi nhanh hơn và nén tốt hơn nhưng chịu **khuếch đại ghi (write amplification)** do compaction và độ trễ đọc khó đoán; B-tree cho đọc ổn định, mỗi khoá nằm một chỗ (thuận cho giao dịch/khoá) nhưng ghi ngẫu nhiên nhiều hơn.

Chương phân biệt **xử lý giao dịch trực tuyến (OLTP)** — nhiều truy vấn nhỏ, hướng bản ghi, chỉ mục quyết định hiệu năng — với **phân tích trực tuyến (OLAP)** — ít truy vấn nhưng quét khối lượng lớn để tổng hợp. OLAP dùng **kho dữ liệu (data warehouse)** riêng, lược đồ **sao (star schema)** với bảng sự kiện (fact) và bảng chiều (dimension), và **lưu trữ theo cột (column-oriented storage)** để chỉ đọc cột cần thiết, nén mạnh bằng mã hoá bitmap và tận dụng cache CPU. Chỉ mục thứ cấp (secondary index), clustered index và **khung nhìn thực thể hoá (materialized view)/data cube** cũng được bàn.

---

## Chương 4 — Mã hoá và tiến hoá (Encoding and Evolution) {#chuong-4}

Ứng dụng luôn thay đổi, nên lược đồ dữ liệu và mã nguồn tiến hoá theo thời gian. Chương tập trung vào cách dữ liệu được **mã hoá (encoding/serialization)** để lưu trữ hoặc truyền đi, và làm sao giữ **tương thích tiến (forward compatibility)** — mã cũ đọc được dữ liệu do mã mới tạo — cùng **tương thích lùi (backward compatibility)** — mã mới đọc được dữ liệu cũ. Hai chiều này thiết yếu cho **triển khai luân phiên (rolling upgrade)**, khi các phiên bản dịch vụ chạy song song.

Tác giả so sánh các định dạng. Định dạng **văn bản** như JSON, XML, CSV dễ đọc nhưng cồng kềnh, mơ hồ về kiểu số và không có lược đồ chặt. Các định dạng **nhị phân theo lược đồ (schema-driven binary)** hiệu quả và an toàn hơn: **Apache Thrift** và **Protocol Buffers (Protobuf)** dùng thẻ số (field tag) để nhận diện trường, cho phép thêm/xoá trường tùy chọn mà vẫn tương thích; **Apache Avro** dùng lược đồ ghi (writer's schema) và lược đồ đọc (reader's schema) tách rời, đối chiếu lúc đọc, đặc biệt hợp với dữ liệu sinh động và Hadoop. Điểm chung: lược đồ vừa tiết kiệm không gian, vừa là tài liệu và cơ chế kiểm tra tiến hoá.

Chương phân tích ba **luồng dữ liệu (dataflow)**. Qua **cơ sở dữ liệu**: dữ liệu ghi bởi mã mới có thể được đọc lại bởi mã cũ, nên cần cẩn thận không đánh mất trường lạ. Qua **dịch vụ (services)**: mô hình REST và **RPC (Remote Procedure Call)**, với lưu ý RPC che giấu sự khác biệt giữa gọi cục bộ và gọi mạng (mạng có thể mất gói, chậm, thất bại) nên API cần bền vững qua nhiều phiên bản. Qua **truyền thông điệp bất đồng bộ (asynchronous message-passing)**: message broker và hệ actor giúp giảm khớp nối (decoupling). Đánh đổi cốt lõi: đầu tư vào lược đồ tường minh đổi lấy khả năng tiến hoá độc lập giữa các thành phần và đội ngũ.

---

## Chương 5 — Nhân bản (Replication) {#chuong-5}

Nhân bản là giữ nhiều bản sao dữ liệu trên các nút (node) khác nhau nhằm tăng khả dụng (availability), giảm độ trễ (đặt dữ liệu gần người dùng) và tăng thông lượng đọc. Thách thức không nằm ở việc chép dữ liệu tĩnh mà ở việc xử lý **thay đổi (writes)**. Chương trình bày ba kiến trúc.

**Một lãnh đạo (single-leader)**: mọi ghi đi qua nút leader rồi phát tán tới các follower qua luồng bản ghi thay đổi. Đây là mô hình phổ biến nhất (PostgreSQL, MySQL). Nhân bản có thể **đồng bộ (synchronous)** — bảo đảm bản sao cập nhật nhưng chậm và dễ nghẽn — hoặc **bất đồng bộ (asynchronous)** — nhanh nhưng có nguy cơ mất ghi khi leader hỏng. Xử lý follower mới bằng snapshot; xử lý leader hỏng bằng **failover**, vốn đầy rủi ro (split-brain, chọn nhầm leader, mất dữ liệu chưa kịp sao).

Vấn đề trung tâm là **độ trễ nhân bản (replication lag)** trong hệ **nhất quán cuối cùng (eventual consistency)**. Ba đảm bảo cần thiết: **đọc-thấy-ghi (read-your-writes)** để người dùng thấy chính thay đổi của mình; **đọc đơn điệu (monotonic reads)** để không "đi ngược thời gian"; và **đọc nhất quán tiền tố (consistent prefix reads)** để bảo toàn thứ tự nhân quả.

**Nhiều lãnh đạo (multi-leader)**: cho phép ghi ở nhiều trung tâm dữ liệu hoặc thiết bị offline, nhưng phải giải quyết **xung đột ghi (write conflict)** qua các chiến lược như last-write-wins (dễ mất dữ liệu), gộp thủ công, hoặc CRDT. **Không lãnh đạo (leaderless)** (Dynamo, Cassandra, Riak) cho client ghi/đọc tới nhiều bản sao, dùng **quorum** (w + r > n) để đảm bảo giao nhau, cùng **đọc sửa lỗi (read repair)** và **anti-entropy**. Chương giới thiệu đồng hồ vector (version vector) để phát hiện đồng thời. Đánh đổi lớn: đơn giản-nhất quán (single-leader) đối lại khả dụng-linh hoạt-phức tạp giải xung đột (multi/leaderless).

---

## Chương 6 — Phân mảnh (Partitioning) {#chuong-6}

Khi dữ liệu quá lớn cho một nút, ta chia thành các **phân mảnh (partition/shard)** để mỗi nút giữ một phần, giúp mở rộng ngang. Phân mảnh thường kết hợp với nhân bản: mỗi phân mảnh vẫn có nhiều bản sao. Mục tiêu là phân bổ dữ liệu và tải đều, tránh **điểm nóng (hot spot)** và tình trạng **lệch tải (skew)** khi một phân mảnh gánh quá nhiều.

Có hai cách phân mảnh dữ liệu khóa-giá trị. **Theo khoảng khoá (key range)**: sắp xếp khoá và chia thành dải liên tục, cho phép truy vấn khoảng hiệu quả nhưng dễ tạo hot spot nếu khoá tăng đơn điệu (ví dụ timestamp). **Theo băm khoá (hash of key)**: rải khoá đều bằng hàm băm, tránh hot spot nhưng mất khả năng quét khoảng. Có thể lai: dùng khoá phức hợp (compound key) băm phần đầu, sắp xếp phần sau. Ngay cả vậy, một khoá "siêu nóng" (celebrity) vẫn cần tách thủ công.

Vấn đề khó là **chỉ mục thứ cấp (secondary index)**. Hai chiến lược: **phân mảnh theo tài liệu (document-partitioned / local index)** — mỗi phân mảnh giữ chỉ mục cho dữ liệu của mình, ghi rẻ nhưng đọc phải **scatter/gather** qua mọi phân mảnh; và **phân mảnh theo từ khoá (term-partitioned / global index)** — chỉ mục được phân mảnh riêng theo giá trị, đọc hiệu quả nhưng ghi phải cập nhật nhiều phân mảnh và thường bất đồng bộ.

**Cân bằng lại (rebalancing)** khi thêm/bớt nút phải di chuyển ít dữ liệu và giữ hệ hoạt động. Kleppmann cảnh báo tránh dùng `hash mod N` vì đổi N buộc dời gần hết dữ liệu; nên dùng **số phân mảnh cố định** lớn, **phân mảnh động (dynamic partitioning)** tách/gộp theo kích thước, hoặc tỉ lệ theo số nút. **Băm nhất quán (consistent hashing)** cũng được nhắc. Cuối cùng là **định tuyến yêu cầu (request routing)**: qua node bất kỳ, qua lớp định tuyến, hoặc client biết trước — thường nhờ dịch vụ điều phối như ZooKeeper. Đánh đổi: mọi lựa chọn phân mảnh đều cân bằng giữa hiệu quả đọc, chi phí ghi và độ phức tạp vận hành.

---

## Chương 7 — Giao dịch (Transactions) {#chuong-7}

Giao dịch (transaction) là cơ chế nhóm nhiều thao tác đọc/ghi thành một đơn vị logic, hoặc thành công trọn vẹn (commit) hoặc huỷ toàn bộ (abort/rollback). Nó là công cụ trừu tượng giúp lập trình viên khỏi phải tự xử lý vô số tình huống lỗi và cạnh tranh. Bộ đảm bảo kinh điển là **ACID**: **nguyên tử (Atomicity)** — không có trạng thái nửa vời; **nhất quán (Consistency)** — bảo toàn bất biến ứng dụng (thực chất là trách nhiệm của ứng dụng); **cô lập (Isolation)** — các giao dịch đồng thời không giẫm chân nhau; **bền vững (Durability)** — dữ liệu đã commit không mất. Tác giả chỉ ra ACID bị dùng lỏng lẻo trong tiếp thị, và đối lập nó với BASE.

Trọng tâm chương là **cô lập (isolation)** và các dị thường (anomaly) khi bỏ qua nó. **Đọc-cam-kết (Read Committed)** ngăn đọc bẩn (dirty read) và ghi bẩn (dirty write). **Cô lập ảnh chụp (Snapshot Isolation)** — hiện thực bằng **kiểm soát đồng thời đa phiên bản (MVCC — Multi-Version Concurrency Control)** — cho mỗi giao dịch một ảnh nhất quán, ngăn đọc không lặp lại (nonrepeatable read); đây là mức "repeatable read" phổ biến. Nhưng các mức yếu vẫn để lọt các lỗi tinh vi: **cập nhật mất (lost update)**, **lệch ghi (write skew)** và **hiện tượng bóng ma (phantom)** — khi một giao dịch thay đổi tiền đề (premise) mà giao dịch khác dựa vào.

Giải pháp mạnh nhất là **khả tuần tự (Serializability)** — kết quả tương đương với một thứ tự chạy tuần tự nào đó. Có ba cách đạt được: **thực thi tuần tự thực sự (actual serial execution)** trên một luồng (VoltDB, Redis) khi dữ liệu vừa RAM; **khoá hai pha (2PL — Two-Phase Locking)** dùng khoá đọc/ghi và khoá phạm vi (predicate/index-range lock), an toàn nhưng hiệu năng kém và dễ deadlock; và **cô lập ảnh chụp khả tuần tự (SSI — Serializable Snapshot Isolation)** — kỹ thuật lạc quan (optimistic) phát hiện xung đột lúc commit, cho hiệu năng tốt hơn nhiều. Đánh đổi cốt lõi: mức cô lập càng mạnh càng an toàn nhưng càng đắt về hiệu năng và khả năng mở rộng.

---

## Chương 8 — Những rắc rối của hệ phân tán (The Trouble with Distributed Systems) {#chuong-8}

Chương này mang giọng bi quan có chủ đích: liệt kê mọi thứ có thể sai trong hệ phân tán để buộc kỹ sư đối diện thực tế. Khác với một máy đơn (nơi lỗi thường là "toàn bộ dừng"), hệ phân tán chịu **lỗi cục bộ (partial failure)** — một số phần hỏng theo cách phi tất định (nondeterministic), khó phát hiện.

**Mạng không tin cậy (unreliable networks)**: gói tin có thể mất, chậm, trùng hoặc bị đảo thứ tự. Điều nguy hiểm là ta **không thể phân biệt** một nút chết với một nút chỉ đang chậm hay đường mạng bị nghẽn — chỉ có timeout, và chọn ngưỡng timeout luôn là đánh đổi giữa phát hiện nhanh và báo động giả. Mạng thực tế bất đồng bộ (asynchronous), không đảm bảo giới hạn độ trễ.

**Đồng hồ không tin cậy (unreliable clocks)**: mỗi máy có đồng hồ riêng, lệch nhau (clock drift) và được đồng bộ lỏng lẻo qua NTP. Tác giả phân biệt **đồng hồ thời gian trong ngày (time-of-day clock)** — có thể nhảy lùi — với **đồng hồ đơn điệu (monotonic clock)** — chỉ để đo khoảng thời gian. Dùng dấu thời gian để quyết thứ tự sự kiện (như last-write-wins) rất nguy hiểm vì có thể âm thầm mất dữ liệu; Google Spanner dùng TrueTime với khoảng bất định để né vấn đề này.

**Tạm dừng tiến trình (process pauses)**: một luồng có thể bị dừng bất ngờ vì **thu gom rác (GC pause)**, di trú máy ảo, hoặc hoán trang, khiến giả định về thời gian thực bị phá vỡ và một leader tưởng mình còn hợp lệ. Đây là lý do cần **token vây hãm (fencing token)** để chặn client "zombie" ghi đè sau khi mất khoá. Chương kết bằng khái niệm **sự thật theo số đông (truth defined by majority)**, mô hình lỗi **Byzantine** (nút nói dối), và tầm quan trọng của việc chọn đúng **mô hình hệ thống (system model)** làm giả định. Bài học: đừng tin tưởng mù quáng; hãy thiết kế để hệ vẫn đúng dù các giả định thời gian và mạng bị vi phạm.

---

## Chương 9 — Nhất quán và đồng thuận (Consistency and Consensus) {#chuong-9}

Sau khi liệt kê mọi thứ có thể hỏng ở Chương 8, chương này xây các trừu tượng giúp hệ phân tán vẫn đúng. Trọng tâm là các mức đảm bảo nhất quán và bài toán **đồng thuận (consensus)** — làm cho nhiều nút thống nhất một quyết định.

**Nhất quán tuyến tính (linearizability)** là mức mạnh: hệ hành xử như thể chỉ có một bản sao dữ liệu duy nhất, mọi thao tác đọc đều thấy giá trị mới nhất — tạo ảo giác về một bản sao nguyên tử. Nó cần cho bầu leader, khoá phân tán và ràng buộc duy nhất (uniqueness). Nhưng linearizability đắt và, theo **định lý CAP**, xung khắc với khả dụng khi có **phân vùng mạng (network partition)** — hệ phải chọn giữa nhất quán (CP) và khả dụng (AP). Nó cũng chậm vì đòi hỏi phối hợp, nên nhiều hệ chọn mức yếu hơn.

Tác giả tách biệt **thứ tự nhân quả (causal order)** — chỉ sắp xếp các sự kiện có quan hệ nhân quả, là **thứ tự bộ phận (partial order)** — với thứ tự toàn phần (total order) của linearizability. Nhất quán nhân quả (causal consistency) là mức mạnh nhất vẫn còn khả dụng khi phân vùng. **Bộ sinh số tuần tự (Lamport timestamp)** cho thứ tự toàn phần tôn trọng nhân quả, nhưng để hiện thực ràng buộc như uniqueness ta cần **quảng bá theo thứ tự toàn phần (total order broadcast)** — tương đương với đồng thuận.

**Đồng thuận (consensus)** giải các bài toán: bầu leader, cam kết nguyên tử. **Cam kết hai pha (2PC — Two-Phase Commit)** cho giao dịch phân tán nhưng có điểm hỏng đơn (blocking khi coordinator chết). Các thuật toán đồng thuận chịu lỗi thực thụ — **Paxos, Raft, Zab, Viewstamped Replication** — bảo đảm thống nhất, tính hợp lệ, kết thúc và chịu lỗi. Chúng nền tảng cho các dịch vụ điều phối như **ZooKeeper/etcd**, vốn cung cấp khoá, bầu chọn và phát hiện nút. Đánh đổi: đồng thuận đắt (cần quorum, nhiều vòng thông điệp) nên hãy giới hạn nó cho quyết định thật sự cần, và tái dùng qua các dịch vụ chuyên biệt thay vì tự cài đặt.

---

## Chương 10 — Xử lý theo lô (Batch Processing) {#chuong-10}

Ba chương cuối chuyển từ hệ lưu trữ/truy vấn sang hệ **xử lý dữ liệu phái sinh (derived data)**. Chương 10 bàn **xử lý theo lô (batch processing)**: nhận một tập dữ liệu lớn hữu hạn làm đầu vào, chạy một tác vụ, sinh ra dữ liệu đầu ra — không tương tác thời gian thực, đo bằng **thông lượng (throughput)**.

Điểm khởi đầu là **triết lý Unix**: các công cụ nhỏ (`awk`, `sort`, `grep`) nối với nhau qua pipe, mỗi công cụ làm một việc, giao tiếp bằng luồng byte/dòng thống nhất, tách logic khỏi luồng vào/ra. **MapReduce** đưa triết lý này lên quy mô cụm hàng nghìn máy: lập trình viên viết hai hàm **map** (trích cặp khoá-giá trị) và **reduce** (tổng hợp theo khoá), còn framework lo phân phối, sắp xếp và chịu lỗi. Bước **sắp xếp-trộn (sort-merge)** giữa map và reduce là cốt lõi, cho phép gom mọi giá trị cùng khoá về một reducer, đọc/ghi qua hệ tệp phân tán như HDFS.

Bài toán khó là **join phân tán**. **Sort-merge join** đưa cả hai phía về cùng reducer theo khoá. **Broadcast hash join** phát tán bảng nhỏ vào bộ nhớ mọi mapper. **Partitioned hash join** tận dụng dữ liệu đã phân mảnh sẵn cùng cách. Lệch tải (hot key/skew) là kẻ thù, cần kỹ thuật như "skewed join". MapReduce chịu lỗi tốt nhờ ghi trung gian ra đĩa và chạy lại tác vụ hỏng, nhưng chính việc **thực thể hoá trạng thái trung gian (materialization)** làm nó chậm.

Các **công cụ dòng chảy dữ liệu (dataflow engines)** thế hệ sau — **Spark, Tez, Flink** — mô hình hoá công việc thành đồ thị không chu trình có hướng (DAG), giữ dữ liệu trung gian trong bộ nhớ và tránh ghi đĩa thừa, nhanh hơn nhiều. Chúng cũng hỗ trợ **xử lý đồ thị (graph)** lặp (mô hình Pregel). Nguyên tắc vàng của batch: đầu vào **bất biến (immutable)** và đầu ra **tất định**, nên có thể chạy lại an toàn, thử nghiệm dễ và cách ly lỗi — nền tảng cho tư duy dữ liệu phái sinh của cả cuốn sách.

---

## Chương 11 — Xử lý luồng (Stream Processing) {#chuong-11}

Xử lý theo lô giả định đầu vào hữu hạn, nhưng dữ liệu thực tế đến liên tục và không bao giờ "kết thúc". **Xử lý luồng (stream processing)** áp dụng tư duy dữ liệu phái sinh cho dòng vô hạn, giảm độ trễ từ hàng giờ (lô) xuống gần thời gian thực. Đơn vị cơ bản là **sự kiện (event)** — một bản ghi bất biến gắn dấu thời gian.

Việc truyền sự kiện dùng **hệ môi giới thông điệp (message broker)**. Tác giả phân biệt kiểu **hàng đợi truyền thống (AMQP/JMS)** — xoá thông điệp sau khi tiêu thụ, hợp cho công việc rời rạc — với **nhật ký phân mảnh (log-based / partitioned log)** như **Apache Kafka**: sự kiện được nối vào một log bền, nhiều consumer đọc độc lập theo offset, có thể tua lại (replay). Log-based broker kết hợp độ bền của cơ sở dữ liệu với ngữ nghĩa luồng.

Một ý tưởng thống nhất mạnh mẽ là **thu bắt thay đổi dữ liệu (CDC — Change Data Capture)** và **truy tìm sự kiện (event sourcing)**: coi mọi thay đổi trạng thái như một luồng sự kiện bất biến, từ đó **cơ sở dữ liệu chính là một luồng** và ngược lại. Điều này cho phép giữ đồng bộ nhiều hệ phái sinh (chỉ mục tìm kiếm, cache, kho phân tích) bằng cách phát lại cùng một log — nguyên lý **đối ngẫu (duality) giữa luồng và trạng thái**.

Xử lý luồng có ba mục đích: theo dõi sự kiện phức (CEP), phân tích chỉ số thời gian thực, và duy trì khung nhìn thực thể hoá. Thách thức cốt lõi là **suy luận về thời gian**: phân biệt **thời gian sự kiện (event time)** với **thời gian xử lý (processing time)**, xử lý **sự kiện đến muộn/lạc (straggler)** bằng **watermark**, và chọn kiểu **cửa sổ (window)** (trượt, nhảy, phiên). **Join luồng** (stream-stream, stream-table, table-table) phải đối phó dữ liệu thay đổi theo thời gian. Về chịu lỗi, để đạt ngữ nghĩa **đúng-một-lần (exactly-once)** thực chất, hệ dùng **microbatching, checkpoint, giao dịch nguyên tử và thao tác idempotent**. Đánh đổi: luồng cho độ trễ thấp và phản ứng liên tục, đổi lại độ phức tạp về thời gian, thứ tự và bảo đảm chính xác.

---

## Chương 12 — Tương lai của hệ thống dữ liệu (The Future of Data Systems) {#chuong-12}

Chương kết là tổng hợp và tầm nhìn: Kleppmann đề xuất cách ghép các mảnh của cuốn sách thành kiến trúc mạch lạc, đồng thời bàn khía cạnh đạo đức.

Ý tưởng trung tâm là **tích hợp dữ liệu (data integration)**. Không có công cụ nào phù hợp mọi việc, nên thực tế ta luôn phải kết hợp nhiều hệ chuyên biệt và giữ chúng đồng bộ. Tác giả đề xuất coi luồng sự kiện bất biến làm **nguồn sự thật (source of truth)**, rồi phái sinh mọi thứ khác (chỉ mục, cache, khung nhìn) từ đó bằng xử lý luồng/lô. Ông gọi đây là tư duy **cơ sở dữ liệu tháo rời (unbundling the database)**: các chức năng của CSDL — lưu trữ, chỉ mục, nhân bản, khung nhìn thực thể hoá — được tách ra thành các thành phần độc lập nối với nhau qua log, dùng **dòng chảy dữ liệu (dataflow)** làm chất keo thay cho lời gọi đồng bộ. Sự thống nhất giữa batch và stream (lambda architecture rồi tiến tới kiến trúc thống nhất) là hệ quả tự nhiên.

Từ đó nảy ra ý tưởng ứng dụng như **hệ đăng ký-nhận phái sinh**: giao diện người dùng, cache và trạng thái đều được cập nhật liên tục bằng cách theo dõi luồng thay đổi, hướng tới trải nghiệm thời gian thực end-to-end.

Về **tính đúng đắn (correctness)**, tác giả lập luận rằng thay vì cố ép giao dịch phân tán mạnh và đắt, ta có thể đạt đúng đắn nhờ **thao tác idempotent, khử trùng lặp bằng định danh, và ràng buộc bất đối xứng theo thời gian** — kiểm tra vi phạm sau (compensating transaction) thay vì khoá trước. Ông cũng nhấn mạnh nguyên tắc **tin nhưng phải kiểm chứng (trust but verify)**: kiểm toán liên tục thay vì tin mù vào hệ thống.

Cuối cùng, chương chuyển sang **đạo đức**: dữ liệu có thể bị lạm dụng cho giám sát, phân biệt đối xử qua thuật toán thiên lệch, và tích luỹ quyền lực. Kleppmann kêu gọi kỹ sư xem dữ liệu người dùng như tài sản được uỷ thác cần bảo vệ, tôn trọng quyền riêng tư và tự quyết, khép lại cuốn sách bằng lời nhắc rằng trách nhiệm kỹ thuật đi kèm trách nhiệm xã hội.
