// const producer = require('../controller/kafka');
const { getAllNotifies, createCheckSeen, updateSeen, getFullNotifies } = require('../controller/notifyController');
const notificateRouter = require('express').Router();

module.exports = notificateRouter;


notificateRouter.get('/getAllNotifies', async (req, res) => {
    const { userId } = req.query
    if (!userId) return
    const result = await getAllNotifies(userId)
    return res.status(200).send(result)
})

notificateRouter.get('/getFullNotifies', async (req, res) => {
    const { userId } = req.query
    if (!userId) return
    const result = await getFullNotifies(userId)
    return res.status(200).send(result)
})

notificateRouter.get('/test', async (req, res) => {
    const result = await createCheckSeen()
    // console.log(result)
    return res.status(200).send(result)
})

notificateRouter.put('/updateSeenMsg', async(req, res) => {
    const { uid, messId } = req.body
    // console.log(uid)
    // console.log(messId)
    const response = await updateSeen(uid, messId);
    if (response.error) return { error: response.error }
    res.status(201).send("Updated successfully")
})