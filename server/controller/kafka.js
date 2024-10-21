// const kafka = require('kafka-node');
// const { wss, WebSocket } = require('./websocket');
// const Producer = kafka.Producer;
// const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
// const producer = new Producer(client);
// const Consumer = kafka.Consumer;


// producer.on('ready', () => {
//     console.log('Kafka Producer is connected and ready.');
// });

// producer.on('error', (err) => {
//     console.error('Producer error:', err);
// });

// const consumer = new Consumer(
//     client,
//     [{ topic: 'test', partition: 0 }],
//     { autoCommit: true }
//   );
  
// consumer.on('message', (message) => {
//     console.log('Received message:', message.value);

//      // Gửi message đến tất cả client đã kết nối
//     wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//         client.send(message.value);
//         }
//     });
// });

// consumer.on('error', (err) => {
//     console.error('Consumer error:', err);
// });

// module.exports = producer