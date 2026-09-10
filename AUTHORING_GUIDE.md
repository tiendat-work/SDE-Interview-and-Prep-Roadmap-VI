# Hướng dẫn biên soạn trang (dành cho người viết nội dung)

Mục tiêu: mỗi trang phải GIÀU MINH HOẠ, không chỉ toàn chữ. Kết hợp: giải thích →
sơ đồ → code (nhiều ngôn ngữ) → demo chạy được → bảng đánh đổi → câu hỏi phỏng vấn.

## 0. NGUYÊN TẮC QUAN TRỌNG NHẤT: luôn giải thích "TẠI SAO"

Người đọc phàn nàn rằng các trang chỉ NÊU kết luận mà không giải thích. Cấm viết
kiểu liệt kê khô khan. Với MỌI khẳng định, con số, dòng bảng, hay độ phức tạp, phải
trả lời được câu "tại sao lại thế?".

Ví dụ SAI (chỉ nêu): "Truy cập theo chỉ số: O(1) nhờ bộ nhớ liền kề."
Ví dụ ĐÚNG (giải thích cơ chế): "Truy cập theo chỉ số là O(1) vì mảng nằm liền kề
trong bộ nhớ, mỗi phần tử cùng kích thước, nên CPU tính THẲNG địa chỉ bằng công
thức `địa_chỉ_gốc + i × kích_thước` — một phép nhân cộng, không cần dò tìm; dù mảng
1000 hay 1 triệu phần tử cũng cùng số bước." (kèm sơ đồ ô nhớ + địa chỉ).

Quy tắc cụ thể:
- Sau mỗi bảng độ phức tạp: thêm mục "Vì sao có các con số này?" giải thích TỪNG dòng
  quan trọng (vì sao O(1)/O(n)/O(log n)/O(n log n)... — do cơ chế nào).
- Mỗi thuật toán/khái niệm: nêu TRỰC GIÁC (ý tưởng vì sao nó hoạt động) trước khi vào
  chi tiết, và giải thích vì sao nó nhanh/chậm/ổn định/không.
- Với đánh đổi (trade-off): nói RÕ đánh đổi cái gì lấy cái gì và vì sao buộc phải đổi.
- Dùng admonition để làm nổi phần giải thích sâu:
  `!!! question "Tại sao?"` hoặc `!!! info "Giải thích"`.
- Ưu tiên phép loại suy đời thực (analogy) khi khái niệm trừu tượng.
- Viết như đang giảng cho người mới: giả định họ chưa biết, dẫn dắt từng bước.

## 1. Sơ đồ Mermaid
Dùng fence ```mermaid. Nhãn có dấu tiếng Việt/ký tự đặc biệt PHẢI bọc ngoặc kép:
`A["Máy khách"] -->|"HTTP"| B["Máy chủ"]`.
Lưu ý: trong `sequenceDiagram`, KHÔNG bọc ngoặc kép cho participant/message
(sẽ hiện dấu " thừa) — ví dụ `C->>S: SYN` chứ không phải `C->>S: "SYN"`.

## 2. Code nhiều ngôn ngữ (dùng tab)
Dùng pymdownx.tabbed để cho cả Python và JavaScript:

    === "JavaScript"
        ```js
        function demo() { /* ... */ }
        ```
    === "Python"
        ```python
        def demo(): ...
        ```

## 3. Playground JavaScript CHẠY ĐƯỢC (bắt buộc có ít nhất 1 nếu trang có thuật toán)
Đặt khối HTML này (KHÔNG thụt lề, để nguyên mức 0):

    <div class="js-demo" data-title="Tiêu đề demo">
    <textarea class="js-demo-src">
    // Viết JS ở đây. print(...) hoặc console.log(...) in ra khung kết quả.
    print('Kết quả:', 1 + 1);
    </textarea>
    </div>

Nếu muốn VẼ (hoạt hình/hình hoạ), thêm data-canvas="1" — trong code có sẵn biến
`canvas` và `ctx` (Canvas 2D):

    <div class="js-demo" data-title="Vẽ" data-canvas="1">
    <textarea class="js-demo-src">
    ctx.fillStyle = '#4db6ac';
    for (let i = 0; i < 10; i++) ctx.fillRect(i*40, 200 - i*15, 30, i*15);
    print('Đã vẽ xong');
    </textarea>
    </div>

Quy tắc playground:
- Code phải tự chạy ra kết quả có nghĩa (in bước chạy, hoặc vẽ hình).
- KHÔNG dùng import/require/fetch/DOM ngoài — chỉ JS thuần + canvas/ctx/print.
- Nhãn tiếng Việt trong chuỗi thoải mái; giữ tên biến/hàm bằng tiếng Anh.

## 4. Bảng đánh đổi & độ phức tạp
Luôn có bảng khi so sánh nhiều phương án/thuật toán (thời gian, bộ nhớ, ổn định...).

## 5. Độ dài & chiều sâu
Trang phải ĐẦY ĐỦ, không liệt kê hời hợt. Nếu chủ đề có nhiều mục con (ví dụ 23 mẫu
thiết kế, các thuật toán sắp xếp...) phải trình bày HẾT, mỗi mục: ý tưởng, khi nào
dùng, ví dụ code, (nếu hợp) sơ đồ. Ưu tiên ví dụ thực tế thay vì định nghĩa khô khan.

## 6. Ngôn ngữ
100% tiếng Việt. Thuật ngữ kỹ thuật kèm tiếng Anh trong ngoặc ở lần đầu. Code, tên
biến, từ khoá giữ tiếng Anh; chú thích trong code bằng tiếng Việt.

## 7. Kiểm tra bắt buộc trước khi báo xong
    cd /Users/lycan/Projects/SDE-Interview-and-Prep-Roadmap
    source .venv/bin/activate
    mkdocs build 2>&1 | grep -iE 'error'   # không được có ERROR
Sửa cú pháp Mermaid/tab tới khi build sạch.
