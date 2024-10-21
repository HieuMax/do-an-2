const { StatusCodes } = require('http-status-codes');
const ms = require('ms');
const { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE, REFRESH_TOKEN_SECRET_SIGNATURE } = require('../providers/JwtProvider');
const pool = require('../database/database')
const bcryptjs = require('bcryptjs');

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 */
const MOCK_DATABASE = {
  USER: {
    ID: 'phuctrandevj-sample-id-12345678',
    EMAIL: 'phuctrandevj.official@gmail.com',
    PASSWORD: 'phuctrandevj@123'
  }
};

/**
 * 2 chữ ký bí mật quan trọng trong dự án. Dành cho JWT - JsonWebTokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế để bảo mật.
 */
const login = async (req, res) => {
  try {
    const { tendangnhap, matkhau, vaitro } = req.body;

    // Tìm user bằng email trong bảng "users"
    const query = 'SELECT * FROM taikhoan WHERE tendangnhap = $1 and vaitro = $2';
    const result = await pool.query(query, [tendangnhap, vaitro]);

    // Nếu không tìm thấy user
    if (result.rows.length === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // So sánh mật khẩu
    // const isPasswordValid = await bcryptjs.compare(matkhau, user.matkhau);
    // if (!isPasswordValid) {
    //   return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid credentials' });
    // }

    if (tendangnhap !== user.tendangnhap || matkhau !== user.matkhau) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your username or password is incorrect!' });
      return;
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    const userInfo = {
      taikhoanid: user.taikhoanid,
      vaitro: user.vaitro
    };

    // Tạo ra 2 loại token: accessToken và refreshToken
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      '1h'
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      '14 days'
    );

    // Set HTTP only cookie cho phía trình duyệt
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    });

    // Trả về thông tin user và Tokens
    res.status(StatusCodes.OK).json({
      ...userInfo,
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // Cách 1: Lấy từ Cookie
    const refreshTokenFromCookie = req.cookies?.refreshToken;

    // Verify / Giải mã token
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshTokenFromCookie, // Dùng token theo cách 1 ở trên
      REFRESH_TOKEN_SECRET_SIGNATURE
    );

    const userInfo = {
      taikhoanid: refreshTokenDecoded.taikhoanid,
      vaitro: refreshTokenDecoded.vaitro
    };

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      '1h'
    );

    // Set HTTP only cookie cho accessToken mới
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    });

    // Trả về accessToken mới
    res.status(StatusCodes.OK).json({ accessToken });

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  userController: {
    login,
    logout,
    refreshToken
  }
};