# Thu gom rác (Garbage Collection)

## Khái niệm

Thu gom rác (garbage collection — GC) là cơ chế tự động thu hồi vùng nhớ mà chương trình không còn dùng tới, giải phóng lập trình viên khỏi việc giải phóng thủ công. Bộ thu gom rác xác định đối tượng nào không còn "sống" (không thể truy cập được nữa) rồi trả bộ nhớ đó về cho hệ thống.

## Khi nào dùng / Vì sao quan trọng

GC là mặc định trong Java, C#, Python, JavaScript, Go. Hiểu nó giúp bạn viết code tránh giữ tham chiếu thừa, giải thích được các đợt "khựng" (GC pause) và tối ưu hiệu năng — câu hỏi thường gặp cho vị trí backend/hệ thống.

## Cách hoạt động

### Đếm tham chiếu (Reference Counting)

Mỗi đối tượng giữ một bộ đếm số tham chiếu trỏ tới nó. Khi bộ đếm về 0, giải phóng ngay lập tức.

- **Ưu:** Thu hồi tức thì, dễ đoán, phân tán chi phí.
- **Nhược:** Không xử lý được **tham chiếu vòng (cycle)** — A trỏ B, B trỏ A nhưng cả hai không ai dùng; cập nhật bộ đếm tốn chi phí. CPython dùng cách này kèm một bộ dò chu trình bổ sung.

### Truy vết (Tracing GC)

Bắt đầu từ tập "gốc" (roots — biến toàn cục, ngăn xếp), lần theo tham chiếu để đánh dấu mọi đối tượng còn tiếp cận được; phần còn lại là rác.

- **Mark-and-Sweep (đánh dấu và quét):** Pha *mark* đánh dấu đối tượng sống; pha *sweep* quét thu hồi đối tượng không đánh dấu. Xử lý được cycle nhưng có thể gây khựng và phân mảnh.
- **Mark-Compact:** Sau khi đánh dấu, dồn các đối tượng sống lại để chống phân mảnh.
- **Copying:** Chia heap hai nửa, chép đối tượng sống sang nửa kia.

### GC theo thế hệ (Generational GC)

Dựa trên giả thuyết "hầu hết đối tượng chết trẻ": chia heap thành thế hệ trẻ (young) và già (old). Thu gom thế hệ trẻ thường xuyên và nhanh; đối tượng sống sót được "thăng cấp" lên thế hệ già, ít bị quét hơn. Giảm đáng kể tổng chi phí GC (Java HotSpot, .NET, CPython đều dùng).

## Ví dụ

```python
import gc, sys

class Nut:
    def __init__(self): self.ke = None

a = Nut(); b = Nut()
a.ke = b; b.ke = a        # tham chiếu VÒNG: a<->b
print(sys.getrefcount(a)) # >0 do vòng, đếm tham chiếu không giải phóng được

del a; del b              # đếm tham chiếu vẫn không về 0 vì cycle
thu_hoi = gc.collect()    # bộ dò chu trình (tracing) mới dọn được
print("Đối tượng đã thu hồi:", thu_hoi)
```

## Ưu / nhược điểm

- **Ưu:** Loại bỏ nhiều lớp lỗi bộ nhớ (leak do quên free, dangling pointer, double-free); tăng năng suất.
- **Nhược:** Chi phí CPU và độ trễ khó đoán (GC pause); tiêu tốn thêm bộ nhớ; ít kiểm soát thời điểm giải phóng — không lý tưởng cho hệ thống thời gian thực cứng.

## Câu hỏi phỏng vấn thường gặp

1. Reference counting và tracing GC khác nhau thế nào?
2. Vì sao đếm tham chiếu không tự xử lý được tham chiếu vòng?
3. Mark-and-sweep hoạt động ra sao?
4. Generational GC dựa trên giả thuyết nào và vì sao hiệu quả?
5. "Stop-the-world" pause là gì? Cách giảm thiểu?

## Tham khảo

- *The Garbage Collection Handbook* (Jones et al.)
- Tài liệu module `gc` của Python; tài liệu GC của JVM
