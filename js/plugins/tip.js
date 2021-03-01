module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');
const { checkAccount } = require('../factory/account');
const { getAccountNumber } = require('../factory/encryption');
const { getAccountData, saveAccountData, getCoinData, saveCoinData } = require('../factory/storage');

async function start(key, user, userID, accountNumber, args) {

    if (args[2] != null) {

        //Getting The User
        var mentionID = await getUserFromMention(args[2]); //Mention ARGS

        //Checks if Mention is legit
        if(mentionID == false){

            return await generateEmbed(
                'standard',
                '',
                'There was an error',
                'The person you were mentioning does not exist for some reason.\n\u200B'
            );

        };
       
        var toNumber = await getAccountNumber(key, mentionID)

        //Creating Account If Needed
        await checkAccount(key, toNumber, mentionID); //Creates User Account If Needed

        //Get UserData
        var userData = await getAccountData(key, accountNumber);
        var sendData = await getAccountData(key, toNumber);

        //Set Amount
        let amount = Math.round(args[0] * 1e9) / 1e9;

        //Mention is bot
        if(mentionID == '785377179680374785'){
            userData[args[1]].balance -= amount;
            await saveAccountData(key, accountNumber, userData);
            
            let coinData = await getCoinData(key);
            coinData[args[1]].claimed -= amount;
            await saveCoinData(coinData);

            return await generateEmbed(
                'standard',
                '',
                'Thank You!',
                'You have tipped ' + amount + ' ' + args[1] + ' to the Incognito Banker Bot.\n\u200B'
        
            );

        };

        //Checks if has balance
        if (amount <= userData[args[1]].balance) {

            userData[args[1]].balance -= amount;

            sendData[args[1]].balance += amount;

            await saveAccountData(key, accountNumber, userData);
            await saveAccountData(key, toNumber, sendData);
            
            return await generateEmbed(
                'standard',
                '',
                'Your Transaction',
                'You sent ' + amount + ' ' + args[1] + ' to ' + args[2] + '\n\u200B'
            );
        };

    };


    return await generateEmbed(
        'standard',
        '',
        'There was an error',
        'Maybe you do not have enough of a balance?\n\u200B'
    );
};

async function getUserFromMention(mention) {

    var finalID;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        finalID = mention.slice(2, -1);

        if (finalID.startsWith('!')) {
            finalID = finalID.slice(1);
        }

        return finalID;
    };

    return false;
}