// const producer = require('../controller/kafka');
const { getAllNotifies } = require('../controller/notifyController');
const { wss, WebSocket } = require('../controller/websocket')
const notificateRouter = require('express').Router();
// const { getAll, getById } = require('../controller/controller')

module.exports = notificateRouter;

notificateRouter.post('/send-notification', (req, res) => {
    const message = req.body;

    console.log('Received message:', message);

     // Gửi message đến tất cả client đã kết nối
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
        client.send(message.value);
        }
    });
    res.status(200)
    // const payloads = [{ topic: "test", messages: message }]

    // producer.send(payloads, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //         return res.status(500).send("Error sending message");
    //     }
    //     res.status(200).send("Message sent successfully");
    // })
})

notificateRouter.get('/getAllNotifies', async (req, res) => {
    const result = await getAllNotifies(2)
    return res.status(200).send(result)
    console.log(result)
})