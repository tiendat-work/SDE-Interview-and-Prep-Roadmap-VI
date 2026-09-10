# Nguyên lý thiết kế hướng đối tượng & SOLID (OOP Design Principles & SOLID)

## Khái niệm
Nguyên lý thiết kế (design principles) là các quy tắc và hướng dẫn giúp viết mã dễ đọc, dễ bảo trì, dễ mở rộng và ít lỗi. Khác với mẫu thiết kế (là giải pháp cụ thể), nguyên lý là triết lý nền tảng định hướng cách ta cấu trúc mã. Nhóm quan trọng nhất là **SOLID** cùng các nguyên lý tổng quát như DRY, KISS, YAGNI và Law of Demeter.

## Khi nào dùng / Vì sao quan trọng
Áp dụng các nguyên lý này giúp giảm nợ kỹ thuật (technical debt), làm cho hệ thống chống chịu tốt trước thay đổi yêu cầu và giảm phụ thuộc chặt (tight coupling) giữa các thành phần. Trong phỏng vấn thiết kế, khả năng giải thích và áp dụng SOLID cho thấy tư duy thiết kế trưởng thành.

## Cách hoạt động

### Các nguyên lý tổng quát

- **DRY (Don't Repeat Yourself — Đừng lặp lại chính mình)**: Mỗi mẩu tri thức/logic chỉ nên tồn tại ở một nơi duy nhất trong hệ thống. Trùng lặp mã dẫn đến việc sửa một chỗ mà quên chỗ khác. *Cách áp dụng:* trích xuất logic lặp thành hàm, lớp hoặc mô-đun dùng chung.
- **KISS (Keep It Simple, Stupid — Giữ cho đơn giản)**: Ưu tiên giải pháp đơn giản nhất giải quyết được vấn đề. Sự phức tạp không cần thiết làm tăng khả năng phát sinh lỗi và khó bảo trì.
- **YAGNI (You Aren't Gonna Need It — Bạn sẽ không cần nó đâu)**: Đừng cài đặt chức năng chỉ vì "có thể sau này cần". Chỉ xây dựng những gì yêu cầu hiện tại đòi hỏi, tránh phình to không cần thiết.
- **Law of Demeter (Luật Demeter / nguyên lý ít hiểu biết nhất)**: Một đối tượng chỉ nên "nói chuyện" với các bạn bè gần gũi của nó, không truy sâu vào chuỗi đối tượng (tránh `a.b().c().d()`). Giảm phụ thuộc và tăng tính đóng gói (encapsulation).

### SOLID — 5 nguyên lý

**S — Single Responsibility Principle (SRP — Nguyên lý trách nhiệm đơn)**
Một lớp chỉ nên có một lý do để thay đổi, tức chỉ đảm nhận một trách nhiệm. Ví dụ: lớp `Invoice` không nên vừa tính toán, vừa in ấn, vừa lưu vào cơ sở dữ liệu — hãy tách thành `InvoiceCalculator`, `InvoicePrinter`, `InvoiceRepository`.

**O — Open/Closed Principle (OCP — Nguyên lý đóng/mở)**
Thực thể phần mềm nên **mở** cho việc mở rộng nhưng **đóng** cho việc sửa đổi. Ví dụ: thêm loại hình học mới bằng cách tạo lớp mới kế thừa `Shape` thay vì sửa hàm `tinh_dien_tich` với chuỗi if/else.

**L — Liskov Substitution Principle (LSP — Nguyên lý thay thế Liskov)**
Đối tượng của lớp con phải thay thế được cho đối tượng của lớp cha mà không làm hỏng tính đúng đắn của chương trình. Ví dụ điển hình sai: lớp `Square` kế thừa `Rectangle` nhưng ghi đè setter làm hỏng kỳ vọng về chiều rộng/cao độc lập.

**I — Interface Segregation Principle (ISP — Nguyên lý phân tách giao diện)**
Không nên buộc client phụ thuộc vào các phương thức mà nó không dùng. Hãy chia giao diện lớn thành nhiều giao diện nhỏ, chuyên biệt. Ví dụ: tách `Printer` khỏi `Scanner` thay vì một giao diện `Machine` khổng lồ.

**D — Dependency Inversion Principle (DIP — Nguyên lý đảo ngược phụ thuộc)**
Mô-đun cấp cao không nên phụ thuộc vào mô-đun cấp thấp; cả hai nên phụ thuộc vào trừu tượng (abstraction). Ví dụ: `OrderService` phụ thuộc vào giao diện `PaymentGateway` chứ không phụ thuộc trực tiếp lớp `StripePayment` cụ thể.

Sơ đồ lớp minh hoạ DIP: cả `OrderService` (cấp cao) và `StripePayment` (cấp thấp) đều phụ thuộc vào trừu tượng `PaymentGateway`:

```mermaid
classDiagram
    class PaymentGateway {
        <<interface>>
        +thanh_toan(so_tien)
    }
    class OrderService {
        +dat_hang(so_tien)
    }
    class StripePayment {
        +thanh_toan(so_tien)
    }
    OrderService --> PaymentGateway
    PaymentGateway <|.. StripePayment
```

## Ví dụ
```python
# Vi phạm SRP: một lớp làm quá nhiều việc
class BaoCao:
    def tao_du_lieu(self): ...
    def dinh_dang_pdf(self): ...   # trách nhiệm trình bày
    def gui_email(self): ...       # trách nhiệm gửi

# Tuân thủ SRP: tách trách nhiệm
class DuLieuBaoCao:
    def tao(self): ...

class TrinhBayPDF:
    def dinh_dang(self, du_lieu): ...

class GuiEmail:
    def gui(self, tep): ...

# Tuân thủ DIP: phụ thuộc vào trừu tượng
from abc import ABC, abstractmethod

class CongThanhToan(ABC):        # trừu tượng
    @abstractmethod
    def thanh_toan(self, so_tien): ...

class DichVuDonHang:
    def __init__(self, cong: CongThanhToan):
        self.cong = cong          # không phụ thuộc lớp cụ thể
    def dat_hang(self, so_tien):
        self.cong.thanh_toan(so_tien)
```

## Các nguyên lý bổ trợ

Ngoài SOLID và bộ tổng quát ở trên, một số nguyên lý khác thường xuất hiện trong phỏng vấn:

- **Composition over Inheritance (Ưu tiên kết hợp hơn kế thừa)**: kế thừa tạo phụ thuộc chặt và cây lớp cứng nhắc; kết hợp (chứa đối tượng khác) linh hoạt hơn và dễ thay đổi tại thời điểm chạy.
- **Separation of Concerns (Tách biệt mối quan tâm)**: mỗi phần của hệ thống chỉ giải quyết một khía cạnh (giao diện, nghiệp vụ, dữ liệu). Là nền tảng của kiến trúc phân tầng (layered architecture).
- **Encapsulation (Đóng gói)**: che giấu trạng thái nội bộ, chỉ lộ ra giao diện tối thiểu; giảm khả năng phá vỡ khi thay đổi.
- **Principle of Least Astonishment (Nguyên lý ít gây ngạc nhiên nhất)**: mã nên hành xử đúng như tên gọi/kỳ vọng của nó, tránh tác dụng phụ bất ngờ.

## Cân bằng giữa các nguyên lý

Các nguyên lý đôi khi kéo về hướng khác nhau, cần cân nhắc ngữ cảnh:

| Tình huống | Nguyên lý nhấn mạnh | Rủi ro nếu quá đà |
|-----------|---------------------|--------------------|
| Trừu tượng hoá trước cho "tương lai" | Bị YAGNI phản đối | Phình to, phức tạp thừa |
| Chia nhỏ mọi lớp theo SRP | SRP, ISP | Quá nhiều lớp vụn, khó theo dõi |
| Gộp logic để tránh lặp | DRY | Ghép nối sai các phần vốn nên độc lập |
| Giữ mọi thứ đơn giản | KISS | Bỏ qua trừu tượng cần thiết, khó mở rộng |

*Kinh nghiệm:* áp dụng nguyên lý khi có **nhu cầu thực tế** (đau ở đâu chữa ở đó), không áp dụng máy móc ngay từ dòng mã đầu tiên. Quy tắc "Rule of Three": chỉ trừu tượng hoá khi thấy một mẫu lặp lại lần thứ ba.

## Mối liên hệ với mẫu thiết kế
Nhiều mẫu thiết kế chính là hiện thực hoá của các nguyên lý SOLID: Strategy và Template Method áp dụng OCP; Dependency Injection áp dụng DIP; Adapter áp dụng SRP + OCP. Nắm nguyên lý giúp hiểu **vì sao** một mẫu tồn tại, không chỉ **cách** dùng nó.

## Ưu / nhược điểm
- **Ưu:** mã dễ đọc, dễ kiểm thử (testable), dễ mở rộng, giảm phụ thuộc chặt, giảm nợ kỹ thuật.
- **Nhược:** áp dụng cứng nhắc dễ dẫn tới quá nhiều lớp/giao diện nhỏ, làm tăng độ phức tạp cấu trúc; cần cân bằng với KISS và YAGNI.

## Ví dụ áp dụng Open/Closed Principle
```python
# VI PHẠM OCP: thêm hình mới phải sửa hàm tính diện tích
def tinh_dien_tich(hinh):
    if hinh.loai == "tron":
        return 3.14 * hinh.r ** 2
    elif hinh.loai == "vuong":       # mỗi loại mới → sửa hàm này
        return hinh.canh ** 2

# TUÂN THỦ OCP: mở rộng bằng lớp mới, không sửa mã cũ
from abc import ABC, abstractmethod

class Hinh(ABC):
    @abstractmethod
    def dien_tich(self) -> float: ...

class HinhTron(Hinh):
    def __init__(self, r): self.r = r
    def dien_tich(self): return 3.14 * self.r ** 2

class HinhVuong(Hinh):            # thêm hình mới: chỉ tạo lớp mới
    def __init__(self, canh): self.canh = canh
    def dien_tich(self): return self.canh ** 2

def tong_dien_tich(ds_hinh):     # không bao giờ phải sửa
    return sum(h.dien_tich() for h in ds_hinh)
```

## Ví dụ trước/sau khi áp dụng — các nguyên lý tổng quát (JS + Python)

### DRY — Đừng lặp lại chính mình

=== "JavaScript"
    ```js
    // TRƯỚC: cùng logic tính thuế lặp ở nhiều nơi
    function giaCoThue(gia) { return gia + gia * 0.1; }
    function tongDon(items) {
      let t = 0;
      for (const it of items) t += it.gia + it.gia * 0.1; // lặp lại 10%
      return t;
    }

    // SAU: trích logic dùng chung một nơi
    const THUE = 0.1;
    const themThue = (gia) => gia + gia * THUE;   // nguồn duy nhất
    const giaCoThue2 = (gia) => themThue(gia);
    const tongDon2 = (items) => items.reduce((t, it) => t + themThue(it.gia), 0);
    ```
=== "Python"
    ```python
    # TRƯỚC: cùng công thức thuế lặp ở nhiều nơi
    def gia_co_thue(gia): return gia + gia * 0.1
    def tong_don(items):
        return sum(it.gia + it.gia * 0.1 for it in items)  # lặp 10%

    # SAU: trích logic dùng chung
    THUE = 0.1
    def them_thue(gia): return gia + gia * THUE   # nguồn duy nhất
    def gia_co_thue2(gia): return them_thue(gia)
    def tong_don2(items): return sum(them_thue(it.gia) for it in items)
    ```

### KISS — Giữ cho đơn giản

=== "JavaScript"
    ```js
    // TRƯỚC: phức tạp hoá không cần thiết để kiểm tra chẵn
    function laChan(n) {
      return n.toString(2).split('').pop() === '0';
    }

    // SAU: đơn giản, rõ ý định
    const laChan2 = (n) => n % 2 === 0;
    ```
=== "Python"
    ```python
    # TRƯỚC: rối rắm không cần thiết
    def la_chan(n):
        return bin(n)[-1] == '0'

    # SAU: đơn giản, rõ ràng
    def la_chan2(n):
        return n % 2 == 0
    ```

### YAGNI — Bạn sẽ không cần nó đâu

=== "JavaScript"
    ```js
    // TRƯỚC: cài sẵn nhiều định dạng "phòng khi cần" nhưng chưa ai dùng
    class Xuat {
      xuat(du_lieu, dinh_dang = 'json') {
        if (dinh_dang === 'json') return JSON.stringify(du_lieu);
        if (dinh_dang === 'xml')  return toXml(du_lieu);   // chưa dùng
        if (dinh_dang === 'yaml') return toYaml(du_lieu);  // chưa dùng
        if (dinh_dang === 'csv')  return toCsv(du_lieu);   // chưa dùng
      }
    }

    // SAU: chỉ làm điều yêu cầu hiện tại cần (JSON), mở rộng khi thực sự cần
    class Xuat2 {
      xuat(du_lieu) { return JSON.stringify(du_lieu); }
    }
    ```
=== "Python"
    ```python
    # TRƯỚC: gánh nặng đa định dạng chưa ai yêu cầu
    class Xuat:
        def xuat(self, du_lieu, dinh_dang='json'):
            if dinh_dang == 'json': return to_json(du_lieu)
            if dinh_dang == 'xml':  return to_xml(du_lieu)   # chưa dùng
            if dinh_dang == 'yaml': return to_yaml(du_lieu)  # chưa dùng

    # SAU: chỉ đáp ứng nhu cầu hiện tại
    class Xuat2:
        def xuat(self, du_lieu):
            return to_json(du_lieu)
    ```

### Law of Demeter — chỉ nói chuyện với bạn bè gần

=== "JavaScript"
    ```js
    // TRƯỚC: truy sâu chuỗi đối tượng (train wreck)
    function giaoHang(don) {
      const tp = don.getKhach().getDiaChi().getThanhPho().getTen();
      return tp;
    }

    // SAU: che giấu chi tiết, hỏi thay vì đào sâu
    class DonHang {
      constructor(khach) { this.khach = khach; }
      thanhPhoGiao() { return this.khach.thanhPho(); }  // uỷ nhiệm
    }
    ```
=== "Python"
    ```python
    # TRƯỚC: chuỗi gọi xuyên nhiều tầng đối tượng
    def giao_hang(don):
        return don.get_khach().get_dia_chi().get_thanh_pho().ten

    # SAU: uỷ nhiệm, chỉ hỏi hàng xóm trực tiếp
    class DonHang:
        def __init__(self, khach): self.khach = khach
        def thanh_pho_giao(self):        # đối tượng tự trả lời
            return self.khach.thanh_pho()
    ```

## Ví dụ trước/sau — 5 nguyên lý SOLID (JS + Python)

### S — Single Responsibility

=== "JavaScript"
    ```js
    // TRƯỚC: User vừa giữ dữ liệu vừa lưu DB vừa gửi email
    class User {
      constructor(email) { this.email = email; }
      luuDB() { /* SQL... */ }
      guiChaoMung() { /* SMTP... */ }
    }

    // SAU: mỗi lớp một trách nhiệm
    class User2 { constructor(email) { this.email = email; } }
    class UserRepo { luu(u) { /* SQL... */ } }
    class Mailer   { guiChaoMung(u) { /* SMTP... */ } }
    ```
=== "Python"
    ```python
    # TRƯỚC: một lớp ôm nhiều lý do thay đổi
    class User:
        def __init__(self, email): self.email = email
        def luu_db(self): ...        # thay đổi khi đổi CSDL
        def gui_chao_mung(self): ... # thay đổi khi đổi email

    # SAU: tách trách nhiệm
    class User2:
        def __init__(self, email): self.email = email
    class UserRepo:
        def luu(self, u): ...
    class Mailer:
        def gui_chao_mung(self, u): ...
    ```

### O — Open/Closed

=== "JavaScript"
    ```js
    // TRƯỚC: thêm loại nhân viên phải sửa hàm tính lương
    function tinhLuong(nv) {
      if (nv.loai === 'full') return nv.luong;
      if (nv.loai === 'part') return nv.gio * nv.donGia;
    }

    // SAU: mở rộng bằng lớp mới, không sửa mã cũ
    class NhanVien { luong() { throw new Error('abstract'); } }
    class FullTime extends NhanVien {
      constructor(l){ super(); this.l = l; } luong(){ return this.l; }
    }
    class PartTime extends NhanVien {
      constructor(g,d){ super(); this.g=g; this.d=d; } luong(){ return this.g*this.d; }
    }
    ```
=== "Python"
    ```python
    # TRƯỚC: chuỗi if/elif phình theo mỗi loại mới
    def tinh_luong(nv):
        if nv.loai == 'full': return nv.luong
        if nv.loai == 'part': return nv.gio * nv.don_gia

    # SAU: đa hình, thêm lớp mới không đụng mã cũ
    from abc import ABC, abstractmethod
    class NhanVien(ABC):
        @abstractmethod
        def luong(self): ...
    class FullTime(NhanVien):
        def __init__(self, l): self.l = l
        def luong(self): return self.l
    class PartTime(NhanVien):
        def __init__(self, g, d): self.g, self.d = g, d
        def luong(self): return self.g * self.d
    ```

### L — Liskov Substitution

=== "JavaScript"
    ```js
    // TRƯỚC: Square kế thừa Rectangle làm hỏng kỳ vọng
    class Rectangle {
      setRong(w){ this.w = w; } setCao(h){ this.h = h; }
      dienTich(){ return this.w * this.h; }
    }
    class Square extends Rectangle {   // vi phạm LSP
      setRong(w){ this.w = this.h = w; }
      setCao(h){ this.w = this.h = h; }
    }

    // SAU: tách trừu tượng chung, không ép quan hệ cha-con sai
    class Shape { dienTich(){ throw new Error('abstract'); } }
    class RectangleOK extends Shape {
      constructor(w,h){ super(); this.w=w; this.h=h; } dienTich(){ return this.w*this.h; }
    }
    class SquareOK extends Shape {
      constructor(c){ super(); this.c=c; } dienTich(){ return this.c*this.c; }
    }
    ```
=== "Python"
    ```python
    # TRƯỚC: lớp con phá vỡ hợp đồng của lớp cha
    class Rectangle:
        def set_rong(self, w): self.w = w
        def set_cao(self, h):  self.h = h
        def dien_tich(self):   return self.w * self.h
    class Square(Rectangle):          # vi phạm LSP
        def set_rong(self, w): self.w = self.h = w
        def set_cao(self, h):  self.w = self.h = h

    # SAU: không ép kế thừa sai, dùng trừu tượng chung
    from abc import ABC, abstractmethod
    class Shape(ABC):
        @abstractmethod
        def dien_tich(self): ...
    class RectangleOK(Shape):
        def __init__(self, w, h): self.w, self.h = w, h
        def dien_tich(self): return self.w * self.h
    class SquareOK(Shape):
        def __init__(self, c): self.c = c
        def dien_tich(self): return self.c * self.c
    ```

### I — Interface Segregation

=== "JavaScript"
    ```js
    // TRƯỚC: giao diện "khổng lồ" ép lớp cài phương thức không dùng
    class Machine { in(){} scan(){} fax(){} }
    class MayInCu extends Machine {
      in(){ /* ok */ }
      scan(){ throw new Error('không hỗ trợ'); } // buộc phải cài
      fax(){ throw new Error('không hỗ trợ'); }
    }

    // SAU: chia giao diện nhỏ, chuyên biệt
    const Printer = { in(){} };
    const Scanner = { scan(){} };
    class MayInMoi { in(){ /* chỉ cài cái cần */ } }
    ```
=== "Python"
    ```python
    # TRƯỚC: ép cài phương thức thừa
    from abc import ABC, abstractmethod
    class Machine(ABC):
        @abstractmethod
        def in_(self): ...
        @abstractmethod
        def scan(self): ...
        @abstractmethod
        def fax(self): ...
    class MayInCu(Machine):
        def in_(self): ...
        def scan(self): raise NotImplementedError  # thừa
        def fax(self):  raise NotImplementedError  # thừa

    # SAU: giao diện nhỏ theo năng lực
    class Printer(ABC):
        @abstractmethod
        def in_(self): ...
    class Scanner(ABC):
        @abstractmethod
        def scan(self): ...
    class MayInMoi(Printer):
        def in_(self): ...    # chỉ cài đúng năng lực
    ```

### D — Dependency Inversion

=== "JavaScript"
    ```js
    // TRƯỚC: lớp cấp cao phụ thuộc trực tiếp lớp cụ thể
    class MySQL { luu(x){ /* ... */ } }
    class OrderService {
      constructor(){ this.db = new MySQL(); }  // ghép chặt
      dat(x){ this.db.luu(x); }
    }

    // SAU: cả hai phụ thuộc trừu tượng, tiêm phụ thuộc vào
    class OrderService2 {
      constructor(repo){ this.repo = repo; }   // nhận abstraction
      dat(x){ this.repo.luu(x); }
    }
    // repo có thể là MySQLRepo, MongoRepo, FakeRepo (test)...
    ```
=== "Python"
    ```python
    # TRƯỚC: OrderService "biết" lớp cụ thể MySQL
    class MySQL:
        def luu(self, x): ...
    class OrderService:
        def __init__(self): self.db = MySQL()   # ghép chặt
        def dat(self, x): self.db.luu(x)

    # SAU: phụ thuộc trừu tượng, tiêm vào từ ngoài
    from abc import ABC, abstractmethod
    class Repo(ABC):
        @abstractmethod
        def luu(self, x): ...
    class OrderService2:
        def __init__(self, repo: Repo): self.repo = repo
        def dat(self, x): self.repo.luu(x)
    # dễ thay MySQLRepo / MongoRepo / FakeRepo khi kiểm thử
    ```

## Câu hỏi phỏng vấn thường gặp
1. Giải thích từng chữ cái trong SOLID kèm ví dụ thực tế.
2. Phân biệt DRY và YAGNI — chúng có mâu thuẫn nhau không?
3. Cho một ví dụ vi phạm Liskov Substitution Principle và cách khắc phục.
4. Dependency Inversion khác gì với Dependency Injection?
5. Law of Demeter giúp giảm phụ thuộc như thế nào?
6. Vì sao "ưu tiên kết hợp hơn kế thừa"?
7. Quy tắc "Rule of Three" liên quan gì tới DRY?
8. Cho ví dụ vi phạm Single Responsibility Principle trong một lớp thực tế.
9. Open/Closed Principle được hiện thực hoá bằng mẫu thiết kế nào?
10. Khi nào việc áp dụng SOLID quá đà lại gây hại?

## Tham khảo
- *Clean Code* & *Agile Software Development* — Robert C. Martin (Uncle Bob)
- *The Pragmatic Programmer* — Hunt & Thomas
- Xem thêm: [Mẫu thiết kế (Design Patterns)](design-patterns.md)
