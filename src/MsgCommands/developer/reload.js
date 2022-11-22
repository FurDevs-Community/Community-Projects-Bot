const fs = require('fs')
require('dotenv').config()
module.exports = {
  name: 'reload',
  aliases: ['refresh'],
  async execute(message, args) {
    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return message.channel.send({ content: "https://tenor.com/view/rohan-jjba-daga-kotowaru-i-refuse-refuse-gif-7385649\n\nI refuse! You're not my developer!" })

    const commandName2 = args[0].toLowerCase();
    const command2 = message.client.commands2.get(commandName2)
      || message.client.commands2.find(cmd => cmd.aliases && cmd.aliases.includes(commandName2));

    if (!command2) {
      return message.channel.send(`Erm, idk the command \`${commandName2}\`, Kigu!`);
    }
    const commandFolders = fs.readdirSync('./src/MsgCommands');
    const folderName = commandFolders.find(folder => fs.readdirSync(`./src/MsgCommands/${folder}`).includes(`${command2.name}.js`));

    delete require.cache[require.resolve(`../${folderName}/${command2.name}.js`)];

    try {
      const newCommand = require(`../${folderName}/${command2.name}.js`);
      message.client.commands2.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${newCommand.name}\` was reloaded~!`);
    } catch (error) {
      console.error(error);
      message.channel.send(`There was an error while reloading a command QwQ, \`${command.name}\`:\n\`${error}\``);
    }
  }
}