# Tối ưu hoá (Optimization)

## Khái niệm

Tối ưu hoá là quá trình cải thiện chương trình để chạy **nhanh hơn**, dùng **ít bộ nhớ hơn**, hoặc cân bằng giữa hai mục tiêu này. Tối ưu có thể ở mức thuật toán (chọn cách tiếp cận có độ phức tạp thấp hơn) hoặc mức cài đặt (giảm chi phí hằng số, tận dụng cache, cấu trúc dữ liệu phù hợp).

## Khi nào dùng / Vì sao quan trọng

- Khi lời giải hiện tại **quá chậm** so với ràng buộc đề bài, hoặc **vượt giới hạn bộ nhớ**.
- Trong hệ thống thực tế, tối ưu ảnh hưởng chi phí máy chủ và trải nghiệm người dùng.
- **Nguyên tắc vàng:** "Đừng tối ưu sớm" (premature optimization) — hãy viết code đúng và rõ trước, đo đạc, rồi mới tối ưu chỗ thực sự là nút thắt cổ chai (bottleneck).

## Cách hoạt động

**1. Tối ưu thuật toán (algorithmic optimization)** — đòn bẩy lớn nhất:

- Giảm bậc độ phức tạp: `O(n²)` → `O(n log n)` → `O(n)`.
- Kỹ thuật điển hình: dùng bảng băm thay vòng lặp lồng, sắp xếp trước rồi hai con trỏ, quy hoạch động thay đệ quy vét cạn, tìm kiếm nhị phân thay quét tuyến tính.
- Thường quan trọng hơn nhiều so với chỉnh sửa vặt ở mức code.

**2. Đánh đổi thời gian – không gian (time–space tradeoff)** — dùng thêm bộ nhớ để đổi lấy tốc độ (hoặc ngược lại):

- **Ghi nhớ (memoization) / bảng tra cứu (lookup table):** lưu kết quả đã tính để khỏi tính lại → nhanh hơn nhưng tốn bộ nhớ.
- **Tiền xử lý (precomputation):** tính trước tổng tiền tố (prefix sum), chỉ mục... để truy vấn `O(1)`.
- **Ngược lại:** khi bộ nhớ khan hiếm, có thể chấp nhận tính lại để tiết kiệm không gian.

**3. Đo lường & định hình hiệu năng (profiling)** — không đoán, hãy đo:

- Dùng **profiler** (ví dụ `cProfile`, `timeit` trong Python) để tìm hàm/dòng tốn thời gian nhất.
- Tối ưu đúng **nút thắt cổ chai** theo nguyên tắc 80/20: phần lớn thời gian thường nằm ở một phần nhỏ code.
- Đo lại sau mỗi thay đổi để xác nhận có cải thiện thật, không làm chậm chỗ khác.

**4. Tối ưu mức cài đặt (low-level)** — sau khi thuật toán đã tốt:

- Chọn cấu trúc dữ liệu phù hợp (set để kiểm tra thành viên, deque cho hàng đợi hai đầu).
- Giảm cấp phát bộ nhớ và sao chép thừa; tránh tính lặp trong vòng lặp.
- Tận dụng thao tác dựng sẵn (built-in) đã tối ưu bằng ngôn ngữ máy.

## Ví dụ

=== "JavaScript"
    ```js
    // CHẬM: kiểm tra trùng bằng vòng lặp lồng -> O(n^2)
    function hasDuplicateSlow(nums) {
      for (let i = 0; i < nums.length; i++)
        for (let j = i + 1; j < nums.length; j++)
          if (nums[i] === nums[j]) return true;
      return false;
    }

    // NHANH: đánh đổi không gian lấy thời gian bằng Set -> O(n) time, O(n) space
    function hasDuplicateFast(nums) {
      const seen = new Set();
      for (const x of nums) {
        if (seen.has(x)) return true;   // kiểm tra thành viên O(1) trung bình
        seen.add(x);
      }
      return false;
    }

    // Tiền xử lý prefix sum: truy vấn tổng đoạn [l, r] trong O(1)
    function buildPrefix(nums) {
      const prefix = [0];
      for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);
      return prefix;
    }
    function rangeSum(prefix, l, r) {
      return prefix[r + 1] - prefix[l];   // mỗi truy vấn O(1)
    }
    ```
=== "Python"
    ```python
    # CHẬM: kiểm tra trùng bằng vòng lặp lồng -> O(n^2)
    def has_duplicate_slow(nums):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False

    # NHANH: đánh đổi không gian lấy thời gian bằng set -> O(n) thời gian, O(n) bộ nhớ
    def has_duplicate_fast(nums):
        seen = set()
        for x in nums:
            if x in seen:        # kiểm tra thành viên O(1) trung bình
                return True
            seen.add(x)
        return False

    # Tiền xử lý prefix sum: truy vấn tổng đoạn [l, r] trong O(1)
    def build_prefix(nums):
        prefix = [0]
        for x in nums:
            prefix.append(prefix[-1] + x)   # tính trước một lần O(n)
        return prefix

    def range_sum(prefix, l, r):
        return prefix[r + 1] - prefix[l]    # mỗi truy vấn O(1) thay vì O(n)
    ```

```python
# Profiling nhanh bằng cProfile
import cProfile
cProfile.run("has_duplicate_slow(list(range(2000)))")  # xem hàm nào tốn thời gian
```

## Thử ngay: memoization so với đệ quy vét cạn

Playground tính Fibonacci bằng hai cách: đệ quy thuần (`O(2ⁿ)` — số lời gọi bùng nổ) và đệ quy có ghi nhớ (`O(n)`). Nó in **số lần gọi hàm** và **thời gian chạy** để bạn thấy đánh đổi thời gian – không gian rõ ràng: chỉ thêm một object nhỏ mà nhanh gấp hàng nghìn lần.

<div class="js-demo" data-title="Memoization vs đệ quy vét cạn (Fibonacci)">
<textarea class="js-demo-src">
let naiveCalls = 0;
function fibNaive(n) {                 // O(2^n): tính lại chồng chất
  naiveCalls++;
  if (n < 2) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

let memoCalls = 0;
function fibMemo(n, memo = {}) {       // O(n): ghi nhớ kết quả
  memoCalls++;
  if (n < 2) return n;
  if (memo[n] !== undefined) return memo[n];
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}

const N = 30;
let t0 = performance.now();
const r1 = fibNaive(N);
let t1 = performance.now();
const r2 = fibMemo(N);
let t2 = performance.now();

print(`fib(${N}) = ${r1}  (cả hai cách cho cùng kết quả: ${r1 === r2})`);
print('');
print('Cách        | số lần gọi |   thời gian (ms)');
print('------------+------------+-----------------');
print(`Vét cạn     | ${String(naiveCalls).padStart(10)} | ${(t1-t0).toFixed(3).padStart(15)}`);
print(`Memoization | ${String(memoCalls).padStart(10)} | ${(t2-t1).toFixed(3).padStart(15)}`);
print('');
print(`=> Memoization gọi ít hơn ~${Math.round(naiveCalls/memoCalls)} lần.`);
</textarea>
</div>

## Độ phức tạp

| Cách tiếp cận | Thời gian | Bộ nhớ |
|---------------|-----------|--------|
| Kiểm tra trùng bằng vòng lồng | O(n²) | O(1) |
| Kiểm tra trùng bằng set | O(n) | O(n) |
| Tổng đoạn bằng quét trực tiếp | O(n) mỗi truy vấn | O(1) |
| Tổng đoạn bằng prefix sum | O(1) mỗi truy vấn | O(n) |

## Ưu / nhược điểm

- **Ưu:** tăng tốc độ và khả năng mở rộng; tiết kiệm chi phí tài nguyên.
- **Nhược:** tối ưu sớm hoặc quá mức làm code khó đọc, khó bảo trì và dễ sinh lỗi; nhiều tối ưu là đánh đổi (nhanh hơn nhưng tốn bộ nhớ hơn) nên phải cân theo ràng buộc thực tế.

## Câu hỏi phỏng vấn thường gặp

1. Vì sao "tối ưu hoá sớm là gốc rễ của mọi điều xấu"?
2. Cho ví dụ về đánh đổi thời gian – không gian bạn từng dùng.
3. Bạn xác định nút thắt cổ chai của chương trình bằng cách nào?
4. Tối ưu thuật toán và tối ưu mức cài đặt khác nhau ra sao; nên làm cái nào trước?

## Tham khảo

- [Phân tích độ phức tạp](do-phuc-tap.md)
- [Kỹ thuật lập trình](ky-thuat-coding.md)
- Tài liệu `cProfile` và `timeit` (Python)
