
const { getAccountData, saveAccountData } = require("./storage");
const Random = require('random-js').Random;

//Exports Command
module.exports = {
    changeServerSeed,
    setClientSeed,
    getServerSeed,
    getClientSeed,
    calculateResult,
};

async function calculateResult(serverSeed, clientSeed) {

    let number = Math.round((serverSeed + clientSeed));
    

};

async function changeServerSeed(key, accountNumber, data) {

    const engine = new Random(Random.MersenneTwister19937);
    const distribution = (engine.integer(1000, 9999) / 100);

    //Get Account Data
    let accountData = await getAccountData(key, accountNumber);

    accountData['Account'].serverSeed = distribution + ' <SaltedData: ' + (Math.random().toString(36).substr(2, 9)) + '>';

    await saveAccountData(key, accountNumber, accountData);

    return true;
};

async function setClientSeed(key, accountNumber, data) {

    //Checks if Data is a number
    if (data >= 0) {
        return false;
    };

    //Get Account Data
    let accountData = await getAccountData(key, accountNumber);

    //Sets Client Seed
    accountData['Account'].clientSeed = data;

    await saveAccountData(key, accountNumber, accountData);

    return true;

};

async function getServerSeed(key, accountNumber) {

    //Get Account Data
    let accountData = await getAccountData(key, accountNumber);

    return accountData['Account'].serverSeed;

};

async function getClientSeed(key, accountNumber) {

    //Get Account Data
    let accountData = await getAccountData(key, accountNumber);

    return accountData['Account'].clientSeed;

};