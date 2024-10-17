const socket = new WebSocket('ws://localhost:8000');

socket.onopen = function() {
    console.log('WebSocket connection established.');
    socket.send('Hello Server!');
};

socket.onmessage = function(event) {
    console.log('Message from server:', event.data);
};

socket.onclose = function() {
    console.log('WebSocket connection closed.');
};
