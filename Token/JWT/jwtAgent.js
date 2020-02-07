'use strict';

const jwt_module = require('./jwt-module.js');
const config = require('./config.json');

/**
 * Get Client Assertion
 * @returns {Promise<String>}: JWT String
 */
module.exports.getClientAssertion = async () => {
    return new Promise(resolve => {
        let payload = {};
        let date = new Date();
        let jti = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
        let sOptions = {
            CBSMonitor: true,
            issuer: config.payload_iss,
            subject: config.payload_sub,
            audience: config.payload_aud,
            header_kid: config.header_kid,
            payload_jti: jti
        };

        let retJWT = jwt_module.signFirst(payload, sOptions);
        //console.log(`FirstJWT: ${retJWT}`);
        resolve(retJWT);
    });
};

/**
 * Get Request
 * @param consent_id: Account Access Consent Id String
 * @returns {Promise<String>}: JWT String
 */
module.exports.getRequest = async (consent_id, redirect_uri, nonce = "") => {
    return new Promise((resolve => {
        let payload = {
            max_age: 86400,
            scope: `openid accounts`,// OB_ACCOUNT_CONSENT:${consent_id} openid`,
            claims: {
                id_token: {
                    acr: {
                        values: [
                            "urn:openbanking:psd2:sca",
                            "urn:openbanking:psd2:ca"
                        ],
                        essential: true
                    },
                    openbanking_intent_id: {
                        value: consent_id,
                        essential: true
                    }
                },
                userinfo: {
                    openbanking_intent_id: {
                        value: consent_id,
                        essential: true
                    }
                }
            },
            response_type: "code id_token",
            redirect_uri: redirect_uri,
            nonce: nonce,
            client_id: config.client_id
        };

        let sOptions = {
            issuer: config.payload_iss,
            audience: config.payload_aud,
            header_kid: config.header_kid,
        };

        let retJWT = jwt_module.signSecond(payload, sOptions);
        console.log(`AuthorizeEndpoint JWT: ${retJWT}`);
        resolve(retJWT);
    }));
};
