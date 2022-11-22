const ms = require('ms')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: "info",
  aliases: ['about'],
  async execute(message) {
    let uwu = await message.client.application.fetch()

    let uptimer = message.client.uptime / 1000
    var totaluptime = ms(uptimer)

    const embed1 = new EmbedBuilder()
      .setAuthor({name:message.client.user.username, iconURL:message.client.user.avatarURL()})
      .setColor('#e0b0ff')
      .setThumbnail(message.client.user.avatarURL())
      .setDescription("Hi there! I am Fenix, who will be in-charge of FurDevs' Community Projects System. I am made using discord.js, and more functions will come in the future for me. Use `f.help` for a command list!")
      .addFields([
        {name:"Bot owner:", value:`${uwu.owner.tag} (${uwu.owner.id})`, inline: true},
        {name:"Uptime:", value:`${totaluptime}`, inline: true},
      ])
      .setTimestamp()
      .setFooter({text:"Discord.js v14.4.0 | FurDevs Community Projects", iconURL:message.client.user.avatarURL()})

    message.channel.send({ embeds: [embed1] })
  }
}