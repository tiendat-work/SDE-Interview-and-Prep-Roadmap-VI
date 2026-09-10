# Hệ thống kiểu (Type Systems)

## Khái niệm

Hệ thống kiểu (type system) là tập quy tắc gán "kiểu" (type) cho các giá trị và biểu thức trong ngôn ngữ, nhằm ngăn những thao tác vô nghĩa (như cộng số với hàm). Nó quyết định lỗi kiểu được phát hiện lúc nào (biên dịch hay chạy) và chặt chẽ đến đâu.

## Khi nào dùng / Vì sao quan trọng

Hiểu hệ thống kiểu giúp bạn chọn ngôn ngữ phù hợp, viết code an toàn hơn và giải thích được sự khác biệt giữa các ngôn ngữ. Chủ đề này hay được hỏi để đánh giá chiều sâu về ngôn ngữ.

## Cách hoạt động

### Tĩnh vs Động (Static vs Dynamic)

- **Kiểu tĩnh (static typing):** Kiểu được kiểm tra lúc **biên dịch** (Java, C++, Rust, TypeScript). Bắt lỗi sớm, hỗ trợ IDE tốt, nhưng cần khai báo/verbose hơn.
- **Kiểu động (dynamic typing):** Kiểu gắn với giá trị và kiểm tra lúc **chạy** (Python, JavaScript, Ruby). Linh hoạt, viết nhanh, nhưng lỗi kiểu chỉ lộ khi thực thi.

### Mạnh vs Yếu (Strong vs Weak)

- **Kiểu mạnh (strong typing):** Hạn chế chuyển kiểu ngầm; `"1" + 1` báo lỗi (Python).
- **Kiểu yếu (weak typing):** Cho phép nhiều chuyển kiểu ngầm; `"1" + 1` cho `"11"` (JavaScript). Tiện nhưng dễ sinh lỗi bất ngờ.

> Lưu ý: tĩnh/động và mạnh/yếu là hai trục **độc lập**. Python là động + mạnh; C là tĩnh + tương đối yếu.

### Định danh vs Cấu trúc (Nominal vs Structural)

- **Nominal typing:** Tương thích kiểu dựa trên **tên**/khai báo tường minh (Java: phải `implements` interface).
- **Structural typing:** Tương thích dựa trên **hình dạng** (có đủ thuộc tính/phương thức là được — TypeScript, "duck typing" của Python).

## Ví dụ

```python
# Python: động + mạnh
x = 10          # x là int
x = "chuoi"     # hợp lệ: kiểu gắn với giá trị, không với biến

# Kiểu mạnh: KHÔNG tự ép "1" + 1
try:
    print("1" + 1)
except TypeError as e:
    print("Lỗi kiểu:", e)   # can only concatenate str... to str

# Structural / duck typing: "nếu kêu như vịt thì coi là vịt"
class Vit:  quack = lambda self: "Quạc"
class Nguoi: quack = lambda self: "Giả tiếng vịt"

def cho_keu(x):
    print(x.quack())   # chỉ cần có 'quack', không quan tâm kiểu tên gì

cho_keu(Vit()); cho_keu(Nguoi())
```

```typescript
// TypeScript: tĩnh + structural
interface DiemXY { x: number; y: number; }
function do_dai(p: DiemXY) { return Math.hypot(p.x, p.y); }
do_dai({ x: 3, y: 4, z: 9 });  // OK: đủ x,y là hợp lệ (structural)
```

## Ưu / nhược điểm

- **Ưu (tĩnh):** Bắt lỗi sớm, tài liệu hóa qua kiểu, tối ưu hiệu năng, IDE thông minh.
- **Nhược (tĩnh):** Dài dòng hơn, kém linh hoạt khi thử nghiệm nhanh.
- **Ưu (động):** Viết nhanh, linh hoạt, ít khuôn mẫu.
- **Nhược (động):** Lỗi kiểu lộ muộn, khó refactor dự án lớn (giảm bớt nhờ type hint).

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt static và dynamic typing; ưu nhược mỗi loại.
2. Strong và weak typing khác gì? Cho ví dụ chuyển kiểu ngầm.
3. Nominal và structural typing khác nhau ra sao?
4. Duck typing là gì?
5. Type hint trong Python có thực sự ép kiểu lúc chạy không?

## Tham khảo

- *Types and Programming Languages* (Pierce)
- Tài liệu `typing` của Python; sổ tay TypeScript
