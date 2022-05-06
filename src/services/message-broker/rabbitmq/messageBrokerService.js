const rabbitmqConfig = require('open-music-api-configs');
const amqp = require('amqplib');

const messageBrokerService = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(rabbitmqConfig.host);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {
      durable: true,
    });
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 1000);
  },
};

module.exports = messageBrokerService;
