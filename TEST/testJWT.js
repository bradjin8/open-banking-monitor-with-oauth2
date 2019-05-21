const jwtAgent = require('../Token/JWT/jwtAgent');

async function test(){
    let ret = await jwtAgent.getClientAssertion();
    console.log(`CLIENT_ASSERTION: \n\t${ret}`);
}

test();