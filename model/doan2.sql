-- Table for TaiKhoan (Accounts)
CREATE TABLE TaiKhoan (
    taiKhoanID INT PRIMARY KEY AUTO_INCREMENT,
    tenDangNhap VARCHAR(255) NOT NULL UNIQUE,
    matKhau VARCHAR(255) NOT NULL,
    vaiTro ENUM('Student', 'Teacher', 'Admin') NOT NULL,
);

-- Table for BoPhanQL (Management Department)
CREATE TABLE BoPhanQL (
    maNQL VARCHAR(20) PRIMARY KEY,
    tenNQL NVARCHAR(255) NOT NULL,
    SDT VARCHAR(13) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    tenBoPhan VARCHAR(255) NOT NULL,
    taiKhoanID INT,
    FOREIGN KEY (taiKhoanID) REFERENCES TaiKhoan(taiKhoanID)
);



-- Table for Khoa (Departments)
CREATE TABLE Khoa (
    khoaID VARCHAR(13) PRIMARY KEY,
    tenKhoa VARCHAR(255) NOT NULL
    -- truongKhoa VARCHAR(255) NULL,
    -- FOREIGN KEY (truongKhoa) REFERENCES GiangVien(giangVienID)
);


-- Table for GiangVien (Lecturers)
CREATE TABLE GiangVien (
    giangVienID VARCHAR(13) PRIMARY KEY,
    hoTen VARCHAR(255) NOT NULL,
    hocHam VARCHAR(255),
    hocVi VARCHAR(255),
    mail VARCHAR(255) NOT NULL,
    tenNH VARCHAR(255),
    stkNH VARCHAR(30),
    CCCD CHAR(12) NOT NULL UNIQUE,
    gioiTinh ENUM("0", "1") NOT NULL,
    ngaySinh DATE NOT NULL,
    khoaID VARCHAR(13),
    taiKhoanID INT,
    FOREIGN KEY (taiKhoanID) REFERENCES TaiKhoan(taiKhoanID)
    FOREIGN KEY (khoaID) REFERENCES Khoa(khoaID),
);

-- Table for Lop (Classes)
CREATE TABLE Lop (
    lopID VARCHAR(13) PRIMARY KEY,
    tenLop VARCHAR(255) NOT NULL,
    coVan VARCHAR(13) NULL,
    khoaID VARCHAR(13),
    FOREIGN KEY (coVan) REFERENCES GiangVien(giangVienID)
    FOREIGN KEY (khoaID) REFERENCES Khoa(khoaID)
);

-- Table for SinhVien (Students)
CREATE TABLE SinhVien (
    sinhVienID VARCHAR(13) PRIMARY KEY,
    hoTen VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL,
    tenNH VARCHAR(255),
    stkNH VARCHAR(30),
    CCCD CHAR(12) NOT NULL UNIQUE,
    gioiTinh ENUM("0", "1") NOT NULL,
    ngaySinh DATE NOT NULL,
    taiKhoanID INT,
    lopID VARCHAR(13),
    FOREIGN KEY (taiKhoanID) REFERENCES TaiKhoan(taiKhoanID)
    FOREIGN KEY (lopID) REFERENCES Lop(lopID)
);

-- Table for HoiDong (Council)
CREATE TABLE HoiDong (
    hoiDongID INT PRIMARY KEY AUTO_INCREMENT,
    tenHoiDong VARCHAR(255) NOT NULL,
    moTa TEXT NULL
);

-- Table for ThanhVienHD (Council Members)
CREATE TABLE ThanhVienHD (
    hoiDongID INT,
    giangVienID INT,
    vaiTro VARCHAR(255) NOT NULL,
    PRIMARY KEY (hoiDongID, giangVienID),
    FOREIGN KEY (hoiDongID) REFERENCES HoiDong(hoiDongID),
    FOREIGN KEY (giangVienID) REFERENCES GiangVien(giangVienID)
);

-- Table for DeTai (Research Topics)
CREATE TABLE DeTai (
    deTaiID VARCHAR(10) PRIMARY KEY,
    tenDeTai NVARCHAR(255) NOT NULL,
    linhVuc NVARCHAR(255) NOT NULL,
    kinhPhi DECIMAL NOT NULL,
    trangThai INT DEFAULT 0,
    thoiGianThucHien INT NOT NULL,
    ngayBatDau DATE NULL,
    TaiLieuDeXuat PATH NOT NULL,
    giangVienChuNhiemID INT,
    sinhVienID INT,
    hoiDongPhanCong INT NULL,
    FOREIGN KEY (hoiDongPhanCong) REFERENCES HoiDong(hoiDongID),
    FOREIGN KEY (giangVienChuNhiemID) REFERENCES GiangVien(giangVienID),
    FOREIGN KEY (sinhVienID) REFERENCES SinhVien(sinhVienID)
);

-- Table for ThanhVienThucHien (Executing Members)
CREATE TABLE ThanhVienThucHien (
    deTaiID VARCHAR(10),
    sinhVienID INT,
    PRIMARY KEY (deTaiID, sinhVienID),
    FOREIGN KEY (deTaiID) REFERENCES DeTai(deTaiID),
    FOREIGN KEY (sinhVienID) REFERENCES SinhVien(sinhVienID)
);

-- Table for TaiLieuNghienCuu (Research Documents)
CREATE TABLE tailieuthuyetminh (
    tailieupath PATH NOT NULL,
    detaiid VARCHAR(10) PRIMARY KEY,
    ngayNop DATE NOT NULL,
    FOREIGN KEY (detaiid) REFERENCES DeTai(deTaiId)
)

CREATE TABLE diemtailieuthuyetminh (
  nguoichamdiem VARCHAR(13) NOT NULL,
  diemtailieu DOUBLE PRECISION NOT NULL,
  nhanxet TEXT NULL,
  detaiid VARCHAR(10) NOT NULL,
  diemTC1 SMALLINT NOT NULL,
  diemTC2 SMALLINT NOT NULL,
  diemTC3 SMALLINT NOT NULL,
  diemTC4 SMALLINT NOT NULL,
  diemTC5 SMALLINT NOT NULL,
  diemTC6 SMALLINT NOT NULL,
  diemTC7 SMALLINT NOT NULL,
  diemTC8 SMALLINT NOT NULL,
  PRIMARY KEY (detaiid,nguoichamdiem),
  FOREIGN KEY (detaiid) REFERENCES DeTai(deTaiId),
  FOREIGN KEY (nguoichamdiem) REFERENCES giangvien(giangvienid)
)

-- Table for TaiLieuBaoCao (Report Documents)
CREATE TABLE TaiLieuBaoCao (
    deTaiID VARCHAR(10),
    taiLieuBaoCao PATH NOT NULL,
    ngayNop DATE NOT NULL,
    FOREIGN KEY (deTaiID) REFERENCES DeTai(deTaiID),
    PRIMARY KEY (deTaiID)
);

-- Table for BangDiemDeTai (Research Grading)
CREATE TABLE BangDiemDeTai (
    deTaiID VARCHAR(10) PRIMARY KEY,
    diem DECIMAL(5, 2),
    FOREIGN KEY (deTaiID) REFERENCES DeTai(deTaiID)
);

CREATE TABLE BangDiemThanhPhan (
    deTaiID VARCHAR(10),
    hoiDongID INT,
    vaiTro VARCHAR(255) NOT NULL,
    diemTC1 DECIMAL(5, 2) NOT NULL,
    diemTC2 DECIMAL(5, 2) NOT NULL,
    diemTC3 DECIMAL(5, 2) NOT NULL,
    diemTC4 DECIMAL(5, 2) NOT NULL,
    diemTC5 DECIMAL(5, 2) NOT NULL,
    diemTC6 DECIMAL(5, 2) NOT NULL,
    PRIMARY KEY (deTaiID, hoiDongID, vaiTro),
    FOREIGN KEY (hoiDongID) REFERENCES HoiDong(hoiDongID),
    FOREIGN KEY (deTaiID) REFERENCES DeTai(deTaiID),
    FOREIGN KEY (vaiTro) REFERENCES ThanhVienHD(vaiTro)
)

CREATE TABLE diemtailieudexuat (
	detaiid VARCHAR(13) NOT NULL,
  nguoichamdiem VARCHAR(13) NOT NULL,
  nhanxet TEXT NULL,
  diemtailieu DOUBLE PRECISION NOT NULL,
  diemTC1 SMALLINT NOT NULL,
  diemTC2 SMALLINT NOT NULL,
  diemTC3 SMALLINT NOT NULL,
  diemTC4 SMALLINT NOT NULL,
  diemTC5 SMALLINT NOT NULL,
  diemTC6 SMALLINT NOT NULL,
  diemTC7 SMALLINT NOT NULL,
  diemTC8 SMALLINT NOT NULL,
  diemtailieu DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (detaiid,nguoichamdiem),
  FOREIGN KEY (detaiid) REFERENCES DeTai(deTaiId),
  FOREIGN KEY (nguoichamdiem) REFERENCES giangvien(giangvienid)
)


-- Notify
CREATE TABLE groupConsumer (
  groupConsumerId VARCHAR(10) PRIMARY KEY,
  name_group TEXT NOT NULL
)

CREATE TABLE consumers (
	groupConsumerId VARCHAR(10) NOT NULL,
  taikhoanid integer NOT NULL,
  PRIMARY KEY (taikhoanid, groupConsumerId),
  FOREIGN KEY (taikhoanid) REFERENCES taikhoan(taikhoanid),
  FOREIGN KEY (groupConsumerId) REFERENCES groupConsumer(groupConsumerId)
)

CREATE TABLE Topics (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  groupConsumerId VARCHAR(10) NOT NULL,
  detaiid VARCHAR(10) NOT NULL,
  FOREIGN KEY (detaiid) REFERENCES detai(detaiid),
  FOREIGN KEY (groupConsumerId) REFERENCES groupConsumer(groupConsumerId)
)

CREATE TABLE UnseenMsgs (
  taikhoanid INTEGER NOT NULL,
  messagesid SERIAL NOT NULL,
  time_stamp TEXT NOT NULL,
  topicId INTEGER NOT NULL,
  _message TEXT,
  PRIMARY KEY (messagesid),
  FOREIGN KEY (taikhoanid) REFERENCES taikhoan(taikhoanid),
  FOREIGN KEY (topicId) REFERENCES Topics(id)
)

CREATE TABLE SeenMsgs (
  taikhoanid INTEGER NOT NULL,
  messagesid INTEGER NOT NULL,
  seen BOOL NOT NULL,
  PRIMARY KEY (taikhoanid, messagesid),
  FOREIGN KEY (taikhoanid) REFERENCES taikhoan(taikhoanid),
  FOREIGN KEY (messagesid) REFERENCES UnseenMsgs(messagesid)
)


------------------------------------------------------------------------------------------------------
-- TRIGGER -------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------

---------------------------------------------------------------
-------------------- Tai Lieu De Xuat -------------------------
---------------------------------------------------------------
--Trigger update status when approving
CREATE OR REPLACE FUNCTION tg_autoCheckDuyetDeXuat()
RETURNS TRIGGER AS
$$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(nguoichamdiem) INTO flag_update
    FROM diemtailieudexuat
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 5 THEN
        UPDATE detai
        SET trangthai = 2
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Now create the trigger
CREATE TRIGGER tg_autoCheckDuyetDeXuat
AFTER INSERT
ON diemtailieudexuat
FOR EACH ROW
EXECUTE FUNCTION tg_autoCheckDuyetDeXuat();

---------------------------------------------------------------
-------------------- Tai Lieu Thuyet Minh ---------------------
---------------------------------------------------------------
--Trigger update status when mark presentation of documentation
CREATE OR REPLACE FUNCTION tg_autoCheckChamDiemThuyetMinh()
RETURNS TRIGGER AS
$$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(nguoichamdiem) INTO flag_update
    FROM diemtailieuthuyetminh
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 5 THEN
        UPDATE detai
        SET trangthai = 3
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Now create the trigger
CREATE TRIGGER tg_autoCheckChamDiemThuyetMinh
AFTER INSERT
ON diemtailieuthuyetminh
FOR EACH ROW
EXECUTE FUNCTION tg_autoCheckChamDiemThuyetMinh();

-- 0: Mới đăng ký
-- 1: GVHD duyệt
-- 2: Hội đồng góp ý và duyệt
-- 3: Nộp đề cương (đợi chấm)
-- 4: Đã chấm điểm thuyết minh -> thực hiện
-- 5: Nộp tài liệu báo cáo
-- 6: Chấm tài liệu báo cáo
-- 7: Nghiệm thu và các bước tiếp theo