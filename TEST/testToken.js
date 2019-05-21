const tokenAgent = require('../Token/tokenAgent');

async function authorizeEndpointFromZero() {
    let retFirstAccessToken = await tokenAgent.getAccessToken();

    console.log(`Get FirstAccessToken: \n\t${JSON.stringify(retFirstAccessToken)}`);
    if (!retFirstAccessToken.access_token) {
        console.log(`Failed to Get FirstAccessToken: \n\t${retFirstAccessToken}`);
        return;
    }
    console.log(`FirstAccessToken: \n\t${retFirstAccessToken.access_token}`);
    let retConsents = await tokenAgent.getAccountAccessConsents(retFirstAccessToken.access_token);
    console.log(`Account Access Consents Result: \n\t${retConsents}`);
    retConsents = JSON.parse(retConsents);
    if (!retConsents.Data || !retConsents.Data.ConsentId) {
        console.log(`Failed to Get AccountAccessConsent: \n\t${retConsents}`);
        return;
    }

    let consentId = retConsents.Data.ConsentId;
    console.log(`ConsentID: \n\t${consentId}`);
    let retAuthorizeEndpointURL = await tokenAgent.getAuthorizeEndpointURL(consentId);
    console.log(`Authorize Endpoint URL Result: \n\t${retAuthorizeEndpointURL}`);

    return retAuthorizeEndpointURL;
}

async function getAccessTokenFromLogin() {
    let retAuthorizeEndpointURL  = await authorizeEndpointFromZero();

    let retCode = await tokenAgent.getCode(retAuthorizeEndpointURL);
    console.log(`Code: \n\t${retCode}`);

    let retAccessToken = await tokenAgent.getAccessTokenForAPI(retCode);
    console.log(`GetAccessToken Result: \n\t${retAccessToken}`);
    retAccessToken = JSON.parse(retAccessToken);
    if (retAccessToken.access_token == null) {
        console.log(`Failed to Get AccessToken: \n\t${retConsents}`);
        return;
    }
    let accessToken = retAccessToken.access_token;
    console.log(`Access Token: \n\t${accessToken}`);
    return accessToken;
}

authorizeEndpointFromZero();
// getAccessTokenFromLogin();
// tokenAgent.getCode('https://openbanking.cumberland.co.uk/authenticationendpoint/login.do?sessionDataKey=49b20dbb-cbe0-4f54-a6f7-91914c2a0032&relyingParty=S6HksZfPrMNPMTh6VrhcopfXoLQa&authenticators=SandstoneBasicCustomAuth%3ALOCAL');
