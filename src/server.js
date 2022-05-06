require('dotenv').config();
const amqp = require('amqplib');
const DbService = require('./services/postgresql/dbService');
const MailService = require('./services/mailer/mailService');
const PlaylistListener = require('./playlists');

const init = async () => {
  const dbService = new DbService();
  const mailService = new MailService();
  const playlistListener = await PlaylistListener.listener({ dbService, mailService });

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });

  channel.consume('export:playlists', playlistListener, { noAck: true });
};

init();
