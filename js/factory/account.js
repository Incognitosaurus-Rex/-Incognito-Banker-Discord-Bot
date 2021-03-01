//Exports Command
module.exports = {
    checkAccount
};

//Factory Imports
const { populateAccountData, getAccountData, getCoinData, saveCoinData, saveAccountData, getUserList, saveUserList } = require('./storage');
const { getMigrationNumber } = require('./encryption');

//File Import
const fs = require('fs-extra');



async function checkAccount(key, accountNumber, userID) {

    //Add User Data File
    await populateAccountData(accountNumber);

    //Retrieve User Data File
    var accountData = await getAccountData(key, accountNumber);

    //Populate Account Info
    if (accountData['Version'] <= 1) {

        //Populate User Data File ('Account')
        if (!accountData['Account']) {
            accountData['Account'] = {
                lastClaimed: 0,
                memo: 0,
                clientSeed: '',
                serverSeed: ''
            };
        };

        if (!accountData['PRV']) {
            accountData['PRV'] = {
                balance: 0,
                staked: 0,
            };
        };

        //Update Version
        accountData['Version'] = 2;
		
		//Reset Claimed
		if(accountData['PRV'].balance > 0){
			//Updates Claimed Value
			var coinData2 = await getCoinData();
			coinData2['PRV'].claimed += accountData['PRV'].balance;
			await saveCoinData(coinData2);
		};

        //Save Changes To Account Data
        await saveAccountData(key, accountNumber, accountData);

        //Add to userlist
        var list = await getUserList();
        list['Users'].push(accountNumber);
        await saveUserList(list);

    };

    //Migrate Old Data
    if (accountData['Migrated'] == false) {

        //Migrate Old Data to New User File
        accountData = await migrateOldData(userID, accountData);

        //Save Changes To Account Data
        await saveAccountData(key, accountNumber, accountData);

        //Debuging Log
        console.log('~ ' + 'Data:'.cyan + ' Data Migration Complete'.magenta);

    };

    //Populate Coin Info
    let coinData = await getCoinData();
    let coinList = coinData['Coins'];
    
    //Adds Each Coin
    for (const element of coinList) {
        if(!accountData[element]){
            accountData[element] = {
                balance: 0,
                staked: 0
            };

            //Saves Data
            await saveAccountData(key, accountNumber, accountData);
        };
    };

    //Ends Function
    return true;

};


async function migrateOldData(userId, accountData){

    //Set Paths
    let migrationPath = './data/migration';
    let userPath = migrationPath + '/' + await getMigrationNumber(userId);

    var newData = accountData;

    //Get Migrated Data
    if(await fs.pathExists(userPath) == true){
        
        //Reads Json Data
        let oldAccountData = JSON.parse(fs.readFileSync(userPath + '/account.json'));
        let oldBalanceData = JSON.parse(fs.readFileSync(userPath + '/PRV.json'));

        //Add Account Data
        newData['Account'].lastClaimed = oldAccountData['Account'].lastClaimed;
        newData['Account'].memo = oldAccountData['Account'].memo;

        //Add Balance Data
        let oldBalance = Math.round(oldBalanceData['Account'].Balance * 1e9) / 1e9
        newData['PRV'].balance = oldBalance;

        //Updates Claimed Value
        let coinData = await getCoinData();
        coinData['PRV'].claimed += oldBalance;
        await saveCoinData(coinData);

    };

    //Set Migration Status
    newData['Migrated'] = true;

    //Return Data
    return newData;
    
};