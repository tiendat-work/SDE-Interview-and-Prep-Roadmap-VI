# Thuật toán sắp xếp (Sorting Algorithms)

## Khái niệm

Sắp xếp (sorting) là quá trình sắp đặt lại các phần tử trong một tập dữ liệu theo một thứ tự xác định — thường là tăng dần hoặc giảm dần. Đây là một trong những nhóm thuật toán nền tảng nhất: nhiều bài toán khác (tìm kiếm nhị phân, gộp khoảng, hai con trỏ...) đều dựa trên dữ liệu đã được sắp xếp.

## Khi nào dùng / Vì sao quan trọng

- **Tiền xử lý (preprocessing):** rất nhiều thuật toán chạy nhanh hơn khi dữ liệu đã sắp (ví dụ tìm kiếm nhị phân cần mảng đã sắp).
- **So sánh / khử trùng lặp:** dữ liệu đã sắp giúp dễ phát hiện phần tử trùng hoặc gần nhau.
- **Câu hỏi phỏng vấn:** hiểu rõ đánh đổi (trade-off) giữa các thuật toán sắp xếp là kiến thức bắt buộc.

## Cách hoạt động

Ta chia các thuật toán sắp xếp thành hai nhóm chính:

**Nhóm dựa trên so sánh (comparison-based)** — so sánh từng cặp phần tử. Giới hạn lý thuyết là `O(n log n)`.

**Nhóm không so sánh (non-comparison)** — dùng tính chất của khóa (giá trị số nguyên, chữ số...) để đạt tuyến tính `O(n)` trong điều kiện nhất định.

Một khái niệm quan trọng là **tính ổn định (stability)**: thuật toán ổn định giữ nguyên thứ tự tương đối của các phần tử có cùng khóa.

### Bubble Sort (sắp xếp nổi bọt)

**Ý tưởng:** duyệt qua mảng nhiều lần, đổi chỗ hai phần tử kề nhau nếu sai thứ tự; phần tử lớn dần "nổi" về cuối. **Thời gian:** `O(n²)`; **bộ nhớ:** `O(1)`; **ổn định:** có.

### Selection Sort (sắp xếp chọn)

**Ý tưởng:** mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp rồi đưa về đầu. **Thời gian:** `O(n²)` (kể cả trường hợp tốt nhất); **bộ nhớ:** `O(1)`; **ổn định:** không.

### Insertion Sort (sắp xếp chèn)

**Ý tưởng:** xây dần mảng đã sắp bằng cách lấy từng phần tử và chèn vào đúng vị trí trong phần đã sắp phía trước. **Thời gian:** `O(n²)` trung bình, `O(n)` khi mảng gần sắp; **bộ nhớ:** `O(1)`; **ổn định:** có. Rất hiệu quả với mảng nhỏ hoặc gần sắp.

### Merge Sort (sắp xếp trộn)

**Ý tưởng:** chia để trị — chia đôi mảng, sắp xếp đệ quy hai nửa, rồi trộn (merge) lại. **Thời gian:** `O(n log n)` mọi trường hợp; **bộ nhớ:** `O(n)`; **ổn định:** có.

### Quick Sort (sắp xếp nhanh)

**Ý tưởng:** chọn một phần tử chốt (pivot), phân hoạch (partition) mảng thành phần nhỏ hơn và lớn hơn chốt, rồi đệ quy hai phần. **Thời gian:** `O(n log n)` trung bình, `O(n²)` xấu nhất (chốt xấu); **bộ nhớ:** `O(log n)` cho ngăn xếp đệ quy; **ổn định:** không.

### Heap Sort (sắp xếp vun đống)

**Ý tưởng:** xây một đống cực đại (max-heap) từ mảng, liên tục lấy phần tử lớn nhất ở gốc đưa về cuối. **Thời gian:** `O(n log n)`; **bộ nhớ:** `O(1)`; **ổn định:** không.

### Counting Sort (sắp xếp đếm)

**Ý tưởng:** đếm số lần xuất hiện của mỗi khóa (số nguyên trong khoảng nhỏ) rồi dựng lại mảng. **Thời gian:** `O(n + k)` với `k` là miền giá trị; **bộ nhớ:** `O(k)`; **ổn định:** có. Chỉ dùng khi miền giá trị không quá lớn.

### Radix Sort (sắp xếp cơ số)

**Ý tưởng:** sắp xếp số theo từng chữ số (từ hàng đơn vị lên), mỗi lượt dùng counting sort ổn định. **Thời gian:** `O(d·(n + k))` với `d` là số chữ số; **bộ nhớ:** `O(n + k)`; **ổn định:** có.

## Ví dụ

**Merge Sort — sắp xếp trộn**

```python
def merge_sort(arr):
    if len(arr) <= 1:           # mảng 0 hoặc 1 phần tử đã sắp sẵn
        return arr
    mid = len(arr) // 2         # chia đôi mảng
    left = merge_sort(arr[:mid])    # sắp xếp đệ quy nửa trái
    right = merge_sort(arr[mid:])   # sắp xếp đệ quy nửa phải
    return merge(left, right)   # trộn hai nửa đã sắp

def merge(left, right):
    result = []
    i = j = 0
    # so sánh song song, luôn lấy phần tử nhỏ hơn
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:     # dùng <= để giữ tính ổn định
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])     # chép nốt phần còn lại
    result.extend(right[j:])
    return result

print(merge_sort([5, 2, 8, 1, 9, 3]))   # [1, 2, 3, 5, 8, 9]
```

**Quick Sort — sắp xếp nhanh (phân hoạch tại chỗ, kiểu Lomuto)**

```python
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)   # p là vị trí đúng của chốt
        quick_sort(arr, low, p - 1)     # đệ quy phần bên trái chốt
        quick_sort(arr, p + 1, high)    # đệ quy phần bên phải chốt
    return arr

def partition(arr, low, high):
    pivot = arr[high]       # chọn phần tử cuối làm chốt
    i = low - 1             # ranh giới các phần tử nhỏ hơn chốt
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]   # đưa phần tử nhỏ về trái
    arr[i + 1], arr[high] = arr[high], arr[i + 1]   # đặt chốt vào đúng vị trí
    return i + 1

print(quick_sort([5, 2, 8, 1, 9, 3]))   # [1, 2, 3, 5, 8, 9]
```

## Độ phức tạp

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định |
|-----------|----------|-----------|----------|--------|---------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Có |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | Không |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Có |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Có |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | Không |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | Không |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | Có |
| Radix | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n + k) | Có |

## Ưu / nhược điểm

- **Ưu:**
    - **Merge sort:** ổn định, luôn `O(n log n)`, phù hợp sắp xếp ngoài (external sort).
    - **Quick sort:** nhanh trên thực tế, sắp xếp tại chỗ, thân thiện với bộ nhớ đệm (cache).
    - **Counting/Radix:** vượt giới hạn `O(n log n)` khi khóa là số nguyên miền hẹp.
- **Nhược:**
    - **Bubble/Selection/Insertion:** chậm `O(n²)`, chỉ hợp dữ liệu nhỏ.
    - **Merge sort:** tốn thêm `O(n)` bộ nhớ.
    - **Quick sort:** xấu nhất `O(n²)` nếu chọn chốt kém (khắc phục bằng chốt ngẫu nhiên hoặc trung vị của ba).

## Câu hỏi phỏng vấn thường gặp

1. Vì sao merge sort ổn định còn quick sort thì không?
2. Khi nào quick sort rơi vào `O(n²)` và làm sao tránh?
3. Counting sort và radix sort đạt tuyến tính bằng cách nào, và giới hạn của chúng là gì?
4. Python dùng thuật toán sắp xếp nào cho `sorted()`? (Timsort — lai giữa merge và insertion sort.)
5. Giải thích sự khác nhau giữa sắp xếp trong bộ nhớ (in-memory) và sắp xếp ngoài (external).

## Tham khảo

- [Sorting Algorithms — GeeksforGeeks](https://www.geeksforgeeks.org/sorting-algorithms/)
- [Timsort — Wikipedia](https://en.wikipedia.org/wiki/Timsort)
