const projectRouter = require('express').Router();
const { getAll, getById, updateStatus } = require('../controller/controller');
const upload = require('../middleware/multer');

module.exports = projectRouter;

const obj = "projects"

projectRouter.get('/', async(req, res) => {
    const result = await getAll(obj);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data})
    }
})

projectRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data, members: result.members})
    }
})

projectRouter.put('/updateStatus', async (req, res, next) => {
    const body = req.body
    const header = req.headers
    const result = await updateStatus(body.status, body.id)
    if (result.status === 200) {
        res.status(200).send(result.message)
    } else {
        res.status(204).send(result.error)
    }
    if(header.apikey !== "test") return
    console.log(header)

    // const result = await updateStatus(id);

})

projectRouter.post('/uploadFile', upload.single('file'), (req,res) => {
    // console.log(upload)
    console.log(req.file)
    // console.log(upload.storage.getFilename)
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send('File uploaded successfully: ' + req.file.filename);
    // const 
})

projectRouter.post('/preparefile', (req, res) => {
    return res.status(200).send({ message: "well connect"})
})