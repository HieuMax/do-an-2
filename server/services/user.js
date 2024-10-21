const userRouter = require('express').Router();


const {userController} = require('../controller/userController')



// API đăng nhập.
userRouter.post('/login', userController.login)

// API đăng xuất.
userRouter.delete('/logout', userController.logout)

// API Refresh Token - Cấp lại Access Token mới.
userRouter.put('/refresh_token', userController.refreshToken)

module.exports = userRouter;
