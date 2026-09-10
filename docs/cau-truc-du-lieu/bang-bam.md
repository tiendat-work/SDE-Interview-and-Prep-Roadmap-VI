# Bảng băm (Hash Table)

## Khái niệm

Bảng băm (hash table, còn gọi hash map) là một cấu trúc dữ liệu ánh xạ **khóa (key)** tới **giá trị (value)** cho phép tra cứu, chèn và xóa với thời gian **trung bình O(1)**. Cốt lõi là một **hàm băm (hash function)** chuyển khóa thành một chỉ số trong mảng chứa dữ liệu (gọi là *bucket* — ô chứa). Đây là cấu trúc đứng sau `dict` của Python, `HashMap` của Java, đối tượng của JavaScript.

Hàm băm ánh xạ khóa vào các bucket; hai khóa trùng ô tạo va chạm (giải quyết bằng chuỗi móc nối):

```mermaid
graph LR
    K1["Khóa: An"] --> H{"Hàm băm"}
    K2["Khóa: Bình"] --> H
    K3["Khóa: Cường"] --> H
    H --> B0["Bucket 0"]
    H --> B1["Bucket 1: An"]
    H --> B2["Bucket 2: Bình → Cường"]
    H --> B3["Bucket 3"]
```

## Khi nào dùng / Vì sao quan trọng

Dùng bảng băm khi cần **tra cứu theo khóa cực nhanh**:

- Từ điển, bộ nhớ đệm (cache), đếm tần suất, khử trùng lặp (deduplication).
- Kiểm tra một phần tử có tồn tại không trong O(1) (tập hợp — set).
- Lập chỉ mục, bảng ký hiệu của trình biên dịch, định tuyến.

## Cách hoạt động

### Hàm băm (hash function)

Hàm băm nhận khóa và trả về một số nguyên, rồi lấy dư cho kích thước mảng để ra chỉ số: `index = hash(key) % capacity`. Một hàm băm tốt cần:

- **Xác định (deterministic):** cùng khóa luôn cho cùng kết quả.
- **Phân bố đều (uniform):** rải khóa đều khắp các ô để giảm va chạm.
- **Nhanh** để tính toán.

### Va chạm (collision)

Khi hai khóa khác nhau băm ra cùng một chỉ số → **va chạm**. Vì số khóa có thể lớn hơn số ô, va chạm là không thể tránh khỏi. Có hai chiến lược xử lý chính:

#### 1. Nối chuỗi (chaining / separate chaining)

Mỗi ô chứa một **danh sách liên kết** (hoặc cây) các cặp khóa–giá trị cùng băm vào đó. Khi va chạm, thêm vào danh sách của ô. Đơn giản, chịu được hệ số tải cao, nhưng tốn bộ nhớ con trỏ.

#### 2. Địa chỉ mở (open addressing)

Mọi phần tử lưu ngay trong mảng; khi ô đã đầy thì **dò (probing)** tìm ô trống khác:

- **Dò tuyến tính (linear probing):** thử ô kế tiếp `(i+1), (i+2)...` — dễ bị cụm (clustering).
- **Dò bậc hai (quadratic probing):** thử `i+1², i+2²...` — giảm cụm.
- **Băm kép (double hashing):** dùng hàm băm thứ hai để quyết định bước nhảy.

### Hệ số tải & tái băm (load factor & rehashing)

**Hệ số tải** = số phần tử / số ô. Khi vượt ngưỡng (thường 0.7), bảng **tái băm (rehash)**: cấp phát mảng lớn hơn rồi băm lại toàn bộ khóa để giữ hiệu năng O(1).

## Ví dụ

### Dùng dict có sẵn của Python

```python
phone = {}
phone["An"] = "0901"         # chèn
phone["Bình"] = "0902"
print(phone["An"])            # tra cứu → 0901
print("Bình" in phone)        # kiểm tra tồn tại → True
del phone["An"]               # xóa
```

### Tự cài bảng băm với chaining

```python
class HashTable:
    def __init__(self, capacity=8):
        self.capacity = capacity
        self.buckets = [[] for _ in range(capacity)]  # mỗi ô là 1 list

    def _index(self, key):
        return hash(key) % self.capacity   # hàm băm → chỉ số

    def put(self, key, value):
        bucket = self.buckets[self._index(key)]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)   # cập nhật nếu đã có
                return
        bucket.append((key, value))        # va chạm → nối vào list

    def get(self, key):
        bucket = self.buckets[self._index(key)]
        for k, v in bucket:
            if k == key:
                return v
        raise KeyError(key)

ht = HashTable()
ht.put("x", 10)
ht.put("y", 20)
print(ht.get("x"))   # 10
```

### Ứng dụng: đếm tần suất

```python
from collections import defaultdict

def count_words(text):
    freq = defaultdict(int)
    for w in text.split():
        freq[w] += 1          # tra cứu + cập nhật O(1)
    return dict(freq)

print(count_words("mèo chó mèo cá mèo"))
# {'mèo': 3, 'chó': 1, 'cá': 1}
```

### Bloom filter (bộ lọc xác suất)

Bloom filter là cấu trúc dựa trên ý tưởng băm, dùng để kiểm tra "phần tử **có thể** thuộc tập hợp" với bộ nhớ cực ít. Nó có thể báo **dương tính giả (false positive)** nhưng **không bao giờ âm tính giả** — nếu nói "không có" thì chắc chắn không có.

```python
class BloomFilter:
    def __init__(self, size=100, num_hashes=3):
        self.size = size
        self.num_hashes = num_hashes
        self.bits = [0] * size

    def _hashes(self, item):
        for i in range(self.num_hashes):
            yield hash((i, item)) % self.size   # nhiều hàm băm

    def add(self, item):
        for h in self._hashes(item):
            self.bits[h] = 1          # bật các bit tương ứng

    def might_contain(self, item):
        return all(self.bits[h] for h in self._hashes(item))

bf = BloomFilter()
bf.add("mèo")
print(bf.might_contain("mèo"))  # True (chắc đã thêm)
print(bf.might_contain("chó"))  # thường False; có thể True (dương tính giả)
```

## Độ phức tạp

| Thao tác | Trung bình | Xấu nhất |
|----------|-----------|----------|
| Tra cứu (get) | O(1) | O(n) |
| Chèn (put) | O(1) | O(n) |
| Xóa (delete) | O(1) | O(n) |
| Bộ nhớ | O(n) | O(n) |

Trường hợp xấu nhất O(n) xảy ra khi mọi khóa va chạm vào cùng một ô (hàm băm kém). Bloom filter: thêm/kiểm tra đều O(k) với k là số hàm băm.

## Ưu / nhược điểm

- **Ưu:**
  - Tra cứu/chèn/xóa trung bình O(1) — nhanh nhất cho tra cứu theo khóa.
  - Linh hoạt với mọi kiểu khóa băm được.
- **Nhược:**
  - Không giữ thứ tự phần tử (dùng cây nếu cần thứ tự).
  - Hiệu năng phụ thuộc hàm băm; va chạm nhiều làm chậm về O(n).
  - Tốn bộ nhớ dư (ô trống) và chi phí tái băm khi mở rộng.

## Câu hỏi phỏng vấn thường gặp

1. **Hàm băm tốt cần tính chất gì?** Xác định, phân bố đều, tính nhanh, ít va chạm.
2. **Va chạm là gì và xử lý thế nào?** Hai khóa băm ra cùng chỉ số; xử lý bằng chaining (nối danh sách) hoặc open addressing (dò ô trống).
3. **Chaining và open addressing khác nhau ra sao?** Chaining lưu ngoài ô bằng danh sách; open addressing lưu trong mảng, tìm ô trống khi va chạm.
4. **Hệ số tải (load factor) là gì?** Tỉ lệ số phần tử trên số ô; vượt ngưỡng thì tái băm để giữ O(1).
5. **Vì sao tra cứu trung bình O(1) nhưng xấu nhất O(n)?** Xấu nhất khi mọi khóa va chạm vào một ô, biến tra cứu thành duyệt danh sách.
6. **Bloom filter dùng khi nào?** Khi cần kiểm tra tồn tại với bộ nhớ cực nhỏ và chấp nhận dương tính giả (ví dụ lọc URL, kiểm tra cache).
7. **Khi nào nên dùng cây thay vì bảng băm?** Khi cần dữ liệu có thứ tự hoặc truy vấn khoảng (range query) — bảng băm không bảo toàn thứ tự.

## Tham khảo

- Nội dung được biên dịch và điều chỉnh từ tài liệu cấu trúc dữ liệu của dự án.
