module.exports = {
    generateEmbed
};

//To Generate Embeds
var Discord = require('discord.js');


async function generateEmbed(type, bold, title, body){

    switch(type){

        case 'standard':
            return await generate(
                bold,
                title,
                body,
            );
        break;

        case 'failure':
            return await generate(
                'There was an Error',
                'Invalid Command:',
                'The command you were trying to use was invalid.\n' +
                'Please do $help to look at all the available commands.\n\u200B'

            ); 
        break;

        case 'unencrypted':
            let admin1 = '<@214065979091714048>'
            let admin2 = '<@521201894979403837>'
            return await generate(
                'There was an Error',
                'The Bot Needs An Encryption Key!',
                'Please have both admins intitalize their half of the encryption key! ' + admin1 + ' ' + admin2 + '\n\u200B'
            ); 
        break;

    };


};



//Used To Generate Messeges
async function generate(embedTitle, commandTitle, embedMessege ){
    let embed = new Discord.MessageEmbed()
	.setColor('#03fc2c')
	.setTitle(embedTitle)
	//.setURL('https://we.incognito.org/t/revolve-incognito-bank-discord-bot/8308')
	.setAuthor('[Incognito Banker]')
    .setDescription('')
    .addFields(
        { name: commandTitle, value: embedMessege, inline: true },
	)
	.setThumbnail('https://i.imgur.com/RPki4oX.png')
	.setTimestamp()
	.setFooter('Made by @Revolve');

    //Returns Messege
    return(embed);
};