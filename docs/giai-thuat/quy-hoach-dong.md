# Quy hoạch động (Dynamic Programming)

## Khái niệm

Quy hoạch động (dynamic programming — DP) là kỹ thuật giải bài toán bằng cách chia thành các bài toán con (subproblems) chồng lấp, giải mỗi bài con **đúng một lần** rồi lưu lại kết quả để tái sử dụng. Nhờ vậy tránh được việc tính lại nhiều lần như đệ quy thuần túy.

Một bài toán giải được bằng DP khi có hai tính chất:

- **Bài toán con chồng lấp (overlapping subproblems):** cùng một bài con xuất hiện lại nhiều lần.
- **Cấu trúc con tối ưu (optimal substructure):** lời giải tối ưu của bài lớn được xây từ lời giải tối ưu của các bài con.

## Khi nào dùng / Vì sao quan trọng

DP xuất hiện trong hầu hết các bài toán tối ưu: tìm giá trị lớn/nhỏ nhất, đếm số cách, kiểm tra khả thi... Nhận diện đúng "trạng thái" (state) và "công thức truy hồi" (recurrence) là kỹ năng cốt lõi trong phỏng vấn.

## Cách hoạt động

Có hai cách cài đặt chính:

**1. Ghi nhớ — Memoization (từ trên xuống, top-down)**

Viết đệ quy tự nhiên, nhưng lưu kết quả mỗi bài con vào bộ nhớ đệm (cache); lần sau gặp lại thì trả ngay. Dễ viết, chỉ tính các trạng thái thật sự cần.

**2. Lập bảng — Tabulation (từ dưới lên, bottom-up)**

Điền một bảng theo thứ tự từ bài con nhỏ nhất đến bài lớn nhất bằng vòng lặp. Tránh chi phí đệ quy, dễ tối ưu bộ nhớ (ví dụ chỉ giữ vài hàng).

| Tiêu chí | Memoization | Tabulation |
|----------|-------------|------------|
| Hướng | Trên xuống | Dưới lên |
| Cài đặt | Đệ quy + cache | Vòng lặp + bảng |
| Tính trạng thái thừa | Không | Có thể có |
| Rủi ro tràn ngăn xếp | Có | Không |

### Các bài toán kinh điển

- **LCS — Dãy con chung dài nhất (Longest Common Subsequence):** độ dài dãy con xuất hiện trong cả hai chuỗi (không cần liền kề). `O(m·n)`.
- **LIS — Dãy con tăng dài nhất (Longest Increasing Subsequence):** `O(n²)` bằng DP, hoặc `O(n log n)` kết hợp nhị phân.
- **0/1 Knapsack — Cái túi 0/1:** chọn tập món đồ (mỗi món lấy hoặc không) để tối đa giá trị trong giới hạn trọng lượng `W`. `O(n·W)`.
- **Coin Change — Đổi tiền:** số đồng xu ít nhất để đạt số tiền mục tiêu. `O(số_tiền · số_loại_xu)`.
- **Edit Distance — Khoảng cách chỉnh sửa (Levenshtein):** số phép chèn/xóa/thay tối thiểu để biến chuỗi này thành chuỗi kia. `O(m·n)`.

## Ví dụ

**0/1 Knapsack — bằng lập bảng (tabulation)**

```python
def knapsack(weights, values, W):
    n = len(weights)
    # dp[i][w] = giá trị lớn nhất khi xét i món đầu với sức chứa w
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(W + 1):
            # trường hợp 1: không lấy món i
            dp[i][w] = dp[i - 1][w]
            # trường hợp 2: lấy món i nếu còn chỗ, chọn phương án tốt hơn
            if weights[i - 1] <= w:
                dp[i][w] = max(dp[i][w],
                               dp[i - 1][w - weights[i - 1]] + values[i - 1])
    return dp[n][W]

print(knapsack([1, 3, 4, 5], [1, 4, 5, 7], 7))   # 9
```

**LCS — Dãy con chung dài nhất (memoization)**

```python
from functools import lru_cache

def lcs(a, b):
    @lru_cache(maxsize=None)     # tự động ghi nhớ kết quả theo (i, j)
    def solve(i, j):
        if i == len(a) or j == len(b):   # hết một trong hai chuỗi
            return 0
        if a[i] == b[j]:
            return 1 + solve(i + 1, j + 1)   # ký tự khớp -> mở rộng dãy con
        # không khớp -> bỏ 1 ký tự ở a hoặc b, lấy phương án tốt hơn
        return max(solve(i + 1, j), solve(i, j + 1))
    return solve(0, 0)

print(lcs("ABCBDAB", "BDCAB"))   # 4  (ví dụ "BCAB")
```

**Coin Change — số xu ít nhất (tabulation)**

```python
def coin_change(coins, amount):
    INF = amount + 1
    dp = [0] + [INF] * amount     # dp[x] = số xu ít nhất để đạt số tiền x
    for x in range(1, amount + 1):
        for c in coins:
            if c <= x:
                dp[x] = min(dp[x], dp[x - c] + 1)   # dùng thêm 1 đồng xu c
    return dp[amount] if dp[amount] != INF else -1  # -1 nếu không đổi được

print(coin_change([1, 2, 5], 11))   # 3  (5 + 5 + 1)
```

## Độ phức tạp

| Bài toán | Thời gian | Bộ nhớ |
|----------|-----------|--------|
| LCS | O(m·n) | O(m·n), tối ưu còn O(min(m,n)) |
| LIS | O(n²) hoặc O(n log n) | O(n) |
| 0/1 Knapsack | O(n·W) | O(n·W), tối ưu còn O(W) |
| Coin Change | O(amount·k) | O(amount) |
| Edit Distance | O(m·n) | O(m·n), tối ưu còn O(min(m,n)) |

## Ưu / nhược điểm

- **Ưu:**
    - Biến bài toán mũ `O(2^n)` thành đa thức nhờ tái sử dụng kết quả.
    - Khung tư duy thống nhất: xác định trạng thái, truy hồi, điều kiện cơ sở (base case).
- **Nhược:**
    - Tốn bộ nhớ để lưu bảng/cache (có thể tối ưu bằng cuộn hàng — rolling array).
    - Khó nhất là **định nghĩa đúng trạng thái** và công thức truy hồi.

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt memoization và tabulation; khi nào chọn cách nào?
2. Xác định trạng thái và công thức truy hồi cho bài coin change.
3. Tối ưu bộ nhớ 0/1 knapsack từ `O(n·W)` xuống `O(W)` như thế nào?
4. Vì sao LIS có thể giảm về `O(n log n)`?
5. Phân biệt dãy con (subsequence) và chuỗi con liên tục (substring) trong các bài DP.

## Tham khảo

- [Dynamic Programming — GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/)
- [LeetCode — Dynamic Programming](https://leetcode.com/tag/dynamic-programming/)
