const apiAgent = require('../OpenBankingApi/apiAgent');

async function run() {
    console.log(`=======================[ Monitoring Started : ${new Date().toISOString()} ]=======================`);

    let token = "a83c0c5a-4a08-3454-82d4-c4c993cd3041";
    let fid= "001580000103U9kAAE";

    let ret = await apiAgent.getAccounts(token, fid);
    console.log(`Accounts: \n\t${ret}`);
    let aid="_uHhMROQPty6S284ksR_lg";
    ret = await apiAgent.getAccountsById(token, aid, fid);
    console.log(`Account ${aid}: \n\t${ret}`);
    ret = await apiAgent.getBalances(token, aid, fid);
    console.log(`Balances of ${aid}: \n\t${ret}`);
    ret = await apiAgent.getStatements(token, aid, fid);
    console.log(`Statements of ${aid}: \n\t${ret}`);
    ret = await apiAgent.getTransactions(token, aid, fid);
    console.log(`Transactions of ${aid}: \n\t${ret}`);

    setTimeout(run, 5000);
}

run();