// const { getAccountId } = require('./notifyController');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });
const clients = {};

// Middleware to convert targetUid to AccountId
const messageMiddleware = async (message, ws, next, getAccountId) => {
    try {
        const jsonMess = JSON.parse(message);
        
        // If the message contains a targetUid, convert it to AccountId
        if (jsonMess.targetUid) {
            const accountId = await getAccountId(jsonMess.targetUid, "giangvien");
            jsonMess.targetUid = accountId.taikhoanid; // Replace targetUid with accountId
        }

        // Pass the modified message to the next handler
        next(jsonMess, ws);
    } catch (err) {
        console.error("Failed to parse message:", err);
    }
};

// Function to handle messages after middleware
const handleMessage = (messageObj, ws) => {
    // console.log("Processed message:", messageObj);

    if (messageObj.type) {
        // Register the client by their userId
        clients[messageObj.userId] = ws;
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
const socketReceive = (getAccountId) => {
    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            // Apply middleware before handling the message
            messageMiddleware(message, ws, handleMessage, getAccountId);
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

module.exports = { wss, socketReceive };
