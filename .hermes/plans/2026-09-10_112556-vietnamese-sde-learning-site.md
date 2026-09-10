# Kế hoạch: Trang web học kiến thức SDE (tiếng Việt) từ repo roadmap

## Goal
Biến repo `SDE-Interview-and-Prep-Roadmap` thành một trang web học tập tiếng Việt dùng MkDocs Material, tổng hợp lại toàn bộ nội dung hiện có + tóm tắt 2 cuốn sách PDF + viết mới nội dung chi tiết cho MỌI mục trong checklist README, rồi deploy lên GitHub Pages.

## Current context / assumptions
- Repo: `/Users/lycan/Projects/SDE-Interview-and-Prep-Roadmap`, branch `main`, remote `origin` (GitHub), working tree sạch (chỉ có `.idea/` untracked).
- Nội dung markdown ĐÃ CÓ (tiếng Anh, cần dịch + chuẩn hoá sang tiếng Việt):
  - `Data Structures/Arrays.md` (591 dòng), `Data Structures/LinkedList.md` (239), `Data Structures/LinkedList.py`
  - `Algorithms/Two-Pointer-Algo.md` (54), `Algorithms/Sliding-Window-Algo.md` (211), `Algorithms/Two-Pointer-Algo.py`
  - `Databases/database-interview-prep-guide.md` (1382)
  - `System Design/Microservices.md` (626), `System Design/RESTfulArchitecture.md` (416)
  - `Version Control Systems/Git.md` (284)
- PDF nguồn:
  - `SDE-Interview-and-Prep-Roadmap.pdf` (13 trang — bản checklist in ra, TRÙNG với README, KHÔNG cần tóm tắt riêng)
  - `System Design/Resources/System Design Interview by Alex Xu.pdf` (269 trang)
  - `System Design/Resources/Designing Data Intensive Applications by Martin Kleppmann.pdf` (613 trang)
- `README.md` chứa checklist đầy đủ 10 lĩnh vực (đây là "bản đồ" nội dung cần viết — xem mục Phụ lục A).
- Tooling sẵn có: Python 3.9.6, `pdftotext` (poppler), `node`/`npm`, `git`, `gh` (GitHub CLI). `mkdocs-material` CHƯA cài.
- Quyết định của chủ repo (đã xác nhận): (1) MkDocs Material; (2) phạm vi ĐẦY ĐỦ — viết chi tiết mọi mục con + tóm tắt sâu cả 2 cuốn sách (nhiều phiên); (3) deploy GitHub Pages.
- Ngôn ngữ nội dung: 100% tiếng Việt. Thuật ngữ kỹ thuật giữ tiếng Anh trong ngoặc lần đầu xuất hiện, ví dụ: "danh sách liên kết (linked list)". Code/identifier giữ nguyên tiếng Anh.

## Architecture / proposed approach
Dùng MkDocs Material: viết nội dung thuần Markdown trong `docs/`, cấu hình `mkdocs.yml` (nav + theme tiếng Việt + search + dark mode + code highlight + admonitions). Nội dung được tổ chức theo 10 lĩnh vực của README, cộng một mục "Tóm tắt sách". Vì khối lượng rất lớn (hàng trăm trang chủ đề), triển khai theo LÀN SÓNG (wave): hạ tầng trước → di cư & dịch nội dung có sẵn → trích xuất + tóm tắt sách → viết mới theo lô (batch) bằng subagent song song, bám một TEMPLATE trang chuẩn và một MANIFEST theo dõi tiến độ. Deploy bằng GitHub Actions.

Quy ước chung xuyên suốt:
- Mọi file nội dung nằm trong `docs/`, đặt tên kebab-case không dấu, ví dụ `docs/cau-truc-du-lieu/mang.md`.
- Mỗi trang chủ đề bám `docs/_TEMPLATE.md` (xem Task 2.2).
- Tiến độ ghi trong `CONTENT_MANIFEST.md` ở gốc repo (checkbox từng trang) — nguồn sự thật duy nhất để điều phối subagent, tránh trùng/sót.
- Commit thường xuyên: mỗi task (hoặc mỗi lô trang) là một commit riêng.

---

## WAVE 0 — Khởi tạo hạ tầng MkDocs

### Task 0.1 — Tạo virtualenv + cài dependencies
File: `requirements.txt` (mới, ở gốc repo)
```
mkdocs-material==9.5.39
mkdocs-material[imaging]
pymdown-extensions==10.11.2
mkdocs-minify-plugin==0.8.0
```
Lệnh:
```bash
cd /Users/lycan/Projects/SDE-Interview-and-Prep-Roadmap
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
Kỳ vọng: `pip` cài xong không lỗi; `mkdocs --version` in ra `mkdocs, version 1.6.x`.
Verify:
```bash
mkdocs --version
```

### Task 0.2 — Bỏ qua artefact khỏi git
File: `.gitignore` (mới/ghi đè ở gốc repo)
```
.venv/
site/
.idea/
__pycache__/
*.pyc
.DS_Store
_pdf_extract/
```
Verify:
```bash
git status --porcelain | grep -E '\.venv|site/' ; echo "exit=$?"
```
Kỳ vọng: không in dòng nào (exit=1 từ grep là đúng — nghĩa là không còn bị track).

### Task 0.3 — Cấu hình `mkdocs.yml`
File: `mkdocs.yml` (mới, gốc repo). LƯU Ý: sửa `site_url`/`repo_url` cho đúng remote thật (lấy bằng `git remote get-url origin`).
```yaml
site_name: Lộ trình ôn thi Kỹ sư phần mềm (SDE)
site_description: Tổng hợp kiến thức phỏng vấn SDE bằng tiếng Việt
site_url: https://<USER>.github.io/SDE-Interview-and-Prep-Roadmap/
repo_url: https://github.com/<USER>/SDE-Interview-and-Prep-Roadmap
repo_name: SDE-Interview-and-Prep-Roadmap
docs_dir: docs
copyright: "Tổng hợp phục vụ học tập"

theme:
  name: material
  language: vi
  palette:
    - media: "(prefers-color-scheme: light)"
      scheme: default
      primary: teal
      accent: teal
      toggle:
        icon: material/weather-night
        name: Chuyển sang nền tối
    - media: "(prefers-color-scheme: dark)"
      scheme: slate
      primary: teal
      accent: teal
      toggle:
        icon: material/weather-sunny
        name: Chuyển sang nền sáng
  features:
    - navigation.instant
    - navigation.tracking
    - navigation.tabs
    - navigation.sections
    - navigation.top
    - navigation.indexes
    - toc.follow
    - search.suggest
    - search.highlight
    - content.code.copy
    - content.code.annotate

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.highlight:
      anchor_linenums: true
  - pymdownx.inlinehilite
  - pymdownx.tabbed:
      alternate_style: true
  - pymdownx.arithmatex:
      generic: true
  - attr_list
  - md_in_html
  - tables
  - footnotes
  - toc:
      permalink: true

plugins:
  - search:
      lang: vi
  - minify:
      minify_html: true

extra_javascript:
  - https://unpkg.com/mathjax@3/es5/tex-mml-chtml.js

# nav: được bổ sung dần ở Task 1.3, mở rộng mỗi wave. Tạm thời để trống
# để MkDocs tự sinh nav theo cây thư mục docs/.
```
Verify: sau khi có `docs/index.md` (Task 0.4):
```bash
mkdocs build --strict 2>&1 | tail -5
```
Kỳ vọng: `INFO - Documentation built in ...` và KHÔNG có dòng `WARNING`/`ERROR` (vì `--strict` sẽ fail nếu có link hỏng). Nếu lần đầu còn thiếu trang trong nav thì bỏ `--strict` cho tới Wave 1.

### Task 0.4 — Trang chủ
File: `docs/index.md` (mới)
```markdown
# Lộ trình ôn thi Kỹ sư phần mềm (SDE)

Chào mừng bạn đến với bộ tài liệu tổng hợp kiến thức phỏng vấn **Kỹ sư phát triển phần mềm (Software Development Engineer — SDE)** bằng tiếng Việt.

Tài liệu được chia theo 10 lĩnh vực lớn. Mỗi chủ đề được tóm tắt ngắn gọn nhưng đủ chi tiết để hiểu bản chất, kèm ví dụ và độ phức tạp khi phù hợp.

## Các lĩnh vực
- [Cấu trúc dữ liệu](cau-truc-du-lieu/index.md)
- [Giải thuật](giai-thuat/index.md)
- [Thiết kế hệ thống](thiet-ke-he-thong/index.md)
- [Hệ điều hành](he-dieu-hanh/index.md)
- [Mạng máy tính](mang-may-tinh/index.md)
- [Cơ sở dữ liệu](co-so-du-lieu/index.md)
- [Ngôn ngữ & khái niệm lập trình](ngon-ngu-lap-trinh/index.md)
- [Kiến trúc hệ thống](kien-truc-he-thong/index.md)
- [Giải quyết vấn đề & coding](giai-quyet-van-de/index.md)
- [Hệ thống quản lý phiên bản](quan-ly-phien-ban/index.md)
- [Tóm tắt sách](tom-tat-sach/index.md)

> Xem tiến độ biên soạn tại `CONTENT_MANIFEST.md` trong repo.
```
Commit: `git add -A && git commit -m "chore: khởi tạo hạ tầng MkDocs Material tiếng Việt"`

---

## WAVE 1 — Khung thư mục, template, manifest

### Task 1.1 — Tạo cây thư mục `docs/` theo 10 lĩnh vực + sách
Lệnh:
```bash
cd /Users/lycan/Projects/SDE-Interview-and-Prep-Roadmap
for d in cau-truc-du-lieu giai-thuat thiet-ke-he-thong he-dieu-hanh \
         mang-may-tinh co-so-du-lieu ngon-ngu-lap-trinh kien-truc-he-thong \
         giai-quyet-van-de quan-ly-phien-ban tom-tat-sach; do
  mkdir -p "docs/$d"
done
ls docs
```
Kỳ vọng: liệt kê đủ 11 thư mục + `index.md`.

### Task 1.2 — Trang `index.md` cho từng lĩnh vực
Mỗi thư mục `docs/<linh-vuc>/index.md` là trang "mục lục" của lĩnh vực: tiêu đề tiếng Việt + đoạn giới thiệu 2-3 câu + danh sách liên kết tới các trang con (điền dần khi trang con ra đời). Ví dụ `docs/cau-truc-du-lieu/index.md`:
```markdown
# Cấu trúc dữ liệu

Cấu trúc dữ liệu là cách tổ chức và lưu trữ dữ liệu để truy cập và xử lý hiệu quả. Phần này trình bày các cấu trúc nền tảng thường gặp trong phỏng vấn SDE.

## Nội dung
- [Mảng (Array)](mang.md)
- [Danh sách liên kết (Linked List)](danh-sach-lien-ket.md)
- ... (bổ sung khi viết thêm)
```
(Tạo 11 file index tương tự — dùng tên tiếng Việt ở Phụ lục A.)

### Task 1.3 — Khai báo `nav` trong `mkdocs.yml`
Thêm khối `nav:` vào `mkdocs.yml`, mỗi lĩnh vực là một tab trỏ tới `index.md` của nó + các trang con (cập nhật mỗi khi thêm trang). Ví dụ khởi đầu:
```yaml
nav:
  - Trang chủ: index.md
  - Cấu trúc dữ liệu:
      - cau-truc-du-lieu/index.md
  - Giải thuật:
      - giai-thuat/index.md
  - Thiết kế hệ thống:
      - thiet-ke-he-thong/index.md
  - Hệ điều hành:
      - he-dieu-hanh/index.md
  - Mạng máy tính:
      - mang-may-tinh/index.md
  - Cơ sở dữ liệu:
      - co-so-du-lieu/index.md
  - Ngôn ngữ lập trình:
      - ngon-ngu-lap-trinh/index.md
  - Kiến trúc hệ thống:
      - kien-truc-he-thong/index.md
  - Giải quyết vấn đề:
      - giai-quyet-van-de/index.md
  - Quản lý phiên bản:
      - quan-ly-phien-ban/index.md
  - Tóm tắt sách:
      - tom-tat-sach/index.md
```
Verify:
```bash
mkdocs build --strict 2>&1 | tail -3
```
Kỳ vọng: build thành công, không WARNING/ERROR.

### Task 2.1 — Template trang chủ đề
File: `docs/_TEMPLATE.md` (mới). MkDocs bỏ qua file bắt đầu bằng `_`. Đây là khuôn mọi trang chủ đề phải theo:
```markdown
# <Tên chủ đề tiếng Việt> (<English term>)

## Khái niệm
<2-4 câu định nghĩa bản chất, dễ hiểu.>

## Khi nào dùng / Vì sao quan trọng
<Bối cảnh sử dụng, vấn đề nó giải quyết.>

## Cách hoạt động
<Giải thích cơ chế, kèm sơ đồ bằng chữ/bảng nếu cần.>

## Ví dụ
```python
# code minh hoạ ngắn, có chú thích tiếng Việt
```

## Độ phức tạp (nếu có)
| Thao tác | Thời gian | Bộ nhớ |
|----------|-----------|--------|
| ...      | O(...)    | O(...) |

## Ưu / nhược điểm
- **Ưu:** ...
- **Nhược:** ...

## Câu hỏi phỏng vấn thường gặp
1. ...
2. ...

## Tham khảo
- <nguồn nếu có>
```
Quy ước độ dài: mỗi trang ~150-400 dòng, "ngắn gọn nhưng đủ chi tiết để hiểu". Không bắt buộc đủ mọi mục (ví dụ chủ đề lý thuyết không cần bảng độ phức tạp) — bỏ mục không liên quan.

### Task 2.2 — Manifest theo dõi tiến độ
File: `CONTENT_MANIFEST.md` (mới, gốc repo). Liệt kê MỌI trang cần có (từ Phụ lục A), mỗi dòng một checkbox + đường dẫn file + trạng thái. Đây là bảng điều phối subagent. Khung:
```markdown
# Tiến độ biên soạn nội dung

Trạng thái: [ ] chưa làm · [~] đang làm (ghi tên agent) · [x] xong & build pass

## 1. Cấu trúc dữ liệu
- [ ] docs/cau-truc-du-lieu/mang.md  (di cư từ Data Structures/Arrays.md)
- [ ] docs/cau-truc-du-lieu/danh-sach-lien-ket.md  (di cư từ LinkedList.md)
- [ ] docs/cau-truc-du-lieu/ngan-xep.md
- [ ] docs/cau-truc-du-lieu/hang-doi.md
- [ ] docs/cau-truc-du-lieu/cay.md
- [ ] docs/cau-truc-du-lieu/do-thi.md
- [ ] docs/cau-truc-du-lieu/bang-bam.md
## 2. Giải thuật
- [ ] docs/giai-thuat/sap-xep.md
- [ ] docs/giai-thuat/tim-kiem.md
- [ ] docs/giai-thuat/quy-hoach-dong.md
- [ ] docs/giai-thuat/tham-lam.md
- [ ] docs/giai-thuat/chia-de-tri.md
- [ ] docs/giai-thuat/thuat-toan-chuoi.md
- [ ] docs/giai-thuat/hai-con-tro.md  (di cư Two-Pointer-Algo.md)
- [ ] docs/giai-thuat/cua-so-truot.md  (di cư Sliding-Window-Algo.md)
... (tiếp tục đủ 10 lĩnh vực + 2 trang tóm tắt sách — xem Phụ lục A)
```
Commit: `git add -A && git commit -m "docs: khung thư mục, template trang, manifest nội dung"`

---

## WAVE 2 — Di cư & dịch nội dung đã có (ưu tiên, ít rủi ro)

Quy tắc: mỗi file cũ → một trang `docs/...` tương ứng theo Phụ lục A, DỊCH sang tiếng Việt theo `docs/_TEMPLATE.md`, gộp file `.py` liên quan vào mục "Ví dụ" dưới dạng code block. File gốc cũ GIỮ NGUYÊN (không xoá, để đối chiếu) cho tới khi chủ repo xác nhận.

### Task 3.1 — Di cư Data Structures
- `Data Structures/Arrays.md` → `docs/cau-truc-du-lieu/mang.md`
- `Data Structures/LinkedList.md` + `LinkedList.py` → `docs/cau-truc-du-lieu/danh-sach-lien-ket.md`
Dịch toàn bộ sang tiếng Việt, giữ code. Đánh dấu `[x]` trong manifest.

### Task 3.2 — Di cư Algorithms
- `Algorithms/Two-Pointer-Algo.md` + `.py` → `docs/giai-thuat/hai-con-tro.md`
- `Algorithms/Sliding-Window-Algo.md` → `docs/giai-thuat/cua-so-truot.md`

### Task 3.3 — Di cư còn lại
- `Databases/database-interview-prep-guide.md` → `docs/co-so-du-lieu/cam-nang-phong-van-csdl.md`
- `System Design/Microservices.md` → `docs/kien-truc-he-thong/microservices.md`
- `System Design/RESTfulArchitecture.md` → `docs/kien-truc-he-thong/rest.md`
- `Version Control Systems/Git.md` → `docs/quan-ly-phien-ban/git.md`

Verify (sau mỗi task): cập nhật `nav` + chạy
```bash
mkdocs build --strict 2>&1 | tail -3
```
Kỳ vọng: không WARNING/ERROR.
Commit mỗi task: `git commit -m "docs(di-cu): <lĩnh vực> — dịch sang tiếng Việt"`

---

## WAVE 3 — Trích xuất & tóm tắt 2 cuốn sách

### Task 4.1 — Trích text PDF ra thư mục tạm
Lệnh:
```bash
cd /Users/lycan/Projects/SDE-Interview-and-Prep-Roadmap
mkdir -p _pdf_extract
pdftotext -layout "System Design/Resources/System Design Interview by Alex Xu.pdf" _pdf_extract/alex-xu.txt
pdftotext -layout "System Design/Resources/Designing Data Intensive Applications by Martin Kleppmann.pdf" _pdf_extract/ddia.txt
wc -l _pdf_extract/*.txt
```
Kỳ vọng: sinh 2 file `.txt` khác rỗng (vài nghìn dòng mỗi file). `_pdf_extract/` đã nằm trong `.gitignore`.
Ghi chú: nếu PDF là ảnh scan (text rỗng), chuyển sang OCR qua skill `pdf` — kiểm tra bằng `head -50 _pdf_extract/alex-xu.txt`.

### Task 4.2 — Tóm tắt "System Design Interview" (Alex Xu)
File: `docs/tom-tat-sach/system-design-interview-alex-xu.md`
Tóm tắt sâu theo từng chương (sách có khung chương rõ: ước lượng back-of-envelope, framework 4 bước, rate limiter, consistent hashing, key-value store, unique ID, URL shortener, web crawler, notification, news feed, chat, search autocomplete, YouTube, Google Drive...). Mỗi chương một mục `##`, 150-300 từ tiếng Việt, nêu: vấn đề, các quyết định thiết kế chính, trade-off, sơ đồ bằng chữ. Nguồn đọc từ `_pdf_extract/alex-xu.txt`.

### Task 4.3 — Tóm tắt "Designing Data-Intensive Applications" (Kleppmann)
File: `docs/tom-tat-sach/ddia-kleppmann.md`
Tóm tắt theo 12 chương (Reliable/Scalable/Maintainable, Data models, Storage & retrieval, Encoding, Replication, Partitioning, Transactions, Trouble with distributed systems, Consistency & consensus, Batch, Stream, Future). Mỗi chương `##`, 200-350 từ tiếng Việt. Nguồn `_pdf_extract/ddia.txt`.

File: `docs/tom-tat-sach/index.md` — mục lục 2 cuốn + 1 đoạn mô tả.
Verify: `mkdocs build --strict`. Commit: `git commit -m "docs(sach): tóm tắt Alex Xu & DDIA (tiếng Việt)"`

---

## WAVE 4 — Viết mới nội dung toàn bộ checklist (song song bằng subagent)

Đây là phần lớn nhất. Chia theo LÔ độc lập (mỗi lô = 1 subagent), bám `docs/_TEMPLATE.md`, cập nhật `CONTENT_MANIFEST.md` trước/sau. Mỗi lô là một nhánh công việc riêng, commit riêng. Điều phối: trước khi giao, đánh `[~] <agent>` vào manifest để không trùng; xong thì `[x]`.

Nguyên tắc giao cho subagent (context cần truyền đủ vì subagent không biết hội thoại này):
- Đường dẫn repo + vị trí `docs/_TEMPLATE.md` + yêu cầu "100% tiếng Việt, thuật ngữ Anh trong ngoặc lần đầu".
- Danh sách file cần tạo (từ manifest) + các mục con README tương ứng (Phụ lục A).
- Lệnh tự kiểm: `source .venv/bin/activate && mkdocs build --strict`.
- Yêu cầu cập nhật `nav` trong `mkdocs.yml` cho các trang mới + tick manifest.

Đề xuất chia lô (mỗi lô ~5-10 trang, chạy tối đa vài subagent song song):
- Lô A — CTDL còn lại: `ngan-xep.md`, `hang-doi.md`, `cay.md`, `do-thi.md`, `bang-bam.md`
- Lô B — Giải thuật: `sap-xep.md`, `tim-kiem.md`, `quy-hoach-dong.md`, `tham-lam.md`, `chia-de-tri.md`, `thuat-toan-chuoi.md`
- Lô C — Thiết kế hệ thống: `design-patterns.md`, `nguyen-ly-oop.md`, `scalability.md`, `he-phan-tan.md`, `microservices-kien-truc.md`, `thiet-ke-csdl.md`
- Lô D — Hệ điều hành: `tien-trinh-luong.md`, `dong-bo-hoa.md`, `deadlock.md`, `lap-lich.md`, `quan-ly-bo-nho.md`, `he-thong-tep.md`
- Lô E — Mạng: `tcp-ip.md`, `http.md`, `dns.md`, `dinh-tuyen.md`
- Lô F — CSDL (bổ sung ngoài cẩm nang đã di cư): `sql.md`, `nosql.md`, `acid.md`, `chi-muc.md`, `giao-dich.md`
- Lô G — Ngôn ngữ lập trình: `paradigm.md`, `quan-ly-bo-nho.md`, `concurrency.md`, `xu-ly-loi.md`, `functional.md`, `oop.md`, `bat-dong-bo.md`, `type-system.md`, `garbage-collection.md`, `de-quy.md`
- Lô H — Kiến trúc hệ thống (bổ sung): `client-server.md`, `soa.md`, `message-queue.md`, `eda.md`, `layered.md`, `caching.md`
- Lô I — Giải quyết vấn đề: `chien-luoc.md`, `ky-thuat-coding.md`, `best-practices.md`, `do-phuc-tap.md`, `debugging.md`, `toi-uu.md`
- Lô J — Quản lý phiên bản (bổ sung): `bitbucket.md`

Verify mỗi lô:
```bash
source .venv/bin/activate && mkdocs build --strict 2>&1 | tail -3
```
Kỳ vọng: không WARNING/ERROR. Commit mỗi lô: `git commit -m "docs(<lĩnh vực>): viết mới nội dung tiếng Việt (lô X)"`

Tiêu chí "xong Wave 4": mọi dòng trong `CONTENT_MANIFEST.md` đã `[x]`. Kiểm:
```bash
grep -c '^\- \[ \]' CONTENT_MANIFEST.md
```
Kỳ vọng: `0`.

---

## WAVE 5 — Kiểm tra chất lượng & deploy GitHub Pages

### Task 6.1 — Kiểm link & build nghiêm ngặt
```bash
source .venv/bin/activate && mkdocs build --strict 2>&1 | tee _pdf_extract/build.log | tail -10
```
Kỳ vọng: `Documentation built`, không WARNING (link hỏng, ảnh thiếu sẽ hiện ở đây).

### Task 6.2 — Xem thử local
```bash
mkdocs serve -a 127.0.0.1:8000
```
Verify: mở `http://127.0.0.1:8000`, kiểm tra: nav đủ 11 mục, search gõ tiếng Việt có dấu hoạt động, toggle dark/light chạy, vài trang bất kỳ hiển thị code highlight + bảng. (Chủ repo mở trình duyệt; agent tự kiểm bằng `curl -s 127.0.0.1:8000 | grep -c '<title>'` nếu cần xác nhận server sống.)

### Task 6.3 — GitHub Actions deploy
File: `.github/workflows/deploy.yml` (mới)
```yaml
name: Deploy MkDocs to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: mkdocs gh-deploy --force --strict
```
Sau khi push lên `main`: vào GitHub → Settings → Pages → Source chọn nhánh `gh-pages` (Action tự tạo). (Bước bật Pages là thao tác trên web của chủ repo — KHÔNG tự làm trong plan mode.)
Verify:
```bash
gh run list --workflow=deploy.yml --limit 1
```
Kỳ vọng: run gần nhất `completed success`. Trang truy cập tại `site_url` đã khai trong `mkdocs.yml`.
Commit: `git commit -m "ci: deploy MkDocs lên GitHub Pages"`

### Task 6.4 — Cập nhật README trỏ sang site
Thêm vào đầu `README.md` dòng: `> 📘 Bản web tiếng Việt: <site_url>` (giữ nguyên phần checklist cũ).

---

## Tests / validation (tổng hợp)
- Không có unit test truyền thống (đây là dự án nội dung). "Test" = `mkdocs build --strict` phải sạch sau MỖI task có đụng `docs/`/`mkdocs.yml`. `--strict` biến link hỏng/nav sai thành lỗi fail-build → đóng vai trò test hồi quy.
- Kiểm phủ nội dung: `grep -c '^\- \[ \]' CONTENT_MANIFEST.md` phải về `0` khi kết thúc Wave 4.
- Kiểm ngôn ngữ (phát hiện trang còn sót tiếng Anh lớn): rà thủ công khi review từng lô; không tự động hoá để tránh dương tính giả với thuật ngữ Anh.
- Kiểm deploy: `gh run list` báo success + truy cập được URL.

## Risks, tradeoffs, open questions
- **Khối lượng rất lớn:** checklist README có hàng trăm mục con; plan gom về ~55-65 trang chủ đề ở cấp hợp lý (mỗi trang gộp nhiều mục con, ví dụ "Sắp xếp" gộp mọi thuật toán sort). Nếu chủ repo muốn tách nhỏ hơn (mỗi thuật toán 1 trang) thì số trang tăng gấp nhiều lần — CẦN xác nhận độ chi tiết trước khi chạy Wave 4. (Open question 1)
- **Chất lượng tóm tắt PDF:** tóm tắt từ text trích `pdftotext` có thể lệ thuộc chất lượng OCR/layout; cần spot-check vài chương với PDF gốc. Bản quyền: đây là tóm tắt học tập nội bộ, không copy nguyên văn.
- **Nhất quán giữa các subagent:** rủi ro văn phong/thuật ngữ lệch nhau. Giảm thiểu bằng `_TEMPLATE.md` + một "bảng thuật ngữ" (cân nhắc thêm `docs/thuat-ngu.md`). (Open question 2: có cần bảng thuật ngữ Anh–Việt thống nhất không?)
- **File gốc tiếng Anh:** plan giữ lại; hỏi chủ repo có muốn xoá/đưa vào `legacy/` sau khi di cư xong không. (Open question 3)
- **`site_url`/`<USER>`:** phải điền đúng username GitHub thật trước khi deploy, nếu không GitHub Pages sẽ sai đường dẫn.

## Phụ lục A — Bản đồ checklist README → trang docs
(Trích từ README.md; dùng để điền `CONTENT_MANIFEST.md` và giao lô Wave 4.)
1. Cấu trúc dữ liệu → Mảng, Danh sách liên kết, Ngăn xếp (stack), Hàng đợi (queue), Cây (tree/BST/AVL/B-tree/heap/trie), Đồ thị (graph), Bảng băm (hash table).
2. Giải thuật → Sắp xếp, Tìm kiếm, Quy hoạch động, Tham lam, Chia để trị, Thuật toán chuỗi, Hai con trỏ, Cửa sổ trượt.
3. Thiết kế hệ thống → Design patterns (creational/structural/behavioral), Nguyên lý OOP/SOLID, Scalability, Hệ phân tán, Microservices, Thiết kế & tối ưu CSDL.
4. Hệ điều hành → Tiến trình & luồng, Đồng bộ hoá (mutex/semaphore/monitor), Deadlock, Lập lịch, Quản lý bộ nhớ, Hệ thống tệp.
5. Mạng máy tính → TCP/IP & OSI, HTTP, DNS, Định tuyến.
6. Cơ sở dữ liệu → SQL (DDL/DML/DCL/DQL, chuẩn hoá, join, transaction, view, trigger, stored proc), NoSQL, ACID, Chỉ mục, Giao dịch & mức cô lập. (cẩm nang lớn đã di cư ở Wave 2)
7. Ngôn ngữ & khái niệm lập trình → Paradigm, Quản lý bộ nhớ, Concurrency, Xử lý lỗi, Functional, OOP, Bất đồng bộ, Type system, Garbage collection, Đệ quy, Regex, Virtual memory.
8. Kiến trúc hệ thống → Client-server, REST (đã di cư), SOA, Message queue, Microservices (đã di cư), EDA, Layered, Caching.
9. Giải quyết vấn đề & coding → Chiến lược, Kỹ thuật coding, Best practices, Độ phức tạp (Big O/Ω/Θ), Debugging, Tối ưu.
10. Quản lý phiên bản → Git (đã di cư), Bitbucket.
Sách → Alex Xu (System Design Interview), Kleppmann (DDIA).
