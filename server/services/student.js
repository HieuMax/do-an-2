const studentRouter = require('express').Router();
const { getAll, getById } = require('../controller/controller')
module.exports = studentRouter;
const obj = "students";

studentRouter.get('/', async (req, res) => {
    const result = await getAll(obj);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({sinhvien: result.data})
    }
})

studentRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({sinhvien: result.data})
    }
})