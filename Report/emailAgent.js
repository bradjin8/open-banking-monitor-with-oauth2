const settings = require('./settings');
const sgMail = require('@sendgrid/mail');
const http = require('https');

module.exports.sendEmail = async (html) => {
    return new Promise(async (resolve, reject) => {
        let data = {
            personalizations: [{
                to: [{
                    email: settings.email_to_address,
                    name: settings.email_to_name
                }],
                subject: "About the Result of Monitoring Open Banking API"
            }],
            from: {
                email: settings.email_from_address,
                name: settings.email_from_name
            },
            reply_to: {
                email: settings.email_from_address,
                name: settings.email_from_name
            },
            content: [{
                type: "text/html",
                value: html
            }]
        };

        let options = {
            "method": "POST",
            "hostname": settings.smtp_server_hostname,
            "path": settings.smtp_server_path,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${settings.smtp_server_apikey}`
            },
        };

        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data.sqlite3", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                //console.log(`${body.toString()}`);
                resolve(body.toString());
            });

            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });
        req.write(JSON.stringify(data));
        req.end();
    });
};

module.exports.sendEmailViaSg = async (html) => {
    return new Promise(async (resolve, reject) => {
        sgMail.setApiKey(settings.smtp_server_apikey);
        const msg = {
            to: settings.email_to_address,
            from: settings.email_from_address,
            subject: settings.email_subject,
            text: "Text",
            html: html
        };
        let ret = await sgMail.send(msg);
        resolve(`Report Mail Sent: \n\t${JSON.stringify(ret)}`);
    });
};
