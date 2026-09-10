# Kỹ thuật lập trình (Coding Techniques)

## Khái niệm

Kỹ thuật lập trình là tập hợp các **mẫu (pattern) và chiến lược thuật toán** dùng đi dùng lại để giải các lớp bài toán quen thuộc. Nắm vững chúng giúp bạn nhanh chóng nhận ra hướng giải khi gặp một đề bài, thay vì phải nghĩ lại từ đầu. Trang này tổng quan các kỹ thuật cốt lõi; các mục có trang riêng sẽ được liên kết để tìm hiểu sâu.

## Khi nào dùng / Vì sao quan trọng

Phần lớn bài phỏng vấn coding là biến thể của một số mẫu cố định. Việc **phân loại đúng mẫu** thường quyết định lời giải:

- Nhận diện mẫu → chọn cấu trúc dữ liệu và độ phức tạp phù hợp.
- Rút ngắn thời gian tư duy trong phòng phỏng vấn.
- Tránh giải pháp "vét cạn" (brute force) khi có cách tối ưu hơn.

## Cách hoạt động

**Chia mô-đun (Modular design)** — tách chương trình thành các hàm nhỏ, mỗi hàm làm một việc. Dễ đọc, dễ kiểm thử, dễ tái sử dụng.

**Chia để trị (Divide and conquer)** — chia bài thành các bài con giống nhau, giải rồi gộp kết quả. Điển hình: merge sort, quick sort, tìm kiếm nhị phân. Độ phức tạp thường phân tích qua **định lý thợ (Master Theorem)**.

**Đệ quy (Recursion)** — hàm tự gọi chính nó, cần **điều kiện dừng (base case)** và bước thu nhỏ bài toán. Nền tảng cho chia để trị, quay lui và duyệt cây.

**Quy hoạch động (Dynamic Programming – DP)** — giải bài có **bài con gối nhau (overlapping subproblems)** và **cấu trúc con tối ưu (optimal substructure)** bằng cách lưu lại kết quả (memoization / bảng bottom-up). Ví dụ: Fibonacci, ba lô (knapsack), chuỗi con chung dài nhất (LCS).

**Tham lam (Greedy)** — mỗi bước chọn phương án tốt nhất cục bộ, kỳ vọng đạt tối ưu toàn cục. Chỉ đúng khi bài có tính chất tham lam (ví dụ: đổi tiền với hệ tiền chuẩn, lập lịch hoạt động).

**Quay lui (Backtracking)** — thử từng lựa chọn, nếu không dẫn tới lời giải thì "lùi lại" và thử hướng khác. Dùng cho hoán vị, tổ hợp, N-hậu, giải Sudoku.

**Thao tác bit (Bit manipulation)** — dùng phép `AND`, `OR`, `XOR`, dịch bit để xử lý nhanh trên bit. Ví dụ: tìm số xuất hiện lẻ lần bằng `XOR`, kiểm tra lũy thừa của 2.

**Cửa sổ trượt (Sliding window)** — duy trì một "cửa sổ" liên tục trên mảng/chuỗi, mở rộng và co lại theo điều kiện. Xem [Cửa sổ trượt](../giai-thuat/cua-so-truot.md).

**Hai con trỏ (Two pointers)** — dùng hai chỉ số duyệt dữ liệu có chủ đích, thường giảm `O(n²)` xuống `O(n)`. Xem [Hai con trỏ](../giai-thuat/hai-con-tro.md).

**Tìm kiếm nhị phân (Binary search)** — trên dữ liệu đã sắp, mỗi bước loại bỏ nửa không gian tìm kiếm, đạt `O(log n)`. Còn dùng để "tìm kiếm nhị phân trên đáp án".

**Con trỏ nhanh-chậm (Fast-slow pointers)** — hai con trỏ chạy tốc độ khác nhau (thuật toán rùa và thỏ), phát hiện chu trình trong danh sách liên kết, tìm phần tử giữa.

**Băm (Hashing)** — dùng bảng băm (hash map / set) để tra cứu, đếm, nhóm phần tử trong `O(1)` trung bình. Cốt lõi của rất nhiều lời giải tối ưu.

**Duyệt đồ thị (Graph traversal – BFS/DFS)** — duyệt theo chiều rộng (BFS, dùng hàng đợi) tìm đường ngắn nhất trên đồ thị không trọng số; duyệt theo chiều sâu (DFS, dùng đệ quy/ngăn xếp) dò liên thông, phát hiện chu trình, sắp thứ tự tô-pô.

**Sắp xếp tô-pô (Topological sort)** — sắp thứ tự các đỉnh của đồ thị có hướng không chu trình (DAG) sao cho mọi cạnh đi từ trước ra sau. Dùng cho lịch phụ thuộc công việc, biên dịch, khoá học tiên quyết.

**Union-Find (Disjoint Set Union)** — quản lý các tập hợp rời nhau với `find` và `union` gần `O(1)` (nhờ nén đường và hợp theo hạng). Dùng cho đếm thành phần liên thông, Kruskal MST, phát hiện chu trình đồ thị vô hướng.

**Cây tiền tố (Trie)** — cây lưu chuỗi theo ký tự, tra cứu tiền tố `O(độ dài chuỗi)`. Dùng cho gợi ý tự động (autocomplete), kiểm tra từ điển, tìm tiền tố chung.

**Đống / hàng đợi ưu tiên (Heap / Priority Queue)** — luôn lấy ra phần tử nhỏ/lớn nhất trong `O(log n)`. Dùng cho "k phần tử lớn nhất", Dijkstra, trộn k danh sách đã sắp.

**Tổng tiền tố & mảng hiệu (Prefix sum / Difference array)** — tiền xử lý một lần để trả lời truy vấn tổng đoạn hoặc cập nhật đoạn trong `O(1)`.

**Tìm kiếm nhị phân trên đáp án (Binary search on answer)** — khi đáp án đơn điệu (monotonic), nhị phân trên chính giá trị đáp án thay vì trên mảng. Dùng cho "giá trị nhỏ nhất khả thi", "tốc độ tối thiểu"...

**Thuật toán dòng quét (Sweep line) & khoảng (Intervals)** — sắp các mốc theo trục rồi quét qua, xử lý bài giao/gộp khoảng, đặt lịch phòng họp.

**Nhánh cận (Branch and bound)** — như quay lui nhưng cắt tỉa (pruning) các nhánh không thể tốt hơn lời giải hiện có; tăng tốc bài tối ưu tổ hợp.

## Ví dụ

=== "JavaScript"
    ```js
    // Chia để trị: tìm kiếm nhị phân
    function binarySearch(nums, target) {
      let lo = 0, hi = nums.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;      // chia đôi không gian
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) lo = mid + 1;  // loại nửa trái
        else hi = mid - 1;                            // loại nửa phải
      }
      return -1;
    }

    // DP: Fibonacci với memoization
    function fib(n, memo = {}) {
      if (n < 2) return n;                // base case
      if (memo[n] === undefined)
        memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
      return memo[n];
    }

    // Bit: kiểm tra n có phải lũy thừa của 2
    function isPowerOfTwo(n) {
      return n > 0 && (n & (n - 1)) === 0;
    }
    ```
=== "Python"
    ```python
    # Chia để trị: tìm kiếm nhị phân
    def binary_search(nums, target):
        lo, hi = 0, len(nums) - 1
        while lo <= hi:
            mid = (lo + hi) // 2         # chia đôi không gian
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                lo = mid + 1             # loại nửa trái
            else:
                hi = mid - 1             # loại nửa phải
        return -1

    # DP: Fibonacci với memoization
    def fib(n, memo={}):
        if n < 2:
            return n                     # base case
        if n not in memo:
            memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
        return memo[n]

    # Bit: kiểm tra n có phải lũy thừa của 2
    def is_power_of_two(n):
        return n > 0 and (n & (n - 1)) == 0
    ```

**Ví dụ quay lui (backtracking) — sinh mọi hoán vị:**

=== "JavaScript"
    ```js
    function permutations(arr) {
      const res = [];
      const used = new Array(arr.length).fill(false);
      const path = [];
      function backtrack() {
        if (path.length === arr.length) { res.push([...path]); return; }
        for (let i = 0; i < arr.length; i++) {
          if (used[i]) continue;      // đã dùng thì bỏ qua
          used[i] = true; path.push(arr[i]);   // chọn
          backtrack();                          // đệ quy
          used[i] = false; path.pop();          // lùi lại (undo)
        }
      }
      backtrack();
      return res;
    }
    ```
=== "Python"
    ```python
    def permutations(arr):
        res, used, path = [], [False] * len(arr), []
        def backtrack():
            if len(path) == len(arr):
                res.append(path[:]); return
            for i in range(len(arr)):
                if used[i]:
                    continue          # đã dùng thì bỏ qua
                used[i] = True; path.append(arr[i])   # chọn
                backtrack()                            # đệ quy
                used[i] = False; path.pop()            # lùi lại (undo)
        backtrack()
        return res
    ```

## Thử ngay: quay lui sinh hoán vị

Playground minh hoạ **khung quay lui kinh điển** — chọn / đệ quy / lùi lại. Nó in ra toàn bộ hoán vị của một danh sách và đếm số lời gọi đệ quy để bạn thấy cây tìm kiếm lớn cỡ nào (`n!` lá).

<div class="js-demo" data-title="Backtracking: sinh mọi hoán vị">
<textarea class="js-demo-src">
function permutations(arr) {
  const res = [];
  const used = new Array(arr.length).fill(false);
  const path = [];
  let calls = 0;
  function backtrack(depth) {
    calls++;
    if (path.length === arr.length) { res.push(path.join('')); return; }
    for (let i = 0; i < arr.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(arr[i]);   // chọn
      backtrack(depth + 1);                // đệ quy sâu hơn
      used[i] = false; path.pop();         // lùi lại
    }
  }
  backtrack(0);
  return { res, calls };
}

const input = ['A', 'B', 'C'];
const { res, calls } = permutations(input);
print('Đầu vào:', input.join(''));
print('Số hoán vị:', res.length, '(= ' + input.length + '! )');
print('Các hoán vị:', res.join(', '));
print('Số lời gọi đệ quy:', calls);
</textarea>
</div>

## Bảng chọn kỹ thuật nhanh

| Dấu hiệu trong đề | Kỹ thuật gợi ý |
|-------------------|----------------|
| Mảng/chuỗi đã sắp, tìm cặp | Hai con trỏ, tìm kiếm nhị phân |
| Mảng con/chuỗi con liên tục | Cửa sổ trượt |
| "Số cách", "tối đa/tối thiểu" chồng lấn | Quy hoạch động |
| Sinh mọi hoán vị/tổ hợp | Quay lui |
| Chu trình / phần tử giữa danh sách liên kết | Con trỏ nhanh-chậm |
| Đếm/tra cứu/nhóm nhanh | Băm (hash map) |
| Chọn tối ưu từng bước | Tham lam |
| Đường ngắn nhất đồ thị không trọng số | BFS |
| Liên thông / chu trình / duyệt sâu | DFS, Union-Find |
| Thứ tự phụ thuộc (tiên quyết) | Sắp xếp tô-pô |
| "k phần tử lớn/nhỏ nhất", trộn k danh sách | Heap (hàng đợi ưu tiên) |
| Truy vấn tổng đoạn nhiều lần | Tổng tiền tố (prefix sum) |
| "Giá trị nhỏ nhất/lớn nhất khả thi" đơn điệu | Nhị phân trên đáp án |
| Gộp/giao khoảng, lịch phòng họp | Dòng quét (sweep line) |
| Tra cứu tiền tố / autocomplete | Cây tiền tố (Trie) |

## Ưu / nhược điểm

- **Ưu:** rút ngắn thời gian tìm hướng giải; áp dụng lại cho nhiều bài.
- **Nhược:** dễ chọn nhầm mẫu nếu chỉ nhìn hình thức đề; một số mẫu (greedy) chỉ đúng khi bài thỏa điều kiện đặc thù, cần chứng minh.

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt quy hoạch động và tham lam; khi nào greedy cho kết quả sai?
2. Khi nào chọn hai con trỏ, khi nào chọn cửa sổ trượt?
3. Giải thích thuật toán rùa và thỏ để phát hiện chu trình.
4. Vì sao bảng băm cho lời giải `O(n)` cho bài Two Sum chưa sắp?

## Tham khảo

- [Hai con trỏ](../giai-thuat/hai-con-tro.md)
- [Cửa sổ trượt](../giai-thuat/cua-so-truot.md)
- [Phân tích độ phức tạp](do-phuc-tap.md)
