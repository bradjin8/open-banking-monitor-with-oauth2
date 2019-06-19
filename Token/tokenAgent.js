const fs = require('file-system');
const qs = require('qs');
const http = require('https');
const settings = require('./settings.json');
const jwtAgent = require('./JWT/jwtAgent');
const openBrowser = require('opn');

/**
 * Get First Access Token
 * @returns {Promise<String>} Response JSON/HTML String
 */
module.exports.getAccessToken = async function () {
    return new Promise(async (resolve, reject) => {
        let options = {
            "method": "POST",
            "hostname": settings.hostname,
            "path": "/token",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": settings.financial_id,
                "Accept": "application/json",
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": "Passw0rd"
        };

        let jwt_token = await jwtAgent.getClientAssertion();
        // console.log(`JWT_RECEIVE: ${jwt_token}`);
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                console.log(`${body.toString()}`);
                resolve(body.toString());
            });

            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.write(qs.stringify({
            grant_type: "client_credentials",
            scope: settings.scope,
            client_assertion_type: settings.client_assertion_type,
            client_assertion: jwt_token
        }));
        req.end();
    });
};

/**
 * Get Account Access Consents
 * @param access_token: First Access Token String
 * @returns {Promise<String>}: Response JSON/HTML String
 */
module.exports.getAccountAccessConsents = function (access_token) {
    return new Promise(async (resolve, reject) => {
        let options = {
            "method": "POST",
            "hostname": settings.hostname,
            "path": "/open-banking/v3.1/aisp/account-access-consents",
            "headers": {
                "Content-Type": "application/json",
                "x-fapi-financial-id": settings.financial_id,
                "Accept": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": "Passw0rd"
        };
        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
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

        req.write(JSON.stringify({
            Data:
                {
                    Permissions:
                        ['ReadAccountsBasic',
                            'ReadAccountsDetail',
                            'ReadBalances',
                            'ReadBeneficiariesDetail',
                            'ReadDirectDebits',
                            'ReadProducts',
                            'ReadStandingOrdersDetail',
                            'ReadStatementsBasic',
                            'ReadStatementsDetail',
                            'ReadTransactionsCredits',
                            'ReadTransactionsDebits',
                            'ReadTransactionsDetail',
                            'ReadOffers',
                            'ReadPAN',
                            'ReadParty',
                            'ReadPartyPSU',
                            'ReadScheduledPaymentsBasic',
                            'ReadScheduledPaymentsDetail',
                            'ReadStatementsDetail'],
                    ExpirationDateTime: '2019-07-20T00:00:00+00:00',
                    TransactionFromDateTime: '2019-01-22T00:00:00+00:00',
                    TransactionToDateTime: '2019-07-22T00:00:00+00:00'
                },
            Risk: {}
        }));
        req.end();
    });
};

/**
 * Get Authorize Endpoint URL
 * @param consent_id: account access consent id
 * @returns {Promise<String>}: Authorize Endpoint URL String
 */
module.exports.getAuthorizeEndpointURL = async function (consent_id) {
    return new Promise(async (resolve, reject) => {
        let jwtRequest = await jwtAgent.getRequest(consent_id, settings.redirect_uri);

        let options = {
            "method": "GET",
            "hostname": "openbanking.cumberland.co.uk",
            "path": `/oauth2/authorize?response_type=code%20id_token&client_id=${settings.client_id}&scope=openid%20accounts&redirect_uri=${settings.redirect_uri}&request=${jwtRequest}`,
        };

        //console.log(`PATH: ${options.hostname}${options.path}`);
        let authorizeURL = `https://${options.hostname}${options.path}&nonce=123-fgf&state=123-fgf`;
        //openBrowser(authorizeURL);
        resolve(authorizeURL);
    });
};

module.exports.getCode = async function (endpoint_url) {
    return new Promise((resolve, reject) => {
        const nm = require('nightmare');
        const nmAgent = nm({show: false, waitTimeout: 60 * 1000});

        nmAgent
            .goto(endpoint_url)
            .type('#username', settings.user_name)
            .type('#password', settings.user_password)
            .click('form[action*="/commonauth"] [type=submit]')
            .wait('#approve')
            .evaluate(() => {
                let checkboxes = document.querySelectorAll('input[type="checkbox"]#accselect');
                checkboxes.forEach((checkbox) => {
                    checkbox.click();
                });
            })
            .click('#approve')
            .wait('a[href="http://www.iana.org/domains/example"]')
            .evaluate(function () {
                let url = window.location.href;
                console.log(`Redirected URL: \n\t${url}`);
                let code = url.substring(url.indexOf('#code=') + 6, url.indexOf('&id_token'));
                return code;
            })
            .end()
            .then(function (result) {
                resolve(result)
            })
            .catch(function (error) {
                console.error('Login failed:', error);
                reject(error);
            });

    });
};

/**
 * Get Access Token to Call OpenBanking API
 * @param code: Code from Redirected URL
 * @returns {Promise<String>}: Response JSON/HTML String
 */
module.exports.getAccessTokenForAPI = async function (code) {
    return new Promise(async (resolve, reject) => {
        let jwtClientAssertion = await jwtAgent.getClientAssertion();

        let options = {
            "method": "POST",
            "hostname": settings.hostname,
            "path": "/token",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "x-fapi-financial-id": settings.financial_id,
                "Accept": "application/json"
            },
            "key": fs.readFileSync('./SSL/transport.key'),
            "cert": fs.readFileSync('./SSL/transport.pem'),
            "Pass": "Passw0rd"
        };

        let req = http.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                let body = Buffer.concat(chunks);
                //console.log(body.toString());
                resolve(body.toString());
            });

            res.on("error", (err) => {
                console.log(`Request Error: ${err}`);
                reject(`Request Error: ${err}`);
            })
        });

        req.write(qs.stringify({
            grant_type: settings.grant_type,
            code: code,
            client_assertion_type: settings.client_assertion_type,
            redirect_uri: settings.redirect_uri,
            client_assertion: jwtClientAssertion
        }));
        req.end();
    });
};
