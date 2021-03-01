//Requires
var Discord = require('discord.io');
const { startTimer } = require('winston');
var logger = require('winston');
var auth = require('./auth.json');
const { command } = require('./js/manager');
const { generateEmbed } = require('./js/factory/embed');
const { getWalletAddress } = require('./js/factory/storage');
const {spawn} = require('child_process')

//Defines key
var keyA = null;
var keyB = null;


startBot();

async function startBot() {


    // Configure logger settings
    logger.remove(logger.transports.Console);
    logger.add(new logger.transports.Console, {
        colorize: true
    });
    logger.level = 'debug';


    // Initialize Discord Bot
    var bot = new Discord.Client({
        token: auth.token,
        autorun: true
    });

    //Start Notifications
    bot.on('ready', function (evt) {
        logger.info('Connected');
        logger.info('Logged in as: [Incognito Banker]');
        logger.info(bot.username + ' - (' + bot.id + ')');
        bot.setPresence({
            game: {
                name: 'Command - $help',
                type: 2,
                url: 'https://we.incognito.org/t/revolve-incognito-bank-discord-bot/8308'
            }
        });
    });

    //Bot Start
    bot.on('message', function (user, userID, channelID, message, evt) {

        //Executes Check Function
        checkCommand();

        //Checks The Command Messege
        async function checkCommand() {

            //Get's Key
            let key = keyA + '-xx|xx-' + keyB;

            //Get Command
            if (message.substring(0, 1) == '$') {
                var args = message.substring(1).split(' ');
                var cmd = args[0];
                args = args.splice(1);


                //Locks The Bot
                if (cmd != 'bot' && key.includes(null)) {

                    //Locks The Bot
                    bot.sendMessage({
                        to: channelID,
                        embed: await generateEmbed('unencrypted')
                    });

                    //Ends The Thing
                    return true;

                } else if (key.includes(null)) {

                    //Sets Key A
                    if (cmd == 'bot' && args[0] == 'keyA') {
                        keyA = args[1];

                        bot.sendMessage({
                            to: channelID,
                            embed: await generateEmbed('standard', '', 'Thank You!', 'You have entered in your half of the encryption key - Good Job\n\u200B')
                        });

                        return false;

                    };

                    //Sets Key B
                    if (cmd == 'bot' && args[0] == 'keyB') {
                        keyB = args[1];

                        bot.sendMessage({
                            to: channelID,
                            embed: await generateEmbed('standard', '', 'Thank You!', 'You have entered in your half of the encryption key - Good Job\n\u200B')
                        });

                        return true;

                    };

                };

                    //Execute Command
                    bot.sendMessage({
                        to: channelID,
                        embed: await command(key, user, userID, cmd, args)
                    });


            };
        };


    });

    // Automatically reconnect if the bot disconnects due to inactivity
    bot.on('disconnect', function (erMsg, code) {
        console.log('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');	
	spawn('sh', [GitPush.sh]);
	console.log('Git Pushed')
        bot.connect();
    });

};