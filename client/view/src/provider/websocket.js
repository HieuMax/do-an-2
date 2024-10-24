// Open socket to server 
const socket = new WebSocket('ws://localhost:8000');

// socket.onmessage = function(event) {
//     console.log('Message from server:', event.data);
// };

socket.onclose = function() {
    console.log('WebSocket connection closed.');
};

export const registToServer = (userId) => {
    socket.onopen = function() {
        
        console.log('WebSocket connection established.');
        // console.log(JSON.stringify({ type: 'register', userId }));
        socket.send(JSON.stringify({ type: 'register', userId }));
        // return { connect: true }
    };
}

export default socket;