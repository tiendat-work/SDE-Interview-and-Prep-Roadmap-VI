# Lập trình đồng thời (Concurrency)

## Khái niệm

Lập trình đồng thời (concurrency) là kỹ thuật thiết kế chương trình để nhiều tác vụ có thể tiến triển trong cùng khoảng thời gian. Đồng thời (concurrency) nói về **cấu trúc** — xử lý nhiều việc đan xen; song song (parallelism) nói về **thực thi** — chạy nhiều việc thật sự cùng lúc trên nhiều lõi CPU. Một chương trình có thể đồng thời mà không song song (một lõi luân phiên) và ngược lại.

## Khi nào dùng / Vì sao quan trọng

Dùng khi cần tận dụng nhiều lõi CPU, giữ giao diện phản hồi, hoặc xử lý nhiều kết nối mạng cùng lúc. Đây là nguồn gốc của nhiều bug khó tái hiện nhất, nên là chủ đề phỏng vấn nặng ký cho vị trí backend/hệ thống.

## Cách hoạt động

### Thread vs Process vs Async

- **Tiến trình (process):** Có không gian địa chỉ bộ nhớ riêng, cô lập. Giao tiếp qua IPC. Tạo/chuyển đổi tốn kém hơn nhưng an toàn hơn.
- **Luồng (thread):** Nằm trong một tiến trình, **chia sẻ** vùng nhớ heap. Nhẹ, tạo nhanh, nhưng chia sẻ dữ liệu dễ sinh xung đột.
- **Bất đồng bộ (async):** Một luồng đơn dùng vòng lặp sự kiện (event loop) luân phiên giữa các tác vụ tại các điểm `await`. Không có song song thật, nhưng cực hiệu quả với tác vụ I/O-bound (chờ mạng, đĩa) vì không tốn chi phí tạo luồng.

| Mô hình | Bộ nhớ | Chi phí tạo | Song song CPU | Hợp với |
|---------|--------|-------------|---------------|---------|
| Process | Riêng | Cao | Có | CPU-bound (tính toán nặng) |
| Thread | Chia sẻ | Trung bình | Có (trừ GIL Python) | Trộn I/O & CPU nhẹ |
| Async | Chia sẻ | Rất thấp | Không | I/O-bound (nhiều kết nối) |

### Các nguy cơ

- **Race condition (điều kiện tranh chấp):** Kết quả phụ thuộc thứ tự thực thi không xác định của nhiều luồng cùng truy cập dữ liệu chung.
- **Deadlock (khóa chết):** Nhiều luồng chờ nhau vô hạn để giải phóng khóa.
- **Thread safety (an toàn luồng):** Một đoạn code an toàn luồng cho kết quả đúng khi nhiều luồng chạy đồng thời.

### Cơ chế đồng bộ

- **Mutex (khóa loại trừ tương hỗ):** Chỉ một luồng giữ khóa vào vùng tới hạn (critical section) tại một thời điểm.
- **Semaphore (đèn báo):** Bộ đếm cho phép tối đa N luồng vào cùng lúc.
- **Lock/Monitor:** Trừu tượng hóa việc khóa quanh dữ liệu chung.
- **Atomic operation:** Thao tác không thể bị ngắt giữa chừng.

## Ví dụ: khóa bảo vệ biến chung

=== "JavaScript"
    ```js
    // Node.js: mô phỏng bất đồng bộ với async/await (đơn luồng, event loop)
    function taiVe(ten, ms) {
      return new Promise(resolve =>
        setTimeout(() => resolve(`${ten} xong sau ${ms}ms`), ms));
    }

    async function main() {
      // Chạy ĐỒNG THỜI: cả ba cùng khởi động, chờ tất cả hoàn tất
      const kq = await Promise.all([
        taiVe("A", 300), taiVe("B", 100), taiVe("C", 200),
      ]);
      console.log(kq);  // ['A xong sau 300ms', 'B ...', 'C ...']
    }
    main();
    ```

=== "Python"
    ```python
    import threading

    bo_dem = 0
    khoa = threading.Lock()          # mutex bảo vệ biến chung

    def tang(n):
        global bo_dem
        for _ in range(n):
            with khoa:               # chỉ một luồng vào vùng tới hạn
                bo_dem += 1          # tránh race condition

    luong = [threading.Thread(target=tang, args=(100000,)) for _ in range(4)]
    for t in luong: t.start()
    for t in luong: t.join()
    print(bo_dem)                    # 400000 — đúng nhờ có khóa
    ```

Nếu **bỏ khóa** ở ví dụ Python, kết quả sẽ nhỏ hơn 400000 do các luồng đọc-sửa-ghi `bo_dem` đè lên nhau (race condition).

## Ví dụ: async I/O

=== "JavaScript"
    ```js
    // async/await là cách tự nhiên của JS để xử lý I/O đồng thời
    async function xuLy(url) {
      const res = await fetch(url);      // nhường CPU khi chờ mạng
      return (await res.text()).length;
    }
    ```

=== "Python"
    ```python
    import asyncio

    async def tai_ve(ten, giay):
        await asyncio.sleep(giay)        # nhường event loop khi chờ
        return f"{ten} xong"

    async def main():
        # Ba coroutine chạy đan xen trên MỘT luồng
        kq = await asyncio.gather(
            tai_ve("A", 0.3), tai_ve("B", 0.1), tai_ve("C", 0.2))
        print(kq)

    asyncio.run(main())
    ```

> Lưu ý: CPython có GIL (Global Interpreter Lock) nên luồng không cho song song CPU thật; muốn song song tính toán hãy dùng `multiprocessing`.

## Sơ đồ tiến trình và luồng

Một tiến trình (process) có không gian bộ nhớ riêng; bên trong có thể chạy nhiều luồng (thread) chia sẻ chung bộ nhớ heap và dữ liệu, nhưng mỗi luồng có ngăn xếp (stack) riêng.

```mermaid
graph TD
    OS["Hệ điều hành"]
    P1["Tiến trình A<br/>(bộ nhớ riêng)"]
    P2["Tiến trình B<br/>(bộ nhớ riêng)"]
    OS --> P1
    OS --> P2
    P1 --> T1["Luồng 1<br/>(stack riêng)"]
    P1 --> T2["Luồng 2<br/>(stack riêng)"]
    T1 --> H1["Heap + dữ liệu<br/>(chia sẻ)"]
    T2 --> H1
```

- **Tiến trình:** cô lập, an toàn hơn, tốn tài nguyên khi giao tiếp (IPC).
- **Luồng:** nhẹ, chia sẻ bộ nhớ nên giao tiếp nhanh nhưng cần đồng bộ hoá (khoá) để tránh race condition.

## Ưu / nhược điểm

- **Ưu:** Tận dụng đa lõi, tăng thông lượng, giữ ứng dụng phản hồi tốt.
- **Nhược:** Khó viết đúng; bug (race, deadlock) khó tái hiện và gỡ; khóa quá nhiều làm giảm hiệu năng.

## Câu hỏi phỏng vấn thường gặp

1. Phân biệt concurrency và parallelism.
2. Thread và process khác nhau ở điểm nào? Khi nào dùng async thay vì thread?
3. Race condition xảy ra khi nào? Cách phòng tránh?
4. Deadlock là gì? Bốn điều kiện Coffman để xảy ra deadlock?
5. Mutex khác semaphore ra sao? GIL trong Python là gì?

## Tham khảo

- *Operating System Concepts* (Silberschatz)
- Tài liệu `threading`, `multiprocessing`, `asyncio` của Python
