const WebSocket = require('ws');

// const server = new WebSocket.Server({ port: 8080 });
const wss = new WebSocket.Server({ noServer: true });

const socket_on = () => {
    wss.on('connection', socket => {
        console.log('Client connected');
    
        // Gửi thông báo từ server tới client
        // socket.send('Welcome to the WebSocket server!' + server.clients.size);
    
        // Xử lý tin nhắn nhận được từ client
        socket.on('message', message => {
            console.log(`Received: ${message}`);
            socket.send(`You sent: ${message}`);
        });
    
        // Xử lý khi client ngắt kết nối
        socket.on('close', () => {
            console.log('Client disconnected');
        });
    });
}

module.exports = { socket_on, wss, WebSocket }
