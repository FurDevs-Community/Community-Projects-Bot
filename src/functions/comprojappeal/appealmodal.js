const { ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  name: 'appealmaker',
  async execute(interaction) {
    
    let checkapp = 'app' + interaction.user.id
    if (interaction.customId === 'iunderstand') {
      await interaction.update({ components: [] })
      await db.delete(checkapp)
      return
    }
    if (interaction.customId === 'appealmake') {
      const nanio = new ActionRowBuilder()
        .addComponents(
          new TextInputBuilder()
            .setCustomId('appealchannel')
            .setLabel('Input your Appeal Statement.')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(1)
            .setMaxLength(1000)
            .setPlaceholder('Why it should be reconsidered?')
            .setRequired(true),
        )
      const questionnaire2 = new ModalBuilder()
        .setTitle('FDevComProj - Rejection Appeals')
        .setCustomId('projappsappeal')
        .addComponents([nanio])
      await interaction.showModal(questionnaire2)
    }
  }
}