require('dotenv').config
const Database = require("@replit/database")
const db = new Database()
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'dblist',
  async execute(message) {

    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return

     await db.list().then(keys => {
       if(keys.length == 0) return message.reply("QwQ, there ain't anything in my DB Logs")
        let grr = keys.join('\n');

        const list = new EmbedBuilder()
          .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
          .setColor('#4585ed')
          .setTitle(`All Database Keys`)
          .setDescription(grr)
          .setTimestamp()
          .setFooter({ text: 'SeirenAI Database Logs - Cyanide Heights', iconURL: message.client.user.avatarURL() });

        message.reply({ embeds: [list] })
      })
  }
}