# Thuật toán chuỗi (String Algorithms)

## Khái niệm

Thuật toán chuỗi (string algorithms) là nhóm kỹ thuật xử lý văn bản: tìm mẫu (pattern matching), so khớp, đo độ giống nhau, và các cấu trúc dữ liệu chuyên biệt cho chuỗi. Điểm chung là khai thác cấu trúc lặp lại bên trong chuỗi để tránh so sánh dư thừa, giúp giảm từ `O(n·m)` (ngây thơ) xuống tuyến tính.

## Khi nào dùng / Vì sao quan trọng

- **Tìm mẫu trong văn bản:** trình soạn thảo, công cụ tìm kiếm, phân tích log.
- **Tin sinh học:** so khớp chuỗi DNA/protein.
- **Sửa lỗi & gợi ý:** đo khoảng cách chỉnh sửa để gợi ý từ đúng.
- Đây là chủ đề phỏng vấn phổ biến, đặc biệt KMP và các bài chuỗi con.

## Cách hoạt động

### KMP (Knuth–Morris–Pratt)

Tìm mẫu bằng cách dựng trước **mảng tiền tố (prefix function / LPS)** cho mẫu — cho biết khi so khớp thất bại thì nhảy con trỏ về đâu mà không phải so lại từ đầu. **Thời gian:** `O(n + m)`.

### Rabin–Karp

Dùng **hàm băm cuộn (rolling hash)** để so mã băm của cửa sổ văn bản với mã băm của mẫu; chỉ khi băm trùng mới so sánh trực tiếp. **Thời gian:** `O(n + m)` trung bình, `O(n·m)` xấu nhất (nhiều va chạm băm). Rất mạnh khi tìm **nhiều mẫu** cùng lúc.

### Z-algorithm

Tính **mảng Z**: `Z[i]` là độ dài đoạn dài nhất bắt đầu từ `i` trùng với tiền tố của chuỗi. Ghép `mẫu + ký_tự_ngăn + văn_bản` rồi tìm vị trí `Z[i]` bằng độ dài mẫu. **Thời gian:** `O(n + m)`.

### Trie (cây tiền tố)

Cây lưu tập chuỗi theo tiền tố chung; mỗi cạnh là một ký tự. Cho phép tra cứu, chèn, tìm theo tiền tố trong `O(L)` với `L` là độ dài chuỗi. Dùng cho tự động hoàn thành (autocomplete), từ điển.

### Edit Distance & Hamming Distance

- **Edit distance (Levenshtein):** số phép chèn/xóa/thay tối thiểu; giải bằng DP `O(m·n)`.
- **Hamming distance:** số vị trí khác nhau giữa **hai chuỗi cùng độ dài**; `O(n)`.

### Longest Palindromic Substring (chuỗi con đối xứng dài nhất)

Tìm chuỗi con liền kề dài nhất là palindrome. Cách "nở từ tâm (expand around center)" cho `O(n²)`; thuật toán Manacher cho `O(n)`.

## Ví dụ

!!! tip "Thử ngay (chạy được)"
    Bấm **▶ Chạy** để KMP tìm mọi vị trí xuất hiện của `pattern` trong `text` và in ra. Sửa `text`/`pattern` rồi chạy lại.

<div class="js-demo" data-title="KMP — tìm mẫu, in vị trí (JavaScript)">
<textarea class="js-demo-src">
function buildLps(p) {
  const lps = new Array(p.length).fill(0);
  let len = 0, i = 1;
  while (i < p.length) {
    if (p[i] === p[len]) { lps[i++] = ++len; }
    else if (len > 0) { len = lps[len - 1]; }
    else { lps[i++] = 0; }
  }
  return lps;
}

function kmpSearch(text, pattern) {
  const lps = buildLps(pattern);
  print('Mảng LPS của mẫu:', `[${lps}]`);
  const res = [];
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
      if (j === pattern.length) {
        print(`Khớp tại vị trí ${i - j}`);
        res.push(i - j);
        j = lps[j - 1];
      }
    } else if (j > 0) {
      j = lps[j - 1];   // nhảy nhờ LPS, không lùi i
    } else {
      i++;
    }
  }
  return res;
}

const text = 'ababcababcabc';
const pattern = 'abc';
print('Kết quả:', `[${kmpSearch(text, pattern)}]`);
</textarea>
</div>

**KMP — dựng mảng LPS và tìm mẫu**

=== "JavaScript"
    ```js
    function buildLps(pattern) {
      const lps = new Array(pattern.length).fill(0);   // lps[i] = tiền tố cũng là hậu tố dài nhất
      let len = 0, i = 1;
      while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
          lps[i++] = ++len;
        } else if (len > 0) {
          len = lps[len - 1];                          // lùi về vị trí biên trước đó
        } else {
          lps[i++] = 0;
        }
      }
      return lps;
    }

    function kmpSearch(text, pattern) {
      const lps = buildLps(pattern);
      const res = [];
      let i = 0, j = 0;                                 // i chạy trên text, j trên pattern
      while (i < text.length) {
        if (text[i] === pattern[j]) {
          i++; j++;
          if (j === pattern.length) {                  // khớp toàn bộ mẫu
            res.push(i - j);
            j = lps[j - 1];                            // tiếp tục tìm lần khớp kế
          }
        } else if (j > 0) {
          j = lps[j - 1];                              // nhảy nhờ LPS, không lùi i
        } else {
          i++;
        }
      }
      return res;
    }

    console.log(kmpSearch("ababcababcabc", "abc"));   // [2, 7, 10]
    ```

=== "Python"
    ```python
    def build_lps(pattern):
        lps = [0] * len(pattern)    # lps[i] = độ dài tiền tố cũng là hậu tố dài nhất
        length = 0
        i = 1
        while i < len(pattern):
            if pattern[i] == pattern[length]:
                length += 1
                lps[i] = length
                i += 1
            elif length > 0:
                length = lps[length - 1]    # lùi về vị trí biên trước đó
            else:
                lps[i] = 0
                i += 1
        return lps

    def kmp_search(text, pattern):
        lps = build_lps(pattern)
        res = []
        i = j = 0        # i chạy trên text, j chạy trên pattern
        while i < len(text):
            if text[i] == pattern[j]:
                i += 1; j += 1
                if j == len(pattern):       # khớp toàn bộ mẫu
                    res.append(i - j)
                    j = lps[j - 1]          # tiếp tục tìm lần khớp kế
            elif j > 0:
                j = lps[j - 1]              # nhảy nhờ LPS, không lùi i
            else:
                i += 1
        return res

    print(kmp_search("ababcababcabc", "abc"))   # [2, 7, 10]
    ```

**Rabin–Karp — băm cuộn**

```python
def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    if m > n:
        return []
    base, mod = 256, 10**9 + 7
    high = pow(base, m - 1, mod)     # trọng số của ký tự đầu cửa sổ
    ph = th = 0
    for i in range(m):               # băm ban đầu của mẫu và cửa sổ đầu
        ph = (ph * base + ord(pattern[i])) % mod
        th = (th * base + ord(text[i])) % mod
    res = []
    for i in range(n - m + 1):
        if ph == th and text[i:i + m] == pattern:   # băm trùng -> kiểm tra thật
            res.append(i)
        if i < n - m:                # cuộn cửa sổ: bỏ ký tự trái, thêm ký tự phải
            th = ((th - ord(text[i]) * high) * base + ord(text[i + m])) % mod
    return res

print(rabin_karp("abracadabra", "abra"))   # [0, 7]
```

**Longest Palindromic Substring — nở từ tâm**

```python
def longest_palindrome(s):
    if not s:
        return ""
    start, end = 0, 0
    def expand(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1          # nới hai biên khi còn đối xứng
        return l + 1, r - 1          # biên hợp lệ cuối cùng
    for i in range(len(s)):
        l1, r1 = expand(i, i)        # tâm lẻ (một ký tự)
        l2, r2 = expand(i, i + 1)    # tâm chẵn (giữa hai ký tự)
        if r1 - l1 > end - start:
            start, end = l1, r1
        if r2 - l2 > end - start:
            start, end = l2, r2
    return s[start:end + 1]

print(longest_palindrome("babad"))   # "bab" (hoặc "aba")
```

## Độ phức tạp

| Thuật toán | Thời gian | Bộ nhớ |
|-----------|-----------|--------|
| KMP | O(n + m) | O(m) |
| Rabin–Karp | O(n + m) trung bình | O(1) |
| Z-algorithm | O(n + m) | O(n + m) |
| Trie (chèn/tìm) | O(L) mỗi thao tác | O(tổng ký tự) |
| Edit distance | O(m·n) | O(m·n) |
| Hamming distance | O(n) | O(1) |
| Longest palindrome (nở tâm) | O(n²) | O(1) |

## Ưu / nhược điểm

- **Ưu:**
    - KMP/Z/Rabin–Karp đạt tuyến tính, vượt xa cách so khớp ngây thơ `O(n·m)`.
    - Trie truy vấn tiền tố cực nhanh, nền tảng cho autocomplete và tìm nhiều mẫu.
- **Nhược:**
    - Cài đặt (đặc biệt KMP, Manacher) dễ sai; cần hiểu kỹ mảng tiền tố.
    - Rabin–Karp có thể suy biến khi va chạm băm nhiều; Trie tốn bộ nhớ.

## Câu hỏi phỏng vấn thường gặp

1. Mảng LPS trong KMP nghĩa là gì và giúp tránh so sánh lại ra sao?
2. Rolling hash trong Rabin–Karp cập nhật thế nào khi cửa sổ trượt?
3. Phân biệt edit distance và Hamming distance.
4. Cài đặt trie và giải thích tra cứu theo tiền tố.
5. So sánh cách "nở từ tâm" `O(n²)` với Manacher `O(n)` cho chuỗi đối xứng dài nhất.

## Tham khảo

- [Pattern Searching — GeeksforGeeks](https://www.geeksforgeeks.org/pattern-searching/)
- [KMP Algorithm — Wikipedia](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm)
