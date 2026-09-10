# Hệ phân tán (Distributed Systems)

## Khái niệm
Hệ phân tán (distributed system) là tập hợp các máy tính độc lập, kết nối qua mạng, phối hợp với nhau và với người dùng như thể là một hệ thống duy nhất, thống nhất. Vì các node có thể lỗi độc lập và mạng có thể chậm hay đứt, việc thiết kế hệ phân tán xoay quanh việc cân bằng giữa tính nhất quán (consistency), tính sẵn sàng (availability) và khả năng chịu lỗi (fault tolerance).

## Khi nào dùng / Vì sao quan trọng
Hầu hết hệ thống quy mô lớn (mạng xã hội, thương mại điện tử, ngân hàng, đám mây) đều là hệ phân tán vì không một máy nào đủ sức chứa toàn bộ dữ liệu/tải. Hiểu các mô hình nhất quán và cơ chế đồng thuận là cốt lõi để thiết kế hệ thống đáng tin cậy và trả lời các câu hỏi phỏng vấn thiết kế hệ thống.

## Cách hoạt động

### ACID vs. BASE
Hai triết lý đối lập về đảm bảo dữ liệu:

| ACID (thường ở CSDL quan hệ) | BASE (thường ở NoSQL phân tán) |
|------------------------------|--------------------------------|
| **A**tomicity — nguyên tử | **BA**sically **A**vailable — về cơ bản luôn sẵn sàng |
| **C**onsistency — nhất quán | **S**oft state — trạng thái mềm, có thể đổi theo thời gian |
| **I**solation — cô lập | **E**ventually consistent — nhất quán cuối cùng |
| **D**urability — bền vững | Ưu tiên tính sẵn sàng hơn nhất quán tức thời |

ACID phù hợp giao dịch tài chính cần chính xác tuyệt đối; BASE phù hợp hệ thống quy mô lớn cần sẵn sàng cao và chấp nhận trễ nhất quán.

### Nhất quán cuối cùng (Eventual Consistency)
Là mô hình nhất quán yếu (weak consistency) trong đó nếu không có cập nhật mới, tất cả các bản sao **cuối cùng** sẽ hội tụ về cùng một giá trị. Trong khoảng thời gian ngắn, các node có thể trả về giá trị khác nhau. Đổi lại, hệ thống đạt tính sẵn sàng cao và độ trễ thấp. Ví dụ: DNS, Amazon DynamoDB, Cassandra. Các biến thể mạnh hơn gồm **read-your-writes** và **causal consistency**.

### Định lý CAP (CAP Theorem)
Định lý CAP (Eric Brewer) phát biểu: trong một hệ phân tán, khi xảy ra **phân vùng mạng (network Partition — P)**, ta chỉ có thể chọn tối đa **một** trong hai:
- **Consistency (C)** — mọi lần đọc thấy dữ liệu mới nhất.
- **Availability (A)** — mọi yêu cầu đều nhận phản hồi (dù có thể cũ).

Vì phân vùng mạng là điều không thể tránh trong thực tế, lựa chọn thực chất là **CP** hay **AP**:
- **CP** (ví dụ HBase, MongoDB cấu hình mạnh, etcd): hy sinh sẵn sàng để giữ nhất quán.
- **AP** (ví dụ Cassandra, DynamoDB): hy sinh nhất quán tức thời để luôn phản hồi.

Mở rộng của CAP là **định lý PACELC**: khi có Partition thì chọn A hay C; Else (bình thường) thì đánh đổi giữa Latency và Consistency.

Sơ đồ tam giác CAP — mỗi hệ chỉ nằm trên một cạnh (chọn 2 trong 3 khi có phân vùng):

```mermaid
graph TD
    C["Consistency - Nhat quan"] --- A["Availability - San sang"]
    A --- P["Partition tolerance - Chiu phan vung"]
    P --- C
    C -. "CP: HBase, etcd, Spanner" .- P
    A -. "AP: Cassandra, DynamoDB" .- P
    C -. "CA: chi trong 1 node (khong phan tan that)" .- A
```

Sơ đồ ra quyết định theo CAP khi mạng bị phân vùng:

```mermaid
flowchart TD
    P{"Có phân vùng mạng (P)?"}
    P -->|"Không"| N["Đạt cả C và A (bình thường)"]
    P -->|"Có"| Choice{"Chọn ưu tiên?"}
    Choice -->|"Consistency"| CP["Hệ CP: từ chối/chờ để giữ nhất quán (HBase, etcd)"]
    Choice -->|"Availability"| AP["Hệ AP: luôn phản hồi, chấp nhận dữ liệu cũ (Cassandra, DynamoDB)"]
```

### Bầu leader & đồng thuận (Leader Election & Consensus)
Nhiều hệ phân tán cần một node "leader" điều phối (ví dụ node ghi duy nhất). Thuật toán đồng thuận (consensus) đảm bảo các node thống nhất về một giá trị/leader dù có lỗi:

- **Paxos**: thuật toán đồng thuận kinh điển, chứng minh đúng đắn về mặt lý thuyết nhưng khó hiểu và khó cài đặt. Dùng các vai trò proposer, acceptor, learner qua hai pha.
- **Raft**: thiết kế để **dễ hiểu hơn** Paxos với cùng độ mạnh. Chia bài toán thành: bầu leader (leader election), nhân bản nhật ký (log replication) và an toàn (safety). Node ở một trong ba trạng thái: follower, candidate, leader; leader được bầu qua bỏ phiếu đa số (majority quorum) theo từng nhiệm kỳ (term). Dùng trong etcd, Consul, TiKV.

Sơ đồ trạng thái bầu leader trong Raft:

```mermaid
stateDiagram-v2
    [*] --> Follower
    Follower --> Candidate: "Hết thời gian chờ, không nghe leader"
    Candidate --> Candidate: "Không đủ phiếu, mở nhiệm kỳ mới"
    Candidate --> Leader: "Nhận đa số phiếu (quorum)"
    Candidate --> Follower: "Phát hiện leader hợp lệ"
    Leader --> Follower: "Thấy nhiệm kỳ cao hơn"
```

### Khả năng chịu lỗi (Fault Tolerance)
Là khả năng hệ thống tiếp tục hoạt động đúng dù một số thành phần lỗi. Các kỹ thuật:
- **Dư thừa (redundancy)**: nhân bản dữ liệu và dịch vụ trên nhiều node/vùng.
- **Chuyển đổi dự phòng (failover)**: tự chuyển sang node dự phòng khi node chính hỏng.
- **Bỏ phiếu đa số (quorum)**: ghi/đọc thành công khi đủ số node đồng ý (ví dụ W + R > N).
- **Heartbeat & timeout**: phát hiện node chết.
- **Idempotency & retry**: thử lại an toàn khi lỗi tạm thời.
- **Chịu lỗi Byzantine (Byzantine fault tolerance)**: chịu được cả node "phản trắc" trả lời sai (dùng trong blockchain).

## CAP & PACELC — đào sâu và so sánh

CAP thường bị hiểu sai là "chọn 2 trong 3". Chính xác hơn: phân vùng mạng (P) là điều **bắt buộc phải chịu** trong hệ phân tán thực (mạng luôn có thể đứt/chậm), nên khi P xảy ra bạn chỉ được chọn **C hoặc A**. Khi mạng bình thường (không P), một hệ tốt có thể đạt **cả C và A** cùng lúc — đó là lỗ hổng mà **PACELC** lấp: *nếu Partition thì chọn A/C; Else (bình thường) thì đánh đổi Latency/Consistency*. Nghĩa là ngay cả lúc mạng ổn, muốn nhất quán mạnh (đồng bộ nhiều bản sao) vẫn phải trả giá bằng độ trễ.

!!! question "Tại sao phân vùng mạng lại buộc phải đánh đổi C hoặc A?"
    Hãy dựng một tình huống cụ thể để thấy đây là **tất yếu logic**, không phải
    hạn chế kỹ thuật khắc phục được. Có hai node A và B cùng giữ bản sao của
    `x = 1`. Đột nhiên **mạng giữa chúng đứt** (phân vùng): A và B vẫn sống,
    vẫn nhận request, nhưng **không nói chuyện được với nhau**.

    Giờ một client gửi **ghi `x = 2` tới node A**. Ngay lập tức một client khác
    **đọc `x` từ node B**. Node B đứng trước hai lựa chọn, và **không có lựa
    chọn thứ ba**:

    - **Trả lời ngay (giữ Availability):** B trả `x = 1` — vì nó chưa hề nghe
      tin về `x = 2` (mạng đứt, A không báo được). Client nhận được **dữ liệu
      cũ** → **hy sinh Consistency**.
    - **Từ chối / chờ (giữ Consistency):** B nói "tôi không chắc mình có dữ liệu
      mới nhất, khoan đã" và chặn lại cho tới khi mạng nối lại và đồng bộ được
      với A. Dữ liệu trả về sẽ **luôn đúng**, nhưng trong lúc phân vùng B
      **không phản hồi** → **hy sinh Availability**.

    Không thể vừa trả lời ngay **vừa** đảm bảo đúng, đơn giản vì thông tin `x=2`
    **về mặt vật lý chưa thể** đi từ A sang B khi đường truyền đứt. Đây là giới
    hạn của việc **thông tin cần thời gian và một đường truyền còn sống để lan
    đi** — không kỹ thuật nào vượt qua được.

    **Trực giác:** hai thủ kho ở hai kho, bộ đàm hỏng. Một khách bảo kho A "tôi
    vừa đặt trước món hàng cuối"; ngay lúc đó khách khác hỏi kho B "còn hàng
    không?". Thủ kho B chỉ có thể **hoặc** đáp ngay "còn" (nhanh nhưng có thể
    sai — món đã bị đặt), **hoặc** nói "chờ tôi liên lạc kho A đã" (đúng nhưng
    bắt khách chờ). Đó chính là CP (chọn đúng, chịu chờ) so với AP (chọn nhanh,
    chịu sai). Vì phân vùng **sẽ** xảy ra, mọi hệ phân tán buộc phải chọn trước
    mình nghiêng về phía nào.

| Hệ thống | Khi có Partition (PA/PC) | Khi bình thường (EL/EC) | Xếp loại PACELC |
|----------|--------------------------|--------------------------|-----------------|
| DynamoDB / Cassandra | PA (ưu tiên sẵn sàng) | EL (ưu tiên độ trễ) | **PA/EL** |
| MongoDB (mặc định) | PC (ưu tiên nhất quán) | EC (ưu tiên nhất quán) | **PC/EC** |
| Google Spanner | PC | EC (nhất quán mạnh nhờ TrueTime) | **PC/EC** |
| Cassandra (tinh chỉnh) | PA | EL | **PA/EL** |
| PostgreSQL (1 node) | — (không phân tán) | ưu tiên C | ~ **EC** |

## Eventual consistency — đào sâu

Nhất quán cuối cùng nói rằng nếu **ngừng ghi mới**, mọi bản sao sẽ hội tụ cùng giá trị "cuối cùng". Câu hỏi quan trọng là *hội tụ thế nào khi có xung đột*:

- **Last-Write-Wins (LWW)**: dùng timestamp, giá trị ghi sau thắng. Đơn giản nhưng có thể **mất cập nhật** nếu đồng hồ lệch.
- **Vector clock**: phát hiện ghi song song (concurrent) không có quan hệ nhân quả, để lộ xung đột cho tầng trên xử lý (như Dynamo).
- **CRDT (Conflict-free Replicated Data Types)**: cấu trúc dữ liệu tự hợp nhất không xung đột (bộ đếm G-Counter, tập OR-Set) — dùng trong soạn thảo cộng tác, Redis CRDT.
- **Read repair & anti-entropy**: khi đọc phát hiện bản sao lệch thì sửa ngay; nền chạy Merkle tree để đồng bộ dần (Cassandra).

Các mức đảm bảo lấy-người-dùng-làm-trung-tâm (client-centric) thường gặp: **read-your-writes** (thấy ghi của chính mình), **monotonic reads** (không "lùi" về giá trị cũ hơn), **monotonic writes** (ghi của một client áp dụng theo thứ tự), **writes-follow-reads**.

## Paxos vs. Raft — đào sâu và so sánh

Cả hai giải cùng bài toán **đồng thuận**: nhiều node thống nhất một giá trị/chuỗi lệnh dù có node lỗi (crash, không phản hồi — *không* xét node độc hại).

**Paxos** (Lamport) hoạt động theo hai pha với các vai trò *proposer / acceptor / learner*:
1. **Pha 1 (Prepare/Promise)**: proposer chọn số hiệu `n`, hỏi đa số acceptor; acceptor hứa không chấp nhận đề xuất số nhỏ hơn `n`, và trả về giá trị đã chấp nhận (nếu có).
2. **Pha 2 (Accept/Accepted)**: proposer gửi giá trị (giá trị đã chấp nhận cao nhất, hoặc giá trị của mình nếu chưa có) tới đa số; khi đa số chấp nhận thì giá trị được chốt.

*Multi-Paxos* tối ưu bằng cách bầu một leader ổn định để bỏ qua pha 1 lặp lại. Paxos đúng đắn nhưng nổi tiếng **khó hiểu và khó cài đúng**.

**Raft** chia bài toán thành ba mảnh dễ nắm:
1. **Bầu leader (leader election)**: node ở trạng thái follower; hết *election timeout* mà không nghe leader → thành candidate, tăng *term*, xin phiếu; nhận đa số → thành leader.
2. **Nhân bản nhật ký (log replication)**: leader nhận lệnh, ghi vào log, gửi `AppendEntries` tới follower; khi đa số ghi xong thì *commit* và áp dụng vào máy trạng thái.
3. **An toàn (safety)**: chỉ bầu leader có log đủ mới; một term chỉ một leader; entry đã commit không bao giờ mất.

| Tiêu chí | Paxos | Raft |
|----------|-------|------|
| Mục tiêu thiết kế | Đúng đắn lý thuyết | Dễ hiểu, dễ cài |
| Vai trò | proposer/acceptor/learner | leader/follower/candidate |
| Leader | Tuỳ chọn (Multi-Paxos) | Bắt buộc, trung tâm |
| Nhân bản log | Không quy định rõ | Quy định chặt chẽ |
| Độ khó cài đặt | Cao | Trung bình |
| Hệ dùng | Google Chubby, Spanner | etcd, Consul, TiKV, CockroachDB |

Điểm chung cốt lõi: **cần đa số (quorum = ⌊N/2⌋+1)** để tiến; cụm N node chịu được tối đa ⌊(N−1)/2⌋ node hỏng (5 node chịu 2 hỏng). Đây là lý do cụm đồng thuận thường có số node **lẻ**.

## Ví dụ

Sơ đồ quorum đọc/ghi với N = 3, W = 2, R = 2 (vì W + R > N nên tập ghi và tập đọc luôn giao nhau ≥ 1 node mới nhất):

```mermaid
flowchart LR
    Client["Client"] -->|"ghi x=5 (W=2)"| A["Node A: 5"]
    Client -->|"ghi x=5 (W=2)"| B["Node B: 5"]
    Client -.->|"loi mang"| C["Node C: cu"]
    Reader["Reader"] -->|"doc (R=2)"| B
    Reader -->|"doc (R=2)"| C
    B -->|"tra ve gia tri moi nhat 5"| Reader
```

```text
Bỏ phiếu đa số (quorum) với N = 3 bản sao, W = 2, R = 2:

  Ghi giá trị x = 5:
     Node A ✔ (5)   Node B ✔ (5)   Node C ✘ (mạng lỗi, vẫn = cũ)
     → W = 2 node xác nhận  ⇒ GHI THÀNH CÔNG

  Đọc x:
     Đọc Node B (5) + Node C (cũ) → R = 2
     Vì W + R = 4 > N = 3 ⇒ chắc chắn giao nhau ≥ 1 node mới nhất
     → trả về giá trị mới nhất (5)
```

!!! question "Tại sao W + R > N đảm bảo đọc thấy ghi mới nhất?"
    Đây thuần tuý là **nguyên lý chuồng bồ câu (pigeonhole)** áp lên tập các
    node. Có tổng cộng `N` bản sao. Một thao tác **ghi** chỉ báo thành công khi
    đã ghi lên **ít nhất `W` node**; một thao tác **đọc** truy vấn **ít nhất `R`
    node** rồi lấy giá trị mới nhất trong số đó.

    Câu hỏi sống còn: liệu tập `R` node được đọc có **chắc chắn chứa ít nhất một
    node** nằm trong tập `W` node vừa được ghi không? Nếu có, node đó giữ giá
    trị mới nhất → phép đọc **nhìn thấy** nó. Nếu hai tập có thể **rời nhau
    hoàn toàn**, phép đọc có thể trượt sạch mọi node mới và chỉ thấy dữ liệu cũ.

    Hai tập con của cùng `N` phần tử **buộc phải giao nhau** khi tổng kích thước
    của chúng **vượt quá `N`**: nếu `W` node đã ghi và `R` node được đọc mà
    **không** dính nhau node nào, thì cần tới `W + R` node **khác biệt** — nhưng
    ta chỉ có `N` node. Vậy `W + R > N` ⇒ **không thể tách rời** ⇒ giao nhau ít
    nhất `W + R − N ≥ 1` node.

    Kiểm bằng ví dụ N=3, W=2, R=2: `W + R = 4 > 3`. Ghi chạm 2 node, đọc chạm 2
    node — trong 3 node mà lấy 2 nhóm, mỗi nhóm 2 node, chắc chắn **trùng ít
    nhất 1**. Node trùng đó có giá trị mới → đọc thấy. (Kèm điều kiện: đọc phải
    **phân biệt được cái nào mới hơn**, thường bằng version/timestamp, để chọn
    đúng giá trị mới trong các node trả về.)

    **Trực giác:** một hội đồng `N` người. Muốn "thông qua một quyết định" phải
    có `W` người ký; muốn "biết quyết định mới nhất" phải hỏi `R` người. Nếu
    `W + R > N` thì bất kỳ nhóm `R` người nào bạn hỏi **đều lỡ dính** ít nhất
    một người đã ký → luôn có người kể cho bạn tin mới nhất. **Đây cũng là cần
    gạt điều chỉnh:** tăng `W` cho ghi chắc/đọc nhanh, hay tăng `R` cho ghi
    nhanh/đọc chắc — nhưng miễn `W + R > N` thì vẫn giữ được nhất quán mạnh; hạ
    xuống `W + R ≤ N` là bước sang nhất quán cuối cùng để đổi lấy độ trễ/sẵn sàng.

## Các mô hình nhất quán (Consistency Models)

Nhất quán không phải chuyện "có hay không" mà là một phổ (spectrum), từ mạnh đến yếu:

| Mô hình | Đảm bảo | Đánh đổi |
|---------|---------|----------|
| Nhất quán tuyến tính (Linearizability) | Mọi thao tác như xảy ra tức thời theo thứ tự thực | Độ trễ cao, khó ở quy mô lớn |
| Nhất quán tuần tự (Sequential) | Mọi node thấy các thao tác theo cùng một thứ tự | Yếu hơn tuyến tính một chút |
| Nhất quán nhân quả (Causal) | Bảo toàn quan hệ nhân–quả giữa các thao tác | Không đảm bảo thứ tự các thao tác độc lập |
| Đọc-được-cái-vừa-ghi (Read-your-writes) | Người dùng luôn thấy ghi của chính mình | Người khác có thể thấy trễ |
| Nhất quán cuối cùng (Eventual) | Cuối cùng hội tụ nếu ngừng cập nhật | Có thể đọc dữ liệu cũ tạm thời |

## Các thách thức cốt lõi của hệ phân tán

- **Đồng hồ không đáng tin (unreliable clocks)**: đồng hồ vật lý giữa các máy lệch nhau; dùng **đồng hồ logic (logical clock)** như Lamport timestamp hoặc **vector clock** để suy ra thứ tự sự kiện.
- **Phát hiện lỗi (failure detection)**: khó phân biệt node chết thật với node chỉ chậm/mạng lag; dựa vào heartbeat + timeout, chấp nhận sai số.
- **Bài toán tướng Byzantine (Byzantine Generals)**: đạt đồng thuận khi một số node có thể gửi thông tin sai/độc hại — nền tảng của blockchain.
- **Exactly-once vs. at-least-once**: bảo đảm giao nhận thông điệp; "đúng một lần" rất khó, thường dùng "ít nhất một lần" + tính bất biến (idempotency).

## Sao chép dữ liệu (Replication) trong hệ phân tán
- **Single-leader (một leader)**: một node nhận ghi, nhân bản sang follower. Đơn giản, tránh xung đột ghi, nhưng leader là điểm nghẽn/lỗi.
- **Multi-leader (nhiều leader)**: nhiều node cùng nhận ghi, phù hợp đa vùng địa lý, nhưng phải giải quyết xung đột (conflict resolution).
- **Leaderless (không leader)**: mọi node nhận ghi/đọc, dùng quorum (Dynamo, Cassandra); cần cơ chế như read repair và hinted handoff.

## Ưu / nhược điểm
- **Ưu:** khả năng mở rộng cao, chịu lỗi tốt, tính sẵn sàng cao, không có điểm lỗi đơn nếu thiết kế đúng.
- **Nhược:** phức tạp cao; khó gỡ lỗi (debug) và kiểm thử; các đánh đổi CAP buộc hy sinh nhất quán hoặc sẵn sàng; đồng thuận tốn thêm độ trễ.

## Ứng dụng thực tế
- **Amazon DynamoDB / Cassandra (AP)**: ưu tiên sẵn sàng, dùng quorum điều chỉnh được và nhất quán cuối cùng cho quy mô cực lớn.
- **Google Spanner (CP nghiêng)**: dùng đồng hồ nguyên tử TrueTime để đạt nhất quán mạnh trên phạm vi toàn cầu.
- **etcd / ZooKeeper / Consul (CP)**: dùng đồng thuận (Raft/ZAB) để lưu cấu hình và điều phối cụm — ưu tiên nhất quán hơn sẵn sàng.
- **Kafka**: nhật ký phân tán bền vững, dùng bản sao (replica) và leader theo partition để chịu lỗi.
- **Blockchain**: đạt đồng thuận không cần tin cậy (trustless) giữa các node có thể phản trắc, dùng cơ chế như Proof of Work / Proof of Stake — một dạng chịu lỗi Byzantine.

## Kết nối với các chủ đề khác
Hệ phân tán là nền tảng lý thuyết cho [Khả năng mở rộng](scalability.md) (nhân bản, sharding), [Microservices](microservices-kien-truc.md) (saga, nhất quán cuối cùng) và [Thiết kế CSDL](thiet-ke-csdl.md) (NoSQL, quorum). Nắm vững CAP và các mô hình nhất quán giúp lý giải mọi đánh đổi kiến trúc ở các tầng đó.

## Câu hỏi phỏng vấn thường gặp
1. Phát biểu định lý CAP; cho ví dụ hệ thống CP và AP.
2. So sánh ACID và BASE; khi nào chọn mỗi loại.
3. Nhất quán cuối cùng là gì? Nêu vài biến thể nhất quán.
4. Vì sao Raft được xem là dễ hiểu hơn Paxos?
5. Công thức quorum W + R > N đảm bảo điều gì?
6. Các kỹ thuật đạt khả năng chịu lỗi trong hệ phân tán.
7. Định lý PACELC bổ sung gì cho CAP?
8. Vì sao đồng hồ vật lý không đáng tin? Vector clock giải quyết ra sao?
9. Phân biệt sao chép single-leader, multi-leader và leaderless.
10. "Exactly-once delivery" khó ở đâu, và idempotency giúp gì?

## Tham khảo
- *Designing Data-Intensive Applications* — Martin Kleppmann
- *Bài báo gốc: "In Search of an Understandable Consensus Algorithm (Raft)" — Ongaro & Ousterhout*
- Bài báo: "Dynamo: Amazon's Highly Available Key-value Store" — DeCandia et al.
- Xem thêm: [Khả năng mở rộng](scalability.md), [Kiến trúc Microservices](microservices-kien-truc.md)
