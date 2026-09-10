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

## Ví dụ

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
