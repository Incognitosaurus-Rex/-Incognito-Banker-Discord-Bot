//Exports Command
module.exports = {
    command
};

//Debugging Imports
var colors = require('colors');

//Factory Imports
const { checkAccount } = require('./factory/account');
const { getAccountNumber } = require('./factory/encryption');
const { initializeStorage } = require('./factory/storage');

//Plugin Imports
const { generateEmbed } = require('./factory/embed')

//Main Manage Function
async function command(key, user, userID, type, args) {

    //Makes sure all required Directories and Files Exists
    await initializeStorage(key);

	//Generate Account Number
	var accountNumber = await getAccountNumber(key, userID);

	try{
		//Checks and Updates User Account
		await checkAccount(key, accountNumber, userID);
	}catch{
		//Debuging Log
		console.log('- '.green + accountNumber.green + ': '.green + userID.yellow + ' Failed To UpdateAccount'.yellow + type.yellow);
	};

    //Debuging Log
    console.log('- '.green + user.green + ':'.green + ' $'.yellow + type.yellow);

    try {

        try {
            //Delete Cashe
            delete require.cache[require.resolve('./plugins/' + type)];
        } catch {
            console.log('- Reload Failed');
        };

        //Require Plugin
        var { start } = require('./plugins/' + type);

        //Execute Function
        return await start(key, user, userID, accountNumber, args);

    } catch {

        //Failure Messege
        return await generateEmbed('failure');

    };

};
