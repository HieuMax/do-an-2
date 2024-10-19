const { StatusCodes } = require('http-status-codes');
const pool = require('../database/database');

const access = async (req, res) => {
  try {
    let query;
    const { vaitro, taikhoanid } = req.jwtDecoded;

    // Lựa chọn query dựa trên vaitro
    if (vaitro === 'Student') {
      query = `SELECT * FROM sinhvien WHERE taikhoanid = $1`;
    } else if (vaitro === 'Teacher') {
      query = `SELECT * FROM giangvien WHERE taikhoanid = $1`;
    } else if (vaitro === 'Admin') {
      query = `SELECT * FROM bophanql WHERE taikhoanid = $1`;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid role' });
    }

    // Thực hiện truy vấn dựa trên vai trò
    const result = await pool.query(query, [taikhoanid]);

    if (result.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    // Trả về thông tin người dùng
    const userInfo = {
      taikhoanid,
      vaitro,
      ...result.rows[0]  // Kết hợp dữ liệu từ truy vấn với thông tin tài khoản
    };

    return res.status(StatusCodes.OK).json(userInfo);
  } catch (error) {
    console.error('Error accessing user information:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

module.exports = {
  dashboardController: {
    access
  }
};
