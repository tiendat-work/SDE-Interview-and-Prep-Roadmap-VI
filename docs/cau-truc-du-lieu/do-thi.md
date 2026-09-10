# Đồ thị (Graph)

## Khái niệm

Đồ thị (graph) là một cấu trúc dữ liệu phi tuyến tính gồm một tập **đỉnh (vertices/nodes)** và một tập **cạnh (edges)** nối các đỉnh lại với nhau. Khác với cây, đồ thị có thể chứa chu trình (cycle) và mỗi đỉnh có thể nối tới nhiều đỉnh khác mà không cần quan hệ cha–con. Đồ thị mô hình hóa mọi quan hệ "nối kết": mạng xã hội, bản đồ đường đi, mạng máy tính, phụ thuộc tác vụ.

Ví dụ một đồ thị vô hướng đơn giản gồm 4 đỉnh:

```mermaid
graph LR
    A((A)) --- B((B))
    A --- C((C))
    B --- C
    C --- D((D))
```

## Khi nào dùng / Vì sao quan trọng

- **Mạng xã hội:** đỉnh = người dùng, cạnh = quan hệ bạn bè.
- **Bản đồ & định tuyến:** đỉnh = địa điểm, cạnh có trọng số = khoảng cách/thời gian (Google Maps, GPS).
- **Mạng máy tính, web:** đỉnh = trang/máy chủ, cạnh = liên kết.
- **Lập lịch & phụ thuộc:** sắp xếp topo (topological sort) cho các tác vụ phụ thuộc nhau.

## Cách hoạt động

### Phân loại đồ thị

- **Vô hướng (undirected):** cạnh không có chiều (quan hệ hai chiều, như bạn bè).
- **Có hướng (directed/digraph):** cạnh có chiều (A → B, như người theo dõi trên Twitter).
- **Có trọng số (weighted):** mỗi cạnh mang một giá trị (khoảng cách, chi phí).
- **Không trọng số (unweighted):** mọi cạnh như nhau.

### Hai cách biểu diễn

1. **Ma trận kề (adjacency matrix):** mảng 2 chiều `M[i][j]` = 1 (hoặc trọng số) nếu có cạnh i→j. Kiểm tra cạnh tồn tại O(1), nhưng tốn O(V²) bộ nhớ — lãng phí với đồ thị thưa (sparse).
2. **Danh sách kề (adjacency list):** mỗi đỉnh giữ một danh sách các đỉnh kề. Tiết kiệm bộ nhớ O(V + E), duyệt hàng xóm hiệu quả — lựa chọn phổ biến cho đồ thị thưa.

So sánh: đồ thị **dày (dense)** → dùng ma trận; đồ thị **thưa** → dùng danh sách kề.

Cùng một đồ thị (đỉnh 0,1,2,3) được lưu theo hai cách — ma trận đánh dấu mọi cặp, danh sách chỉ liệt kê hàng xóm thực sự có:

```mermaid
graph TD
    subgraph MATRIX["Ma trận kề — M[i][j]=1 nếu có cạnh (tốn O(V²))"]
        MT["&nbsp;&nbsp;&nbsp;0 1 2 3<br/>0: 0 1 1 0<br/>1: 1 0 0 1<br/>2: 1 0 0 1<br/>3: 0 1 1 0"]
    end
    subgraph LIST["Danh sách kề — mỗi đỉnh giữ list hàng xóm (tốn O(V+E))"]
        L0["0"] --> L0N["[1, 2]"]
        L1["1"] --> L1N["[0, 3]"]
        L2["2"] --> L2N["[0, 3]"]
        L3["3"] --> L3N["[1, 2]"]
    end
```

### Duyệt đồ thị

- **DFS (Depth-First Search):** đi sâu theo một nhánh tới cùng rồi mới quay lui. Cài bằng đệ quy hoặc ngăn xếp. Dùng để phát hiện chu trình, sắp xếp topo, tìm thành phần liên thông.
- **BFS (Breadth-First Search):** duyệt theo từng lớp khoảng cách, dùng hàng đợi. Tìm đường đi ngắn nhất theo **số cạnh** trên đồ thị không trọng số.

Cả hai đều thăm mỗi đỉnh/cạnh đúng một lần → O(V + E) với danh sách kề. Khác biệt cốt lõi nằm ở **cấu trúc tạm**: DFS dùng **ngăn xếp (LIFO)** — luôn khai thác đỉnh mới nhất trước nên lao sâu; BFS dùng **hàng đợi (FIFO)** — thăm hết hàng xóm gần trước nên lan theo lớp. Điểm dễ sai: phải đánh dấu **đã thăm (visited)** ngay khi đưa đỉnh vào cấu trúc (BFS) để tránh thêm trùng, và kiểm tra visited trước khi đệ quy (DFS) để không lặp vô hạn trên đồ thị có chu trình.

## Thử ngay: BFS và DFS trên danh sách kề

!!! tip "Chạy được ngay trong trình duyệt"
    Bấm **▶ Chạy** để duyệt cùng một đồ thị bằng cả BFS lẫn DFS và in thứ tự thăm đỉnh. Hãy sửa `graph` hoặc đổi đỉnh bắt đầu `start` rồi chạy lại để so sánh hai thứ tự.

<div class="js-demo" data-title="Duyệt đồ thị — BFS & DFS in thứ tự thăm">
<textarea class="js-demo-src">
// Đồ thị vô hướng biểu diễn bằng danh sách kề
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E'],
};

function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];          // hàng đợi FIFO
  const order = [];
  while (queue.length) {
    const node = queue.shift();   // lấy đỉnh vào sớm nhất
    order.push(node);
    for (const nxt of graph[node]) {
      if (!visited.has(nxt)) {    // đánh dấu ngay khi đưa vào hàng đợi
        visited.add(nxt);
        queue.push(nxt);
      }
    }
  }
  return order;
}

function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function visit(node) {          // đệ quy — dùng ngăn xếp lời gọi
    visited.add(node);
    order.push(node);
    for (const nxt of graph[node]) {
      if (!visited.has(nxt)) visit(nxt);
    }
  }
  visit(start);
  return order;
}

const start = 'A';
print('Đồ thị :', JSON.stringify(graph));
print('Bắt đầu:', start);
print('BFS (theo lớp)  :', bfs(graph, start).join(' → '));
print('DFS (đi sâu)     :', dfs(graph, start).join(' → '));
</textarea>
</div>

### Cây khung nhỏ nhất (Minimum Spanning Tree — MST)

Trên đồ thị liên thông có trọng số, MST là tập cạnh nối tất cả đỉnh với **tổng trọng số nhỏ nhất** và không tạo chu trình. Hai thuật toán kinh điển:

- **Kruskal:** sắp cạnh theo trọng số tăng dần, lần lượt thêm cạnh nếu không tạo chu trình (dùng Union-Find). O(E log E).
- **Prim:** lớn dần từ một đỉnh, mỗi bước thêm cạnh rẻ nhất nối ra ngoài cây (dùng heap). O(E log V).

Ví dụ: đồ thị 4 đỉnh với các cạnh có trọng số; MST chọn 3 cạnh rẻ nhất nối hết đỉnh mà không tạo chu trình (cạnh nét liền được chọn, nét đứt bị loại):

```mermaid
graph LR
    subgraph MST["Cây khung nhỏ nhất — tổng trọng số = 1 + 2 + 4 = 7"]
        M0(("0")) ---|"1"| M1(("1"))
        M0 ===|"2"| M2(("2"))
        M2 ===|"4"| M3(("3"))
        M1 -.->|"3 (bỏ — tạo chu trình)"| M2
    end
```

## Ví dụ

### Biểu diễn bằng danh sách kề

```python
# Đồ thị vô hướng: đỉnh → danh sách hàng xóm
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C'],
}
```

### DFS (đệ quy)

=== "JavaScript"
    ```js
    function dfs(graph, node, visited = new Set()) {
      visited.add(node);
      process.stdout.write(node + " ");
      for (const nxt of graph[node]) {
        if (!visited.has(nxt)) dfs(graph, nxt, visited);  // chỉ thăm đỉnh chưa duyệt
      }
    }

    dfs(graph, 'A');   // ví dụ: A B D C
    ```

=== "Python"
    ```python
    def dfs(graph, node, visited=None):
        if visited is None:
            visited = set()
        visited.add(node)
        print(node, end=" ")
        for nxt in graph[node]:
            if nxt not in visited:      # chỉ thăm đỉnh chưa duyệt
                dfs(graph, nxt, visited)

    dfs(graph, 'A')   # ví dụ: A B D C
    ```

### BFS (dùng hàng đợi)

=== "JavaScript"
    ```js
    function bfs(graph, start) {
      const visited = new Set([start]);
      const q = [start];
      while (q.length) {
        const node = q.shift();        // lấy theo FIFO → duyệt theo lớp
        process.stdout.write(node + " ");
        for (const nxt of graph[node]) {
          if (!visited.has(nxt)) {
            visited.add(nxt);
            q.push(nxt);
          }
        }
      }
    }

    bfs(graph, 'A');   // A B C D
    ```

=== "Python"
    ```python
    from collections import deque

    def bfs(graph, start):
        visited = {start}
        q = deque([start])
        while q:
            node = q.popleft()          # lấy theo FIFO → duyệt theo lớp
            print(node, end=" ")
            for nxt in graph[node]:
                if nxt not in visited:
                    visited.add(nxt)
                    q.append(nxt)

    bfs(graph, 'A')   # A B C D
    ```

### MST bằng thuật toán Kruskal (với Union-Find)

```python
def kruskal(n, edges):
    # edges: danh sách (trọng_số, u, v)
    parent = list(range(n))

    def find(x):                      # tìm gốc tập hợp
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # nén đường
            x = parent[x]
        return x

    mst, total = [], 0
    for w, u, v in sorted(edges):     # xét cạnh theo trọng số tăng
        ru, rv = find(u), find(v)
        if ru != rv:                  # không tạo chu trình
            parent[ru] = rv
            mst.append((u, v, w))
            total += w
    return mst, total

edges = [(1, 0, 1), (3, 1, 2), (2, 0, 2), (4, 2, 3)]
print(kruskal(4, edges))   # cây khung và tổng trọng số
```

## Độ phức tạp

| Thao tác / thuật toán | Ma trận kề | Danh sách kề |
|-----------------------|------------|--------------|
| Bộ nhớ | O(V²) | O(V + E) |
| Kiểm tra cạnh (u,v) | O(1) | O(bậc của u) |
| Duyệt hàng xóm của u | O(V) | O(bậc của u) |
| DFS / BFS | O(V²) | O(V + E) |
| MST Kruskal | — | O(E log E) |
| MST Prim (heap) | — | O(E log V) |

(V = số đỉnh, E = số cạnh.)

### Vì sao có các con số này?

!!! question "Tại sao ma trận kề tốn O(V²) bộ nhớ còn danh sách kề chỉ O(V + E)?"
    - **Ma trận kề — O(V²):** ma trận là một bảng vuông `V × V`, ô `M[i][j]` trả lời câu hỏi "có cạnh từ i tới j không?". Vì phải dành **một ô cho MỌI cặp đỉnh** — kể cả những cặp **không** có cạnh — nên số ô luôn là `V × V = V²`, bất kể đồ thị thực sự có bao nhiêu cạnh. Với đồ thị **thưa (sparse)** — ví dụ mạng xã hội 1 triệu người, mỗi người chỉ vài trăm bạn — ma trận vẫn ngốn `10¹²` ô, gần như toàn số 0. Đó là lãng phí khổng lồ.
    - **Danh sách kề — O(V + E):** thay vì ghi mọi cặp, mỗi đỉnh chỉ **liệt kê những hàng xóm nó thực sự nối tới**. Ta tốn `O(V)` cho `V` "đầu danh sách" (mỗi đỉnh một danh sách), cộng `O(E)` cho tổng số mục hàng xóm — vì **mỗi cạnh chỉ được ghi ra đúng nơi nó tồn tại** (cạnh vô hướng ghi 2 lần, vẫn là hằng số nhân E). Không cạnh nào ⇒ không tốn ô nào. Vì thế với đồ thị thưa (`E ≪ V²`), danh sách kề tiết kiệm bộ nhớ vượt trội.

    Đánh đổi: ma trận trả lời "có cạnh (u,v) không?" tức thì O(1) (đọc thẳng một ô), còn danh sách phải quét danh sách hàng xóm của u — O(bậc của u). Đồ thị **dày** → ma trận đáng giá; đồ thị **thưa** → danh sách kề thắng.

!!! question "Tại sao BFS dùng hàng đợi còn DFS dùng ngăn xếp/đệ quy?"
    Khác biệt hoàn toàn đến từ **thứ tự lấy đỉnh ra để xử lý tiếp**, và mỗi cấu trúc tạm ép ra một thứ tự khác nhau:

    - **BFS cần hàng đợi (FIFO — vào trước, ra trước):** BFS muốn duyệt theo **từng lớp khoảng cách** — thăm hết mọi đỉnh cách gốc 1 cạnh, rồi mới tới lớp cách 2 cạnh... Hàng đợi làm đúng điều đó: những đỉnh được phát hiện **sớm hơn** (gần gốc hơn) nằm ở đầu hàng nên **được lấy ra trước**, đảm bảo ta luôn xử lý xong lớp gần trước khi chạm lớp xa. Chính vì lan theo lớp mà BFS tìm được **đường đi ngắn nhất theo số cạnh** trên đồ thị không trọng số.
    - **DFS cần ngăn xếp (LIFO — vào sau, ra trước):** DFS muốn **lao sâu theo một nhánh tới cùng** rồi mới quay lui. Ngăn xếp cho ta điều đó: đỉnh **mới phát hiện gần nhất** được xử lý ngay, đẩy ta đi xa dần khỏi gốc; chỉ khi cụt đường mới "quay lui" bằng cách lấy đỉnh trên đỉnh ngăn xếp. Đệ quy chính là dùng **ngăn xếp lời gọi hàm (call stack)** của ngôn ngữ để làm việc này một cách ngầm — nên đệ quy và "dùng stack" là cùng một cơ chế.

    Phép loại suy: BFS như **vết dầu loang** trên mặt nước — lan đều ra mọi hướng theo vòng tròn đồng tâm. DFS như **đi trong mê cung luôn men theo một bức tường** — cứ đâm sâu tới ngõ cụt rồi lùi lại thử lối khác.

!!! question "Tại sao duyệt (DFS/BFS) là O(V + E) với danh sách kề?"
    Vì cả hai đều nhờ mảng `visited` bảo đảm **mỗi đỉnh chỉ được xử lý đúng một lần** và **mỗi cạnh chỉ được xét đúng một lần** (hoặc hai lần với đồ thị vô hướng — vẫn là hằng số nhân E). Cộng lại: chi phí "chạm mỗi đỉnh một lần" là `O(V)`, chi phí "đi qua mỗi cạnh một lần khi liệt kê hàng xóm" là `O(E)` → tổng `O(V + E)`.

    Lưu ý vì sao con số này **khác** với ma trận kề: với danh sách kề, để duyệt hàng xóm của một đỉnh ta chỉ đọc đúng số hàng xóm nó có. Nhưng với **ma trận kề**, muốn tìm hàng xóm của một đỉnh phải quét **cả một hàng dài V ô** (phần lớn là số 0) để lọc ra ô nào bằng 1 — làm vậy cho `V` đỉnh thành `O(V²)`. Đó là lý do bảng độ phức tạp ghi DFS/BFS là `O(V²)` khi dùng ma trận nhưng `O(V + E)` khi dùng danh sách kề.

## Ưu / nhược điểm

- **Ưu:**
  - Mô hình hóa linh hoạt mọi quan hệ kết nối phức tạp.
  - Danh sách kề tiết kiệm bộ nhớ cho đồ thị thưa.
  - Nhiều thuật toán mạnh: đường đi ngắn nhất, MST, luồng cực đại, sắp xếp topo.
- **Nhược:**
  - Ma trận kề tốn O(V²) bộ nhớ dù đồ thị thưa.
  - Nhiều thuật toán phức tạp, dễ sai khi xử lý chu trình/đỉnh chưa thăm.
  - Đồ thị lớn tốn nhiều tài nguyên tính toán.

## Câu hỏi phỏng vấn thường gặp

1. **So sánh ma trận kề và danh sách kề.** Ma trận: kiểm tra cạnh O(1), bộ nhớ O(V²); danh sách: bộ nhớ O(V+E), phù hợp đồ thị thưa.
2. **DFS và BFS khác nhau thế nào?** DFS đi sâu (dùng stack/đệ quy); BFS đi theo lớp (dùng queue), tìm đường ngắn nhất trên đồ thị không trọng số.
3. **Làm sao phát hiện chu trình?** Đồ thị vô hướng: Union-Find hoặc DFS; có hướng: DFS với đánh dấu đỉnh đang trong ngăn xếp đệ quy.
4. **Sắp xếp topo (topological sort) là gì?** Sắp các đỉnh của đồ thị có hướng không chu trình (DAG) sao cho mọi cạnh u→v thì u đứng trước v.
5. **Dijkstra dùng để làm gì?** Tìm đường đi ngắn nhất từ một nguồn trên đồ thị trọng số không âm, dùng hàng đợi ưu tiên.
6. **Kruskal và Prim khác nhau ra sao?** Cả hai tìm MST; Kruskal sắp cạnh + Union-Find, Prim lớn dần từ một đỉnh dùng heap.
7. **Thành phần liên thông (connected component) là gì?** Tập đỉnh mà giữa hai đỉnh bất kỳ đều có đường đi; tìm bằng DFS/BFS hoặc Union-Find.

## Tham khảo

- Nội dung được biên dịch và điều chỉnh từ tài liệu cấu trúc dữ liệu của dự án.
