// const producer = require('../controller/kafka');
const { getAllNotifies, createCheckSeen, updateSeen, getFullNotifies, notify_upload_proposal } = require('../controller/notifyController');
const notificateRouter = require('express').Router();

module.exports = notificateRouter;


notificateRouter.get('/getAllNotifies', async (req, res) => {
    const { userId } = req.query
    if (!userId) return
    const result = await getAllNotifies(userId)
    return res.status(200).send(result)
})

notificateRouter.get('/getFullNotifies', async (req, res) => {
    const { userId, page } = req.query
    if (!userId) return
    const result = await getFullNotifies(userId, page)
    return res.status(200).json(result)
})

notificateRouter.get('/test', async (req, res) => {
    const result = await createCheckSeen()
    // console.log(result)
    return res.status(200).send(result)
})

notificateRouter.put('/updateSeenMsg', async(req, res) => {
    const { uid, messId } = req.body
    const response = await updateSeen(uid, messId);
    if (response.error) return { error: response.error }
    res.status(201).send("Updated successfully")
})

notificateRouter.get('/send-Noti', async(req, res) => {
    const { detaiid, typeOfDoc, gr_subcriber, messageProgress } = req.query
    msgs = [
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu thuyết minh (Sinh viên chủ nhiệm).",
        "đã được UPLOAD tài liệu thuyết minh, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét.",
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu báo cáo (Sinh viên chủ nhiệm).",
        "đã được UPLOAD tài liệu báo cáo, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét.",
        "đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét bài báo cáo."
    ]

    Docs = ["diemtailieudexuat", "diemtailieuthuyetminh", "diemtailieubaocao", "uploadfile"]
    groupConsumer = ["Cập nhật thông tin đề tài", "Hội đồng chấm điểm"]
    // GRADING RECOM
    const result = await notify_upload_proposal(
        detaiid, 
        Docs[typeOfDoc], 
        groupConsumer[gr_subcriber],
        msgs[messageProgress]
    );

    res.status(200).send({ message: "ok" })
})