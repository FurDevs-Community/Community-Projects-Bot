const { Collection } = require('discord.js')
const cooldowns = new Map()
module.exports = {
  name: "messageCreate",
  async execute(message) {

    message.client.cooldowns = new Collection();
    if(message.author.bot == true) return;
    if(message.author == message.client.user) return

    const prefixes = ['F.', 'f.']
    let hasPrefix = false;
    prefixes.some(p => message.content.startsWith(p)) ? hasPrefix = true : null;
    if (!hasPrefix) return;
    let args = message.content.slice(prefixes.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const poke = message.client.commands2.get(commandName) || message.client.commands2.find(poke => poke.aliases && poke.aliases.includes(commandName));
    console.log(poke)

    if (!poke) return;

    if (!cooldowns.has(poke.name)) {
      cooldowns.set(poke.name, new Collection())
    }

    var current_time = Date.now()
    const timestamp = cooldowns.get(poke.name);
    const cd_amt = (poke.cooldown) * 1000;

    if (timestamp.has(`${message.author.id}`)) {
      let expiry = timestamp.get(message.author.id) + cd_amt

      if (current_time < expiry) {
        let waitaminute = (expiry - current_time) / 1000

        return message.reply(`Holdup! Give us some time. Please wait ${waitaminute.toFixed(1)} seconds before using **${poke.name}** again.`)
      }
    }

    timestamp.set(message.author.id, current_time)
    setTimeout(() => timestamp.delete(message.author.id), cd_amt)

    try {
      poke.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('there was an error trying to execute that command! if this error persists, please contact the bot owner.');
    }
  }
}