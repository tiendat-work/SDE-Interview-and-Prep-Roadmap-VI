# Thuật toán tham lam (Greedy Algorithms)

## Khái niệm

Tham lam (greedy) là chiến lược xây dựng lời giải bằng cách ở **mỗi bước luôn chọn phương án tốt nhất tại thời điểm hiện tại** (lựa chọn cục bộ tối ưu), với hy vọng chuỗi các lựa chọn cục bộ sẽ cho lời giải tối ưu toàn cục. Không quay lui, không xét lại — mỗi quyết định là cuối cùng.

## Khi nào dùng / Vì sao quan trọng

Tham lam chỉ cho kết quả **tối ưu toàn cục** khi bài toán có hai tính chất:

- **Tính chất lựa chọn tham lam (greedy-choice property):** một lựa chọn cục bộ tối ưu dẫn tới lời giải toàn cục tối ưu.
- **Cấu trúc con tối ưu (optimal substructure):** lời giải tối ưu chứa trong nó lời giải tối ưu của các bài con.

Nếu thiếu các tính chất này, tham lam có thể sai — khi đó cần quy hoạch động. Tham lam thường nhanh và đơn giản hơn DP nên rất đáng ưu tiên khi chứng minh được tính đúng.

## Cách hoạt động

Khung chung: sắp xếp/ưu tiên các lựa chọn theo một tiêu chí, rồi lần lượt nhận lựa chọn nào không vi phạm ràng buộc.

### Các ví dụ kinh điển

- **Activity Selection (chọn hoạt động):** chọn nhiều nhất các hoạt động không giao nhau. Tham lam: luôn chọn hoạt động **kết thúc sớm nhất**. `O(n log n)` do sắp xếp.
- **Huffman Coding (mã hóa Huffman):** xây cây mã tiền tố tối ưu để nén dữ liệu; luôn gộp hai nút tần suất nhỏ nhất. `O(n log n)` dùng hàng đợi ưu tiên.
- **Fractional Knapsack (túi phân số):** được lấy phần lẻ của món đồ; tham lam chọn theo **tỉ lệ giá trị/trọng lượng** cao nhất. `O(n log n)`. (Khác 0/1 knapsack — bản 0/1 phải dùng DP.)
- **Prim & Kruskal (cây khung nhỏ nhất — Minimum Spanning Tree, MST):** Prim mở rộng cây bằng cạnh nhẹ nhất nối ra ngoài (dùng hàng đợi ưu tiên); Kruskal xét các cạnh tăng dần theo trọng số, thêm cạnh nếu không tạo chu trình (dùng cấu trúc Union-Find để kiểm tra chu trình). Cả hai đều `O(E log V)`.
- **Dijkstra (đường đi ngắn nhất):** với đồ thị trọng số **không âm**, luôn mở rộng đỉnh có khoảng cách tạm nhỏ nhất. `O(E log V)` với hàng đợi ưu tiên.

## Ví dụ

**Activity Selection — chọn nhiều hoạt động không giao nhau nhất**

=== "JavaScript"
    ```js
    function activitySelection(activities) {
      // activities: mảng [start, finish]; sắp theo thời điểm kết thúc
      activities.sort((a, b) => a[1] - b[1]);
      const result = [];
      let lastEnd = -Infinity;
      for (const [start, finish] of activities) {
        if (start >= lastEnd) {      // không đè lên hoạt động vừa chọn
          result.push([start, finish]);
          lastEnd = finish;          // cập nhật mốc kết thúc gần nhất
        }
      }
      return result;
    }

    console.log(activitySelection([[1, 3], [2, 5], [4, 7], [1, 8], [5, 9]]));
    // [[1, 3], [4, 7], [5, 9]]
    ```
=== "Python"
    ```python
    def activity_selection(activities):
        # activities: danh sách (start, finish); sắp theo thời điểm kết thúc
        activities.sort(key=lambda x: x[1])
        result = []
        last_end = float('-inf')
        for start, finish in activities:
            if start >= last_end:       # không đè lên hoạt động vừa chọn
                result.append((start, finish))
                last_end = finish       # cập nhật mốc kết thúc gần nhất
        return result

    print(activity_selection([(1, 3), (2, 5), (4, 7), (1, 8), (5, 9)]))
    # [(1, 3), (4, 7), (5, 9)]
    ```

**Fractional Knapsack — túi phân số**

=== "JavaScript"
    ```js
    function fractionalKnapsack(items, W) {
      // items: mảng [value, weight]; sắp giảm dần theo tỉ lệ value/weight
      items.sort((a, b) => b[0] / b[1] - a[0] / a[1]);
      let total = 0;
      for (const [value, weight] of items) {
        if (W >= weight) {
          total += value;             // lấy trọn món
          W -= weight;
        } else {
          total += value * (W / weight);   // lấy phần lẻ vừa đủ đầy túi
          break;                      // túi đã đầy
        }
      }
      return total;
    }

    console.log(fractionalKnapsack([[60, 10], [100, 20], [120, 30]], 50));   // 240
    ```
=== "Python"
    ```python
    def fractional_knapsack(items, W):
        # items: danh sách (value, weight); sắp giảm dần theo tỉ lệ value/weight
        items.sort(key=lambda it: it[0] / it[1], reverse=True)
        total = 0.0
        for value, weight in items:
            if W >= weight:
                total += value         # lấy trọn món
                W -= weight
            else:
                total += value * (W / weight)   # lấy phần lẻ vừa đủ đầy túi
                break                  # túi đã đầy
        return total

    print(fractional_knapsack([(60, 10), (100, 20), (120, 30)], 50))   # 240.0
    ```

**Huffman Coding — xây cây mã tối ưu (dùng heap)**

=== "JavaScript"
    ```js
    function huffman(freqs) {
      // freqs: mảng [char, weight]; dùng mảng đã sắp làm hàng đợi ưu tiên đơn giản
      let heap = freqs.map(([ch, w]) => ({ w, ch }));
      let cost = 0;
      while (heap.length > 1) {
        heap.sort((x, y) => x.w - y.w);      // hai nút tần suất nhỏ nhất ở đầu
        const a = heap.shift();
        const b = heap.shift();
        const merged = a.w + b.w;
        cost += merged;                      // mỗi lần gộp cộng vào tổng chi phí
        heap.push({ w: merged, ch: null });
      }
      return cost;
    }

    console.log(huffman([['a', 5], ['b', 9], ['c', 12], ['d', 13], ['e', 16], ['f', 45]]));
    ```
=== "Python"
    ```python
    import heapq

    def huffman(freqs):
        # freqs: dict ký tự -> tần suất; trả về tổng chi phí mã hóa
        heap = [[w, ch] for ch, w in freqs.items()]
        heapq.heapify(heap)
        cost = 0
        while len(heap) > 1:
            a = heapq.heappop(heap)     # hai nút tần suất nhỏ nhất
            b = heapq.heappop(heap)
            merged = a[0] + b[0]
            cost += merged              # mỗi lần gộp cộng vào tổng chi phí
            heapq.heappush(heap, [merged, None])
        return cost

    print(huffman({'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45}))
    ```

## Thử ngay: Activity Selection in từng bước chọn

!!! tip "Chạy được ngay"
    Đoạn dưới sắp các hoạt động theo thời điểm kết thúc, rồi duyệt và in quyết định **chọn** hay **bỏ** từng hoạt động cùng lý do. Bấm **▶ Chạy**; đổi mảng `activities` (mỗi phần tử là `[start, finish]`) để thử.

<div class="js-demo" data-title="Activity Selection — chọn hoạt động kết thúc sớm nhất">
<textarea class="js-demo-src">
function activitySelection(activities) {
  // sắp tăng dần theo thời điểm kết thúc (finish)
  const sorted = [...activities].sort((a, b) => a[1] - b[1]);
  print('Sau khi sắp theo thời điểm kết thúc:');
  print('  ' + sorted.map(a => `[${a[0]},${a[1]}]`).join('  '));
  const chosen = [];
  let lastEnd = -Infinity;
  for (const [s, f] of sorted) {
    if (s >= lastEnd) {
      chosen.push([s, f]);
      print(`CHỌN [${s},${f}] — bắt đầu ${s} >= mốc ${lastEnd === -Infinity ? '-∞' : lastEnd}`);
      lastEnd = f;
    } else {
      print(`BỎ   [${s},${f}] — bắt đầu ${s} < mốc ${lastEnd} (bị chồng lấn)`);
    }
  }
  print(`=> Chọn được tối đa ${chosen.length} hoạt động: ` +
        chosen.map(a => `[${a[0]},${a[1]}]`).join(', '));
}

const activities = [[1, 3], [2, 5], [4, 7], [1, 8], [5, 9], [8, 10]];
activitySelection(activities);
</textarea>
</div>

## Độ phức tạp

| Bài toán | Thời gian | Bộ nhớ |
|----------|-----------|--------|
| Activity Selection | O(n log n) | O(1) |
| Fractional Knapsack | O(n log n) | O(1) |
| Huffman Coding | O(n log n) | O(n) |
| Prim / Kruskal (MST) | O(E log V) | O(V + E) |
| Dijkstra | O(E log V) | O(V + E) |

- **Prim (Minimum Spanning Tree):** `O(E log V)` với hàng đợi ưu tiên | `O(V + E)`
- **Kruskal (Minimum Spanning Tree):** `O(E log V)` do sắp cạnh | `O(V + E)`
- **Dijkstra (shortest path):** `O(E log V)` | `O(V + E)`

Ghi chú: cả Prim, Kruskal, Dijkstra đều là các thuật toán tham lam trên đồ thị — chúng cùng khai thác tính chất "chọn cạnh/đỉnh nhẹ nhất tại mỗi bước" và đều chứng minh được tính đúng nhờ cấu trúc con tối ưu của đồ thị.

## Ưu / nhược điểm

- **Ưu:**
    - Nhanh, đơn giản, ít bộ nhớ hơn quy hoạch động.
    - Nhiều bài kinh điển có lời giải tham lam ngắn gọn và đẹp.
- **Nhược:**
    - **Không phải lúc nào cũng đúng** — cần chứng minh tính chất lựa chọn tham lam.
    - Ví dụ điển hình thất bại: 0/1 knapsack (phải dùng DP), đổi tiền với bộ mệnh giá bất kỳ.

## Câu hỏi phỏng vấn thường gặp

1. Vì sao tham lam đúng cho fractional knapsack nhưng sai cho 0/1 knapsack?
2. Chứng minh tại sao "chọn hoạt động kết thúc sớm nhất" là tối ưu.
3. So sánh Prim và Kruskal — khi nào chọn cái nào?
4. Vì sao Dijkstra không hoạt động đúng khi có cạnh trọng số âm?
5. Cho một bài toán, làm sao xác định nó giải được bằng tham lam hay phải dùng DP?

## Tham khảo

- [Greedy Algorithms — GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/)
- [Huffman Coding — Wikipedia](https://en.wikipedia.org/wiki/Huffman_coding)
