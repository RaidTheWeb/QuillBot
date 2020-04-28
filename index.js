const Discord = require('discord.js');

const { exec } = require('child_process');

const bot = new Discord.Client();

const token = process.env.token;

process.env.token = '';

const fs = require('fs');


var http = require('http');

http.createServer(function (req, res) {
  res.write("QuillBot is Live...");
  res.end();
}).listen(8080);

process.exit = '';

process.kill = '';

process.abort = '';

process.reallyExit = '';


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


process.on('exit', (code) => {
    
});

bot.on('message', message=>{
    try{
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

            case '!write':
                var numLines = args[1];
                var outFile = args[2];
                const filter = m => m.author.id == message.author.id
                const collector = message.channel.createMessageCollector(filter, { max: numLines });
                let appendList = [];
                collector.on('collect', m => {
                    console.log(`collected ${m.content}`);
                    fs.appendFile(outFile, m.content + '\n', (err) => {
                        if (err) throw err;
                        console.log(`Wrote ${m.content}`);
                    });
                });
                break;
            
            case '!read':
                var filename = args[1];
                exec('cat ' + filename, (error, stdout, stderr) =>{
                    if(error){
                        message.channel.send(stderr);
                    }
                    message.channel.send(stdout);
                                
                    });               
                break;

            case '!b64':
                var data = args.slice(1).join(' ');
                var buff = new Buffer(data);
                let base64 = buff.toString('base64');
                message.channel.send(`Base64 encoded data is: ${base64}`);
                break;

            case '!d64':
                var data = args.slice(1).join(' ');
                var buff = new Buffer(data, 'base64');
                let ascii = buff.toString('ascii');
                message.channel.send(`Base64 decoded data is: ${ascii}`);
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
                            if(args.includes('kill')){
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
                    case 'roleColor':
                        var botrole = message.guild.roles.find(role => role.name === 'QuillBot');
                        roleColor = args[2];
                        botrole.edit({
                            color: roleColor
                        });
                        message.channel.send('Updated roleColor to: ' + roleColor);
                        break;
                }
                break;
            case '!version':
                message.channel.send(version);
                break;
            
        }
    } catch (e) {}
});



bot.login(token);