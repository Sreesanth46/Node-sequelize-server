const mail = require('../utils/nodeMailer')
const htmlToSend = `<p style="color:red;"> Hello world {{status}}</p>`;
const sendTo = `abhishek.r@innovaturelabs.com`
const subject = 'Test subject'

mail.sendMail(htmlToSend, sendTo, subject)

exports.registeration = async (req, res, next) => {
// mail.sendMail(htmlToSend, sendTo, subject)
}