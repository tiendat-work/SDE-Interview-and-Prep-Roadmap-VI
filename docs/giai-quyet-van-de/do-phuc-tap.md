# Phân tích độ phức tạp (Complexity Analysis / Big O)

## Khái niệm

Phân tích độ phức tạp là cách **ước lượng lượng tài nguyên** (thời gian chạy và bộ nhớ) mà một thuật toán tiêu tốn khi kích thước đầu vào `n` tăng lên. Ta không đo bằng giây thực tế (phụ thuộc máy, ngôn ngữ) mà mô tả **tốc độ tăng trưởng** bằng ký hiệu tiệm cận (asymptotic notation): Big O, Big Omega, Big Theta.

## Khi nào dùng / Vì sao quan trọng

- So sánh hai thuật toán một cách khách quan, không phụ thuộc phần cứng.
- Dự đoán liệu lời giải có "chạy kịp" với ràng buộc đề bài (ví dụ `n ≤ 10⁶` thì cần `O(n)` hoặc `O(n log n)`).
- Là ngôn ngữ chung bắt buộc trong mọi phỏng vấn thuật toán.

## Cách hoạt động

**Ba ký hiệu tiệm cận chính**

- **Big O — `O(f(n))`:** chặn **trên** (upper bound) — mô tả trường hợp xấu nhất (worst case). "Chạy không chậm hơn `f(n)`". Đây là ký hiệu dùng nhiều nhất.
- **Big Omega — `Ω(f(n))`:** chặn **dưới** (lower bound) — trường hợp tốt nhất. "Chạy không nhanh hơn `f(n)`".
- **Big Theta — `Θ(f(n))`:** chặn **chặt** (tight bound) — khi chặn trên và chặn dưới trùng bậc. "Tăng trưởng đúng bằng `f(n)`".

**Quy tắc rút gọn**

- Bỏ hằng số: `O(2n)` → `O(n)`; `O(n/2)` → `O(n)`.
- Giữ số hạng trội nhất: `O(n² + n)` → `O(n²)`.
- Nhân theo vòng lặp lồng nhau; cộng theo các đoạn nối tiếp.

**Phân tích thời gian (time complexity)** — đếm số phép toán cơ bản theo `n`:

- Một vòng lặp qua `n` phần tử → `O(n)`.
- Hai vòng lặp lồng nhau → `O(n²)`.
- Chia đôi mỗi bước (tìm kiếm nhị phân) → `O(log n)`.
- Chia để trị kiểu merge sort → `O(n log n)`.

**Phân tích bộ nhớ (space complexity)** — đếm bộ nhớ phụ theo `n`:

- Biến đếm, vài con trỏ → `O(1)`.
- Mảng/bảng băm phụ kích thước `n` → `O(n)`.
- Đệ quy sâu `n` tầng → `O(n)` cho ngăn xếp lời gọi (call stack).

**Các bậc tăng trưởng thường gặp (từ tốt tới xấu)**

`O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`

## Ví dụ

```python
# O(n) - một vòng lặp
def total(nums):
    s = 0
    for x in nums:        # chạy n lần
        s += x
    return s

# O(n^2) - hai vòng lồng nhau
def has_dup_pair(nums):
    for i in range(len(nums)):        # n lần
        for j in range(i + 1, len(nums)):  # tới n lần
            if nums[i] == nums[j]:
                return True
    return False

# O(log n) - chia đôi mỗi vòng
def count_halvings(n):
    steps = 0
    while n > 1:
        n //= 2           # số lần lặp ~ log2(n)
        steps += 1
    return steps
```

## Bảng độ phức tạp các thao tác phổ biến

| Cấu trúc / thao tác | Trung bình | Xấu nhất |
|---------------------|-----------|----------|
| Mảng — truy cập theo chỉ số | O(1) | O(1) |
| Mảng — tìm kiếm tuyến tính | O(n) | O(n) |
| Mảng — chèn/xoá ở giữa | O(n) | O(n) |
| Mảng động — thêm cuối (amortized) | O(1) | O(n) |
| Bảng băm — tra cứu/chèn/xoá | O(1) | O(n) |
| Danh sách liên kết — chèn/xoá đầu | O(1) | O(1) |
| Danh sách liên kết — tìm kiếm | O(n) | O(n) |
| Cây tìm kiếm nhị phân cân bằng | O(log n) | O(log n) |
| Đống nhị phân (binary heap) — push/pop | O(log n) | O(log n) |
| Tìm kiếm nhị phân (mảng đã sắp) | O(log n) | O(log n) |
| Sắp xếp nhanh (quicksort) | O(n log n) | O(n²) |
| Sắp xếp trộn (merge sort) | O(n log n) | O(n log n) |

## Ưu / nhược điểm

- **Ưu:** so sánh khách quan, độc lập phần cứng; dự đoán khả năng mở rộng (scalability).
- **Nhược:** bỏ qua hằng số và số hạng bậc thấp — với `n` nhỏ, thuật toán "bậc cao hơn" đôi khi lại nhanh hơn trong thực tế; không phản ánh yếu tố như cache, hằng số ẩn lớn.

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt Big O, Big Omega và Big Theta.
2. Vì sao thêm phần tử vào cuối mảng động là `O(1)` khấu hao (amortized) dù đôi lúc là `O(n)`?
3. Độ phức tạp bộ nhớ của một hàm đệ quy sâu `n` tầng là bao nhiêu, vì sao?
4. Quicksort trung bình `O(n log n)` nhưng xấu nhất `O(n²)` — khi nào xảy ra trường hợp xấu?

## Tham khảo

- [Kỹ thuật lập trình](ky-thuat-coding.md)
- [Tối ưu hoá](toi-uu.md)
- T. Cormen và cộng sự, *Introduction to Algorithms* (CLRS)
