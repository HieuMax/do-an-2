const projectRouter = require('express').Router();
const { getAll, updateProjectStatusAndCouncil, getById, updateStatus, getLastIdProject, registNewProject, updateFile, downloadFile, markType, getMarkOfProject, uploadProposal, getProposalFile, getProjectsByStatus } = require('../controller/controller');
const upload = require('../middleware/multer');
const { generateid } = require('../utils/generateid');

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


projectRouter.get('/status', getProjectsByStatus)


projectRouter.get('/project/:id', async (req, res, next) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data, members: result.members})
    }
    next()

})

projectRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data})
    }
})

projectRouter.get('/download/:filename', async(req, res) => {
    try {
        const filePath = await downloadFile(req.params.filename, res)

        res.download(filePath, (err) => {
        if (err) {
            res.status(500).send({
                message: "File không tồn tại.",
                error: err.message
            });
            }
        });
        // return res.status(200).send({url: "file"})
    } catch (err) {
        // console.log(err)
        return res.status(404).send(err)
    }
})

projectRouter.get('/marks', async(req, res) => {
    const { detaiid, role, userid, type } = req.query;
    const allowType = ["thuyetminh", "dexuat"]
    if(!allowType.includes(type)) return res.status(404).send({ error: "error" })
        
    if(!detaiid || !role || !userid) {
        return res.status(400).send({ error: "error" })
    }
    try {
        const result = await getMarkOfProject(detaiid, role, userid, type)
        if(result.error) {
            res.status(500).json({"error": result.error})
        } else {
            res.json({ data: result.data })
        }
    } catch (error) {
        return res.status(404).send(error)
    }
})

projectRouter.get('/proposalFile/:id', async(req, res) => {
    const { id } = req.params
    try {
        const result = await getProposalFile(id);
        if(result.error) {
            res.status(500).json({"error": result.error})
        }
        res.status(200).json({ data: result.data })
    } catch (error) {
        return res.status(404).send(error)
    }
})

// ------------------------------------------------------------------------------------------------------------------------------
// PUT --------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
projectRouter.put('/updateStatusAndCouncil', async (req, res) => {
    const { detaiid, status, council } = req.body;

    if (!detaiid || !status || !council) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {
        const result = await updateProjectStatusAndCouncil(detaiid, status, council);
        
        if (result.error) {
            return res.status(500).json({ "error": result.error });
        }

        res.status(200).json({ message: "Project status and council updated successfully", data: result.data });
    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
});


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
})

projectRouter.put('/updatefile', (req, res) => {
    const { type, file, id } = req.query;
    
})


// ------------------------------------------------------------------------------------------------------------------------------
// POST --------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------

projectRouter.post('/uploadFile', upload.single('file'), (req,res) => {
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }
    return res.status(201).send({ filename: req.file.filename, message: 'File uploaded successfully: ', originalname: req.file, status: 201 });
})

projectRouter.post('/preparefile', (req, res) => {
    return res.status(200).send({ message: "well connect"})
})

projectRouter.post('/registNewProject', async (req, res) => {
    const result = await getLastIdProject()
    const estimateProject = 3
    const newId = generateid(result.data.detaiid.length == 9 ? result.data.detaiid : "", result.data.detaiid.length - estimateProject)

    const data = {
        ...req.body,
        kinhPhi: Number.parseFloat(req.body.kinhPhi),
        thoiGianThucHien: Number.parseInt(req.body.thoiGianThucHien),
        detaiid: newId
    }
    
    try {
        const response = await registNewProject(data)
        if(response.status === 201) {       
            res.status(201).send(response.status)
        } else {
            res.status(response.status).send({ "error": "Unexpected response" });
        }
    } catch (error) {
        res.status(500)
    }
})

projectRouter.post('/uploadProposal', async (req, res) => {

    const data = req.body

    try {
        const response = await uploadProposal(data)
        if(response.status === 201) {       
            res.status(201).send("successful")
        } else {
            res.status(response.status).send({ "error": "Unexpected response" });
        }
    } catch (error) {
        res.status(500)
    }
})




projectRouter.post('/markProject', async(req, res) => {
    const { mark, comment, detaiid, nguoichamdiem, type, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8 } = req.body
    const data = {
        nguoichamdiem: nguoichamdiem,
        mark: mark,
        comment: comment,
        detaiid: detaiid,
        diemtc1: diemtc1,
        diemtc2: diemtc2,
        diemtc3: diemtc3,
        diemtc4: diemtc4,
        diemtc5: diemtc5,
        diemtc6: diemtc6,
        diemtc7: diemtc7,
        diemtc8: diemtc8,
    }
    try {
        const response = await markType(type, data)
        console.log(response)
        if(response.status === 201) {       
            // res.status(201).send(response.status)
            res.sendStatus(response.status)
        } else {
            
            res.status(401).send({ "error": response.Error });
            // res.status(response.status).send({ "error": "Unexpected response" });
        }
    } catch (error) {
        res.status(500)
    }
    
})