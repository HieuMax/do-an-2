const managementRouter = require('express').Router();
const { getAll, addCouncilWithMembers, getCouncilMembers, deleteCouncil, updateCouncilMember } = require('../controller/controller');
const { sendMessToMemsCouncil } = require('../controller/notifyController');
const { generateCouncilId } = require('../middleware/generateCouncilId');


module.exports = managementRouter;

const obj1 = "councils";
const obj2 = "mentors";
const obj3 = "departments";

managementRouter.get('/getAllCouncils', async (req, res) => {
    const result = await getAll(obj1);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({hoidong: result.data})
    }
})

managementRouter.get('/getAllTeachers', async (req, res) => {
    const result = await getAll(obj2);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({giangvien: result.data})
    }
})

managementRouter.get('/getAllDepartments', async (req, res) => {
    const result = await getAll(obj3);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({khoa: result.data})
    }
})
managementRouter.post('/addCouncilWithMembers', generateCouncilId, async (req, res) => {
    const { hoidongid, tenhoidong, mota, thanhvien } = req.body;


    if (!tenhoidong || !mota || !Array.isArray(thanhvien)) {
        return res.status(400).json({ "error": "Tên hội đồng, mô tả và danh sách thành viên là bắt buộc" });
    }


    const result = await addCouncilWithMembers(hoidongid, tenhoidong, mota, thanhvien);
    
    if (result.error) {
        res.status(500).json({ "error": result.error });
    } else {
        res.status(201).json({ "hoidongid": result.hoidongid });
    }

});

managementRouter.get('/getCouncilMembers/:hoidongid', getCouncilMembers);

managementRouter.delete('/deleteCouncil/:hoidongid', deleteCouncil);

managementRouter.put('/updateCouncilMember',updateCouncilMember )

managementRouter.get('/allk', async(req, res) => {
    const result = await sendMessToMemsCouncil(1, 'DT2024007', 28)
    res.status(200).send(result)
})

module.exports = managementRouter;