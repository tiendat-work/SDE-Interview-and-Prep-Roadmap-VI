# Hướng dẫn biên soạn trang (dành cho người viết nội dung)

Mục tiêu: mỗi trang phải GIÀU MINH HOẠ, không chỉ toàn chữ. Kết hợp: giải thích →
sơ đồ → code (nhiều ngôn ngữ) → demo chạy được → bảng đánh đổi → câu hỏi phỏng vấn.

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
