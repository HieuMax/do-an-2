const producer = require('../controller/kafka');

const notificateRouter = require('express').Router();
// const { getAll, getById } = require('../controller/controller')

module.exports = notificateRouter;

notificateRouter.post('/send-notification', (req, res) => {
    const message = req.body.message;
    const payloads = [{ topic: "test", messages: message }]

    producer.send(payloads, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(500).send("Error sending message");
        }
        res.status(200).send("Message sent successfully");
    })
})
