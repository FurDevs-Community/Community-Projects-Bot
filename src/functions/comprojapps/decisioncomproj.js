const { EmbedBuilder, ActionRowBuilder, TextInputBuilder, ModalBuilder, ChannelType, PermissionsBitField, TextInputStyle } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  name: 'decisioncomproj',
  async execute(interaction) {
    console.log("Got it!")

    let mahdude = await interaction.customId.split('-')[0]
    console.log(mahdude)
    let dbID = await interaction.customId.split('-')[1]
    console.log(dbID)

    try {
      db.get(dbID)
    } catch (err) {
      interaction.reply({ content: "I have an error with the database!\n\n" + `error: ${err}` })
    }

    let gagu = await db.get(`${dbID}`)

    if (gagu) {
      let hulda = interaction.channel
      let records = await JSON.parse(gagu.responses)

      try {
        await interaction.guild.members.fetch(`${gagu.id}`)
      } catch (err) {
        await hulda.send({ content: "I had an issue with fetching the member." })
        await interaction.update({ content: "User is not in guild. Action Suspended.", components: [] })
        console.log(err)
        await db.delete(`${dbID}`)
        return
      }

      let humaygahd = await interaction.guild.members.cache.get(gagu.id)
      if (humaygahd) {
        console.log(humaygahd)
      }

      const tubaba = interaction.client.channels.cache.find(c => c.id == 'PROJLOGS')

      let okayme = new EmbedBuilder()
        .setAuthor({ name: gagu.name, iconURL: gagu.revimgsearch })
            .setTitle('Application Log')
            .setColor('#e0b0ff')
            .setThumbnail(`${gagu.revimgsearch}`)
            .addFields([
              { name: "Applicant Name", value: "Answer: " + gagu.name },
              { name: "Applicant ID", value: "Answer: " + gagu.id },
              { name: "Channel Name", value: "Answer: " + records[0] },
              { name: "Channel Topic", value: "Answer: " + records[1] },
              { name: "Project Description", value: "Answer: " + records[2] },
              { name: "Project Goal/s", value: "Answer: " + records[3] },
              { name: "Do you agree to the Community Project Rules?", value: "Answer: " + records[4] },
              { name: "Date Submitted", value: gagu.date },
            ])
            .setFooter({ text: `date handled: ${new Date()}` })

      let hithere = await interaction.channel.messages.fetch(`${gagu.ogmessage}`)

      if (mahdude == 'comproja') {
        await hithere.delete()
        await humaygahd.send({ content: "Great news! Your project has been approved. Check it out in FurDevs!" }).catch(() => hulda.send("User is unaccessible or is not in Guild! Resolving promise and proceeding with available action."))
        try {
          interaction.guild.channels.create({
            name:`${records[0]}`, 
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
              },
            ],
            type: ChannelType.GuildText
          }).then(async channel => {
            await channel.setParent('COMPROJECTS')
            await channel.permissionOverwrites.create(gagu.id, {
              ViewChannel: true,
              SendMessages: true,
              ManageWebhooks: true,
              ManageMessages: true
            })
            channel.send({ content: `Good day <@${gagu.id}>` + ", and welcome to your community project channel! To view the commands, please view with `f.help proj-management` for your powers. Please remember to abide by the **Community Projects Rules** in <#825203154181947392> and we hope you enjoy! Why not introduce your project to us here?" })
            channel.setTopic(`${records[1]}`)
            let newproj = {}
          newproj['projectLeader'] = gagu.id
          newproj['members'] = 'none'
          await db.set(`${channel.id}`, newproj)
          })
        } catch (err) {
          console.log(err)
          await hithere.edit({ content: "This person isn't in the guild!", components: [] })
          await hulda.send("Error! This person is not in the guild. Action suspended!")
          await db.delete(`${dbID}`)
          console.log(err)
        }
        await tubaba.send({ content: `Project approved by ${interaction.user.username}#${interaction.user.discriminator}`, embeds: [okayme] })
        await db.delete(`${dbID}`)
      }

      if (mahdude == 'comprojd') {
        console.log('active.')
        const aaaaaaaa = new ActionRowBuilder()
          .addComponents(
            new TextInputBuilder()
              .setCustomId('reasonx')
              .setLabel('Please insert reason for Rejection.')
              .setStyle(TextInputStyle.Paragraph)
              .setMinLength(1)
              .setMaxLength(2000)
              .setPlaceholder('I do not think "N/A" is a good reason, bud.')
              .setRequired(true),
          )

        const questionnaire = new ModalBuilder()
          .setTitle('Rejection Reason')
          .setCustomId('rejectcomproj')
          .addComponents([aaaaaaaa])

        await interaction.showModal(questionnaire)
        let hmm = 'comprojreject-' + interaction.user.id
        let kakagura = {}
        kakagura['usertoreject'] = `${dbID}`
        await db.set(hmm, kakagura)
      }

      if (mahdude == 'comprojq') {
        await hithere.delete()
        await humaygahd.send({ content: "You have been summoned to defend your project. Please check back in the server!" }).catch(() => hulda.send("User is unaccessible or is not in Guild! Resolving promise and proceeding with available action."))
        try {
          interaction.guild.channels.create({
            name: `qna-${gagu.id}`,
            permissionOverwrites: [
              {
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.ViewChannel]
              },
            ],
            type: 'text'
          }).then(async channel => {
            await channel.setParent('PROJMODCATEGORY')
            await channel.permissionOverwrites.create(gagu.id, {
              ViewChannel: true,
              SendMessages: true,
            })
            channel.send({ content: `Good day <@${gagu.id}> ! Please answer the questions that will be posed by staff shortly.` })
            await tubaba.send({ content: `Project being questioned by ${interaction.user.username}#${interaction.user.discriminator}`, embeds: [okayme] })
          })
        } catch (err) {
          console.log(err)
          await hithere.edit({ content: "This person isn't in the guild!", components: [] })
          await hulda.send("Error! This person is not in the guild. Action suspended!")
          await db.delete(`${dbID}`)
          console.log(err)
        }
      }
    }
  }
}