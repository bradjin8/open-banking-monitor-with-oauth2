const reportAgent = require('../Report/emailAgent');

async function sendEmail() {
    let html = `<h1>Hi, Nick</h1>`;
    html += `<p>This is the test email of new account you created.<br>Of course this was sent by code.</p>`;

    let ret = await reportAgent.sendEmailViaSg(html);
    console.log(`Result: ${ret}`);

}

sendEmail();