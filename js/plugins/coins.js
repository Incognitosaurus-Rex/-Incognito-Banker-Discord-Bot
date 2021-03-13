//Exports Command
module.exports = {
    start
};

//Factory Imports
const { getCoinData, saveCoinData } = require('../factory/storage');
const { generateEmbed } = require('../factory/embed')


async function start(key, user, userID, accountNumber, args) {

    if (args[0] == 'add') {

        if (accountNumber == 'cb63fff8a90fb9cc565fc953e0faa943') {

            var data = await getCoinData();

            //Populate Coin Data
            if (!data[args[1]]) {
                data[args[1]] = {
                    balance: 0,
                    claimed: 0,
                    staked: 0,
                    tokenID: args[2]
                };

                data['Coins'].push(args[1]);

                await saveCoinData(data);

                //Return Embed
                return await generateEmbed(
                    'standard',
                    ' ',
                    'You have added a coin!',
                    args[1] +' is now a usable coin.\n\u200B',
                );

            };

        };
    };

    if (args[0] == 'remove') {

        if (accountNumber == 'cb63fff8a90fb9cc565fc953e0faa943') {

            var data = await getCoinData();

                data['Coins'].pop();

                await saveCoinData(data);

                //Return Embed
                return await generateEmbed(
                    'standard',
                    ' ',
                    'You have removed a coin!',
                    'The last added coin is now removed.\n\u200B',
                );

            };

        };

    if(args[0] == null){

        var coinData = await getCoinData();
        var messegeBody = '';

        //Cycles through each coin
        for (const element of coinData['Coins']) {
            messegeBody += '```fix' + '\n' + element + '```';
        };

        //Return Embed
        return await generateEmbed(
            'standard',
            ' ',
            'Available Coins:',
            messegeBody + '\n\u200B',
        );

    }else{
        //Return Embed
        return await generateEmbed(
            'standard',
            ' ',
            'You can not use this command!',
            'Please use $help to get a list of usable commands.\n\u200B',
        );
    };

};