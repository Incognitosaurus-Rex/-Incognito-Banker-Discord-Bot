//Exports Command
module.exports = {
    generateWallet
};

const incognitoJs = require('incognito-js/build/node');

async function generateWallet(){

    //Initialize Wallet
    const { WalletInstance } = incognitoJs;

    //Go Services
    await incognitoJs.goServices.implementGoMethodUseWasm();

    wallet = new incognitoJs.WalletInstance();
    await wallet.init('Discord Bot - ' + Math.random() * 1337, 'GenerateWallet');

    let jsonData = JSON.stringify(wallet);
    var jsonParse = JSON.parse(jsonData);

    let privateKey = await jsonParse.masterAccount.key.keySet.privateKeySerialized;
    let viewingKey = await jsonParse.masterAccount.key.keySet.viewingKeySerialized;
    let publicKey = await jsonParse.masterAccount.key.keySet.paymentAddressKeySerialized;

    let walletInfo = [ privateKey, viewingKey, publicKey];

    return walletInfo;

};
