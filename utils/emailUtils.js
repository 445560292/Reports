'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '445560292@qq.com',
        pass: 'uwqztolinbxmbgjd'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '445560292@qq.com', // sender address
    to: 'hank.cheng@xplusz.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
module.exports =  {
    sendEmails: function() {
        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
};

