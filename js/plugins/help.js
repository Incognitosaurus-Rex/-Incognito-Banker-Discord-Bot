module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');

async function start(key, user, userID, accountNumber, args){

    return await generateEmbed(
        'standard',
        'Here is a list of commands',
        'Commands: ',
        '```fix' + '\n' + '$balance <pCoin>``` - *Displays your pCoin balance in the Incognito Bank*' + '\n\n' +
        '```fix' + '\n' + '$bank``` - *Displays how much pCoins are inside the Incognito Bank*' + '\n\n' +
        '```fix' + '\n' + '$coins``` - *Displays a list of all usable pCoins*' + '\n\n' +
        '```fix' + '\n' + '$dao``` - *Work in Progress*' + '\n\n' +
        '```fix' + '\n' + '$deposit``` - *Allows you to deposit pCoins into the Incognito Bank*' + '\n\n' +
        '```fix' + '\n' + '$faucet``` - *Allows you to recieve some free PRV every 6 hours*' + '\n\n' +
        '```fix' + '\n' + '$gamble``` - *Work in Progress*' + '\n\n' +
        '```fix' + '\n' + '$tip <amount> <pCoin> <@user>``` - *Do this to send pCoins to someones Incognito Bank Account*' + '\n\n' +
        '```fix' + '\n' + '$verify <pCoin>``` - *Do this to confirm your deposit*' + '\n\n' +
        '```fix' + '\n' + '$withdraw <amount> <pCoin> <address>``` - *Allows you to withdraw pCoins from the Incognito Bank*' + '\n\u200B'
    );

};