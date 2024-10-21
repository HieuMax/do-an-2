const dashboardRouter = require('express').Router();


const {dashboardController} = require('../controller/dashboardController')
const {authMiddleware} = require('../middleware/authMiddleware')

dashboardRouter.get('/accessa', authMiddleware.isAuthorized, dashboardController.access)

module.exports = dashboardRouter;
