# Cơ sở dữ liệu quan hệ & SQL (Relational Database & SQL)

## Khái niệm
Cơ sở dữ liệu quan hệ (relational database) tổ chức dữ liệu thành các bảng (table) gồm hàng (row) và cột (column), với quan hệ giữa các bảng biểu diễn qua khoá (key). SQL (Structured Query Language) là ngôn ngữ chuẩn để định nghĩa, thao tác và truy vấn dữ liệu trong các hệ quản trị như MySQL, PostgreSQL, SQL Server, Oracle.

## Khi nào dùng / Vì sao quan trọng
Dùng khi dữ liệu có cấu trúc rõ ràng, quan hệ chặt chẽ, cần đảm bảo toàn vẹn (integrity) và giao dịch ACID: hệ thống ngân hàng, thương mại điện tử, ERP. SQL là kỹ năng nền tảng của mọi kỹ sư backend và là chủ đề gần như chắc chắn xuất hiện trong phỏng vấn.

## Cách hoạt động

### Bốn nhóm câu lệnh SQL
| Nhóm | Tên đầy đủ | Mục đích | Lệnh tiêu biểu |
|------|-----------|----------|----------------|
| DDL | Data Definition Language | Định nghĩa cấu trúc | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DML | Data Manipulation Language | Thao tác dữ liệu | `INSERT`, `UPDATE`, `DELETE` |
| DQL | Data Query Language | Truy vấn dữ liệu | `SELECT` |
| DCL | Data Control Language | Phân quyền | `GRANT`, `REVOKE` |

> Ghi chú: `COMMIT`, `ROLLBACK`, `SAVEPOINT` thuộc nhóm TCL (Transaction Control Language) — xem trang Giao dịch.

### DDL — định nghĩa cấu trúc
```sql
CREATE TABLE nhan_vien (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    ho_ten      VARCHAR(100) NOT NULL,
    phong_id    INT,
    luong       DECIMAL(12,2) CHECK (luong >= 0),
    ngay_vao    DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (phong_id) REFERENCES phong_ban(id)  -- khoá ngoại
);

ALTER TABLE nhan_vien ADD COLUMN email VARCHAR(120) UNIQUE;
```

### DML — thao tác dữ liệu
```sql
INSERT INTO nhan_vien (ho_ten, phong_id, luong) VALUES ('Lan', 1, 15000000);
UPDATE nhan_vien SET luong = luong * 1.1 WHERE phong_id = 1;  -- tăng 10%
DELETE FROM nhan_vien WHERE ngay_vao < '2015-01-01';
```

## Chuẩn hoá (Normalization)
Chuẩn hoá loại bỏ dư thừa (redundancy) và bất thường khi cập nhật (update anomaly).

| Dạng chuẩn | Điều kiện |
|------------|-----------|
| 1NF | Mỗi ô chứa giá trị nguyên tử (atomic), không có nhóm lặp |
| 2NF | Đạt 1NF + không phụ thuộc bộ phận vào khoá chính (partial dependency) |
| 3NF | Đạt 2NF + không phụ thuộc bắc cầu (transitive dependency) |
| BCNF | Đạt 3NF + mọi phụ thuộc hàm đều có vế trái là siêu khoá (superkey) |

Thực tế thường chuẩn hoá tới 3NF, đôi khi **phi chuẩn hoá (denormalize)** có chủ đích để tăng tốc đọc.

## Truy vấn (DQL)

### Các loại JOIN
```sql
-- INNER JOIN: chỉ hàng khớp ở cả hai bảng
SELECT nv.ho_ten, pb.ten
FROM nhan_vien nv
INNER JOIN phong_ban pb ON nv.phong_id = pb.id;

-- LEFT OUTER JOIN: giữ mọi hàng bảng trái, thiếu thì NULL
SELECT nv.ho_ten, pb.ten
FROM nhan_vien nv
LEFT JOIN phong_ban pb ON nv.phong_id = pb.id;

-- CROSS JOIN: tích Descartes mọi cặp hàng
SELECT a.mau, b.size FROM mau a CROSS JOIN size b;
```

| Loại JOIN | Kết quả |
|-----------|---------|
| INNER | Giao — chỉ hàng khớp |
| LEFT / RIGHT OUTER | Giữ toàn bộ bảng trái / phải |
| FULL OUTER | Hợp — giữ cả hai, thiếu thì NULL |
| CROSS | Tích Descartes (m × n hàng) |

### Aggregate + GROUP BY / HAVING
```sql
SELECT phong_id, COUNT(*) AS so_nv, AVG(luong) AS luong_tb
FROM nhan_vien
GROUP BY phong_id
HAVING AVG(luong) > 12000000  -- lọc SAU khi gộp nhóm
ORDER BY luong_tb DESC;
```
`WHERE` lọc từng hàng **trước** khi gộp; `HAVING` lọc nhóm **sau** khi gộp.

### Subquery (truy vấn con)
```sql
-- Nhân viên có lương cao hơn trung bình toàn công ty
SELECT ho_ten, luong FROM nhan_vien
WHERE luong > (SELECT AVG(luong) FROM nhan_vien);
```

### Window function (hàm cửa sổ)
Tính toán trên một "cửa sổ" hàng mà **không** gộp chúng lại thành một dòng.
```sql
SELECT ho_ten, phong_id, luong,
       RANK() OVER (PARTITION BY phong_id ORDER BY luong DESC) AS hang_luong
FROM nhan_vien;
```

## Đối tượng khác

### View (khung nhìn)
Bảng ảo dựa trên câu truy vấn, dùng để đơn giản hoá và kiểm soát truy cập.
```sql
CREATE VIEW nv_luong_cao AS
SELECT ho_ten, luong FROM nhan_vien WHERE luong > 20000000;
```

### Stored procedure (thủ tục lưu sẵn)
```sql
CREATE PROCEDURE tang_luong(IN p_phong INT, IN p_ty_le DECIMAL(4,2))
BEGIN
    UPDATE nhan_vien SET luong = luong * p_ty_le WHERE phong_id = p_phong;
END;
```

### Trigger (bộ kích hoạt)
Tự động chạy khi có sự kiện INSERT/UPDATE/DELETE.
```sql
CREATE TRIGGER ghi_log_luong
AFTER UPDATE ON nhan_vien
FOR EACH ROW
INSERT INTO log_luong(nv_id, luong_cu, luong_moi)
VALUES (OLD.id, OLD.luong, NEW.luong);
```

## Ưu / nhược điểm
- **Ưu:** toàn vẹn dữ liệu mạnh, hỗ trợ ACID, ngôn ngữ truy vấn chuẩn hoá, quan hệ rõ ràng.
- **Nhược:** khó mở rộng theo chiều ngang (horizontal scaling), lược đồ (schema) cứng nhắc, JOIN nhiều bảng có thể chậm ở quy mô lớn.

## Câu hỏi phỏng vấn thường gặp
1. Phân biệt `WHERE` và `HAVING`? Phân biệt `DELETE`, `TRUNCATE`, `DROP`?
2. 3NF khác BCNF ở điểm nào? Cho ví dụ vi phạm.
3. Sự khác nhau giữa INNER JOIN và LEFT JOIN? Khi nào kết quả có NULL?
4. Window function khác GROUP BY như thế nào?
5. `UNION` và `UNION ALL` khác nhau ra sao?

## Tham khảo
- Xem thêm: [Cẩm nang phỏng vấn CSDL](cam-nang-phong-van-csdl.md), [Chỉ mục](chi-muc.md), [Giao dịch](giao-dich.md)
