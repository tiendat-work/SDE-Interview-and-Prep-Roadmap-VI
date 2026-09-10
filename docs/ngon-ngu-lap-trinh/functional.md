# Lập trình hàm (Functional Programming)

## Khái niệm

Lập trình hàm (functional programming) là mô hình xây dựng chương trình bằng cách kết hợp các hàm và tránh trạng thái biến đổi (mutable state) cùng dữ liệu chia sẻ. Hàm được xem như "công dân hạng nhất" (first-class citizen): có thể gán vào biến, truyền làm tham số và trả về từ hàm khác. Lý tưởng là mỗi hàm chỉ biến đầu vào thành đầu ra, không gây tác dụng phụ (side effect).

## Khi nào dùng / Vì sao quan trọng

Hợp với xử lý dữ liệu dạng luồng (map/filter/reduce), tính toán song song (không trạng thái chia sẻ nên ít race condition) và code dễ kiểm thử. Nhiều ngôn ngữ chủ đạo (Python, JavaScript, Java) đã hấp thu các ý tưởng này.

## Cách hoạt động

### Các khái niệm cốt lõi

- **Hàm thuần khiết (pure function):** Cùng đầu vào luôn cho cùng đầu ra và không gây tác dụng phụ. Dễ hiểu, dễ test, dễ cache.
- **Tính trong suốt tham chiếu (referential transparency):** Một biểu thức có thể được thay bằng giá trị của nó mà không đổi ý nghĩa chương trình — hệ quả của hàm thuần khiết.
- **Hàm bậc cao (higher-order function):** Hàm nhận hàm khác làm tham số hoặc trả về hàm (ví dụ `map`, `filter`, `sorted(key=...)`).
- **Hàm ẩn danh (lambda):** Hàm ngắn không tên, dùng ngay tại chỗ.
- **Bao đóng (closure):** Hàm "ghi nhớ" và truy cập được các biến ở phạm vi nơi nó được định nghĩa, ngay cả sau khi phạm vi đó kết thúc.
- **Tính bất biến (immutability):** Dữ liệu không đổi sau khi tạo; thay vì sửa, ta tạo bản mới.

## Ví dụ

```python
# Hàm thuần khiết: không tác dụng phụ, cùng input -> cùng output
def binh_phuong(x):
    return x * x

# Hàm bậc cao + lambda
so = [1, 2, 3, 4]
chan_binh_phuong = list(map(lambda x: x * x,
                            filter(lambda x: x % 2 == 0, so)))
print(chan_binh_phuong)  # [4, 16]

# Bao đóng (closure): 'he_so' được nhớ trong hàm trả về
def tao_nhan(he_so):
    def nhan(x):
        return x * he_so   # dùng biến từ phạm vi ngoài
    return nhan

gap_doi = tao_nhan(2)
gap_ba = tao_nhan(3)
print(gap_doi(10), gap_ba(10))  # 20 30
```

```python
from functools import reduce
# reduce gộp danh sách thành một giá trị bằng hàm hai ngôi
tong = reduce(lambda acc, x: acc + x, [1, 2, 3, 4], 0)
print(tong)  # 10
```

## Ưu / nhược điểm

- **Ưu:** Dễ suy luận và kiểm thử (không trạng thái ẩn); an toàn hơn khi song song; code cô đọng, tái sử dụng cao.
- **Nhược:** Có thể khó với người quen tư duy mệnh lệnh; tạo nhiều bản sao dữ liệu bất biến có thể tốn bộ nhớ; đệ quy thay vòng lặp có thể kém hiệu quả nếu không tối ưu tail-call.

## Câu hỏi phỏng vấn thường gặp

1. Hàm thuần khiết là gì? Vì sao nó dễ test?
2. Giải thích closure và cho một ví dụ dùng thực tế.
3. Higher-order function là gì? Kể tên vài hàm bậc cao phổ biến.
4. Referential transparency mang lại lợi ích gì?
5. Vì sao immutability giúp lập trình đồng thời an toàn hơn?

## Tham khảo

- *Structure and Interpretation of Computer Programs* (SICP)
- Tài liệu `functools`, `itertools` của Python
