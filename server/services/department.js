const departmentRouter = require('express').Router();
const { getAll, getById, getByKeyObject } = require('../controller/controller')

module.exports = departmentRouter;

const obj = "departments";

departmentRouter.get('/', async (req, res) => {
    const result = await getAll(obj);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({khoa: result.data})
    }
})

departmentRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    const table = "mentors"
    const key = Object.keys(result.data)[0]
    // console.log(key)
    // console.log(id)
    // console.log(result.data)
    const staffs = await getByKeyObject(table, key, id)
    // console.log(staffs)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({khoa: result.data, staffs: staffs.data})
    }
})