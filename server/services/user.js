const userRouter = require('express').Router();


const {userController} = require('../controller/userController')



// API đăng nhập.
userRouter.post('/login', userController.login)

// API đăng xuất.
userRouter.delete('/logout', userController.logout)

// API Refresh Token - Cấp lại Access Token mới.
userRouter.put('/refresh_token', userController.refreshToken)

// API quên mật khẩu.
userRouter.post("/forgot-password", userController.forgotPassword)

// API reset mật khẩu
userRouter.post("/reset-password/:token", userController.resetPassword)

// API đổi mật khẩu
userRouter.post("/change-password", userController.changePassword)


module.exports = userRouter;
