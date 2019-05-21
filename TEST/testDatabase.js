const dbAgent = require('../Database/dbAgent');

async function run() {


    let ret = await dbAgent.readURL();
    console.log(`Read Result: ${ret}`);

    //dbAgent.updateURL("asdf");
}

run();
