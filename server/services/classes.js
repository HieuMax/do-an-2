const classRouter = require('express').Router();
const { getAll, getById } = require('../controller/controller')

module.exports = classRouter;

const obj = "classes";

classRouter.get('/', async (req, res) => {
    const result = await getAll(obj);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({lop: result.data})
    }
})

classRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({lop: result.data})
    }
})