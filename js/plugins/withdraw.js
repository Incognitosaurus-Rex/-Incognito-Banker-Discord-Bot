module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');
const { getPrivateKey, getCoinData, getAccountData, saveCoinData, saveAccountData } = require('../factory/storage');

//Incognito Import
const incognitoJs = require('incognito-js/build/node');



async function start(key, user, userID, accountNumber, args) {

    if((args[0] < 0) || (args[0] == null) || (args[1] == null) ||(args[2] == null)){
        return await generateEmbed(
            'standard',
            '',
            'Invalid Arguments',
            'Please do $help to figure out how to use the command!',
        );
    };

    //Get UserData
    var userData = await getAccountData(key, accountNumber);
    let amount = Math.round(args[0] * 1e9) / 1e9;

    //GetCoinData
    let coinData = await getCoinData(key);

    if (userData[args[1]].balance >= amount) {
        
        let bankBalance = await getCoinData()

        if (bankBalance[args[1]].claimed >= amount){

            if(await sendTransaction(key, coinData[args[1]].tokenID, (amount * 1000000000).toString(), args[2]) == true){

                userData[args[1]].balance -= amount;
                coinData[args[1]].claimed -= amount;
    
                await saveAccountData(key, accountNumber, userData);
    
                await saveCoinData(coinData);
    
                return await generateEmbed(
                    'standard',
                    '',
                    'Transaction Confirmed',
                    'You have withdrawn ' + args[0] + ' ' + args[1] + '!',
            
                );        
    
            };

        };

    };


    return await generateEmbed(
        'standard',
        '',
        'Error',
        'For some reason, your withdraw failed.',
    );

};

async function sendTransaction(key, coinID, value, address) {

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

    if (coinID == '0000000000000000000000000000000000000000000000000000000000000004') {

        try {
            await account.nativeToken.transfer(
                [
                    {
                        paymentAddressStr: address,
                        amount: value,
                        message: 'From The Bank'
                    }
                ],
                '20' // fee in nano PRV
            );
        } catch {
            return false
        };

        return true;

    };

    try {

        const token = await account.getFollowingPrivacyToken(tokenID);
        await token.transfer(
            [
                {
                    paymentAddressStr: address,
                    amount: value,
                    message: 'From The Bank'
                }
            ],
            '20', // fee in nano PRV
            '0' // the privacy token must has exchange rate to be fee
        );

    }catch{
        return false
    };

    return true;

};