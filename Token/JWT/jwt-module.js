const {join}      = require('path');
const fs 		= require('fs');
const jwt 		= require('jsonwebtoken');
// http://travistidwell.com/blog/2013/09/06/an-online-rsa-public-and-private-key-generator/
// use 'utf8' to get string instead of byte array  (1024 bit key)
let privateKEY 	= fs.readFileSync(join(__dirname, './private.key'), 'utf8'); // to sign JWT
//let publicKEY 	= fs.readFileSync('./public.key', 'utf8'); 	// to verify JWT

module.exports = {
    signFirst: (payload, $Options) => {
        // Token signing options
        let signOptions = {
            algorithm: 	"PS256",
            keyid: $Options.header_kid,
            subject: 	$Options.subject,
            audience: 	$Options.audience,
            issuer: 	$Options.issuer,
            expiresIn: 	"1h",				// day: "1d", hour: "1h", second: 3600
            jwtid: $Options.payload_jti
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },
    signSecond: (payload, $Options) => {
        // Token signing options
        let signOptions = {
            algorithm: 	"PS256",
            keyid: $Options.header_kid,
            audience: 	$Options.audience,
            issuer: 	$Options.issuer,
            expiresIn: 	"1h",				// day: "1d", hour: "1h", second: 3600
        };
        return jwt.sign(payload, privateKEY, signOptions);
    },

 /*   verify: (token, $Option) => {
        /!*
            vOption = {
                issuer: "Authorization/Resource/This server",
                subject: "iam@user.me",
                audience: "Client_Identity" // this should be provided by client
            }
        *!/
        let verifyOptions = {
            issuer: 	$Option.issuer,
            subject: 	$Option.subject,
            audience: 	$Option.audience,
            expiresIn: 	"30d",
            algorithm: 	["RS256"]
        };
        try {
            return jwt.verify(token, publicKEY, verifyOptions);
        }catch(err){
            return false;
        }
    },
*/
    decode: (token) => {
        return jwt.decode(token, {complete: true});
    }
};
