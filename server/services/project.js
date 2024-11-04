const projectRouter = require('express').Router();
const { getAll, updateProjectStatusAndCouncil, getById, updateStatus, getLastIdProject, registNewProject, updateFile, downloadFile, markType, getMarkOfProject, uploadProposal, getProposalFile, getProjectsByStatus, getAccessProject, getRelatedToAccess, uploadReport, getReportFile, getAccessReportProject, getRelatedReportToAccess } = require('../controller/controller');
const { notify_upload_proposal, sendMessToMemsCouncil } = require('../controller/notifyController');
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

projectRouter.get('/accessProject/:uid', async(req, res) => {
    const { uid } = req.params
    // const { uid } = req.query
    
    const data = JSON.parse(uid)
    const result = await getAccessProject(data.userId, data.typeOfUser, data.status, data.page);
    // console.log(uid)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data, records: result.records})
    }
})

projectRouter.get('/accessReportProject/:uid', async(req, res) => {
    const { uid } = req.params
    const data = JSON.parse(uid)
    const result = await getAccessReportProject(data.userId, data.typeOfUser, data.statusIdx, data.page);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({detai: result.data, records: result.records})
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

// projectRouter.get('/:id', async (req, res) => {
//     const id = req.params.id;
//     const result = await getById(obj, id)
//     if (result.error) {
//         res.status(500).json({"error": result.error});
//     } else {
//         res.json({detai: result.data})
//     }
// })

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
    const allowType = ["thuyetminh", "dexuat", "baocao"]
    if(!allowType.includes(type)) return res.status(404).send({ error: "error" })
        
    if(!detaiid || !role || !userid) {
        // console.log("err")
        return res.status(400).send({ error: "error" })
    }
    try {
        const result = await getMarkOfProject(detaiid, role, userid, type)
        // console.log(result)

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

projectRouter.get('/reportFile/:id', async(req, res) => {
    const { id } = req.params
    try {
        const result = await getReportFile(id);
        if(result.error) {
            res.status(500).json({"error": result.error})
        }
        res.status(200).json({ data: result.data })
    } catch (error) {
        return res.status(404).send(error)
    }
})



projectRouter.get('/accessProjectPermission', async (req, res) => {
    const { detaiid, uid } = req.query
    const result = await getRelatedToAccess(detaiid, uid)
    if (result.permission == "allowed") {
        // console.log(result)
        return res.status(200).send({result})
    }
    return res.status(200).send({result})
})

projectRouter.get('/accessReportPermission', async (req, res) => {
    const { detaiid, uid } = req.query
    const result = await getRelatedReportToAccess(detaiid, uid)
    if (result.permission == "allowed") {
        // console.log(result)
        return res.status(200).send({result})
    }
    return res.status(200).send({result})
})

// ------------------------------------------------------------------------------------------------------------------------------
// PUT --------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------
projectRouter.put('/updateStatusAndCouncil', async (req, res) => {
    const { detaiid, status, council, taikhoanid } = req.body;

    if (!detaiid || !status || !council) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    try {

        const result = await updateProjectStatusAndCouncil(detaiid, status, council);
        
        // await sendMessToMemsCouncil(1, 'DT2024007', 28)
        if (!result.success) {
            return res.status(500).json({ message: result.message, success: result.success });
        }


        await sendMessToMemsCouncil(council, detaiid, taikhoanid)
        
        return res.status(200).json({ message: result.message, success: result.success });

    } catch (error) {
        res.status(500).json({ "error": error.message });
    }
    return

});


projectRouter.put('/updateStatus', async (req, res, next) => {
    const body = req.body
    const header = req.headers

    const result = await updateStatus(body.status, body.id, body.uid)
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

projectRouter.get('/test22', async (req, res) => {
    const { detaiid, typeOfDoc, gr_subcriber, messageProgress } = req.query
    msgs = [
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu thuyết minh (Sinh viên chủ nhiệm).", //
        "đã được UPLOAD tài liệu thuyết minh, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét.", //
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu báo cáo (Sinh viên chủ nhiệm).", //
        "đã được UPLOAD tài liệu báo cáo, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét.", //
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét bài báo cáo." //
    ]

    Docs = ["diemtailieudexuat", "diemtailieuthuyetminh", "diemtailieubaocao", "uploadfile"]
    groupConsumer = ["Cập nhật thông tin đề tài", "Hội đồng chấm điểm"]
    // GRADING RECOM
    const result1 = await notify_upload_proposal(detaiid, 
        Docs[typeOfDoc], 
        groupConsumer[gr_subcriber],
        msgs[messageProgress]
     );

    // UPLOAD PROPOSAL
    const result2 = await notify_upload_proposal('DT2024005', 
        'uploadfile', 
        "Hội đồng chấm điểm",
        "đã được UPLOAD tài liệu thuyết minh, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét."
     );

    // GRADING PROPOSAL
     const result3 = await notify_upload_proposal('DT2024005', 
        'diemtailieuthuyetminh', 
        "Cập nhật thông tin đề tài",
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu báo cáo (Sinh viên chủ nhiệm)."
     );


    // UPLOAD REPORT
    const result4 = await notify_upload_proposal('DT2024005', 
        'uploadfile', 
        "Hội đồng chấm điểm",
        "đã được UPLOAD tài liệu báo cáo, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét."
     );

    // GRADING REPORT
     const result5 = await notify_upload_proposal('DT2024005', 
        'diemtailieubaocao', 
        "Cập nhật thông tin đề tài",
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét bài báo cáo."
     );

    res.sendStatus(200)
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
    const newId = generateid(result.data && result.data.detaiid.length == 9 ? result.data.detaiid : "", result.data? result.data.detaiid.length - estimateProject : 0)

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

projectRouter.post('/uploadReport', async (req, res) => {

    const data = req.body

    try {
        const response = await uploadReport(data)
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
    const { mark, comment, detaiid, nguoichamdiem, type, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8, diemtc9 } = req.body
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
    if (type == "BaoCao") data.diemtc9 = diemtc9
    try {
        console.log(data)
        const response = await markType(type, data)
        // console.log(response)
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