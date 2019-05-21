const tokenAgent = require('./Token/tokenAgent');
const config = require('./config.json');

run = async function () {
    const fist_token = await tokenAgent.getAccessToken();
    console.log(`1st Access Token: ${JSON.stringify(fist_token)}`);
};


run1 = async function () {
    const account_consents = await tokenAgent.getAccountAccessConsents(config.first_access_token);
    console.log(`Account Access Consents: ${account_consents}`);
};

authorizeEndpoint = async function () {
    const ret = await tokenAgent.authorizeEndpoint(config.consent_id);
    console.log(`Authorize Endpoint: ${ret}`);
};

async function authorizeEndpointFromZero() {
    let retFirstAccessToken = await tokenAgent.getAccessToken();
    console.log(`Get FirstAccessToken : ${JSON.stringify(retFirstAccessToken)}`);
    if (!retFirstAccessToken.access_token) {
        console.log(`Failed to Get FirstAccessToken: ${retFirstAccessToken}`);
        return;
    }
    console.log(`FirstAccessToken: ${retFirstAccessToken.access_token}`);
    let retConsents = await tokenAgent.getAccountAccessConsents(retFirstAccessToken.access_token);
    retConsents = JSON.parse(retConsents);
    if (!retConsents.Data || !retConsents.Data.ConsentId) {
        console.log(`Failed to Get AccountAccessConsent: ${retConsents}`);
        return;
    }
    let consentId = retConsents.Data.ConsentId;
    console.log(`ConsentID: ${consentId}`);
    let retAuthorizeEndpoint = await tokenAgent.authorizeEndpoint(consentId);
    console.log(`Account Access Consents Result: ${retAuthorizeEndpoint}`);
}


async function getAccessTokenForAPI() {
    let code = "cc46b685-77b2-3177-9309-9c193781afdb";
    let retAccessToken = await tokenAgent.getAccessTokenForAPI(code);
    console.log(`Get AccessTokenForAPI: ${retAccessToken}`);
}

// authorizeEndpoint();
// authorizeEndpointFromZero();
// run();
getAccessTokenForAPI();
