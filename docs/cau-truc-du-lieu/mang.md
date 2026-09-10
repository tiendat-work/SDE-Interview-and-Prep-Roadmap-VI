# Mảng (Array)

## Khái niệm

Mảng (array) là một cấu trúc dữ liệu lưu trữ một tập hợp các phần tử — thường cùng kiểu dữ liệu — trong một khối bộ nhớ liền kề (contiguous memory). Mỗi phần tử được truy cập thông qua chỉ số (index), thường bắt đầu từ 0. Nhờ bố trí liền kề trong bộ nhớ, mảng cho phép truy cập trực tiếp tới bất kỳ phần tử nào trong thời gian hằng số.

## Khi nào dùng / Vì sao quan trọng

Mảng là cấu trúc dữ liệu nền tảng, xuất hiện trong hầu hết mọi chương trình và là "viên gạch" để xây dựng các cấu trúc phức tạp hơn (ngăn xếp, hàng đợi, heap, bảng băm...). Hãy dùng mảng khi:

- Bạn cần **truy cập ngẫu nhiên (random access)** nhanh tới phần tử theo chỉ số.
- Số lượng phần tử tương đối ổn định, hoặc bạn chấp nhận chi phí mở rộng khi dùng mảng động.
- Bạn muốn tận dụng tính cục bộ bộ nhớ (cache locality) để đạt hiệu năng cao.

Mảng kém phù hợp khi cần chèn/xóa liên tục ở giữa tập dữ liệu lớn, vì thao tác này đòi hỏi dịch chuyển nhiều phần tử.

## Cách hoạt động

### Tính chất của mảng

- **Kích thước cố định (fixed size):** Mảng truyền thống có kích thước xác định lúc khởi tạo và không thể thay đổi.
- **Tính đồng nhất (homogeneity):** Trong một số ngôn ngữ (như Java), mọi phần tử phải cùng kiểu; ở ngôn ngữ khác (như Python), danh sách có thể chứa nhiều kiểu khác nhau.
- **Truy cập ngẫu nhiên (random access):** Truy cập phần tử theo chỉ số mất thời gian hằng số O(1).
- **Cấp phát bộ nhớ liền kề (contiguous memory allocation):** Các phần tử nằm sát nhau trong bộ nhớ, giúp truy cập nhanh nhưng có thể gặp khó khăn khi không có đủ khối bộ nhớ liên tục.

### Cách lưu trữ trong bộ nhớ

Mảng được lưu trong các ô nhớ liền kề: mỗi phần tử nằm ngay sau phần tử trước. Địa chỉ của phần tử thứ `i` được tính trực tiếp từ địa chỉ gốc cộng với `i × kích_thước_phần_tử`, nhờ đó truy cập theo chỉ số rất nhanh.

### Phân loại mảng

1. **Mảng tĩnh (static array):** Kích thước cố định, xác định lúc biên dịch hoặc khai báo. Ví dụ `int arr[10];` trong C.
2. **Mảng động (dynamic array):** Có thể tăng/giảm kích thước lúc chạy, thường được cài đặt bằng một cấu trúc tự động thay đổi kích thước như `list` của Python hay `Array` của JavaScript.

### Các thao tác cơ bản

- **Duyệt (traversal):** Lần lượt truy cập từng phần tử.
- **Chèn (insertion):** Thêm phần tử vào một vị trí — có thể tốn kém nếu phải dịch chuyển các phần tử phía sau.
- **Xóa (deletion):** Loại bỏ phần tử tại một vị trí — cũng có thể tốn kém do dịch chuyển.
- **Tìm kiếm (searching):** Tìm tuyến tính O(n), hoặc tìm nhị phân O(log n) nếu mảng đã sắp xếp.
- **Sắp xếp (sorting):** Sắp thứ tự các phần tử bằng nhiều thuật toán với độ phức tạp khác nhau.

## Ví dụ

### Mảng trong Python

Python không có kiểu mảng dựng sẵn theo nghĩa cổ điển, nhưng `list` được dùng thay thế.

```python
# Tạo danh sách
arr = [1, 2, 3, 4, 5]

# Truy cập phần tử
print(arr[0])   # Kết quả: 1
print(arr[-1])  # Kết quả: 5 (chỉ số âm đếm từ cuối)

# Sửa phần tử
arr[0] = 10
print(arr)  # Kết quả: [10, 2, 3, 4, 5]

# Thêm phần tử
arr.append(6)     # Thêm vào cuối
arr.insert(0, 0)  # Thêm vào đầu

# Xóa phần tử
arr.pop()   # Xóa phần tử cuối
arr.pop(0)  # Xóa phần tử đầu

# Cắt lát (slicing)
sliced_arr = arr[1:3]  # Trả về [2, 3]

# Duyệt kèm chỉ số
for index, element in enumerate(arr):
    print(index, element)
```

### Mảng trong JavaScript

```javascript
// Tạo mảng bằng cú pháp literal
let arr = [1, 2, 3, 4, 5];

// Thêm / xóa phần tử
arr.push(6);      // Thêm vào cuối
arr.unshift(0);   // Thêm vào đầu
arr.pop();        // Xóa ở cuối
arr.shift();      // Xóa ở đầu

// Cắt lát và biến đổi
let slicedArr = arr.slice(1, 3);           // Trả về [2, 3]
let doubled = arr.map(x => x * 2);         // Nhân đôi mỗi phần tử
let filtered = arr.filter(x => x > 2);     // Lọc phần tử > 2
let sum = arr.reduce((acc, v) => acc + v, 0); // Tính tổng
```

### Mảng nhiều chiều (multidimensional array)

Mảng nhiều chiều là mảng của các mảng, dùng để biểu diễn ma trận hoặc dữ liệu nhiều chiều.

```python
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(matrix[1][1])  # Kết quả: 5
```

### Một số thuật toán thường gặp trên mảng

```python
# Tìm kiếm nhị phân (binary search) trên mảng đã sắp xếp — O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1  # Không tìm thấy


# Thuật toán bỏ phiếu Boyer-Moore: tìm phần tử đa số (> n/2 lần)
def find_majority_element(arr):
    count, candidate = 0, None
    for num in arr:
        if count == 0:
            candidate = num
        count += 1 if num == candidate else -1
    return candidate if arr.count(candidate) > len(arr) // 2 else None
```

## Độ phức tạp

| Thao tác | Thời gian | Ghi chú |
|----------|-----------|---------|
| Truy cập theo chỉ số | O(1) | Nhờ bộ nhớ liền kề |
| Tìm kiếm tuyến tính | O(n) | Mảng chưa sắp xếp |
| Tìm kiếm nhị phân | O(log n) | Yêu cầu mảng đã sắp xếp |
| Chèn/xóa ở cuối | O(1)* | Trung bình, với mảng động |
| Chèn/xóa ở đầu hoặc giữa | O(n) | Phải dịch chuyển phần tử |
| Sắp xếp | O(n log n) | Với thuật toán tốt (merge/quick/heap sort) |

*Chèn ở cuối mảng động là O(1) khấu hao (amortized); khi cần cấp phát lại bộ nhớ, chi phí tức thời có thể là O(n).

Về bộ nhớ, mảng dùng O(n) để lưu n phần tử. Vì cần khối liền kề nên có thể gặp vấn đề phân mảnh (fragmentation) trong các chương trình chạy lâu, cấp phát/giải phóng thường xuyên.

## Ưu / nhược điểm

- **Ưu:**
  - Truy cập phần tử theo chỉ số cực nhanh — O(1).
  - Tiết kiệm bộ nhớ và tận dụng tốt cache nhờ lưu trữ liền kề.
  - Cấu trúc đơn giản, dễ hiểu, là nền tảng cho nhiều cấu trúc khác.
- **Nhược:**
  - Mảng tĩnh có kích thước cố định; thay đổi kích thước tốn chi phí.
  - Chèn/xóa ở đầu hoặc giữa tốn O(n) do phải dịch chuyển phần tử.
  - Có thể lãng phí bộ nhớ nếu cấp phát dư, và cần khối bộ nhớ liền kề đủ lớn.

## Câu hỏi phỏng vấn thường gặp

1. **Mảng là gì và vì sao truy cập theo chỉ số là O(1)?** Vì phần tử nằm liền kề trong bộ nhớ, địa chỉ tính trực tiếp từ chỉ số nên không cần duyệt.
2. **Phân biệt mảng tĩnh và mảng động (dynamic array).** Mảng tĩnh cố định kích thước lúc khai báo; mảng động tự mở rộng lúc chạy bằng cách cấp phát mảng lớn hơn rồi sao chép.
3. **Độ phức tạp khi chèn phần tử vào đầu mảng là bao nhiêu?** O(n), vì mọi phần tử phía sau phải dịch sang phải một vị trí.
4. **So sánh mảng và danh sách liên kết (linked list).** Mảng: truy cập ngẫu nhiên O(1), bộ nhớ liền kề; danh sách liên kết: chèn/xóa O(1) tại vị trí đã biết nhưng truy cập O(n).
5. **Làm sao đảo ngược một mảng tại chỗ (in-place)?** Dùng hai con trỏ đầu–cuối, hoán đổi rồi tiến vào giữa, dùng O(1) bộ nhớ phụ.
6. **Làm sao tìm phần tử lớn thứ hai trong mảng?** Duyệt một lượt, giữ hai biến `first` và `second`, cập nhật khi gặp giá trị lớn hơn.
7. **Thuật toán nào tìm phần tử đa số (> n/2 lần) trong O(n)?** Thuật toán bỏ phiếu Boyer-Moore.
8. **Thế nào là mảng thưa (sparse array)?** Mảng mà phần lớn phần tử bằng 0 hoặc rỗng — thường lưu tối ưu để tiết kiệm bộ nhớ.
9. **Phân biệt sao chép nông (shallow copy) và sao chép sâu (deep copy).** Sao chép nông chỉ chép cấu trúc ngoài, dùng chung đối tượng lồng bên trong; sao chép sâu chép toàn bộ, độc lập hoàn toàn.
10. **Thế nào là mảng con (subarray)?** Là một đoạn liền kề của mảng, ví dụ `[2, 3, 4]` trong `[1, 2, 3, 4, 5]`.

## Tham khảo

- Nội dung được biên dịch và điều chỉnh từ tài liệu gốc `Data Structures/Arrays.md` của dự án.
