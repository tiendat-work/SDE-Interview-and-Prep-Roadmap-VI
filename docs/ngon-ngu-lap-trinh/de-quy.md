# Đệ quy (Recursion)

## Khái niệm

Đệ quy (recursion) là kỹ thuật trong đó một hàm tự gọi lại chính nó để giải quyết bài toán bằng cách chia nhỏ thành các bài toán con cùng dạng. Mỗi lời gọi đệ quy phải tiến gần hơn tới **trường hợp cơ sở (base case)** — điều kiện dừng — nếu không sẽ đệ quy vô hạn và tràn ngăn xếp (stack overflow).

## Khi nào dùng / Vì sao quan trọng

Đệ quy diễn đạt tự nhiên các bài toán có cấu trúc tự tương tự: duyệt cây, đồ thị, chia để trị (quicksort, merge sort), quay lui (backtracking). Nó là công cụ tư duy nền tảng và xuất hiện dày đặc trong phỏng vấn thuật toán.

## Cách hoạt động

Mỗi lời gọi hàm tạo một khung ngăn xếp (stack frame) lưu tham số và biến cục bộ. Các khung xếp chồng cho tới base case, sau đó "cởi" ra (unwind) lần lượt để trả kết quả. Một hàm đệ quy đúng cần: (1) base case, (2) bước đệ quy tiến về base case.

### Đệ quy đuôi (Tail recursion)

Lời gọi đệ quy là thao tác **cuối cùng** của hàm, không còn phép tính nào sau nó. Một số ngôn ngữ/trình biên dịch tối ưu (tail-call optimization) để tái sử dụng khung ngăn xếp, biến đệ quy thành vòng lặp, tránh tràn ngăn xếp. **CPython không tối ưu tail-call.**

### Đệ quy tương hỗ (Mutual recursion)

Hai hay nhiều hàm gọi lẫn nhau (A gọi B, B gọi A), ví dụ kiểm tra chẵn/lẻ.

### Đệ quy vs Lặp (Iteration)

Mọi đệ quy đều có thể viết lại bằng vòng lặp (dùng ngăn xếp tường minh) và ngược lại. Đệ quy gọn, dễ đọc cho bài toán đệ quy tự nhiên; lặp thường nhanh hơn và không tốn khung ngăn xếp.

## Ví dụ

```python
# Đệ quy thường: giai thừa
def giai_thua(n):
    if n <= 1:            # base case
        return 1
    return n * giai_thua(n - 1)   # còn phép nhân sau lời gọi -> KHÔNG tail

# Đệ quy đuôi: tích lũy kết quả qua tham số, lời gọi là bước CUỐI
def giai_thua_duoi(n, acc=1):
    if n <= 1:
        return acc
    return giai_thua_duoi(n - 1, acc * n)  # tail call

print(giai_thua(5), giai_thua_duoi(5))  # 120 120
```

```python
# Đệ quy tương hỗ: chẵn/lẻ định nghĩa qua nhau
def la_chan(n): return True if n == 0 else la_le(n - 1)
def la_le(n):   return False if n == 0 else la_chan(n - 1)
print(la_chan(4), la_le(4))  # True False

# Phiên bản LẶP tương đương với giai thừa (không tốn ngăn xếp)
def giai_thua_lap(n):
    kq = 1
    for i in range(2, n + 1):
        kq *= i
    return kq
```

## Độ phức tạp (nếu có)

| Ví dụ | Thời gian | Bộ nhớ (ngăn xếp) |
|-------|-----------|-------------------|
| Giai thừa đệ quy | O(n) | O(n) |
| Giai thừa lặp | O(n) | O(1) |
| Fibonacci đệ quy ngây thơ | O(2ⁿ) | O(n) |

## Ưu / nhược điểm

- **Ưu:** Code ngắn, sát định nghĩa toán học; tự nhiên cho cây, đồ thị, chia để trị.
- **Nhược:** Tốn bộ nhớ ngăn xếp; nguy cơ stack overflow; có thể chậm và tính lặp lại (Fibonacci ngây thơ) nếu không ghi nhớ (memoization).

## Câu hỏi phỏng vấn thường gặp

1. Đệ quy cần những thành phần bắt buộc nào?
2. Tail recursion là gì? Vì sao Python không hưởng lợi từ nó?
3. Khi nào nên chọn đệ quy thay vì lặp và ngược lại?
4. Vì sao Fibonacci đệ quy ngây thơ chậm? Cách khắc phục (memoization)?
5. Điều gì gây stack overflow trong đệ quy?

## Tham khảo

- *Introduction to Algorithms* (CLRS) — chương chia để trị
- *The Little Schemer*
