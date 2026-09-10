# Chiến lược bộ nhớ đệm (Caching Strategies)

## Khái niệm

**Bộ nhớ đệm (Cache)** là một lớp lưu trữ tốc độ cao (thường trong RAM) giữ lại kết quả của các thao tác tốn kém hoặc dữ liệu hay được truy cập, nhằm phục vụ các yêu cầu tiếp theo nhanh hơn thay vì tính toán lại hoặc truy vấn nguồn gốc (cơ sở dữ liệu, API). **Chiến lược cache (caching strategy)** quy định cách đọc, ghi và cập nhật dữ liệu giữa cache và nguồn dữ liệu chính.

## Khi nào dùng / Vì sao quan trọng

- Giảm **độ trễ (latency)** và tăng tốc phản hồi cho người dùng.
- Giảm **tải (load)** lên cơ sở dữ liệu và dịch vụ backend.
- Tiết kiệm chi phí tính toán và băng thông.

Cache đặc biệt hiệu quả khi dữ liệu **đọc nhiều hơn ghi** (read-heavy) và có tính cục bộ (locality) — một phần nhỏ dữ liệu được truy cập rất thường xuyên.

## Các chiến lược cache

### 1. Cache-Aside (Lazy Loading)

Ứng dụng tự quản lý cache. Đây là chiến lược phổ biến nhất.

```
Đọc: 1. Tìm trong cache
     2. Nếu có (cache hit) -> trả về
     3. Nếu không (cache miss) -> đọc DB, ghi vào cache, trả về
Ghi: cập nhật DB rồi xoá (invalidate) key trong cache
```

- **Ưu:** Chỉ cache dữ liệu thực sự được dùng; cache lỗi không làm sập hệ thống.
- **Nhược:** Lần miss đầu chậm; có thể xảy ra dữ liệu cũ (stale) nếu invalidate sai.

### 2. Write-Through (Ghi xuyên qua)

Mọi thao tác ghi đi qua cache: ghi vào cache **và** DB đồng thời (đồng bộ).

- **Ưu:** Cache luôn nhất quán với DB; đọc luôn có dữ liệu mới.
- **Nhược:** Ghi chậm hơn (phải ghi hai nơi); cache có thể chứa dữ liệu không bao giờ được đọc.

### 3. Write-Behind (Write-Back, Ghi trễ)

Ghi vào cache ngay, sau đó ghi xuống DB **bất đồng bộ** (theo lô/độ trễ).

- **Ưu:** Ghi rất nhanh; giảm tải DB khi ghi nhiều.
- **Nhược:** Nguy cơ **mất dữ liệu** nếu cache sập trước khi ghi xuống DB; phức tạp hơn.

### 4. Read-Through

Cache đứng giữa ứng dụng và DB; khi miss, chính cache (không phải ứng dụng) chịu trách nhiệm nạp dữ liệu từ DB. Ứng dụng chỉ nói chuyện với cache.

| Chiến lược | Đường đọc | Đường ghi | Rủi ro chính |
|------------|-----------|-----------|--------------|
| Cache-Aside | App tự nạp khi miss | Ghi DB + invalidate cache | Dữ liệu cũ |
| Write-Through | Luôn từ cache | Cache + DB đồng bộ | Ghi chậm |
| Write-Behind | Luôn từ cache | Cache ngay, DB sau (async) | Mất dữ liệu |
| Read-Through | Cache tự nạp khi miss | Thường kết hợp write-through | Ghi chậm |

## Vô hiệu hóa cache & TTL

- **TTL (Time To Live)**: Thời gian sống của một mục cache; hết hạn thì bị loại bỏ.
- **Chính sách loại bỏ (eviction policy)**: Khi cache đầy, chọn mục để xóa — **LRU (Least Recently Used)**, **LFU (Least Frequently Used)**, **FIFO**.

## Chống Cache Stampede (giẫm đạp cache)

**Cache stampede** (còn gọi là dogpile / thundering herd) xảy ra khi một key phổ biến hết hạn cùng lúc, khiến hàng loạt yêu cầu đồng thời cùng miss và cùng dồn xuống DB, gây quá tải.

Các kỹ thuật giảm thiểu:

- **Khóa/mutex (locking)**: Chỉ cho một yêu cầu nạp lại DB; các yêu cầu khác chờ hoặc dùng giá trị cũ.
- **Làm mới sớm (early recomputation / probabilistic early expiration)**: Làm mới cache ngẫu nhiên trước khi hết hạn để tránh hết hạn đồng loạt.
- **Random jitter cho TTL**: Thêm độ lệch ngẫu nhiên vào TTL để các key không hết hạn cùng lúc.
- **Stale-while-revalidate**: Trả về giá trị cũ trong khi nạp giá trị mới ở nền.

```python
# Minh hoạ cache-aside kèm khóa chống stampede (giản lược)
import threading, time

cache = {}
locks = {}

def lay_du_lieu(key):
    muc = cache.get(key)
    if muc and muc["het_han"] > time.time():
        return muc["gia_tri"]                 # cache hit

    lock = locks.setdefault(key, threading.Lock())
    with lock:                                # chỉ 1 luồng nạp lại DB
        muc = cache.get(key)
        if muc and muc["het_han"] > time.time():
            return muc["gia_tri"]             # luồng khác đã nạp xong
        gia_tri = truy_van_db(key)            # thao tác tốn kém
        cache[key] = {"gia_tri": gia_tri, "het_han": time.time() + 60}
        return gia_tri

def truy_van_db(key):
    time.sleep(0.1)                           # giả lập truy vấn chậm
    return f"du_lieu_cua_{key}"
```

## CDN (Content Delivery Network)

**CDN (Mạng phân phối nội dung)** là hệ thống các máy chủ biên (edge servers) phân bố theo địa lý, lưu cache nội dung tĩnh (ảnh, CSS, JS, video) gần người dùng cuối.

- Giảm độ trễ do phục vụ từ máy chủ gần nhất.
- Giảm tải cho máy chủ gốc (origin server).
- Chống chịu đỉnh tải và một phần tấn công DDoS.
- Dùng TTL và cache invalidation (purge) để cập nhật nội dung mới.

## Ưu / nhược điểm

- **Ưu:** Tăng tốc phản hồi, giảm tải backend, tiết kiệm chi phí, tăng khả năng chịu tải.
- **Nhược:** Nguy cơ dữ liệu cũ (stale), thêm độ phức tạp (invalidation là bài toán khó), tốn bộ nhớ, cần xử lý stampede và tính nhất quán.

## Câu hỏi phỏng vấn thường gặp

1. **So sánh cache-aside, write-through và write-behind.**
   - Cache-aside: app tự nạp khi miss, ghi DB rồi invalidate. Write-through: ghi cache và DB đồng bộ, nhất quán nhưng chậm. Write-behind: ghi cache trước, DB sau (async), nhanh nhưng rủi ro mất dữ liệu.
2. **Cache stampede là gì và cách phòng chống?**
   - Là hiện tượng nhiều yêu cầu cùng miss khi key hết hạn, dồn tải xuống DB. Phòng bằng khóa, làm mới sớm, jitter cho TTL, hoặc stale-while-revalidate.
3. **Các chính sách loại bỏ cache phổ biến?**
   - LRU (ít dùng gần đây nhất), LFU (ít dùng thường xuyên nhất), FIFO.
4. **Làm sao xử lý dữ liệu cũ (stale) trong cache?**
   - Đặt TTL hợp lý, invalidate khi ghi, hoặc dùng write-through để giữ nhất quán.
5. **CDN giúp ích gì và khác gì cache phía server?**
   - CDN cache nội dung tĩnh tại biên gần người dùng, giảm độ trễ mạng; cache phía server (như Redis) giảm tải tính toán/truy vấn DB.

## Tham khảo

- AWS — Caching Best Practices
- Redis Documentation — Caching patterns
