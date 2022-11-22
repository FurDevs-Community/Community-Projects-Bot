const { EmbedBuilder } = require('discord.js')
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  name: 'makechannel',
  async execute(interaction) {
    let mahika = await interaction.client.guilds.resolve('GUILD_ID')
    let query = await interaction.fields.getTextInputValue('appealchannel')
    let checkapp = 'app' + interaction.user.id

    let nocnoc = await db.get(checkapp)
    console.log(nocnoc)
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
      .setFooter({ text: `appeal sent on: ${new Date()}` })

    let whoopsie = new EmbedBuilder()
      .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.avatarURL() })
      .setColor('#e0b0ff')
      .setTitle("Appeal Details")
      .setThumbnail(interaction.user.displayAvatarURL())
      .setDescription(`User ${interaction.user.username}#${interaction.user.discriminator} (UID: ${interaction.user.id}) has requested a motion for Reconsideration of their community projects application.`)
      .addFields([{ name: "Statement for Appeal:", value: `${query}` }])
      .setTimestamp()
      .setFooter({ text: "FDevs - Motion for Reconsideration", iconURL: interaction.client.user.avatarURL() })



    await mahika.channels.create({ name: `appeal-${interaction.user.id}` }).then(async channel => {
      await channel.setParent('STAFFCOMPROJCATEGORY')
      await channel.permissionOverwrites.create(interaction.user.id, { ViewChannel: true, SendMessages: true })
      channel.send({ content: "We have a motion for reconsideration! Please react to this embed accordingly to cast your vote. Thank you.", embeds: [okayme, whoopsie] }).then(async message => {
        await message.react('✅');
        await message.react('✳')
        await message.react('❎')
      })
      channel.send(`<@${interaction.user.id}> Welcome to your appeal ticket! Please wait for the question that staff will be imposing shortly as we fetch your application from the logs. Thank you!`)
      interaction.update({ content: `Appeal submitted! Please check your respective channel. ( <#${channel.id}> )`, embeds:[], components: [] })
    })
  }
}