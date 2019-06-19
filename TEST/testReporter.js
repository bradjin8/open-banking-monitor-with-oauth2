const reportAgent = require('../Report/emailAgent');

async function sendEmail() {
    let html = `<h1>The results</h1>`;
    html += `<p>The monitoring process is run</p>`;

    let ret = await reportAgent.sendEmailViaSg(html);
    console.log(`Result: ${ret}`);

}

sendEmail();