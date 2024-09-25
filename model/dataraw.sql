INSERT INTO TaiKhoan (tenDangNhap, matKhau, vaiTro) VALUES
('user1', 'password1', 'Student'),
('user2', 'password2', 'Teacher'),
('user3', 'password3', 'Admin'),
('user4', 'password4', 'Student'),
('user5', 'password5', 'Teacher');




INSERT INTO BoPhanQL (maNQL, tenNQL, SDT, mail, tenBoPhan, taiKhoanID) VALUES
('BP001', 'Ban Quản Lý 1', '0123456789', 'bql1@example.com', 'Bộ Phận A', 3);
-- ('BP002', 'Ban Quản Lý 2', '0123456788', 'bql2@example.com', 'Bộ Phận B', 1),
-- ('BP003', 'Ban Quản Lý 3', '0123456787', 'bql3@example.com', 'Bộ Phận C', 5),
-- ('BP004', 'Ban Quản Lý 4', '0123456786', 'bql4@example.com', 'Bộ Phận D', 3),
-- ('BP005', 'Ban Quản Lý 5', '0123456785', 'bql5@example.com', 'Bộ Phận E', 4);


INSERT INTO Khoa (khoaID, tenKhoa) VALUES
('K001', 'Khoa Công Nghệ Thông Tin'),
('K002', 'Khoa Kinh Tế'),
('K003', 'Khoa Ngoại Ngữ'),
('K004', 'Khoa Luật'),
('K005', 'Khoa Giáo Dục');


INSERT INTO GiangVien (giangVienID, hoTen, hocHam, hocVi, mail, tenNH, stkNH, CCCD, gioiTinh, ngaySinh, khoaID, taiKhoanID) VALUES
('GV001', 'Nguyễn Văn A', 'TS', 'Thạc sĩ', 'gva@example.com', 'CNTT', '123456789', '123456789012', '0', '1980-01-01', 'K001', 2),
('GV002', 'Trần Thị B', 'TS', 'Cử nhân', 'gtb@example.com', 'KT', '987654321', '123456789013', '1', '1985-02-02', 'K002', 5);
-- ('GV003', 'Lê Văn C', 'PGS', 'Thạc sĩ', 'gvc@example.com', 'NN', '456123789', '123456789014', '0', '1982-03-03', 'K003', 5),
-- ('GV004', 'Phạm Thị D', 'TS', 'Cử nhân', 'gvd@example.com', 'L', '321654987', '123456789015', '1', '1990-04-04', 'K004', 3),
-- ('GV005', 'Đinh Văn E', 'PGS', 'Thạc sĩ', 'gve@example.com', 'GD', '654987321', '123456789016', '0', '1978-05-05', 'K005', 4);

INSERT INTO Lop (lopID, tenLop, coVan, khoaID) VALUES
('L001', 'Lớp CNTT01', 'GV001', 'K001'),
('L002', 'Lớp KT02', 'GV001', 'K002'),
('L003', 'Lớp NN03', 'GV001', 'K003'),
('L004', 'Lớp L04', 'GV002', 'K004'),
('L005', 'Lớp GD05', 'GV002', 'K005');

INSERT INTO SinhVien (sinhVienID, hoTen, mail, tenNH, stkNH, CCCD, gioiTinh, ngaySinh, taiKhoanID, lopID) VALUES
('SV001', 'Nguyễn Văn F', 'svf@example.com', 'CNTT', '321654987', '123456789017', '0', '2000-01-01', 1, 'L001'),
('SV002', 'Trần Thị G', 'svg@example.com', 'KT', '987321456', '123456789018', '1', '2001-02-02', 4, 'L002');
-- ('SV003', 'Lê Văn H', 'svh@example.com', 'NN', '654321987', '123456789019', '0', '2002-03-03', 1, 'L003'),
-- ('SV004', 'Phạm Thị I', 'svi@example.com', 'L', '123456789', '123456789020', '1', '2003-04-04', 1, 'L004'),
-- ('SV005', 'Đinh Văn J', 'svj@example.com', 'GD', '456789123', '123456789021', '0', '2004-05-05', 1, 'L005');

INSERT INTO HoiDong (hoiDongID, tenHoiDong, moTa) VALUES
(1, 'Hội đồng 1', 'Hội đồng đánh giá dự án 1'),
(2, 'Hội đồng 2', 'Hội đồng đánh giá dự án 2'),
(3, 'Hội đồng 3', 'Hội đồng đánh giá dự án 3'),
(4, 'Hội đồng 4', 'Hội đồng đánh giá dự án 4'),
(5, 'Hội đồng 5', 'Hội đồng đánh giá dự án 5');

INSERT INTO ThanhVienHD (hoiDongID, giangVienID, vaiTro) VALUES
(1, 'GV001', 'Chủ tịch'),
(1, 'GV002', 'Thành viên'),
(2, 'GV002', 'Chủ tịch'),
(2, 'GV001', 'Thành viên'),
(3, 'GV001', 'Chủ tịch');

INSERT INTO DeTai (deTaiID, tenDeTai, linhVuc, kinhPhi, trangThai, thoiGianThucHien, ngayBatDau, TaiLieuDeXuat, giangVienChuNhiemID, sinhVienID, hoiDongPhanCong) VALUES
('DT001', 'Đề tài A', 'CNTT', 5000000, 0, 6, '2023-09-01', 'path/to/doc1', 'GV001', 'SV001', 1),
('DT002', 'Đề tài B', 'KT', 3000000, 0, 4, '2023-09-05', 'path/to/doc2', 'GV002', 'SV002', 2),
('DT003', 'Đề tài C', 'NN', 7000000, 0, 5, '2023-09-10', 'path/to/doc3', 'GV002', 'SV001', 3),
('DT004', 'Đề tài D', 'L', 6000000, 0, 3, '2023-09-15', 'path/to/doc4', 'GV002', 'SV001', 4),
('DT005', 'Đề tài E', 'GD', 8000000, 0, 2, '2023-09-20', 'path/to/doc5', 'GV001', 'SV002', 5);

INSERT INTO ThanhVienThucHien (deTaiID, sinhVienID) VALUES
('DT001', 'SV001'),
('DT001', 'SV002'),
('DT002', 'SV002'),
('DT003', 'SV002'),
('DT004', 'SV002');

INSERT INTO TaiLieuNghienCuu (taiLieuThuyetMinh, diemTaiLieu, nhanXet, deTaiID) VALUES
('path/to/doc1', 8.5, 'Tốt', 'DT001'),
('path/to/doc2', 7.0, 'Khá', 'DT002'),
('path/to/doc3', 9.0, 'Xuất sắc', 'DT003'),
('path/to/doc4', 6.5, 'Trung bình', 'DT004'),
('path/to/doc5', 8.0, 'Tốt', 'DT005');

INSERT INTO TaiLieuBaoCao (deTaiID, taiLieuBaoCao, ngayNop) VALUES
('DT001', 'path/to/report1', '2023-10-01'),
('DT002', 'path/to/report2', '2023-10-05'),
('DT003', 'path/to/report3', '2023-10-10'),
('DT004', 'path/to/report4', '2023-10-15'),
('DT005', 'path/to/report5', '2023-10-20');

INSERT INTO BangDiemDeTai (deTaiID, diem) VALUES
('DT001', 8.0),
('DT002', 7.5),
('DT003', 9.5),
('DT004', 6.0),
('DT005', 8.5);

INSERT INTO BangDiemThanhPhan (deTaiID, hoiDongID, vaiTro, diemTC1, diemTC2, diemTC3, diemTC4, diemTC5, diemTC6) VALUES
('DT001', 1, 'Thành viên', 8.0, 7.5, 8.5, 9.0, 8.0, 8.5),
('DT002', 2, 'Thành viên', 6.5, 7.0, 7.5, 8.0, 7.5, 8.0),
('DT003', 3, 'Thành viên', 9.0, 9.5, 9.0, 9.5, 9.0, 9.0),
('DT004', 4, 'Thành viên', 5.0, 6.0, 5.5, 6.5, 5.5, 6.0),
('DT005', 5, 'Thành viên', 8.0, 8.5, 8.0, 9.0, 8.5, 8.0);