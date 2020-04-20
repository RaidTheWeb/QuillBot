const Discord = require('discord.js');

const { exec } = require('child_process');

const bot = new Discord.Client();

const token = process.env.token;

process.env.token = ''

const keep_alive = require('./keep-alive.js');

const PREFIX = '!';

var color = 'BLUE';
var errcolor = 'RED';

const boturl = 'https://discordapp.com/api/oauth2/authorize?client_id=700911378885640274&permissions=8&scope=bot';

const botavater = 'https://cdn.discordapp.com/icons/694736518979256360/524de637dbe781ff6bc2e3a7c6dd925f.png?size=128';



var version = '1.0.1';

bot.on('ready', () =>{
    console.log('QuillBot Listening...');
    bot.user.setActivity('!help', { type: 'LISTENING' });
});

bot.on('message', message=>{
    let args = message.content.split(' ');

    switch(args[0]){
        case '!help':
           const helpembedhome = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle(message.author.username)
            .setDescription('QuillBot help menu:')
            .addField('standard:', '!version, !help, !say, !server')
            .addField('administrative:', '!addrole @user <role>, !delrole @user <role>, !clear <amount>, !botConfig')
            .addField('misc:', '!exec <node/bash> <stream>, !avatar, !avatar @<user>')
            .setFooter('Bot managed by @RaidTheWeb', botavater);
            message.channel.send(helpembedhome);
            break;
        case '!server':
            var ping = Date.now() - message.createdTimestamp + " ms";
            const statusEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .addField(message.guild.name, 'Server: ' + message.guild.name + '\nPing: ' + ping)
            .setFooter('Bot managed by @RaidTheWeb', botavater);
            message.channel.send(statusEmbed);
            break;
        case '!avatar':
            if (!message.mentions.users.size) {
                const attachment = new Discord.MessageAttachment(message.author.displayAvatarURL({ format: "png", dynamic: true }))
		        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`, attachment);
                break;
	        }

            const attachment = new Discord.MessageAttachment(message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true }))
	        message.channel.send(`${message.mentions.users.first().username}'s avatar: <${message.mentions.users.first().displayAvatarURL({ format: "png", dynamic: true })}>`, attachment);
            break;
        case '!clear':
            if(!message.member.hasPermission('ADMINISTRATOR')){
                const noadminembed = new Discord.MessageEmbed()
                .setColor(errcolor)
                .setTitle(message.author.username)
                .setDescription('Sorry, you do not have permission to use this command.');
                message.channel.send(noadminembed);
                break;
            }
            message.channel.bulkDelete(args[1]);
            break;
        case '!exec':
            switch(args[1]){
                case 'node':
                    if(args[2]){
                        if(args[2] === 'quit()' || args[2] === 'quit();'){
                            break;
                        }
                        try {
                            message.channel.send(eval(args.slice(2).join(' ')));
                        } catch (e) {}
                        
                    }
                    break;
                case 'bash':
                    if(args[2]){
                        if(args[2] === 'kill'){
                            break;
                        }
                        exec(args.slice(2).join(' '), (error, stdout, stderr) =>{
                            if(error){
                                message.channel.send(stderr);
                            }
                            message.channel.send(stdout);
                            
                        });
                    }
                    break;
            }
            break;
        case '!botConfig':
            if(!message.member.hasPermission('ADMINISTRATOR')){
                const noadminembed = new Discord.MessageEmbed()
                .setColor(errcolor)
                .setTitle(message.author.username)
                .setDescription('Sorry, you do not have permission to use this command.');
                message.channel.send(noadminembed);
                break;
            }
            if(!args[1]){
                const configembedhome = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(message.author.username + ' - botConfig')
                .setDescription('Help Message Here!');
                message.channel.send(configembedhome);
                break;
            }
            switch(args[1]){
                case 'embedColor':
                    color = args[2];
                    message.channel.send('Updated embedColor to: ' + color);
                    break;
                case 'version':
                    version = args[2];
                    message.channel.send('Updated version to: ' + version);
                    break;
                case 'errorColor':
                    errcolor = args[2];
                    message.channel.send('Updated errorColor to: ' + errcolor);
                    break;
            }
            break;
        case '!version':
            message.channel.send(version);
            break;
        
    }
});



bot.login(token);