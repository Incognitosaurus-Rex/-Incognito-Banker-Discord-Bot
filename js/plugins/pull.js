module.exports = {
    start
};

const { generateEmbed } = require('../factory/embed');
const {spawn} = require('child_process')

async function start(key, user, userID, accountNumber, args){
    
    if (accountNumber == 'abc5e402b52cbcf61555b321c2238096') {
    
        spawn('sh', ['../../GitPull.sh']);
    
    }else{
        return await generateEmbed(
        'standard',
        'Pull Did Not Work',
        'Blah',
        '\n\u200B'
    );
};

};
