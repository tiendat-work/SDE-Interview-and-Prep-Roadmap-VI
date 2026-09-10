# Thuật toán sắp xếp (Sorting Algorithms)

## Khái niệm

Sắp xếp (sorting) là quá trình sắp đặt lại các phần tử trong một tập dữ liệu theo một thứ tự xác định — thường là tăng dần hoặc giảm dần. Đây là một trong những nhóm thuật toán nền tảng nhất: nhiều bài toán khác (tìm kiếm nhị phân, gộp khoảng, hai con trỏ...) đều dựa trên dữ liệu đã được sắp xếp.

## Khi nào dùng / Vì sao quan trọng

- **Tiền xử lý (preprocessing):** rất nhiều thuật toán chạy nhanh hơn khi dữ liệu đã sắp (ví dụ tìm kiếm nhị phân cần mảng đã sắp).
- **So sánh / khử trùng lặp:** dữ liệu đã sắp giúp dễ phát hiện phần tử trùng hoặc gần nhau.
- **Câu hỏi phỏng vấn:** hiểu rõ đánh đổi (trade-off) giữa các thuật toán sắp xếp là kiến thức bắt buộc.

## Phân loại

Ta chia các thuật toán sắp xếp thành hai nhóm chính:

- **Nhóm dựa trên so sánh (comparison-based)** — so sánh từng cặp phần tử. Giới hạn lý thuyết là `O(n log n)`: Bubble, Selection, Insertion, Merge, Quick, Heap.
- **Nhóm không so sánh (non-comparison)** — dùng tính chất của khóa (giá trị số nguyên, chữ số...) để đạt tuyến tính `O(n)` trong điều kiện nhất định: Counting, Radix, Bucket.

Hai khái niệm cần nắm:

- **Tính ổn định (stability):** thuật toán ổn định giữ nguyên thứ tự tương đối của các phần tử có cùng khóa. Quan trọng khi sắp xếp theo nhiều tiêu chí.
- **Sắp xếp tại chỗ (in-place):** chỉ dùng `O(1)` bộ nhớ phụ, không cần mảng phụ lớn.

## Hoạt hình trực quan

Chọn thuật toán ở ô bên dưới để xem quá trình sắp xếp chạy động. Mỗi cột là một giá trị; hoạt hình tự trộn lại và lặp liên tục.

<div class="sv-legend">
  <span><i style="background:var(--sv-bar)"></i> chưa xử lý</span>
  <span><i style="background:var(--sv-compare)"></i> đang so sánh</span>
  <span><i style="background:var(--sv-swap)"></i> đang đổi chỗ</span>
  <span><i style="background:var(--sv-sorted)"></i> đã đúng vị trí</span>
</div>

<div class="sort-viz" data-algos="bubble,selection,insertion,merge,quick" data-size="32" data-speed="55"></div>

---

## 1. Bubble Sort (sắp xếp nổi bọt)

**Ý tưởng:** duyệt qua mảng nhiều lần, so sánh và đổi chỗ hai phần tử kề nhau nếu sai thứ tự; sau mỗi lượt, phần tử lớn nhất "nổi" dần về cuối. Nếu một lượt không đổi chỗ nào thì mảng đã sắp, dừng sớm.

**Các bước:** lặp `i` từ 0 đến `n-1`; ở mỗi lượt so sánh các cặp `(j, j+1)` và đổi chỗ nếu `arr[j] > arr[j+1]`.

=== "JavaScript"
    ```js
    function bubbleSort(arr) {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;                       // cờ tối ưu: phát hiện đã sắp xong
        for (let j = 0; j < n - 1 - i; j++) {      // phần cuối đã đúng vị trí
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];  // đổi chỗ
            swapped = true;
          }
        }
        if (!swapped) break;                       // không đổi chỗ nào -> đã sắp
      }
      return arr;
    }
    console.log(bubbleSort([5, 1, 4, 2, 8]));       // [1, 2, 4, 5, 8]
    ```
=== "Python"
    ```python
    def bubble_sort(arr):
        n = len(arr)
        for i in range(n - 1):
            swapped = False                          # cờ tối ưu
            for j in range(n - 1 - i):               # phần cuối đã đúng vị trí
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]  # đổi chỗ
                    swapped = True
            if not swapped:                          # không đổi chỗ nào -> đã sắp
                break
        return arr

    print(bubble_sort([5, 1, 4, 2, 8]))              # [1, 2, 4, 5, 8]
    ```

**Thời gian:** `O(n)` tốt nhất (đã sắp, nhờ cờ), `O(n²)` trung bình/xấu nhất — **Bộ nhớ:** `O(1)` — **Ổn định:** có.

---

## 2. Selection Sort (sắp xếp chọn)

**Ý tưởng:** chia mảng thành phần đã sắp (bên trái) và chưa sắp (bên phải). Mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp rồi đổi về đầu phần chưa sắp. Số lần đổi chỗ ít (tối đa `n-1`).

=== "JavaScript"
    ```js
    function selectionSort(arr) {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let min = i;                          // giả định phần tử nhỏ nhất là arr[i]
        for (let j = i + 1; j < n; j++) {
          if (arr[j] < arr[min]) min = j;     // tìm chỉ số nhỏ nhất thực sự
        }
        if (min !== i) {
          [arr[i], arr[min]] = [arr[min], arr[i]];  // đưa nhỏ nhất về đầu
        }
      }
      return arr;
    }
    console.log(selectionSort([64, 25, 12, 22, 11]));  // [11, 12, 22, 25, 64]
    ```
=== "Python"
    ```python
    def selection_sort(arr):
        n = len(arr)
        for i in range(n - 1):
            mn = i                              # giả định nhỏ nhất là arr[i]
            for j in range(i + 1, n):
                if arr[j] < arr[mn]:
                    mn = j                      # cập nhật chỉ số nhỏ nhất
            if mn != i:
                arr[i], arr[mn] = arr[mn], arr[i]  # đưa nhỏ nhất về đầu
        return arr

    print(selection_sort([64, 25, 12, 22, 11]))   # [11, 12, 22, 25, 64]
    ```

**Thời gian:** `O(n²)` mọi trường hợp — **Bộ nhớ:** `O(1)` — **Ổn định:** không (có thể làm ổn định nếu chèn thay vì đổi chỗ).

---

## 3. Insertion Sort (sắp xếp chèn)

**Ý tưởng:** xây dần mảng đã sắp bằng cách lấy từng phần tử và chèn vào đúng vị trí trong phần đã sắp phía trước (giống cách sắp bài trên tay). Rất nhanh với mảng nhỏ hoặc gần sắp.

=== "JavaScript"
    ```js
    function insertionSort(arr) {
      for (let i = 1; i < arr.length; i++) {
        const key = arr[i];       // phần tử cần chèn
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {  // dịch các phần tử lớn hơn sang phải
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;         // đặt key vào đúng chỗ
      }
      return arr;
    }
    console.log(insertionSort([12, 11, 13, 5, 6]));  // [5, 6, 11, 12, 13]
    ```
=== "Python"
    ```python
    def insertion_sort(arr):
        for i in range(1, len(arr)):
            key = arr[i]                # phần tử cần chèn
            j = i - 1
            while j >= 0 and arr[j] > key:   # dịch phần tử lớn hơn sang phải
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key            # đặt key vào đúng chỗ
        return arr

    print(insertion_sort([12, 11, 13, 5, 6]))   # [5, 6, 11, 12, 13]
    ```

**Thời gian:** `O(n)` tốt nhất (gần sắp), `O(n²)` trung bình/xấu nhất — **Bộ nhớ:** `O(1)` — **Ổn định:** có. Là thành phần của Timsort cho các đoạn ngắn.

---

## 4. Merge Sort (sắp xếp trộn)

**Ý tưởng:** chia để trị (divide and conquer) — chia đôi mảng, sắp xếp đệ quy hai nửa, rồi **trộn (merge)** hai nửa đã sắp thành một. Luôn đạt `O(n log n)`, ổn định, và là nền tảng của sắp xếp ngoài (external sort) khi dữ liệu không vừa RAM.

=== "JavaScript"
    ```js
    function mergeSort(arr) {
      if (arr.length <= 1) return arr;          // 0 hoặc 1 phần tử đã sắp sẵn
      const mid = arr.length >> 1;
      const left = mergeSort(arr.slice(0, mid));   // đệ quy nửa trái
      const right = mergeSort(arr.slice(mid));     // đệ quy nửa phải
      return merge(left, right);
    }

    function merge(left, right) {
      const result = [];
      let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);  // <= để ổn định
        else result.push(right[j++]);
      }
      return result.concat(left.slice(i)).concat(right.slice(j));
    }
    console.log(mergeSort([5, 2, 8, 1, 9, 3]));    // [1, 2, 3, 5, 8, 9]
    ```
=== "Python"
    ```python
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])     # đệ quy nửa trái
        right = merge_sort(arr[mid:])    # đệ quy nửa phải
        return merge(left, right)

    def merge(left, right):
        result = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:      # <= để giữ tính ổn định
                result.append(left[i]); i += 1
            else:
                result.append(right[j]); j += 1
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    print(merge_sort([5, 2, 8, 1, 9, 3]))    # [1, 2, 3, 5, 8, 9]
    ```

**Thời gian:** `O(n log n)` mọi trường hợp — **Bộ nhớ:** `O(n)` — **Ổn định:** có.

---

## 5. Quick Sort (sắp xếp nhanh)

**Ý tưởng:** chọn một phần tử **chốt (pivot)**, phân hoạch (partition) mảng thành phần nhỏ hơn và lớn hơn chốt, rồi đệ quy hai phần. Nhanh nhất trên thực tế do sắp tại chỗ và thân thiện với bộ nhớ đệm (cache).

=== "JavaScript"
    ```js
    function quickSort(arr, low = 0, high = arr.length - 1) {
      if (low < high) {
        const p = partition(arr, low, high);   // p là vị trí đúng của chốt
        quickSort(arr, low, p - 1);            // đệ quy phần trái
        quickSort(arr, p + 1, high);           // đệ quy phần phải
      }
      return arr;
    }

    function partition(arr, low, high) {
      const pivot = arr[high];   // chọn phần tử cuối làm chốt (Lomuto)
      let i = low - 1;
      for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];  // đưa phần tử nhỏ về trái
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];  // đặt chốt đúng chỗ
      return i + 1;
    }
    console.log(quickSort([5, 2, 8, 1, 9, 3]));   // [1, 2, 3, 5, 8, 9]
    ```
=== "Python"
    ```python
    def quick_sort(arr, low=0, high=None):
        if high is None:
            high = len(arr) - 1
        if low < high:
            p = partition(arr, low, high)   # p là vị trí đúng của chốt
            quick_sort(arr, low, p - 1)     # đệ quy phần trái
            quick_sort(arr, p + 1, high)    # đệ quy phần phải
        return arr

    def partition(arr, low, high):
        pivot = arr[high]       # chọn phần tử cuối làm chốt
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]  # đưa phần tử nhỏ về trái
        arr[i + 1], arr[high] = arr[high], arr[i + 1]  # đặt chốt đúng chỗ
        return i + 1

    print(quick_sort([5, 2, 8, 1, 9, 3]))    # [1, 2, 3, 5, 8, 9]
    ```

**Thời gian:** `O(n log n)` trung bình, `O(n²)` xấu nhất (chốt kém) — **Bộ nhớ:** `O(log n)` cho ngăn xếp đệ quy — **Ổn định:** không.

!!! tip "Tránh trường hợp xấu nhất O(n²)"
    Chọn chốt **ngẫu nhiên** hoặc dùng **trung vị của ba (median-of-three)** để tránh mảng đã sắp/gần sắp làm quick sort suy biến thành `O(n²)`.

### Thử ngay: Quick Sort in từng bước phân hoạch

<div class="js-demo" data-title="Quick Sort — in các bước phân hoạch">
<textarea class="js-demo-src">
let buoc = 0;

function partition(arr, low, high) {
  const pivot = arr[high];      // chốt là phần tử cuối đoạn
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

function quickSort(arr, low, high) {
  if (low < high) {
    const p = partition(arr, low, high);
    buoc++;
    print(`Bước ${buoc}: chốt=${arr[p]}, đoạn [${low}..${high}] -> [${arr.join(', ')}]`);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
}

const data = [5, 2, 8, 1, 9, 3, 7, 4];
print(`Mảng ban đầu: [${data.join(', ')}]`);
quickSort(data, 0, data.length - 1);
print(`Kết quả cuối: [${data.join(', ')}]`);
</textarea>
</div>

---

## 6. Heap Sort (sắp xếp vun đống)

**Ý tưởng:** xây một **đống cực đại (max-heap)** từ mảng, sau đó liên tục lấy phần tử lớn nhất ở gốc đưa về cuối rồi vun lại đống. Sắp tại chỗ và luôn `O(n log n)`, nhưng không thân thiện cache bằng quick sort.

=== "JavaScript"
    ```js
    function heapSort(arr) {
      const n = arr.length;
      // Xây max-heap: vun từ nút cha cuối cùng lên gốc
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
      // Lần lượt đưa gốc (lớn nhất) về cuối rồi vun lại
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
      }
      return arr;
    }

    function heapify(arr, n, i) {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;   // con trái, con phải
      if (l < n && arr[l] > arr[largest]) largest = l;
      if (r < n && arr[r] > arr[largest]) largest = r;
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);           // vun tiếp nhánh bị ảnh hưởng
      }
    }
    console.log(heapSort([12, 11, 13, 5, 6, 7]));  // [5, 6, 7, 11, 12, 13]
    ```
=== "Python"
    ```python
    def heapify(arr, n, i):
        largest = i
        l, r = 2 * i + 1, 2 * i + 2       # con trái, con phải
        if l < n and arr[l] > arr[largest]:
            largest = l
        if r < n and arr[r] > arr[largest]:
            largest = r
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            heapify(arr, n, largest)       # vun tiếp nhánh bị ảnh hưởng

    def heap_sort(arr):
        n = len(arr)
        for i in range(n // 2 - 1, -1, -1):   # xây max-heap
            heapify(arr, n, i)
        for i in range(n - 1, 0, -1):         # đưa gốc về cuối rồi vun lại
            arr[0], arr[i] = arr[i], arr[0]
            heapify(arr, i, 0)
        return arr

    print(heap_sort([12, 11, 13, 5, 6, 7]))   # [5, 6, 7, 11, 12, 13]
    ```

**Thời gian:** `O(n log n)` mọi trường hợp — **Bộ nhớ:** `O(1)` — **Ổn định:** không.

---

## 7. Counting Sort (sắp xếp đếm)

**Ý tưởng:** đếm số lần xuất hiện của mỗi khóa (số nguyên trong khoảng nhỏ `[0..k]`), rồi dùng tổng tích lũy (prefix sum) để đặt mỗi phần tử vào đúng vị trí. Không so sánh nên vượt giới hạn `O(n log n)`, nhưng chỉ dùng được khi miền giá trị `k` không quá lớn.

=== "JavaScript"
    ```js
    function countingSort(arr) {
      if (arr.length === 0) return arr;
      const max = Math.max(...arr);
      const count = new Array(max + 1).fill(0);
      for (const x of arr) count[x]++;          // đếm số lần xuất hiện
      const result = [];
      for (let v = 0; v <= max; v++) {          // duyệt theo thứ tự khóa tăng dần
        while (count[v]-- > 0) result.push(v);
      }
      return result;
    }
    console.log(countingSort([4, 2, 2, 8, 3, 3, 1]));  // [1, 2, 2, 3, 3, 4, 8]
    ```
=== "Python"
    ```python
    def counting_sort(arr):
        if not arr:
            return arr
        mx = max(arr)
        count = [0] * (mx + 1)
        for x in arr:
            count[x] += 1                 # đếm số lần xuất hiện
        result = []
        for v in range(mx + 1):           # duyệt theo khóa tăng dần
            result.extend([v] * count[v])
        return result

    print(counting_sort([4, 2, 2, 8, 3, 3, 1]))   # [1, 2, 2, 3, 3, 4, 8]
    ```

**Thời gian:** `O(n + k)` — **Bộ nhớ:** `O(k)` — **Ổn định:** có (khi cài bằng prefix sum duyệt từ phải). Dùng khi `k = O(n)`.

---

## 8. Radix Sort (sắp xếp cơ số)

**Ý tưởng:** sắp xếp số theo **từng chữ số**, từ hàng đơn vị lên hàng cao nhất, mỗi lượt dùng một sắp xếp ổn định (thường là counting sort) theo chữ số hiện tại. Nhờ tính ổn định, thứ tự các lượt trước được bảo toàn.

=== "JavaScript"
    ```js
    function radixSort(arr) {
      if (arr.length === 0) return arr;
      const max = Math.max(...arr);
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingByDigit(arr, exp);   // sắp ổn định theo chữ số tại vị trí exp
      }
      return arr;
    }

    function countingByDigit(arr, exp) {
      const n = arr.length;
      const output = new Array(n);
      const count = new Array(10).fill(0);
      for (let i = 0; i < n; i++) count[Math.floor(arr[i] / exp) % 10]++;
      for (let d = 1; d < 10; d++) count[d] += count[d - 1];   // prefix sum
      for (let i = n - 1; i >= 0; i--) {         // duyệt từ phải để giữ ổn định
        const digit = Math.floor(arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
      }
      for (let i = 0; i < n; i++) arr[i] = output[i];
    }
    console.log(radixSort([170, 45, 75, 90, 2, 802, 24, 66]));
    // [2, 24, 45, 66, 75, 90, 170, 802]
    ```
=== "Python"
    ```python
    def counting_by_digit(arr, exp):
        n = len(arr)
        output = [0] * n
        count = [0] * 10
        for x in arr:
            count[(x // exp) % 10] += 1
        for d in range(1, 10):
            count[d] += count[d - 1]        # prefix sum
        for i in range(n - 1, -1, -1):      # duyệt từ phải để giữ ổn định
            digit = (arr[i] // exp) % 10
            count[digit] -= 1
            output[count[digit]] = arr[i]
        arr[:] = output

    def radix_sort(arr):
        if not arr:
            return arr
        mx = max(arr)
        exp = 1
        while mx // exp > 0:
            counting_by_digit(arr, exp)
            exp *= 10
        return arr

    print(radix_sort([170, 45, 75, 90, 2, 802, 24, 66]))
    # [2, 24, 45, 66, 75, 90, 170, 802]
    ```

**Thời gian:** `O(d·(n + k))` với `d` là số chữ số, `k` là cơ số (10) — **Bộ nhớ:** `O(n + k)` — **Ổn định:** có.

---

## So sánh trực quan bằng số phép toán

Bấm **▶ Chạy** để so sánh số phép so sánh của các thuật toán trên cùng một mảng ngẫu nhiên. Sửa `n` để thấy khác biệt `O(n²)` và `O(n log n)` giãn ra ra sao.

<div class="js-demo" data-title="Đếm số phép so sánh: O(n²) vs O(n log n)">
<textarea class="js-demo-src">
function makeArray(n) {
  const a = [];
  for (let i = 0; i < n; i++) a.push(Math.floor(Math.random() * 1000));
  return a;
}

function bubbleCount(arr) {
  let c = 0;
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = 0; j < arr.length - 1 - i; j++) { c++; if (arr[j] > arr[j+1]) [arr[j],arr[j+1]]=[arr[j+1],arr[j]]; }
  return c;
}

function mergeCount(arr) {
  let c = 0;
  function ms(a) {
    if (a.length <= 1) return a;
    const m = a.length >> 1, L = ms(a.slice(0,m)), R = ms(a.slice(m)), out = [];
    let i = 0, j = 0;
    while (i < L.length && j < R.length) { c++; out.push(L[i] <= R[j] ? L[i++] : R[j++]); }
    return out.concat(L.slice(i)).concat(R.slice(j));
  }
  ms(arr);
  return c;
}

const n = 200;
const base = makeArray(n);
print(`Mảng ${n} phần tử ngẫu nhiên:`);
print(`  Bubble Sort: ${bubbleCount([...base])} phép so sánh  (~O(n²))`);
print(`  Merge Sort:  ${mergeCount([...base])} phép so sánh  (~O(n log n))`);
</textarea>
</div>

## Bảng độ phức tạp

| Thuật toán | Tốt nhất | Trung bình | Xấu nhất | Bộ nhớ | Ổn định | Tại chỗ |
|-----------|----------|-----------|----------|--------|---------|---------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | Có | Có |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | Không | Có |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | Có | Có |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | Có | Không |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | Không | Có |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | Không | Có |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | Có | Không |
| Radix | O(d(n+k)) | O(d(n+k)) | O(d(n+k)) | O(n + k) | Có | Không |

## Chọn thuật toán nào?

- **Mảng nhỏ hoặc gần sắp:** Insertion sort (nhanh, đơn giản).
- **Cần ổn định + đảm bảo `O(n log n)`:** Merge sort.
- **Nhanh nhất trên thực tế, sắp tại chỗ:** Quick sort (với chốt ngẫu nhiên).
- **Cần `O(n log n)` tại chỗ, không lo xấu nhất:** Heap sort.
- **Khóa là số nguyên miền hẹp:** Counting/Radix sort (đạt tuyến tính).
- **Thư viện chuẩn:** Python `sorted()` và Java `Arrays.sort()` (kiểu object) dùng **Timsort** — lai giữa merge và insertion sort, tối ưu cho dữ liệu thực tế có sẵn các đoạn đã sắp.

## Câu hỏi phỏng vấn thường gặp

1. Vì sao merge sort ổn định còn quick sort thì không?
2. Khi nào quick sort rơi vào `O(n²)` và làm sao tránh?
3. Counting sort và radix sort đạt tuyến tính bằng cách nào, và giới hạn của chúng là gì?
4. Python dùng thuật toán sắp xếp nào cho `sorted()`? (Timsort.)
5. Giải thích sự khác nhau giữa sắp xếp trong bộ nhớ (in-memory) và sắp xếp ngoài (external).
6. Vì sao heap sort tại chỗ và `O(n log n)` nhưng vẫn thường chậm hơn quick sort trong thực tế? (Kém thân thiện với cache, nhiều lần nhảy bộ nhớ.)

## Tham khảo

- [Sorting Algorithms — GeeksforGeeks](https://www.geeksforgeeks.org/sorting-algorithms/)
- [Timsort — Wikipedia](https://en.wikipedia.org/wiki/Timsort)
