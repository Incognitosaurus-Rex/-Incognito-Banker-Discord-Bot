module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');
const { getAccountData, saveAccountData } = require('../factory/storage');

async function start(key, user, userID, accountNumber, args) {


    //Get's Account Data
    var accountData = await getAccountData(key, accountNumber);

    //Get's The Last Claimed Time
    let accountTime = accountData['Account'].lastClaimed;

    //Calculates the Diffrence in Times
    let deltaTime = Math.floor((new Date().getTime() - accountTime) / (1000 * 60));

    //Compare Times
    if (deltaTime > 360) {

        //Random Math
        var ranMath = ((Math.random() * (0.00002 - 0.00000001)) + 0.00000001);

        //Get Faucet Amount
        let faucetAmount = Math.round(ranMath * 1e8) / 1e8;

        //Increase Balance
        accountData['PRV'].balance += faucetAmount;

        //Set Claim Time
        accountData['Account'].lastClaimed = new Date().getTime();

        //Save Balance
        await saveAccountData(key, accountNumber, accountData);

        //Generate Messege
        return generateEmbed
            (
                'standard',
                '',
                'PRV Faucet',
                '<@' + userID + '> was given ' + faucetAmount + ' PRV!' + '\n\u200B'
            );

    };

    //Generate Messege
    return generateEmbed
        (
            'standard',
            '',
            'PRV Faucet',
            'You have to wait ' + (360 - deltaTime) + ' miniutes before you can claim again!' + '\n\u200B'
        );


};