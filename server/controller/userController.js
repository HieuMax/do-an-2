const { StatusCodes } = require('http-status-codes');
const ms = require('ms');
const { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE, REFRESH_TOKEN_SECRET_SIGNATURE } = require('../providers/JwtProvider');
const pool = require('../database/database')
const { getById, getRelatedToAccess } = require('./controller');
const crypto = require('crypto')
const { 
  sendPasswordResetEmail, 
  sendResetSuccessEmail, 
  sendVerificationEmail, 
  sendWelcomeEmail 
} = require("../mailtrap/emails.js");

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
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Tài khoản hoặc mật khẩu của bạn không hợp lệ !!' });
    }

    const user = result.rows[0];

    // So sánh mật khẩu
    // const isPasswordValid = await bcryptjs.compare(matkhau, user.matkhau);
    // if (!isPasswordValid) {
    //   return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid credentials' });
    // }

    if (tendangnhap !== user.tendangnhap || matkhau !== user.matkhau) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Tài khoản hoặc mật khẩu của bạn không hợp lệ !!' });
      return;
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    let obj = '';
    if (user.vaitro == 'Student') {
      obj = 'student-Byaccount'
    } else if (user.vaitro == 'Teacher') {
      obj = 'mentor-Byaccount'
    } else if (user.vaitro == 'Admin') {
      obj = 'admin-Byaccount'
    }
    const userId = await getById(obj, user.taikhoanid)
    const userInfo = {
      taikhoanid: user.taikhoanid,
      vaitro: user.vaitro,
      userId: userId.data.sinhvienid
              ? userId.data.sinhvienid
              : userId.data.giangvienid
                ? userId.data.giangvienid
                : userId.data.manql,
      // accessedProject: getRelatedToAccess(userInfo.userId)
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
      refreshToken,
      // accessSide: vaitro
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

const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
    const query = `
    SELECT taikhoanid, mail FROM giangvien WHERE mail = $1
    UNION
    SELECT taikhoanid, mail FROM sinhvien WHERE mail = $1
    UNION
    SELECT taikhoanid, mail FROM bophanql WHERE mail = $1;
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "User not found" });
    }

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    const updateQuery = `
      UPDATE taikhoan
      SET resetpwdtoken = $1, resetpwdexp = $2
      WHERE taikhoanid = $3
    `;
    await pool.query(updateQuery, [resetToken, resetTokenExpiresAt, result.rows[0].taikhoanid]);
    
		// send email
		await sendPasswordResetEmail(result.rows[0].mail, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const resetTokenExpiresAt = Date.now(); // 1 hour
    const query = `
      SELECT * FROM taikhoan
      WHERE resetpwdtoken = $1
      AND resetpwdexp > $2
    `;
    const { rows } = await pool.query(query, [token, resetTokenExpiresAt]);
    const user = rows[0];

    if (!user) {
    return res.status(400).json({ success: false, message: `Invalid or expired reset token`});
    }

    const updateQuery = `
      UPDATE taikhoan
      SET matkhau = $1, resetpwdtoken = NULL, resetpwdexp = NULL
      WHERE taikhoanid = $2
    `;
    await pool.query(updateQuery, [password, user.taikhoanid]);

		await sendResetSuccessEmail("phuc12104@gmail.com");

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

const changePassword = async (req, res) => {
  try {
    const { taikhoanid, password, oldPassword } = req.body;
  
    // Kiểm tra xem người dùng có tồn tại hay không
    const userQuery = `SELECT * FROM taikhoan WHERE taikhoanid = $1`;
    const userResult = await pool.query(userQuery, [taikhoanid]);

    if (userResult.rows.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.matkhau !== oldPassword) { 
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Mật khẩu cũ không hợp lệ' });
    }

    if (user.matkhau === password) { 
      return res.status(StatusCodes.NOT_MODIFIED).json({ success: false, message: 'Mật khẩu chưa có gì thay đổi' });
    }
    
    // Cập nhật mật khẩu mới
    const updateQuery = `
      UPDATE taikhoan
      SET matkhau = $1
      WHERE taikhoanid = $2
    `;
    await pool.query(updateQuery, [password, taikhoanid]); 

    res.status(StatusCodes.OK).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.log('Error in changePassword', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};


module.exports = {
  userController: {
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword
  }
};
