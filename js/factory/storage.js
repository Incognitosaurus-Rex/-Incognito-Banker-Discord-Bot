//Exports Command
module.exports = {
    initializeStorage,
    populateAccountData,
    getAccountSalt,
    getPrivateKey,
    getAccountData,
    getCoinData,
    getWalletAddress,
    getViewKey,
    getUserList,
    saveUserList,
    saveAccountData,
    saveCoinData,
};

const fs = require('fs-extra');
const { walletServices } = require('incognito-js/build/node');

//Factory Dependanceis 
const { decryptData, encryptData } = require('./encryption');
const { generateWallet } = require('./walletGeneration');

//Data Paths
let dataPath = './data';
let configPath = dataPath + '/config.json';
let coinsPath = dataPath + '/coins';
let usersPath = dataPath + '/users';
let userListPath = usersPath + '/user-list.json'
let coinConfigPath = coinsPath + '/coin-data.json';


async function initializeStorage(key) {

    //If data folder does not exsist, create it
    if (await fs.pathExists(dataPath) == false) {
        await fs.ensureDir(dataPath);
    };

    //If config.json does not exsist, create it
    if (await fs.pathExists(configPath) == false) {

        var walletData = await generateWallet();

        let salt = await encryptData(key, ('<' + (Math.random() * 1337) * (Math.random() * 7331) + '> - MegaSalt(' + new Date().getTime() + ')'))
        let privateK = await encryptData(key, walletData[0]);
        let viewK = await encryptData(key, walletData[1]);
        let publicK = walletData[2];

        await fs.outputJson(configPath, { AccountSalt: salt, PrivateKey: privateK, Viewkey: viewK, PublicKey: publicK });

    };

    //If users folder does not exsist, create it
    if (await fs.pathExists(usersPath) == false) {
        await fs.ensureDir(usersPath);
    };

    //If usersList does not exsist, create it
    if (await fs.pathExists(userListPath) == false) {
        await fs.outputJson(userListPath, { Users: [] });
    };

    //If coins folder does not exsist, create it
    if (await fs.pathExists(coinsPath) == false) {
        await fs.ensureDir(coinsPath);
    };

    //If coin-data.json does not exsist, create it
    if (await fs.pathExists(coinConfigPath) == false) {
        await fs.outputJson(coinConfigPath, { Coins: ['PRV'], PRV: { balance: 0, claimed: 0, staked: 0, tokenID: '0000000000000000000000000000000000000000000000000000000000000004' } });
    };

    return true;
};


async function populateAccountData(accountNumber) {

    //Determines User Account Path
    let accountPath = usersPath + '/' + accountNumber;
    let accountFile = accountPath + '/account.json'

    //If AccountNumber folder does not exsist, create it
    if (await fs.pathExists(accountPath) == false) {
        await fs.ensureDir(accountPath);
    };

    //If account.json does not exsist, create it
    if (await fs.pathExists(accountFile) == false) {
        await fs.outputJson(accountFile, { Data: { Version: 0, Migrated: false } });
    };

};

async function getAccountSalt(key) {

    //Reads Json Data
    let data = JSON.parse(fs.readFileSync(configPath));

    //Returns Decrypted Salt
    return await decryptData(key, data['AccountSalt']);

};

async function getWalletAddress() {

    //Reads Json Data
    let data = JSON.parse(fs.readFileSync(configPath));

    //Returns Decrypted Salt
    return await data['PublicKey'];

};

async function getPrivateKey(key) {

    //Reads Json Data
    let data = JSON.parse(fs.readFileSync(configPath));

    //Returns Decrypted Salt
    return await decryptData(key, data['PrivateKey']);

};

async function getViewKey(key) {

    //Reads Json Data
    let data = JSON.parse(fs.readFileSync(configPath));

    //Returns Decrypted Salt
    return await decryptData(key, data['ViewKey']);

}

async function getAccountData(key, accountNumber) {

    //Determines User Account Path
    let accountPath = usersPath + '/' + accountNumber;
    let accountFile = accountPath + '/account.json'

    //Get's Json Info
    let data = JSON.parse(fs.readFileSync(accountFile));

    //Decrypt Data
    let accountData = await decryptData(key, data['Data'])

    //Returns Unecncrypted Data
    if (accountData == null) {
        return data['Data'];
    }

    //Return Decyrpted Data
    return accountData;

};

async function getCoinData() {

    //Read Data
    let data = JSON.parse(fs.readFileSync(coinConfigPath));

    //Return Data
    return data;

};

async function getUserList() {

    //Read Data
    let data = JSON.parse(fs.readFileSync(userListPath));

    //Return Data
    return data;

}

async function saveUserList(data) {

    //Saves Data
    fs.writeFileSync(userListPath, JSON.stringify(data));

    //Ends Function
    return true;

};

async function saveCoinData(data) {

    //Saves Data
    fs.writeFileSync(coinConfigPath, JSON.stringify(data));

    //Debuging Log
    console.log('~ ' + 'Data:'.cyan + ' Coin Data Has Been Modified'.magenta);

    //Ends Function
    return true;

};


async function saveAccountData(key, accountNumber, saveData) {

    //Determines User Account Path
    let accountPath = usersPath + '/' + accountNumber;
    let accountFile = accountPath + '/account.json'

    //Encrypts Data
    var data = {};
    data['Data'] = await encryptData(key, saveData);

    //Saves Data
    fs.writeFileSync(accountFile, JSON.stringify(data));

    //Debuging Log
    console.log('~ ' + 'Data:'.cyan + ' Account Data Has Been Modified'.magenta);

    //Ends Function
    return true;

};