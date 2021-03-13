module.exports = {
    start
};

//Factory Imports
const { generateEmbed } = require('../factory/embed');
const { getPrivateKey, getCoinData, saveCoinData } = require('../factory/storage');

//Incognito Import
const incognitoJs = require('incognito-js/build/node');

async function start(key, user, userID, accountNumber, args) {

    //Storage Services
    incognitoJs.storageService.implement({
        setMethod: () => null,
        getMethod: () => null,
        removeMethod: () => null
    });

    //Fullnode Config
    incognitoJs.setConfig({
        chainURL: 'https://fullnode.incognito.best',
        apiURL: 'https://api.incognito.org',
        mainnet: true,
    });

    //Go Services
    await incognitoJs.goServices.implementGoMethodUseWasm();

    //Initialize Wallet
    const { WalletInstance } = incognitoJs;
    const wallet = new WalletInstance();
    await wallet.init('Incognito Discord Bot YEEEET', 'SDK Wallet');

    //Get Wallet PrivateKey
    let privateKey = await getPrivateKey(key);

    //Import Bank Wallet
    account = await wallet.masterAccount.importAccount('Bank', privateKey);
    console.log('- ' + '[Incognito Banker]'.cyan + ': '.cyan + 'Imported Incognito Bank Wallet'.magenta);

    //Gets Incognito Balance
    const coinData = await updateData();

    //Check if failed
    if (coinData == false) {

        //Return Embed
        return await generateEmbed(
            'standard',
            'Hmmm... ',
            'Can Not Read Bank Data',
            'For some reason we are unable to retrieve balance data from Incognito!\n\u200B',
        );

    };

    //Set MessegeBody
    var messegeBody = '**Total:**\n';

    //Go through all coins
    for (const element of coinData['Coins']) {
        messegeBody += '```fix' + '\n' + element + ': ' + coinData[element].balance + '```';
    };

    //Makes It look nice
    messegeBody += '\n**Available:**\n'

    //Go through all coins Again For Available
    for (const element of coinData['Coins']) {
        messegeBody += '```fix' + '\n' + element + ': ' + (coinData[element].balance - (Math.round(coinData[element].claimed * 1e9) / 1e9)) + '```';
    };

    //Return Embed
    return await generateEmbed(
        'standard',
        ' ',
        'Bank Holdings',
        '\n' + messegeBody + '\n\u200B',
    );


};


async function updateData() {

    //Get CoinData
    var coinData = await getCoinData();


    //Go through all coins
    for (const element of coinData['Coins']) {
        let incogBalance = await getBalance(coinData[element].tokenID);
        
        //Checks If Failed
        if (incogBalance == 'false') {
            return false;
        };

        coinData[element].balance = (incogBalance / 1000000000);
    };

    //Saves Balance Data
    await saveCoinData(coinData);

    //Return Data
    return coinData;

}

//Retrieve Balance Data
async function getBalance(tokenID) {

    try {

        //Get Total Balance
        if (tokenID == '0000000000000000000000000000000000000000000000000000000000000004') {
            return await account.nativeToken.getTotalBalance();
        } else {
            const token = await account.getFollowingPrivacyToken(tokenID);
            let totalBalance = await token.getTotalBalance();
            return totalBalance.toNumber();
        }

    } catch {

        //Error
        return 'false';
    };

};