module.exports = {
    start
};

//Factory Imports
const { generateEmbed } = require('../factory/embed');
const { getAccountData, getCoinData } = require('../factory/storage');

async function start(key, user, userID, accountNumber, args) {

    //Retrieve Useful Data
    const userData = await getAccountData(key, accountNumber);
    const coinData = await getCoinData();

    //If no Coin Specified
    if (args[0] == null) {

        //Set MessegeBody
        var messegeBody = '';

        //Go through all coins
        for (const element of coinData['Coins']) {
            messegeBody += '```fix' + '\n' + element + ': ' + (Math.round(userData[element].balance * 1e9) / 1e9) + '```';
        };

        //Return Embed
        return await generateEmbed(
            'standard',
            'Your Account ',
            'Coins:',
            messegeBody + '\n\u200B',
        );

    } else {

        //If Coin Dont Exist
        if (!userData[args[0]]) {

            //Return Embed
            return await generateEmbed(
                'standard',
                ' ',
                'Coin Not Recognized!',
                'Unfortunately the coin you were trying to check is currently not listed. Please do $coins to get a list of available coins. Most likely you did not use capitals.\n\u200B',
            );
        };
        
        //Return Embed
        return await generateEmbed(
            'standard',
            ' ',
            'Your Account Balance:',
            '<@' + userID + '> has ' + (Math.round(userData[element].balance * 1e9) / 1e9) + ' ' + args[0] + ' in their account!\n\u200B',
        );

    };


};