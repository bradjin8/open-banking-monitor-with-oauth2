const http = require("https");
const fs = require('file-system');
const settings = require("./settings.json");

const default_financial_id = "001580000103U9kAAE";

/**
 * Get Accounts
 * @param token:        String, Access Token
 * @param financial_id: String, x-fapi-financial-id
 * @returns {Promise<String>}: Response
 */
module.exports.getAccounts = async function (token, financial_id = "") {
    let fid = financial_id.length > 0 ? financial_id : default_financial_id;
    return new Promise((resolve, reject) => {
        let options = {
            "method": "GET",
            "hostname": settings.hostname,
            "path": "/open-banking/v3.1/aisp/accounts",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": fid,
                "Authorization": `Bearer ${token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": settings.user_password
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });
            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.end();
    });
};

module.exports.getAccountsById = async function (token, account_id, financial_id="") {
    let fid = financial_id.length?financial_id:default_financial_id;
    return new Promise((resolve, reject)=>{
        let options = {
            "method": "GET",
            "hostname": settings.hostname,
            "path": `/open-banking/v3.1/aisp/accounts/${account_id}`,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": fid,
                "Authorization": `Bearer ${token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": settings.user_password
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });
            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.end();
    });
};

module.exports.getBalances = async function (token, account_id, financial_id="") {
    let fid = financial_id.length?financial_id:default_financial_id;
    return new Promise((resolve, reject)=>{
        let options = {
            "method": "GET",
            "hostname": settings.hostname,
            "path": `/open-banking/v3.1/aisp/accounts/${account_id}/balances`,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": fid,
                "Authorization": `Bearer ${token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": settings.user_password
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });
            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.end();
    });
};
module.exports.getStatements = async function (token, account_id, financial_id="") {
    let fid = financial_id.length?financial_id:default_financial_id;
    return new Promise((resolve, reject)=>{
        let options = {
            "method": "GET",
            "hostname": settings.hostname,
            "path": `/open-banking/v3.1/aisp/accounts/${account_id}/statements`,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": fid,
                "Authorization": `Bearer ${token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": settings.user_password
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });
            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.end();
    });
};
module.exports.getTransactions = async function (token, account_id, financial_id="") {
    let fid = financial_id.length?financial_id:default_financial_id;
    return new Promise((resolve, reject)=>{
        let options = {
            "method": "GET",
            "hostname": settings.hostname,
            "path": `/open-banking/v3.1/aisp/accounts/${account_id}/transactions`,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": fid,
                "Authorization": `Bearer ${token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": settings.user_password
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                // console.log(body.toString());
                resolve(body.toString());
            });
            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.end();
    });
};
