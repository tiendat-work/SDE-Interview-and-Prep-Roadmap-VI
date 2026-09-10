# Gỡ lỗi (Debugging)

## Khái niệm

Gỡ lỗi (debugging) là quá trình **tìm, hiểu và sửa** lỗi (bug) trong chương trình. Lỗi có thể là lỗi cú pháp (syntax error), lỗi lúc chạy (runtime error) hoặc lỗi logic (logic error) — chương trình chạy nhưng cho kết quả sai. Gỡ lỗi tốt là kỹ năng phân biệt kỹ sư giỏi, và trong phỏng vấn nó cho thấy khả năng lập luận có hệ thống của bạn.

## Khi nào dùng / Vì sao quan trọng

- Code hiếm khi đúng ngay lần đầu; kỹ năng sửa lỗi nhanh giúp tiết kiệm thời gian.
- Trong phỏng vấn, khi code chạy sai, cách bạn **bình tĩnh cô lập nguyên nhân** quan trọng hơn việc lỗi xảy ra.
- Gỡ lỗi có hệ thống tránh việc sửa mò làm phát sinh lỗi mới.

## Cách hoạt động

Quy trình gỡ lỗi có hệ thống:

1. **Tái hiện lỗi (reproduce):** tìm đầu vào nhỏ nhất làm lỗi xuất hiện ổn định.
2. **Quan sát & đặt giả thuyết:** đọc thông báo lỗi (error message) và **truy vết ngăn xếp (stack trace)** để biết lỗi ở đâu.
3. **Cô lập (isolate):** thu hẹp phạm vi nghi ngờ bằng cách chia đôi — kiểm tra giá trị ở nửa chương trình, xác định lỗi nằm ở nửa nào (tương tự tìm kiếm nhị phân).
4. **Sửa & xác minh:** sửa nguyên nhân gốc (root cause), không chỉ triệu chứng; chạy lại test để chắc chắn.

**Các kỹ thuật phổ biến**

**Print debugging** — chèn lệnh in giá trị biến tại các điểm mấu chốt. Đơn giản, không cần công cụ, phù hợp bài nhỏ và môi trường hạn chế. Nhược: lộn xộn, phải xoá lại, không xem được trạng thái đầy đủ.

**Trình gỡ lỗi (debugger)** — công cụ như `pdb` (Python), trình debug của IDE cho phép:
- Đặt **điểm dừng (breakpoint)** để ngừng thực thi tại dòng chỉ định.
- **Chạy từng bước (step over/into)** để theo dõi luồng.
- **Kiểm tra biến (inspect variables)** tại thời điểm dừng.
Mạnh hơn print debugging cho lỗi phức tạp.

**Vịt cao su (rubber duck debugging)** — giải thích code **từng dòng, thành lời** cho một "con vịt cao su" (hoặc bất cứ ai/vật gì). Việc diễn đạt lớn tiếng thường làm lộ ra giả định sai. Rất hiệu quả và gần như miễn phí.

**Chiến lược cô lập lỗi (fault isolation)**
- **Chia để trị:** tạm bỏ hoặc chú thích (comment out) từng phần để khoanh vùng.
- **Đối chiếu phiên bản:** dùng `git bisect` tìm commit gây lỗi (xem [Git](../quan-ly-phien-ban/git.md)).
- **Ca kiểm thử tối giản (minimal test case):** rút đề về ví dụ nhỏ nhất còn tái hiện lỗi.
- **Kiểm tra biên:** phần lớn lỗi nằm ở off-by-one, mảng rỗng, null, tràn số.
- **Ghi nhật ký (logging):** với hệ thống lớn hoặc lỗi khó tái hiện, ghi lại trạng thái theo thời gian giúp truy vết sau này.
- **Bất biến (invariants) & assertion:** thêm `assert` để phát hiện sớm khi một giả định bị vi phạm, thay vì để lỗi lan xa khỏi nguyên nhân gốc.

## Ví dụ

```python
# Lỗi logic: hàm trả về sai vì điều kiện dừng sai
def sum_to(n):
    total = 0
    for i in range(n):     # BUG: range(n) chạy 0..n-1, thiếu n
        total += i
    return total

# Print debugging để soi
def sum_to_debug(n):
    total = 0
    for i in range(n):
        total += i
        print(f"i={i}, total={total}")   # in trạng thái từng vòng
    return total
# sum_to(5) -> 10 (mong đợi 15) => nhận ra thiếu phần tử n
```

```python
# Dùng debugger pdb
import pdb

def buggy(nums):
    result = []
    for x in nums:
        pdb.set_trace()     # dừng tại đây, gõ: p x, n (next), c (continue)
        result.append(x * 2)
    return result
```

## Ưu / nhược điểm

- **Ưu:** quy trình có hệ thống giúp tìm lỗi nhanh, tránh đoán mò; nhiều công cụ hỗ trợ ở mọi cấp độ.
- **Nhược:** print debugging dễ làm rối code; debugger có đường học ban đầu; lỗi khó tái hiện (heisenbug, race condition) vẫn rất mất công.

## Câu hỏi phỏng vấn thường gặp

1. Khi code chạy sai kết quả, bạn làm gì đầu tiên?
2. So sánh print debugging và dùng debugger — khi nào chọn cái nào?
3. Rubber duck debugging là gì và vì sao nó hiệu quả?
4. Làm sao cô lập một lỗi chỉ xuất hiện với dữ liệu lớn?

## Tham khảo

- [Thực hành tốt khi viết code](best-practices.md)
- [Git](../quan-ly-phien-ban/git.md)
- Tài liệu `pdb` — The Python Debugger
