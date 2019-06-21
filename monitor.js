const tokenAgent = require('./Token/tokenAgent'),
    //dbAgent = require('./Database/dbAgent'),
    apiAgent = require('./OpenBankingApi/apiAgent'),
    emailAgent = require('./Report/emailAgent');

const Logger = require('simple-node-logger'),
    options = {
        logFilePath: "./monitoring.log",
        timestampFormat: "YYYY-MM-DD HH:mm:ss"
    },
    logAgent = Logger.createSimpleLogger(options);
const config = require('./config');
const fid = require('./Token/settings').financial_id;
const monitoring_interval = config.monitoring_interval_min*60*1000;

let status_report = "";
let status_code = "_____________MONITORING_START_____________";

async function getNewAuthorizeEndpointURL() {
    let retAuthorizeEndpointURL = "";

    try {
        status_code = `GET_FIRST_ACCESS_TOKEN`;
        status_report = await tokenAgent.getAccessToken();
        let retFirstAccessToken = JSON.parse(status_report);
        console.log(`Get FirstAccessToken: \n\t${JSON.stringify(status_report)}\n`);
        if (!retFirstAccessToken.access_token) {
            console.log(`Failed to Get FirstAccessToken: ${status_report}\n`);
            return;
        }
        logAgent.info(`[${status_code}]: ${retFirstAccessToken.access_token}`);

        status_code = `GET_ACCOUNT_ACCESS_CONSENT`;
        status_report = await tokenAgent.getAccountAccessConsents(retFirstAccessToken.access_token);
        console.log(`Account Access Consents Result: \n\t${status_report}\n`);

        let retConsents = JSON.parse(status_report);
        if (!retConsents.Data || !retConsents.Data.ConsentId) {
            console.log(`Failed to Get AccountAccessConsent: ${status_report}\n`);
            return;
        }

        status_code = `GET_ACCOUNT_CODE`;
        status_report = retConsents.Data.ConsentId;
        logAgent.info(`[${status_code}]: ${status_report}`);

        status_code = `AUTHORIZATION_ENDPOINT`;
        retAuthorizeEndpointURL = await tokenAgent.getAuthorizeEndpointURL(status_report);
        logAgent.info(`[${status_code}]: ${retAuthorizeEndpointURL}`);

        //dbAgent.updateURL(retAuthorizeEndpointURL);
    } catch (e) {
        exceptionhandler(e)
    }

    return retAuthorizeEndpointURL;
}

async function getCode() {
    let retCode;
    try {
        status_code = "READ_ENDPOINT_FROM_DB";
        status_report = await getNewAuthorizeEndpointURL();

        status_code = "GET_ACCESS_CODE";
        retCode = await tokenAgent.getCode(status_report);
        logAgent.info(`[${status_code}]: ${retCode}`);
    } catch (e) {
        exceptionhandler(e)
    }
    return retCode;
}

async function getAccessToken() {
    let accessToken = "";
    try {
        let retCode = await getCode();

        status_code = `GET_ACCESS_TOKEN`;
        status_report = await tokenAgent.getAccessTokenForAPI(retCode);
        console.log(`GetAccessToken Result: \n\t${status_report}`);

        let retAccessToken = JSON.parse(status_report);
        if (retAccessToken.access_token == null) {
            console.log(`Failed to Get AccessToken: \n\t${status_report}`);
            return;
        }
        accessToken = retAccessToken.access_token;
        logAgent.info(`[${status_code}]: ${accessToken}`);
        return accessToken;

    } catch (e) {
        exceptionhandler(e)
    }

}

async function monitorAPI() {
    try {
        let token = await getAccessToken();

        status_code = `GET_ACCOUNTS`;
        status_report = await apiAgent.getAccounts(token, fid);
        console.log(`Accounts: \n\t${status_report}`);
        let accounts = JSON.parse(status_report).Data.Account;
        if (accounts == null && accounts.length < 0) {
            logAgent.warn(`No account found`);
        }

        for (let i = 0; i < accounts.length; i++) {
            status_code = `GET_ACCOUNT[${i}]_INFO`;
            let aid = accounts[i].AccountId;

            status_report = await apiAgent.getAccountsById(token, aid, fid);
            console.log(`Account ${aid}: \n\t${status_report}`);

            status_code = `GET_ACCOUNT[${i}]_BALANCES`;
            status_report = await apiAgent.getBalances(token, aid, fid);
            console.log(`Balances of ${aid}: \n\t${status_report}`);

            status_code = `GET_ACCOUNT[${i}]_STATEMENTS`;
            status_report = await apiAgent.getStatements(token, aid, fid);
            console.log(`Statements of ${aid}: \n\t${status_report}`);

            status_code = `GET_ACCOUNT[${i}]_TRANSACTIONS`;
            status_report = await apiAgent.getTransactions(token, aid, fid);
            console.log(`Transactions of ${aid}: \n\t${status_report}`);
        }

    } catch (e) {
        exceptionhandler(e);
        return false;
    }
    return true
}

function exceptionhandler(e) {
    let msg = `STEP: ${status_code}: \n\t${e.message}\n\nPrevious Response: ${status_report}`;
    console.error(msg);
    logAgent.error(msg);
    let html = `<hr><h1>Open Banking Monitor Alert</h1><hr><hr><p style="font-size: 20px; color: darkred">Error : <b>${e.message}</b><br>At : <b>${status_code}</b></p><hr><h3>Details: </h3><p>${status_report}</p><hr>`;
    emailAgent.sendEmailViaSg(html)
}

async function start() {
    logAgent.info(`\n________________CYCLE_START_______________`);
    let ret = await monitorAPI();
    // emailAgent.sendEmailViaSg(`<h1>Dear Nick</h1><h4>A monitoring cycle was completed at ${new Date().toLocaleTimeString()}</h4>`);
    logAgent.info(`________________CYCLE___END_______________`);
    setTimeout(start, monitoring_interval);
}

start();


