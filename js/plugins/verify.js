module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');
const { getCoinData, getViewKey, getWalletAddress, getAccountData, saveAccountData } = require('../factory/storage');
const bs58 = require('bs58');
const axios = require('axios');

async function start(key, user, userID, accountNumber, args) {

    //No Coin, No Function
    if (args[0] == null) {
        return generateEmbed
            (
                'standard',
                '',
                'Please Select a Coin!',
                'Please do $coins to check coins available for deposit!' + '\n\u200B'
            );
    };

    //Get Token ID
    let coinData = await getCoinData();
    let tokenID = coinData[args[0]].tokenID;

    //Get Keys
    let viewKey = await getViewKey(key);
    let publicKey = await getWalletAddress();

    //Get's Transaction Data
    let transactionData = await getTransactionData(publicKey, viewKey, tokenID);
    if(transactionData == false){
        return await generateEmbed(
            'standard',
            '',
            'Error',
            'Sorry, there was an error retrieving transaction data! ',
        );
    }


    //Get UserMemo
    let accountData = await getAccountData(key, accountNumber);
    let memo = accountData['Account'].memo;

    //Add Balance
    if(transactionData[memo] > 0){
        let depositAmount = (transactionData[memo] / 1000000000);
        
        accountData[args[0]].balance += depositAmount;

        //Generate Memo
        memo = Math.floor(10000 + (99999 - 1000) * Math.random());
        accountData['Account'].memo = memo;

        //Save Account Data
        await saveAccountData(key, accountNumber, accountData);


        return await generateEmbed(
            'standard',
            '',
            'Your Account Balance',
            '<@' + userID + '> deposited ' + depositAmount + ' ' + args[0] + '\n\u200B'
        );
    }

    return await generateEmbed(
        'standard',
        '',
        'No Transaction Found',
        'It seems to be no transaction found with the associated memo!',

    );

};

async function getTransactionData(publicKey, viewKey, tokenID) {

    let perams = {
        PaymentAddress: publicKey,
        ReadonlyKey: viewKey,
        TokenID: tokenID,
        Skip: 0,
        Limit: 1000
    }

    //Ship it
    const newTransactions = (await postToNode('https://fullnode.incognito.best', 'gettransactionbyreceiverv2', [perams] )).ReceivedTransactions;

    //Creates Data List
    var transactionData = {}

    for (const element of newTransactions) {
        let memo = await decode(element.Info);
        if (memo > 1000){
            transactionData[memo] = await parseAmount(element, tokenID);
        };
    };

    return transactionData;


    async function decode(rawValue){
        const decoded = bs58.decode(rawValue);
        const truncated = decoded.slice(1, decoded.length - 4);
        return truncated.toString();
    }

    async function parseAmount(transaction, tokenID){
        let result = 0;
        transaction.ReceivedAmounts[tokenID].forEach(val => {
            result += val.CoinDetails.Value;
        });
        return result;
    };

    async function postToNode(url, type, perams){
        const result = await axios.post(url, {
            jsonrpc: '2.0',
            id: '1',
            method: type,
            params: perams,
        });
        if (result.data.Error === null) {
            return result.data.Result;
        };
        return false;
    };

};