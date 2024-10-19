const { StatusCodes } = require("http-status-codes");
const { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE } = require("../providers/JwtProvider");

const isAuthorized = async (req, res, next) => {

    // Cách 1: Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios và credentials trong CORS
    const accessTokenFromCookie = req.cookies?.accessToken
    if( !accessTokenFromCookie ){
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Unauthorized! (Token not found)"})
        return
    }
    
    try {
        // Bước 01: Thực hiện giải mà token xem có hợp lệ hay kh
        const accessTokenDecoded = await JwtProvider.verifyToken(
            accessTokenFromCookie, // Dùng token theo cách 1 ở trên
            // accessTokenFromHeader.substring('Bearer '.length), // Dùng token theo cách 2 ở trên
            ACCESS_TOKEN_SECRET_SIGNATURE
        )
        // console.log('accessTokenDecoded', accessTokenDecoded)

        // Bước 02: Quan trọng: Nếu như cái token hợp lệ, thì sẽ cần phải lưu thông tin giải mà được vào cái
        // req.jwtDecoded, để sử dụng cho các tầng xử lý ở phía sau
        req.jwtDecoded = accessTokenDecoded;

        // Bước 03: Cho phép cái request đi tiếp
        next()
    } catch (error) {
        // console.log("Error from authMiddleware: ", error)
        // Trường hợp lỗi 01: Nếu cái accessToken nó bị hết hạn (expired) thì mình cần trả về 1 cái mã lỗi GONE - 410 cho phía FE biết để gọi refreshToken
        if(error.message?.includes('jwt expired')){
            res.status(StatusCodes.GONE).json({message: 'Need to refresh token'})
            return
        }
        // Trường hợp lỗi 02: Nếu cái accessToken nó không hợp lệ vì bất cứ lý do gì ngoài vụ hết hạn thì trả về mã 401; phía FE xử lý Logout / hoặc gọi API Logout
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Unauthorized! Please Login"})

    }
};

module.exports = {
    authMiddleware: {
        isAuthorized
    }
};
