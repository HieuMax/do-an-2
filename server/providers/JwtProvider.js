const JWT = require('jsonwebtoken');

/**
 * Function generateToken - cần 3 tham số đầu vào
 * userInfo: Những thông tin muốn đính kèm vào token
 * secrectSignature: Chữ ký bí mật (Dạng 1 chuỗi string ngẫu nhiên) hoặc Private Key
 * tokenLife: Thời gian sống của token
 */
const generateToken = async (userInfo, secrectSignature, tokenLife) => {
    try {
        // Hàm sign() của thư viện Jwt - Thuật toán mặc định là HS256
        return JWT.sign(userInfo, secrectSignature, { algorithm: 'HS256', expiresIn: tokenLife });
    } catch (error) { 
        throw new Error(error); 
    }
};

/**
 * Function kiểm tra 1 token có hợp lệ hay không
 * Hợp lệ ở đây hiểu đơn giản là cái token được tạo ra có đúng với chữ ký bí mật secrectSignature trong project hay không
 */
const verifyToken = async (token, secrectSignature) => {
    try {  
        // Hàm verify của thư viện Jwt
        return JWT.verify(token, secrectSignature);
    } catch (error) { 
        throw new Error(error); 
    }
};

/**
 * 2 chữ ký bí mật quan trọng trong dự án dành cho JWT - JsonWebToken
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế để bảo mật.
 */
const ACCESS_TOKEN_SECRET_SIGNATURE = process.env.ACCESS_TOKEN_SECRET_SIGNATURE;
const REFRESH_TOKEN_SECRET_SIGNATURE = process.env.REFRESH_TOKEN_SECRET_SIGNATURE;

module.exports = {
    JwtProvider: {
        generateToken,
        verifyToken
    },
    ACCESS_TOKEN_SECRET_SIGNATURE,
    REFRESH_TOKEN_SECRET_SIGNATURE
};
