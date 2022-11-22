const Database = require('@replit/database')
const db = new Database()
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')

module.exports = {
  name: 'reasonproj',
  async execute(interaction) {
    const tubaba = interaction.client.channels.cache.find(c => c.id === 'PROJLOGS')
    let hulda = interaction.channel

    var appeal = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('iunderstand')
          .setStyle(ButtonStyle.Secondary)
          .setLabel('I Understand :('),
        new ButtonBuilder()
          .setCustomId('appealmake')
          .setStyle(ButtonStyle.Primary)
          .setLabel('Appeal Decision!'),
      )

    if (interaction.customId == 'rejectcomproj') {
      let namekick = 'comprojreject-' + interaction.user.id
      console.log(namekick)
      try {
        await db.get(namekick)
      } catch (err) {
        await interaction.reply({ content: `Ack, an error!\n\n${err}` })
        return
      }

      let despacito = await db.get(namekick)

      if (despacito) {
        console.log(despacito)
        let dbID = despacito.usertoreject

        let nocnoc = await db.get(`${dbID}`)
        if (nocnoc) {
          console.log(nocnoc)
          let user = nocnoc.id
          console.log(nocnoc.id)

          let hh = await JSON.parse(nocnoc.responses)

          let okayme = new EmbedBuilder()
            .setAuthor({ name: nocnoc.name, iconURL: nocnoc.revimgsearch })
            .setTitle('Application Log')
            .setColor('#e0b0ff')
            .setThumbnail(`${nocnoc.revimgsearch}`)
            .addFields([
              { name: "Applicant Name", value: "Answer: " + nocnoc.name },
              { name: "Applicant ID", value: "Answer: " + nocnoc.id },
              { name: "Channel Name", value: "Answer: " + hh[0] },
              { name: "Channel Topic", value: "Answer: " + hh[1] },
              { name: "Project Description", value: "Answer: " + hh[2] },
              { name: "Project Goal/s", value: "Answer: " + hh[3] },
              { name: "Do you agree to the Community Project Rules?", value: "Answer: " + hh[4] },
              { name: "Date Submitted", value: nocnoc.date },
            ])
            .setFooter({ text: `date handled: ${new Date()}` })

          let mmmyes = await interaction.fields.getTextInputValue('reasonx')

          let awts = new EmbedBuilder()
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle('Application Rejected ;w;')
            .setColor('#e0b0ff')
            .setDescription("Aww, it looks like your application has been rejected. Please check the details below.")
            .addFields([
              { name: "Channel Name", value: "Answer: " + hh[0] },
              { name: "Channel Topic", value: "Answer: " + hh[1] },
              { name: "Project Description", value: "Answer: " + hh[2] },
              { name: "Project Goal/s", value: "Answer: " + hh[3] },
              { name: "Do you agree to the Community Project Rules?", value: "Answer: " + hh[4] },
              { name: "Reason for Rejection", value: `${mmmyes}` },
              { name: "Date Submitted", value: nocnoc.date },
            ])
            .setFooter({ text: `date handled: ${new Date()}` })

          let mensahekainis = await interaction.channel.messages.fetch(`${nocnoc.ogmessage}`)

          try {
            await interaction.guild.members.fetch(user)
          } catch (err) {
            await hulda.send({ content: "I had an issue with fetching the member." })
            await interaction.update({ content: "User is not in guild. Action Suspended.", components: [] })
            console.log(err)
            await db.delete(`${dbID}`)
          }

          let nociscute = await interaction.guild.members.cache.get(user)

          if (nociscute) {

            try {
              await nociscute.send({ embeds: [awts], components: [appeal] }).catch(() => hulda.send("User is unaccessible or is not in Guild! Resolving promise and proceeding with available action."))
              await interaction.reply({ content: "Reason submitted successfully!", ephemeral: true }).catch(() => { console.log() })
              await tubaba.send({ content: `Project rejected by ${interaction.user.username}#${interaction.user.discriminator} for "${mmmyes}"`, embeds: [okayme] })
              await mensahekainis.delete()
              await db.delete(`${namekick}`)
            } catch (err) {
              await mensahekainis.edit({ content: "This person isn't in the guild!", components: [] });
              await hulda.send("Alert! user is not in the guild. Action suspended!")
              console.log(err)
              await db.delete(`${dbID}`)
              await db.delete(`${namekick}`)
              return
            }
          }
        }
      }
    }
  }
}
