# Mẫu thiết kế (Design Patterns)

## Khái niệm
Mẫu thiết kế (design patterns) là các giải pháp tổng quát, đã được kiểm chứng cho những vấn đề thường gặp trong thiết kế phần mềm hướng đối tượng. Chúng không phải là mã nguồn hoàn chỉnh mà là "khuôn mẫu" mô tả cách tổ chức lớp (class) và đối tượng (object) để hệ thống dễ mở rộng, dễ bảo trì và giảm phụ thuộc chặt (tight coupling).

## Khi nào dùng / Vì sao quan trọng
Mẫu thiết kế cung cấp một từ vựng chung cho lập trình viên: chỉ cần nói "dùng Observer" là mọi người hiểu cấu trúc. Chúng giúp tránh việc "phát minh lại bánh xe", giảm lỗi và làm cho thiết kế linh hoạt trước thay đổi. Bộ mẫu kinh điển đến từ nhóm **Gang of Four (GoF)** với 23 mẫu chia thành ba nhóm: khởi tạo, cấu trúc và hành vi.

## Cách hoạt động
Ba nhóm mẫu GoF:

| Nhóm | Mục tiêu |
|------|----------|
| Khởi tạo (Creational) | Trừu tượng hoá cách tạo đối tượng |
| Cấu trúc (Structural) | Tổ chức lớp/đối tượng thành cấu trúc lớn hơn |
| Hành vi (Behavioral) | Phân chia trách nhiệm và giao tiếp giữa các đối tượng |

### 1. Nhóm khởi tạo (Creational Patterns)

- **Singleton**: Đảm bảo một lớp chỉ có duy nhất một thể hiện (instance) và cung cấp điểm truy cập toàn cục. *Khi dùng:* quản lý cấu hình, kết nối cơ sở dữ liệu, bộ ghi nhật ký (logger) dùng chung. Lưu ý tính an toàn luồng (thread-safety).
- **Factory Method**: Định nghĩa một giao diện (interface) để tạo đối tượng nhưng để lớp con quyết định lớp cụ thể nào được khởi tạo. *Khi dùng:* khi lớp cha không biết trước loại đối tượng cần tạo.
- **Abstract Factory**: Cung cấp giao diện tạo ra một họ (family) các đối tượng liên quan mà không cần chỉ định lớp cụ thể. *Khi dùng:* tạo giao diện người dùng đa nền tảng (nút, hộp thoại cho Windows/macOS).
- **Builder**: Tách việc xây dựng một đối tượng phức tạp khỏi biểu diễn của nó, cho phép tạo từng bước. *Khi dùng:* dựng đối tượng có nhiều tham số tuỳ chọn (ví dụ đối tượng cấu hình, câu truy vấn SQL).
- **Prototype**: Tạo đối tượng mới bằng cách sao chép (clone) một nguyên mẫu có sẵn thay vì khởi tạo từ đầu. *Khi dùng:* khi chi phí khởi tạo tốn kém hoặc cần bản sao trạng thái hiện tại.

### 2. Nhóm cấu trúc (Structural Patterns)

- **Adapter (Bộ chuyển đổi)**: Chuyển giao diện của một lớp thành giao diện khác mà client mong đợi. *Khi dùng:* tích hợp thư viện cũ/bên thứ ba có giao diện không tương thích.
- **Bridge (Cầu nối)**: Tách phần trừu tượng khỏi phần cài đặt để hai bên biến đổi độc lập. *Khi dùng:* khi cả trừu tượng và cài đặt cùng có nhiều biến thể (ví dụ hình dạng × cách vẽ).
- **Composite (Kết hợp)**: Tổ chức đối tượng thành cấu trúc cây và xử lý đối tượng đơn lẻ lẫn nhóm đối tượng theo cùng một cách. *Khi dùng:* biểu diễn cây thư mục, menu lồng nhau, cây DOM.
- **Decorator (Trang trí)**: Bổ sung trách nhiệm mới cho đối tượng một cách linh hoạt bằng cách bọc (wrap) nó. *Khi dùng:* thêm chức năng (nén, mã hoá) cho luồng dữ liệu mà không sửa lớp gốc.
- **Facade (Mặt tiền)**: Cung cấp một giao diện đơn giản, thống nhất che giấu độ phức tạp của một hệ thống con. *Khi dùng:* đóng gói nhiều API phức tạp thành một lớp gọi dễ dùng.
- **Flyweight (Hạng nhẹ)**: Chia sẻ phần trạng thái chung giữa nhiều đối tượng để tiết kiệm bộ nhớ. *Khi dùng:* hiển thị hàng nghìn ký tự/đối tượng giống nhau (glyph phông chữ, hạt trong game).
- **Proxy (Đại diện)**: Cung cấp đối tượng thay thế kiểm soát truy cập tới đối tượng gốc. *Khi dùng:* nạp lười (lazy loading), kiểm soát quyền, bộ nhớ đệm, proxy từ xa (remote proxy).

### 3. Nhóm hành vi (Behavioral Patterns)

- **Observer (Quan sát)**: Định nghĩa quan hệ một-nhiều để khi một đối tượng đổi trạng thái, mọi đối tượng phụ thuộc được thông báo tự động. *Khi dùng:* hệ thống sự kiện, cập nhật giao diện, mô hình publish/subscribe.
- **Strategy (Chiến lược)**: Đóng gói một họ thuật toán thành các lớp có thể hoán đổi tại thời điểm chạy. *Khi dùng:* nhiều cách sắp xếp/tính giá/thanh toán khác nhau.
- **Command (Lệnh)**: Đóng gói một yêu cầu thành đối tượng, cho phép tham số hoá, xếp hàng đợi, hoàn tác (undo). *Khi dùng:* nút bấm giao diện, hàng đợi tác vụ, chức năng undo/redo.
- **State (Trạng thái)**: Cho phép đối tượng thay đổi hành vi khi trạng thái nội bộ đổi, như thể đổi lớp. *Khi dùng:* máy trạng thái (state machine) — đơn hàng, kết nối mạng.
- **Iterator (Lặp)**: Cung cấp cách duyệt tuần tự các phần tử của một tập hợp mà không lộ cấu trúc bên trong. *Khi dùng:* duyệt danh sách, cây, tập hợp tuỳ chỉnh.
- **Template Method (Phương thức khuôn mẫu)**: Định nghĩa khung xương của một thuật toán trong lớp cha, để lớp con định nghĩa một số bước. *Khi dùng:* quy trình cố định nhưng có bước biến thể.
- **Chain of Responsibility (Chuỗi trách nhiệm)**: Chuyển yêu cầu dọc theo một chuỗi các bộ xử lý cho tới khi có bộ xử lý phù hợp. *Khi dùng:* middleware, xử lý sự kiện, kiểm duyệt yêu cầu.
- **Mediator (Trung gian)**: Đóng gói cách các đối tượng tương tác vào một đối tượng trung gian, giảm phụ thuộc chằng chịt. *Khi dùng:* điều phối các thành phần giao diện phức tạp.
- **Memento (Kỷ vật)**: Lưu và khôi phục trạng thái trước đó của đối tượng mà không phá vỡ tính đóng gói. *Khi dùng:* chức năng undo, ảnh chụp trạng thái (snapshot).
- **Visitor (Người thăm)**: Tách thuật toán khỏi cấu trúc đối tượng mà nó thao tác. *Khi dùng:* thêm thao tác mới lên cây cú pháp mà không sửa các lớp node.

## Ví dụ
```python
# Mẫu Strategy: hoán đổi thuật toán tính phí vận chuyển tại thời điểm chạy
from abc import ABC, abstractmethod

class ChienLuocVanChuyen(ABC):
    @abstractmethod
    def tinh_phi(self, don_hang) -> float: ...

class VanChuyenNhanh(ChienLuocVanChuyen):
    def tinh_phi(self, don_hang):
        return don_hang.trong_luong * 5.0  # phí cao, giao nhanh

class VanChuyenTietKiem(ChienLuocVanChuyen):
    def tinh_phi(self, don_hang):
        return don_hang.trong_luong * 2.0  # phí thấp, giao chậm

class GioHang:
    def __init__(self, chien_luoc: ChienLuocVanChuyen):
        self.chien_luoc = chien_luoc  # tiêm chiến lược vào

    def tong_phi(self, don_hang):
        return self.chien_luoc.tinh_phi(don_hang)

# Đổi hành vi mà không sửa lớp GioHang
gio = GioHang(VanChuyenNhanh())
```

## So sánh nhanh các mẫu dễ nhầm lẫn

Nhiều mẫu có cấu trúc tương tự nhưng khác **ý định (intent)** — đây là điểm phỏng vấn hay hỏi:

| Cặp mẫu | Điểm giống | Khác biệt về ý định |
|---------|-----------|----------------------|
| Adapter vs. Decorator | Đều bọc một đối tượng | Adapter *đổi* giao diện; Decorator *thêm* hành vi, giữ nguyên giao diện |
| Decorator vs. Proxy | Đều bọc và cùng giao diện | Decorator thêm chức năng; Proxy *kiểm soát truy cập* |
| Strategy vs. State | Đều đóng gói hành vi vào lớp | Strategy để client chọn thuật toán; State tự chuyển đổi theo trạng thái nội bộ |
| Factory Method vs. Abstract Factory | Đều tạo đối tượng | Factory Method tạo *một* sản phẩm qua kế thừa; Abstract Factory tạo *một họ* sản phẩm qua kết hợp |
| Composite vs. Decorator | Đều dùng cấu trúc cây/bọc | Composite biểu diễn quan hệ phần–toàn thể; Decorator gắn thêm trách nhiệm |

## Mẹo chọn và áp dụng mẫu
- **Bắt đầu từ vấn đề, không từ mẫu.** Đừng ép một mẫu vào chỗ không cần; hãy để nhu cầu tái cấu trúc (refactoring) dẫn tới mẫu phù hợp.
- **Ưu tiên kết hợp (composition) hơn kế thừa (inheritance).** Nhiều mẫu (Strategy, Decorator, Bridge) dựa trên nguyên tắc này để linh hoạt hơn.
- **Lập trình theo giao diện, không theo cài đặt cụ thể.** Đây là nền tảng để hoán đổi thành phần.
- **Nhận biết "mùi mã" (code smells)** như chuỗi if/else dài (→ Strategy/State), khởi tạo rải rác (→ Factory), phụ thuộc trực tiếp lớp cụ thể (→ Dependency Injection).

## Mẫu ngoài GoF thường gặp trong thiết kế hệ thống
Ngoài 23 mẫu GoF, thực tế còn nhiều mẫu quan trọng ở tầng kiến trúc:
- **Dependency Injection (Tiêm phụ thuộc)**: cung cấp phụ thuộc từ bên ngoài thay vì tự khởi tạo, giúp dễ kiểm thử và giảm phụ thuộc chặt.
- **Repository**: trừu tượng hoá lớp truy cập dữ liệu, tách logic nghiệp vụ khỏi chi tiết lưu trữ.
- **Model-View-Controller (MVC)**: tách dữ liệu (Model), trình bày (View) và điều khiển (Controller).
- **Publish-Subscribe (Pub/Sub)**: mở rộng của Observer cho hệ phân tán qua message broker.

## Ưu / nhược điểm
- **Ưu:** cung cấp giải pháp đã kiểm chứng, tạo từ vựng chung, tăng khả năng tái sử dụng và mở rộng, giảm phụ thuộc chặt.
- **Nhược:** dễ bị lạm dụng gây "kỹ thuật quá đà" (over-engineering); áp mẫu không phù hợp làm mã phức tạp không cần thiết; một số mẫu tăng số lượng lớp.

## Câu hỏi phỏng vấn thường gặp
1. Ba nhóm mẫu thiết kế GoF là gì? Cho ví dụ mỗi nhóm.
2. Singleton khác gì so với một biến toàn cục (global variable)? Làm sao đảm bảo an toàn luồng?
3. Phân biệt Factory Method và Abstract Factory.
4. Adapter, Decorator và Proxy đều "bọc" đối tượng — điểm khác nhau về ý định là gì?
5. Khi nào dùng Strategy thay vì hàng loạt câu lệnh if/else?
6. Observer pattern giải quyết vấn đề gì trong kiến trúc hướng sự kiện?
7. Vì sao nên "ưu tiên kết hợp hơn kế thừa"? Mẫu nào minh hoạ nguyên tắc này?
8. Cho một tình huống lạm dụng mẫu thiết kế (over-engineering) mà bạn từng gặp.
9. Command pattern hỗ trợ chức năng undo/redo như thế nào?
10. Facade và Adapter khác nhau ra sao về mục đích?

## Tham khảo
- *Design Patterns: Elements of Reusable Object-Oriented Software* — Gang of Four
- *Head First Design Patterns* — Freeman & Robson
- Xem thêm: [Nguyên lý thiết kế hướng đối tượng & SOLID](nguyen-ly-oop.md)
