# Thuật toán tìm kiếm (Searching Algorithms)

## Khái niệm

Tìm kiếm (searching) là quá trình xác định vị trí (hoặc sự tồn tại) của một phần tử mục tiêu trong một tập dữ liệu. Cách tìm phụ thuộc nhiều vào việc dữ liệu **đã sắp xếp hay chưa**: với dữ liệu chưa sắp ta chỉ có thể duyệt tuyến tính, còn với dữ liệu đã sắp ta khai thác được các thuật toán logarit như tìm kiếm nhị phân.

## Khi nào dùng / Vì sao quan trọng

- **Truy vấn thành viên (membership):** kiểm tra một phần tử có trong tập dữ liệu không.
- **Định vị chỉ số:** tìm vị trí để chèn/xóa, hoặc tìm biên (cận trái/cận phải).
- **Nền tảng phỏng vấn:** tìm kiếm nhị phân là một trong những kỹ thuật được hỏi nhiều nhất, đặc biệt biến thể "nhị phân trên đáp án" (binary search on answer).

## Cách hoạt động

### Tìm kiếm tuyến tính (Linear Search)

Duyệt tuần tự từng phần tử cho tới khi gặp mục tiêu. Không yêu cầu dữ liệu sắp xếp. **Thời gian:** `O(n)`.

### Tìm kiếm nhị phân (Binary Search)

Yêu cầu **mảng đã sắp**. Mỗi bước so sánh mục tiêu với phần tử giữa (mid) rồi loại bỏ nửa không thể chứa mục tiêu, thu hẹp không gian tìm kiếm còn một nửa. **Thời gian:** `O(log n)`.

### Jump Search (tìm kiếm nhảy)

Trên mảng đã sắp, nhảy từng bước cỡ `√n` để khoanh vùng khối chứa mục tiêu, rồi tìm tuyến tính trong khối đó. **Thời gian:** `O(√n)`.

### Interpolation Search (tìm kiếm nội suy)

Cải tiến của nhị phân cho dữ liệu **phân bố đều**: thay vì luôn lấy giữa, ước lượng vị trí mục tiêu theo tỉ lệ giá trị. **Thời gian:** `O(log log n)` khi phân bố đều, `O(n)` xấu nhất.

### Exponential Search (tìm kiếm hàm mũ)

Dùng khi không biết kích thước mảng (hoặc mảng vô hạn/rất lớn): nhân đôi chỉ số (1, 2, 4, 8...) đến khi vượt qua mục tiêu, rồi nhị phân trong khoảng vừa tìm được. **Thời gian:** `O(log n)`.

### Ternary Search (tìm kiếm tam phân)

Chia không gian thành ba phần thay vì hai. Thường dùng để tìm cực trị của **hàm đơn thức (unimodal function)** hơn là tìm phần tử trong mảng. **Thời gian:** `O(log n)`.

## Ví dụ

**Tìm kiếm tuyến tính**

```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:    # gặp mục tiêu
            return i
    return -1                   # không tìm thấy
```

**Tìm kiếm nhị phân (bản lặp)**

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2    # tránh tràn số so với (left+right)//2
        if arr[mid] == target:
            return mid                       # tìm thấy
        elif arr[mid] < target:
            left = mid + 1                   # mục tiêu ở nửa phải
        else:
            right = mid - 1                  # mục tiêu ở nửa trái
    return -1

print(binary_search([1, 3, 5, 7, 9, 11], 7))   # 3
```

**Tìm biên trái — chỉ số nhỏ nhất thỏa điều kiện (lower bound)**

```python
def lower_bound(arr, target):
    # vị trí đầu tiên có arr[i] >= target (chèn giữ thứ tự)
    left, right = 0, len(arr)   # right = len(arr): khoảng nửa mở [left, right)
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid          # giữ lại mid vì có thể là đáp án
    return left

print(lower_bound([1, 2, 2, 2, 5], 2))   # 1
```

**Exponential Search**

```python
def exponential_search(arr, target):
    if arr[0] == target:
        return 0
    i = 1
    while i < len(arr) and arr[i] <= target:
        i *= 2                  # nhân đôi tầm nhảy cho tới khi vượt mục tiêu
    # nhị phân trong khoảng [i//2, min(i, n-1)]
    lo, hi = i // 2, min(i, len(arr) - 1)
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

## Độ phức tạp

| Thuật toán | Thời gian | Yêu cầu | Bộ nhớ |
|-----------|-----------|---------|--------|
| Tuyến tính | O(n) | Không | O(1) |
| Nhị phân | O(log n) | Đã sắp | O(1) |
| Jump | O(√n) | Đã sắp | O(1) |
| Interpolation | O(log log n) ~ O(n) | Đã sắp, phân bố đều | O(1) |
| Exponential | O(log n) | Đã sắp | O(1) |
| Ternary | O(log n) | Đã sắp / hàm đơn thức | O(1) |

## Ưu / nhược điểm

- **Ưu:**
    - **Tuyến tính:** đơn giản, không cần sắp xếp trước.
    - **Nhị phân:** cực nhanh `O(log n)`, dễ mở rộng sang tìm biên và "nhị phân trên đáp án".
    - **Exponential/Jump:** hữu ích khi kích thước không biết trước hoặc muốn giảm số lần so sánh.
- **Nhược:**
    - Mọi thuật toán logarit đều **đòi hỏi dữ liệu đã sắp** — chi phí sắp là `O(n log n)`.
    - **Interpolation** dễ suy biến về `O(n)` nếu dữ liệu phân bố lệch.
    - Nhị phân dễ mắc lỗi off-by-one (điều kiện `<=` vs `<`, cập nhật `mid ± 1`).

## Câu hỏi phỏng vấn thường gặp

1. Viết tìm kiếm nhị phân và giải thích vì sao dùng `left + (right - left) // 2`.
2. Tìm phần tử đầu tiên / cuối cùng bằng mục tiêu trong mảng có phần tử lặp (lower/upper bound).
3. "Nhị phân trên đáp án" là gì? Cho ví dụ (ví dụ tìm tốc độ ăn chuối tối thiểu).
4. Tìm kiếm trong mảng đã sắp bị xoay vòng (rotated sorted array).
5. Khi nào interpolation search tốt hơn binary search và khi nào tệ hơn?

## Tham khảo

- [Binary Search — GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/)
- [LeetCode 704 — Binary Search](https://leetcode.com/problems/binary-search/)
