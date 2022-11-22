const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'appcomproj',
  async execute(interaction) {

    let firstA = await interaction.fields.getTextInputValue('Q1')
    let secondA = await interaction.fields.getTextInputValue('Q2')
    let thirdA = await interaction.fields.getTextInputValue('Q3')
    let fourthA = await interaction.fields.getTextInputValue('Q4')
    let fifthA = await interaction.fields.getTextInputValue('Q5')

    let checkapp = 'app' + interaction.user.id

    let lacrimosa = new EmbedBuilder()
      .setAuthor({ name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
      .setTitle('New Application!')
      .setColor('#e0b0ff')
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setDescription("A new application has been dropped. Please select a button that is appropriate for the application. There's no time limits to all applications.")
      .addFields([
              { name: "Applicant Name", value: "Answer: " + interaction.user.username + `#` + interaction.user.discriminator },
              { name: "Applicant ID", value: "Answer: " + interaction.user.id },
              { name: "Channel Name", value: "Answer: " + firstA },
              { name: "Channel Topic", value: "Answer: " + secondA },
              { name: "Project Description", value: "Answer: " + thirdA },
              { name: "Project Goal/s", value: "Answer: " + fourthA  },
              { name: "Do you agree to the Community Project Rules?", value: "Answer: " + fifthA },
            ])
      .setFooter({text:`Date submitted: ${new Date()}`})

    const chooser = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("comproja-" + checkapp)
          .setLabel('Approve Application')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("comprojq-" + checkapp)
          .setLabel('Question Application')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("comprojd-" + checkapp)
          .setLabel('Reject Application')
          .setStyle(ButtonStyle.Danger),
      )

    let appsend = await interaction.client.channels.cache.find(c => c.id === 'PROJPENDING')
    await appsend.send({ embeds: [lacrimosa], components: [chooser] }).then(async message => {
      let madoka = new Array(firstA, secondA, thirdA, fourthA, fifthA)
      let hiya = {}
      hiya['ogmessage'] = message.id
      hiya['name'] = interaction.user.username + '#' + interaction.user.discriminator
      hiya['id'] = interaction.user.id
      hiya['revimgsearch'] = interaction.user.displayAvatarURL({ dynamic: true })
      hiya['responses'] = JSON.stringify(madoka)
      hiya['date'] = new Date()
      try {
        await db.set(checkapp, hiya)
        await interaction.reply({ content: 'Your application has been submitted for review! Please wait for further notice from me in regards to it. Thank you!\n\nAt this time, please do not submit a duplicate application while we handle it.', ephemeral: true })
      } catch (err) {
        await interaction.reply({ content: "Oops! Something went wrong. Sorry about that! >w< (Please contact Kigu with this error message.)" + `\n\n${err}`, ephemeral: true })
      }
    })
  }
}