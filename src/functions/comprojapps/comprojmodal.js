const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'comprojmodal',
  async execute(interaction) {


    let checkapp = 'app' + interaction.user.id

    let checkfirst = await db.get(`${checkapp}`)
    if (checkfirst) return interaction.reply({ content: "You still have a pending project application. Please wait for until staff has decided on that app before applying again!" })

    const firstQ = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('Q1')
          .setLabel('Channel Name')
          .setStyle(TextInputStyle.Short)
          .setMinLength(1)
          .setMaxLength(100)
          .setPlaceholder('replace space with (-).')
          .setRequired(true),
      )
    const secondQ = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('Q2')
          .setLabel('Channel Topic')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(1)
          .setMaxLength(500)
          .setPlaceholder('What is the channel all about')
          .setRequired(true),
      )
    const thirdQ = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('Q3')
          .setLabel('Project Description')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(1)
          .setMaxLength(500)
          .setPlaceholder("What's the project all about?")
          .setRequired(true),
      )
    const fourthQ = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('Q4')
          .setLabel('Project Goal/s')
          .setStyle(TextInputStyle.Paragraph)
          .setMinLength(1)
          .setMaxLength(500)
          .setPlaceholder('Aim of the project. Write N/A if not applicable.')
          .setRequired(true),
      )
    const fifthQ = new ActionRowBuilder()
      .addComponents(
        new TextInputBuilder()
          .setCustomId('Q5')
          .setLabel('Do you agree to the rules?')
          .setStyle(TextInputStyle.Short)
          .setMinLength(2)
          .setMaxLength(3)
          .setPlaceholder('YES/NO (Category Rules)')
          .setRequired(true),
      )
    const questionnaire = new ModalBuilder()
      .setTitle('Community Projects Application')
      .setCustomId('comprojapp')
      .addComponents([firstQ,
        secondQ,
        thirdQ,
        fourthQ,
        fifthQ])
    await interaction.showModal(questionnaire)
  }
}