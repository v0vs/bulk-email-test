const sendgridMail = require('@sendgrid/mail');
const {sendgridApiKey} = require('../config/env');
sendgridMail.setApiKey(sendgridApiKey);

// Default rate limit in number of recipients in Sendgrid
const RATE_LIMIT_RECIPIENTS_BY_MAIL = 1000;

async function sendMail(msg){
    return await sendgridMail.send(msg);
}

async function sendBulkMail(msg, personalizations = []){
    const iterationsNum = Math.floor(personalizations.length / RATE_LIMIT_RECIPIENTS_BY_MAIL) 
        + (personalizations.length % RATE_LIMIT_RECIPIENTS_BY_MAIL) > 0 ? 1 : 0;

    // Send mails by chunks of RATE_LIMIT_RECIPIENTS_BY_MAIL recipients number
    for (let i=0; i<iterationsNum; i++){
        const startBulkIndex = i * RATE_LIMIT_RECIPIENTS_BY_MAIL;
        const endBulkIndex = Math.min(((i + 1) * RATE_LIMIT_RECIPIENTS_BY_MAIL) - 1, personalizations.length);

        const iterationPersonalizations = personalizations.slice(startBulkIndex, endBulkIndex);
        const mailMsg = Object.assign({}, msg, {personalizations: iterationPersonalizations}); 
        await sendMail(mailMsg);
    }
}

module.exports = {sendMail, sendBulkMail};