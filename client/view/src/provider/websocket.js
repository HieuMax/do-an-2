// Open socket to server 
const socket = new WebSocket('ws://localhost:8000');

export const registToServer = (userId) => {
    // const socket = new WebSocket('ws://localhost:8000');
    // console.log(userId)
    socket.onopen = function() {
        console.log('ok')
        console.log('WebSocket connection established.');
        socket.send(JSON.stringify({ type: 'register', userId }));
    };
}

export const onLogin = (userId) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'register', userId }));
    }

}

export const disconnectServer = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        // socket.close();
        socket.onclose = function() {
            // console.log('ok')
            console.log('WebSocket disconnected.');
            // socket.send(JSON.stringify({ type: 'register', userId }));
        };
    }
}

export default socket;