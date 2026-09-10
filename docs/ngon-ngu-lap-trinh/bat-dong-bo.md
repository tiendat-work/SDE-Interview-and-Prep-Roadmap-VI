# Lập trình bất đồng bộ (Asynchronous Programming)

## Khái niệm

Lập trình bất đồng bộ (asynchronous programming) cho phép chương trình bắt đầu một tác vụ tốn thời gian (đọc file, gọi mạng) rồi **tiếp tục làm việc khác** thay vì đứng chờ, và xử lý kết quả khi nó sẵn sàng. Khác với đa luồng, bất đồng bộ thường chạy trên một luồng duy nhất với vòng lặp sự kiện (event loop), xen kẽ các tác vụ tại các điểm chờ.

## Khi nào dùng / Vì sao quan trọng

Rất hợp cho tác vụ **giới hạn bởi I/O** (I/O-bound): server web xử lý hàng nghìn kết nối, ứng dụng gọi nhiều API. Nó giữ ứng dụng phản hồi mà không tốn chi phí tạo nhiều luồng. Đây là kiến thức bắt buộc cho backend hiện đại (Node.js, Python asyncio).

## Cách hoạt động

### Tiến hóa các mô hình

- **Callback (hàm gọi lại):** Truyền một hàm để chạy khi tác vụ xong. Lồng nhiều callback gây "callback hell" (kim tự tháp khó đọc).
- **Promise / Future (lời hứa / tương lai):** Đối tượng đại diện cho kết quả **sẽ có** trong tương lai, với các trạng thái pending → fulfilled/rejected. Cho phép nối chuỗi `.then()` phẳng hơn callback.
- **Async/await:** Cú pháp giúp code bất đồng bộ trông như đồng bộ. `await` tạm dừng coroutine cho tới khi kết quả sẵn sàng, nhường quyền cho event loop chạy việc khác.
- **Coroutine (đồng thủ tục):** Hàm có thể tạm dừng và tiếp tục — nền tảng của async/await.

### Event loop

Vòng lặp sự kiện điều phối: chạy các coroutine tới điểm `await`, đăng ký chờ I/O, rồi tiếp tục coroutine khi dữ liệu về. Nhờ đó một luồng phục vụ nhiều tác vụ đan xen.

## Ví dụ

```python
import asyncio

async def tai_du_lieu(ten, giay):
    print(f"Bắt đầu tải {ten}")
    await asyncio.sleep(giay)        # giả lập I/O; nhường event loop
    print(f"Xong {ten}")
    return f"dữ liệu {ten}"

async def main():
    # Chạy ĐỒNG THỜI: tổng thời gian ~ tác vụ dài nhất (2s), không phải 3s
    ket_qua = await asyncio.gather(
        tai_du_lieu("A", 2),
        tai_du_lieu("B", 1),
    )
    print(ket_qua)

asyncio.run(main())
```

```javascript
// JavaScript: Promise + async/await
async function layDuLieu() {
  const res = await fetch("/api");   // chờ mà không chặn luồng chính
  return await res.json();
}
```

## Ưu / nhược điểm

- **Ưu:** Xử lý nhiều tác vụ I/O đồng thời với ít tài nguyên; giữ ứng dụng phản hồi; async/await dễ đọc hơn callback.
- **Nhược:** Không tăng tốc tác vụ nặng CPU (CPU-bound); code "lây nhiễm" async (hàm gọi async phải là async); gỡ lỗi khó hơn code tuần tự.

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt bất đồng bộ và đa luồng.
2. Callback hell là gì? Promise và async/await giải quyết ra sao?
3. Event loop hoạt động thế nào?
4. Vì sao async phù hợp I/O-bound nhưng không giúp CPU-bound?
5. Coroutine là gì và liên hệ với async/await?

## Tham khảo

- Tài liệu `asyncio` của Python
- MDN: Promises, async/await
