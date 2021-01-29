//Exports Command
module.exports = {
    getAccountNumber,
    getMigrationNumber,
    encryptData,
    decryptData,
};

//Factory Imports
const { getAccountSalt } = require('./storage');

// Hashing Requirements
var crypto = require('crypto');
var md5 = require('md5');


//Allows you to Generate Account Numbers
async function getAccountNumber(key, userID) {

    //Generates Number
    let accountSecret = crypto.createHash('sha256').update( await getAccountSalt(key) + ' | ' + userID).digest('base64');

    //Debuging Log
    console.log('~ ' + 'Math:'.cyan + ' Account Number Generated'.magenta);

    //Returns Number
    return md5(accountSecret);

};

async function getMigrationNumber(userID) {

    //Generates Number
    let accountHash = crypto.createHash('sha256').update(userID + '| OggieBoogie420').digest('base64');
    let migrationNumber = md5(accountHash);

    //Debuging Log
    console.log('~ ' + 'Math:'.cyan + ' Migration Number Generated'.magenta);

    //Return Number
    return migrationNumber;

};

async function encryptData(key, data){

    //Creates Encryptor
    var encryptor = require('simple-encryptor')(key);

    //Encrypts Data
    var encryptStuff = await encryptor.encrypt(data);

    //Debuging Log
    console.log('~ ' + 'Encryption:'.cyan + ' Data Encrypted'.magenta);

    //Returns Data
    return encryptStuff;

};

async function decryptData(key, data){

    //Creates Encryptor
    var decryptor = require('simple-encryptor')(key);

    //Decrypts Data
    var decryptStuff = await decryptor.decrypt(data);

    //Debuging Log
    console.log('~ ' + 'Encryption:'.cyan + ' Data Decrypted'.magenta);

    //Returns Data
    return decryptStuff;

};