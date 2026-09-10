# Thu gom rác (Garbage Collection)

## Khái niệm

Thu gom rác (garbage collection — GC) là cơ chế tự động thu hồi vùng nhớ mà chương
trình không còn dùng tới, giải phóng lập trình viên khỏi việc giải phóng thủ công.
Bộ thu gom rác xác định đối tượng nào không còn "sống" (không thể truy cập được nữa)
rồi trả bộ nhớ đó về cho hệ thống.

## Khi nào dùng / Vì sao quan trọng

GC là mặc định trong Java, C#, Python, JavaScript, Go. Hiểu nó giúp bạn viết code
tránh giữ tham chiếu thừa, giải thích được các đợt "khựng" (GC pause) và tối ưu hiệu
năng — câu hỏi thường gặp cho vị trí backend/hệ thống.

## Cách hoạt động

### Đếm tham chiếu (Reference Counting)

Mỗi đối tượng giữ một bộ đếm số tham chiếu trỏ tới nó. Khi bộ đếm về 0, giải phóng
ngay lập tức.

- **Ưu:** Thu hồi tức thì, dễ đoán, phân tán chi phí (không có pause lớn).
- **Nhược:** Không xử lý được **tham chiếu vòng (cycle)** — A trỏ B, B trỏ A nhưng
  cả hai không ai dùng; cập nhật bộ đếm tốn chi phí và không thân thiện với đa luồng.
  CPython dùng cách này kèm một bộ dò chu trình bổ sung.

### Truy vết (Tracing GC)

Bắt đầu từ tập "gốc" (roots — biến toàn cục, ngăn xếp), lần theo tham chiếu để đánh
dấu mọi đối tượng còn tiếp cận được; phần còn lại là rác.

- **Mark-and-Sweep (đánh dấu và quét):** Pha *mark* đánh dấu đối tượng sống; pha
  *sweep* quét thu hồi đối tượng không đánh dấu. Xử lý được cycle nhưng có thể gây
  khựng và phân mảnh.
- **Mark-Compact:** Sau khi đánh dấu, dồn các đối tượng sống lại để chống phân mảnh.
- **Copying:** Chia heap hai nửa, chép đối tượng sống sang nửa kia (nhanh nhưng phí
  một nửa bộ nhớ).

### GC theo thế hệ (Generational GC)

Dựa trên giả thuyết "hầu hết đối tượng chết trẻ" (weak generational hypothesis): chia
heap thành thế hệ trẻ (young) và già (old). Thu gom thế hệ trẻ thường xuyên và nhanh;
đối tượng sống sót được "thăng cấp" (promote) lên thế hệ già, ít bị quét hơn. Giảm
đáng kể tổng chi phí GC (Java HotSpot, .NET, CPython đều dùng).

## Ví dụ đa ngôn ngữ

=== "Python"

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

=== "JavaScript"

    ```js
    // V8 (Node/trình duyệt) dùng tracing GC theo thế hệ.
    // Không có API 'free'; chỉ cần bỏ mọi tham chiếu là đủ.
    let cache = { du_lieu: new Array(1e6).fill(0) };
    cache = null;   // mất tham chiếu -> đủ điều kiện bị thu hồi

    // WeakMap/WeakRef không giữ đối tượng sống -> tránh rò rỉ do cache
    const wm = new WeakMap();
    let khoa = {};
    wm.set(khoa, "meta");
    khoa = null;    // cặp trong WeakMap tự biến mất khi GC chạy
    ```

=== "Java"

    ```java
    // JVM: tracing + generational (young: Eden+Survivor, old: Tenured)
    Object o = new Object();  // cấp phát ở Eden (young gen)
    o = null;                 // trở thành rác; Minor GC sẽ dọn young gen
    System.gc();              // GỢI Ý chạy GC (không bảo đảm), tránh dùng thật
    // Đối tượng sống qua nhiều lần Minor GC -> thăng cấp lên Old gen
    ```

## So sánh các chiến lược GC

| Chiến lược | Xử lý cycle? | Độ trễ | Phân mảnh | Ví dụ |
|------------|-------------|--------|-----------|-------|
| Reference counting | Không (cần bổ trợ) | Thấp, đều | Có thể | CPython, Swift ARC |
| Mark-and-Sweep | Có | Có pause | Có | GC cổ điển |
| Mark-Compact | Có | Có pause | Không | JVM Old gen |
| Copying | Có | Ngắn | Không | JVM Young gen |
| Generational | Có | Thấp trung bình | Ít | JVM, .NET, V8 |

## Ưu / nhược điểm

- **Ưu:** Loại bỏ nhiều lớp lỗi bộ nhớ (leak do quên free, dangling pointer,
  double-free); tăng năng suất.
- **Nhược:** Chi phí CPU và độ trễ khó đoán (GC pause / stop-the-world); tiêu tốn
  thêm bộ nhớ; ít kiểm soát thời điểm giải phóng — không lý tưởng cho hệ thống thời
  gian thực cứng.

## Câu hỏi phỏng vấn thường gặp

1. Reference counting và tracing GC khác nhau thế nào?
2. Vì sao đếm tham chiếu không tự xử lý được tham chiếu vòng?
3. Mark-and-sweep hoạt động ra sao?
4. Generational GC dựa trên giả thuyết nào và vì sao hiệu quả?
5. "Stop-the-world" pause là gì? Cách giảm thiểu?
6. `WeakMap`/`WeakRef` giúp tránh rò rỉ bộ nhớ thế nào?
7. Vì sao không nên gọi `System.gc()` / `gc.collect()` trong code thật?

## Sơ đồ thuật toán Mark-and-Sweep

Thuật toán đánh dấu và quét (mark-and-sweep) gồm hai pha: từ tập gốc (root) đánh dấu
mọi đối tượng còn tiếp cận được, sau đó quét và thu hồi các đối tượng chưa được đánh
dấu.

```mermaid
graph LR
    ROOT["Gốc (Root)"]
    A["Đối tượng A<br/>(đánh dấu)"]
    B["Đối tượng B<br/>(đánh dấu)"]
    C["Đối tượng C<br/>(rác - thu hồi)"]
    D["Đối tượng D<br/>(rác - thu hồi)"]
    ROOT -->|"tiếp cận"| A
    A -->|"tiếp cận"| B
    C -.->|"không ai trỏ tới"| D
```

- **Pha Mark:** duyệt từ root, đánh dấu mọi đối tượng còn tham chiếu (A, B).
- **Pha Sweep:** quét toàn bộ heap, giải phóng các đối tượng không được đánh dấu (C, D).

## Tham khảo

- *The Garbage Collection Handbook* (Jones et al.)
- Tài liệu module `gc` của Python; tài liệu GC của JVM
