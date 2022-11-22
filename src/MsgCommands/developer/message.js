const { EmbedBuilder } = require('discord.js')
const resolve = require('../../functions/resolvers/resolveuser.js')
require('dotenv').config()

module.exports = {
  name: 'message',
  async execute(message, args) {
    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return message.reply({ content: "I refuse! You are not my master! >w<" })
    const target = args[0]
    const repuser = await resolve.execute(message, target)
    console.log(repuser)
    let issuer = message.author.id
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID. *I don't accept names because I dun wanna DM wrong person qwq*")
    if (repuser == issuer) return message.reply("y u wan DM yourself? I won't allow it QwQ");

    const reason = args.slice(1).join(" ")

    var mensahe = new EmbedBuilder()
      .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
      .setColor('#4B589C')
      .setTitle('New Message!')
      .setDescription("You have a message from the FurDevs Staff Team.")
      .addFields([
        { name: "Message:", value: reason },
        { name: "Take note!", value: `*As this is an automated message, please do not reply here. Please reach out to available staff to deliver your reply, or to a specific staff if the message indicates so.*` }
      ])
      .setTimestamp()
      .setFooter({ text: 'Staff Team', iconURL: message.client.user.avatarURL() });

    try {
      await message.guild.members.fetch(`${repuser}`)
    } catch (err) {
      await message.reply("User Invalid! You sure the user is still in the guild?")
      return
    }

    let inserver = await message.guild.members.fetch(`${repuser}`)
    if (inserver) {
          await inserver.send({ content: "New message! Please do not reply to me as this is automated.", embeds: [mensahe] }).catch(() => message.reply("User has their DMs closed! Action suspended."))
          await message.reply(`DM sent to <@${repuser}>!`)
    }
  }
}