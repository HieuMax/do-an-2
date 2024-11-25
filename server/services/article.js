

const articleRouter = require('express').Router();
const {upload2} = require('../middleware/multer');
const {articleController} = require('../controller/articleController')


articleRouter.post('/uploadSingleImage', upload2.single('articleImage'), articleController.uploadSingleImage)

articleRouter.post('/addNewArticle', articleController.addNewArticle)

articleRouter.get('/getAllArticle', articleController.getAllArticle)
  
articleRouter.get('/getArticleBySlug/:slug', articleController.getArticleBySlug)

articleRouter.get('/getArticleById/:id', articleController.getArticleById)

articleRouter.delete('/deleteArticle/:articleId', articleController.deleteArticle)

articleRouter.put('/updateArticle/:articleId', articleController.updateArticle);



module.exports = articleRouter;
