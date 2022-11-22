const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const ohshit = require('../../functions/resolvers/resolveuser.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'owner-transfer',
  async execute(message, args) {
    if (args.length < 2) return message.reply({ content: "You need to tell me who you're passing ownership to and why the sudden change! (missing args: `user`, `reason`" })
    let check = db.get(`${message.channel.id}`)
    if (check.projectLeader !== message.author.id) return message.reply({ content: "Access denied! You are not this project's leader." })
    let target = args[0]
    let repuser = await ohshit.execute(message, target)
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID.")
    if (repuser == message.author.id) return message.reply("I...don't get what you're trying to achieve here (why are you doing this to yourself?).");
    const reason = args.slice(1).join(" ")
    try {
      await message.guild.members.fetch(`${repuser}`)
    } catch (err) {
      await message.reply("User Invalid! You sure the user is still in the guild?")
      return
    }
    if (check.members == 'none') return message.reply({ content: "Your project does not have any collaborators. Please set one using the `add-member` command." })
    let gra = await JSON.parse(check.members)
    let actualCheck = gra.includes(`${repuser}`)
    if (!actualCheck) return message.reply({ content: "This user is not a registered collaborator of your project." })

    if (actualCheck) {
      let inserver = await message.guild.members.fetch(`${repuser}`)
      if (inserver) {
        let logging = await message.client.channels.cache.find(c => c.id === 'LOGS')
        const usurekigu = new EmbedBuilder()
          .setColor('#be1919')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Ownership transfer - Are you sure?")
          .setDescription(`Do you wish to transfer your ownership of the project to <@${repuser}>? **this decision is irreversible.**`)
          .setTimestamp()
          .setFooter({ text: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })

        const Log = new EmbedBuilder()
          .setColor('#25008D')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Ownership Transfer Log!")
          .setDescription(`A project leader has executed an ownership transfer.`)
          .addFields([
            { name: "Channel involved:", value: `<#${message.channel.id}> (ID: ${message.channel.id})`, inline: true },
            { name: "Old Owner:", value: `<@${message.author.id}> (UID: ${message.author.id})`, inline: true },
            { name: "New Owner:", value: `<@${repuser}> (UID: ${repuser})`, inline: true },
            { name: "Reason:", value: `${reason}` }
          ])
          .setTimestamp()
          .setFooter({ text: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })

        const kiguselect = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('bignono')
              .setStyle(ButtonStyle.Danger)
              .setLabel('CANCEL'),

            new ButtonBuilder()
              .setCustomId('fineproceed')
              .setStyle(ButtonStyle.Success)
              .setLabel('Transfer Ownership'),
          )
        //start asking
        await message.channel.send({ embeds: [usurekigu], components: [kiguselect] })
        let filter = i => i.member.id === message.author.id
        var collector = message.channel.createMessageComponentCollector({ componentType: 'BUTTON', filter: filter, max: 1, idle: 1 * 60000, time: 1 * 60000, errors: ['time'] })
        if (collector) {
          collector.on('collect', async i => {
            if (i) {
              await i.deferUpdate();
              if (i.customId == 'bignono') {
                i.editReply({ content: `Alright, I've cancelled the operation!`, embeds: [], components: [] })
              } else if (i.customId == 'fineproceed') {
                i.editReply({ content: `Transfer complete!`, embeds: [], components: [] })
                await message.channel.permissionOverwrites.edit(`${repuser}`, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageWebhooks: true,
                  ManageMessages: true
                })
                await message.channel.permissionOverwrites.edit(message.author.id, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageWebhooks: true
                })
                let newOwner = gra.indexOf(`${repuser}`)
                gra.splice(newOwner, 1)
                gra.push(`${message.author.id}`)
                let newData = {}
                newData['projectLeader'] = `${repuser}`
                newData['members'] = JSON.stringify(gra)
                await db.set(`${message.channel.id}`, newData)
                await logging.send({ embeds: [Log] })
              }
            }
          });
          collector.on('end', collected => {
            if (collector.endReason != "limit") {
              message.edit({ content: `Looks like the project owner forgot to respond. Action cancelled!`, embeds: [], components: [] })
            }
          })
        }

      }
    }
  }
}