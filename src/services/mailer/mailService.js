require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = class MailService {
  /**
   * Mail Transporter
   * @private
   */
  #mailTransporter;

  constructor() {
    this.#mailTransporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  /**
   * @method sendMail
   * @param {{targetEmail: string, playlist: object}} mailOptions
   * @returns {Promise<SMTPTransport.SentMessageInfo>}
   */
  sendEmail({ targetEmail, playlist }) {
    const message = {
      from: 'Open Music API Apps',
      to: targetEmail,
      subject: `Ekspor Playlist ${playlist.name}`,
      text: 'Terlampir hasil dari ekspor playlist',
      attachments: [
        {
          filename: 'playlist.json',
          playlist: `${JSON.stringify(playlist)}`,
        },
      ],
    };
    return this.#mailTransporter.sendMail(message);
  }
};
