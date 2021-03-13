module.exports = {
    start
};

//Factory Imports
const { generateEmbed } = require('../factory/embed');
const { getAccountData, saveAccountData, getWalletAddress } = require('../factory/storage');

async function start(key, user, userID, accountNumber, args){

    //Get Account Data
    var accountData = await getAccountData(key, accountNumber);

    var memo = '';

    //Check Memo
    if(accountData['Account'].memo > 9999){
                    
        memo = accountData['Account'].memo;

    }else{
               
        //Generate Memo
        memo = Math.floor(10000 + (99999 - 1000) * Math.random());
        accountData['Account'].memo = memo;
        await saveAccountData(key, accountNumber, accountData);

    }

    let walletAddress = await getWalletAddress();

    return await generateEmbed(
        'standard',
        'Incognito Bank Deposit',
        'Please use this address: ',
        '```fix' + '\n' + walletAddress + '```\n' +
        '**-- Dont Forget To Add The Memo! --**' + 
        '```fix' + '\n' + 'Memo: ' + accountData['Account'].memo + '```\n' + 
        '**Do $address to get wallet address in plain text**\n\u200B'

    );

};