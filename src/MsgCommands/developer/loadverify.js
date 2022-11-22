const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
  name: 'loadverify',
  async execute(message) {

    let types = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId('startcomproj')
          .setLabel('Start Application!'),
      )

    const feck = message.guild.channels.cache.find(c => c.id === "READRULESPROJ")
    feck.send({content: "done reading? Apply here!", components:[types]})

    await message.reply("Verification Button has been loaded!")
  }
}