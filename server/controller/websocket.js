// const { getAccountId } = require('./notifyController');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
const clients = {};

// Middleware to convert targetUid to AccountId
const messageMiddleware = async (message, ws, next, getAccountId, getAdmin) => {
    try {
        const jsonMess = JSON.parse(message);
        // console.log(jsonMess)
        // If the message contains a targetUid, convert it to AccountId
        if (jsonMess.targetUid) {
            const accountId = await getAccountId(jsonMess.targetUid, jsonMess.typeOfUser);
            jsonMess.targetUid = accountId.taikhoanid; // Replace targetUid with accountId
        }

        // Pass the modified message to the next handler
        next(jsonMess, ws, getAdmin);
    } catch (err) {
        console.error("Failed to parse message:", err);
    }
};

// Function to handle messages after middleware
const handleMessage = async (messageObj, ws, getAdmin) => {
    // console.log("Processed message:", messageObj);

    if (messageObj.type == 'register') {
        // Register the client by their userId
        clients[messageObj.userId] = ws;
    } else if ( messageObj.type == 'sendAdmin' ) {
        // console.log('Admin');
        // console.log(messageObj)
        const arrAdmin = await getAdmin();
        for(let admin of arrAdmin) {
            const targetCID = admin.taikhoanid
            socketSend(targetCID)
        }
        // console.log(arr)
    } else {
        // Send message to target client
        const targetUid = messageObj.targetUid;
        const text = messageObj.text;
        if (clients[targetUid]) {
            clients[targetUid].send(JSON.stringify({ from: messageObj.userId, text }));
        }
    }
};

// Setup the WebSocket connection
const socketReceive = (getAccountId, getAdmin) => {
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            console.log('received mess: ', JSON.parse(message))
            // Apply middleware before handling the message
            messageMiddleware(message, ws, handleMessage, getAccountId, getAdmin);
        });

        ws.on('close', () => {
            // Handle user disconnect
            for (const id in clients) {
                if (clients[id] === ws) {
                    delete clients[id];
                }
            }
        });
    });
};

const socketSend = (targetCId) => {
    wss.on('connection', (ws) => {
        if (clients[targetCId]) {
            // console.log(targetCId)
            clients[targetCId].send(JSON.stringify({ message: "Phan cong hoi dong" }))
        }
    })
}

module.exports = { wss, socketReceive, socketSend };
