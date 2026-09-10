# Kiến trúc hướng dịch vụ (SOA - Service-Oriented Architecture)

## Khái niệm

**Kiến trúc hướng dịch vụ (SOA - Service-Oriented Architecture)** là một phong cách thiết kế phần mềm trong đó các chức năng nghiệp vụ (business functions) được đóng gói thành các **dịch vụ (services)** độc lập, có thể tái sử dụng (reusable) và giao tiếp với nhau qua mạng thông qua các giao thức chuẩn. Mỗi dịch vụ thực hiện một khả năng nghiệp vụ hoàn chỉnh (ví dụ: xử lý thanh toán, quản lý khách hàng) và có thể được nhiều ứng dụng khác nhau sử dụng chung.

## Khi nào dùng / Vì sao quan trọng

- Khi doanh nghiệp lớn có nhiều hệ thống rời rạc (legacy) cần **tích hợp (integration)** với nhau.
- Khi muốn **tái sử dụng** các chức năng nghiệp vụ giữa nhiều ứng dụng thay vì viết lại.
- Khi cần **tách biệt (decoupling)** giữa nhà cung cấp dịch vụ (service provider) và bên tiêu thụ (service consumer) để mỗi bên phát triển độc lập.

SOA phổ biến trong các hệ thống doanh nghiệp lớn (ngân hàng, viễn thông) từ những năm 2000, và là tiền thân về mặt tư tưởng của kiến trúc microservices.

## Nguyên lý cốt lõi

1. **Đóng gói dịch vụ (Service encapsulation)**: Mỗi dịch vụ che giấu chi tiết cài đặt bên trong, chỉ lộ ra giao diện (interface).
2. **Liên kết lỏng lẻo (Loose coupling)**: Dịch vụ giảm thiểu phụ thuộc lẫn nhau; thay đổi bên trong một dịch vụ không ảnh hưởng các dịch vụ khác.
3. **Hợp đồng dịch vụ (Service contract)**: Dịch vụ tuân theo một hợp đồng chuẩn mô tả cách gọi (ví dụ: WSDL đối với SOAP).
4. **Trừu tượng hóa (Abstraction)**: Bên tiêu thụ không cần biết dịch vụ được cài đặt thế nào.
5. **Khả năng tái sử dụng (Reusability)**: Một dịch vụ được nhiều ứng dụng dùng lại.
6. **Khả năng kết hợp (Composability)**: Nhiều dịch vụ nhỏ ghép lại thành quy trình nghiệp vụ lớn hơn.
7. **Khả năng khám phá (Discoverability)**: Dịch vụ được đăng ký trong một sổ đăng ký (service registry) để bên khác tìm thấy.

## Cách hoạt động

SOA truyền thống thường dựa vào một **trục dịch vụ doanh nghiệp (ESB - Enterprise Service Bus)** làm trung gian định tuyến, biến đổi và điều phối thông điệp giữa các dịch vụ.

```
[Ứng dụng A] ---\                              /--- [Dịch vụ Thanh toán]
                 \                            /
[Ứng dụng B] -----> [ ESB - Enterprise Bus ] -----> [Dịch vụ Khách hàng]
                 /                            \
[Ứng dụng C] ---/                              \--- [Dịch vụ Kho hàng]
```

- **Nhà cung cấp dịch vụ (Service Provider)**: Triển khai và đăng ký dịch vụ.
- **Sổ đăng ký dịch vụ (Service Registry)**: Nơi lưu thông tin và địa chỉ dịch vụ (ví dụ: UDDI).
- **Bên tiêu thụ dịch vụ (Service Consumer)**: Tìm dịch vụ trong registry và gọi nó.
- **ESB**: Xử lý định tuyến, chuyển đổi định dạng, giao thức, và các mối quan tâm xuyên suốt.

Giao thức phổ biến trong SOA truyền thống: **SOAP (Simple Object Access Protocol)** dùng XML, cùng các chuẩn WS-* (WS-Security, WS-ReliableMessaging).

## Ví dụ

```python
# Minh hoạ khái niệm: một dịch vụ tự chứa với hợp đồng rõ ràng.
# Trong SOA thực tế, dịch vụ này sẽ lộ ra qua SOAP/WSDL hoặc REST.

class DichVuThanhToan:
    """Dịch vụ độc lập, đóng gói toàn bộ logic thanh toán."""

    def xu_ly_thanh_toan(self, ma_don: str, so_tien: float) -> dict:
        # Bên tiêu thụ chỉ thấy giao diện này, không thấy chi tiết bên trong
        # (kết nối cổng thanh toán, ghi sổ, chống gian lận...)
        return {"ma_don": ma_don, "trang_thai": "THANH_CONG", "so_tien": so_tien}

# Bên tiêu thụ gọi dịch vụ mà không cần biết cài đặt bên trong
dich_vu = DichVuThanhToan()
ket_qua = dich_vu.xu_ly_thanh_toan("DH001", 500000)
print(ket_qua)  # {'ma_don': 'DH001', 'trang_thai': 'THANH_CONG', 'so_tien': 500000}
```

## Ưu / nhược điểm

- **Ưu:**
  - **Tái sử dụng** dịch vụ giữa nhiều ứng dụng, giảm trùng lặp.
  - **Tích hợp** các hệ thống cũ và mới, đa nền tảng.
  - **Liên kết lỏng lẻo** giúp thay đổi cục bộ dễ dàng.
  - Phù hợp với các quy trình nghiệp vụ phức tạp trong doanh nghiệp lớn.
- **Nhược:**
  - **ESB là điểm nghẽn và điểm lỗi tập trung** nếu thiết kế sai.
  - **Độ phức tạp cao** do các chuẩn WS-*, XML nặng nề.
  - **Hiệu năng thấp hơn** do overhead của SOAP/XML.
  - Quản trị (governance) và versioning dịch vụ khó khăn.

## So sánh với Microservices

| Tiêu chí | SOA | Microservices |
|----------|-----|---------------|
| Phạm vi dịch vụ | Thô, cấp doanh nghiệp (coarse-grained) | Nhỏ, tập trung một chức năng (fine-grained) |
| Giao tiếp | Thường qua ESB, SOAP/XML | Nhẹ: REST/JSON, gRPC, message queue |
| Chia sẻ dữ liệu | Thường dùng chung cơ sở dữ liệu | Mỗi dịch vụ có DB riêng |
| Liên kết | Có xu hướng tập trung qua ESB | Phi tập trung, "smart endpoints, dumb pipes" |
| Triển khai | Thường đóng gói lớn | Độc lập từng dịch vụ, thường qua container |
| Trọng tâm | Tái sử dụng, tích hợp doanh nghiệp | Tính độc lập, tốc độ triển khai |

Có thể coi microservices là một cách tiếp cận chi tiết hơn (fine-grained) và phi tập trung hơn so với SOA, loại bỏ ESB nặng nề.

## Câu hỏi phỏng vấn thường gặp

1. **SOA là gì và các nguyên lý chính?**
   - Là kiến trúc đóng gói chức năng nghiệp vụ thành dịch vụ độc lập, tái sử dụng, liên kết lỏng lẻo, giao tiếp qua giao thức chuẩn theo hợp đồng.
2. **ESB đóng vai trò gì trong SOA?**
   - ESB là trung gian định tuyến, biến đổi thông điệp và điều phối giao tiếp giữa các dịch vụ; nhưng dễ trở thành điểm nghẽn và điểm lỗi tập trung.
3. **SOA khác microservices ở điểm nào?**
   - SOA thô hơn, thường dùng ESB và chia sẻ DB; microservices nhỏ hơn, phi tập trung, mỗi dịch vụ có DB riêng và giao tiếp nhẹ.
4. **Liên kết lỏng lẻo (loose coupling) mang lại lợi ích gì?**
   - Cho phép thay đổi một dịch vụ mà không ảnh hưởng dịch vụ khác, tăng khả năng bảo trì và tái sử dụng.
5. **Nhược điểm lớn nhất của SOA truyền thống?**
   - Độ phức tạp và overhead của các chuẩn WS-*/SOAP, cùng rủi ro ESB trở thành nghẽn cổ chai.

## Tham khảo

- Thomas Erl, *SOA: Principles of Service Design*
- Martin Fowler — Microservices vs SOA
