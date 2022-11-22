const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const ohshit = require('../../functions/resolvers/resolveuser.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'forceadd',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.reply("You do not have permission to do that.")
    if (args.length < 2) return message.reply({ content: "Please declare the `user` to be added and `reason`" })
    let check = db.get(`${message.channel.id}`)
    let target = args[0]
    let repuser = await ohshit.execute(message, target)
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID.")
    if (repuser == message.author.id) return message.reply("You may *not* do that to yourself, OP.");
    const reason = args.slice(1).join(" ")
    try {
      await message.guild.members.fetch(`${repuser}`)
    } catch (err) {
      await message.reply("User Invalid! You sure the user is still in the guild?")
      return
    }
    // If the person has not added any collaborators at all
    if (check.members == 'none') {
      let inserver = await message.guild.members.fetch(`${repuser}`)
      if (inserver) {
        let logging = await message.client.channels.cache.find(c => c.id === 'LOGS')
        const usurekigu = new EmbedBuilder()
          .setColor('#4585ed')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Membership add - Are you sure?")
          .setDescription(`Do you wish to add <@${repuser}> as a collaborator of this project?`)
          .setTimestamp()
          .setFooter({ text: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })

        const Log = new EmbedBuilder()
          .setColor('#FFDB59')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Action Log!")
          .setDescription(`A **Staff Member** has taken action on a project. Please view the details below.`)
          .addFields([
            { name: "Channel involved:", value: `<#${message.channel.id}> (ID: ${message.channel.id})`, inline: true },
            { name: "Project Leader", value: `<@${check.projectLeader}> (UID: ${check.projectLeader})` },
            { name: "Action Type:", value: "**Add Member (Forced)**" },
            { name: "Member added:", value: `<@${repuser}> (UID: ${repuser})` },
            { name: "Reason", value: `${reason}` },
            { name: "Executor:", value: `<@${message.author.id}> (UID: ${message.author.id})` },
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
              .setLabel('Add Member'),
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
                return
              } else if (i.customId == 'fineproceed') {
                i.editReply({ content: `Member force-added!`, embeds: [], components: [] })
                await message.channel.permissionOverwrites.edit(`${repuser}`, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageWebhooks: true
                })
                await logging.send({ embeds: [Log] })
                let newset = []
                newset.push(`${repuser}`)
                let newData = {}
                newData['projectLeader'] = `${check.projectLeader}`
                newData['members'] = JSON.stringify(newset)
                await db.set(`${message.channel.id}`, newData)
                return
              }
            }
          });
          collector.on('end', collected => {
            if (collector.endReason != "limit") {
              message.edit({ content: `Looks like the project owner forgot to respond. Action cancelled!`, embeds: [], components: [] })
              return
            }
          })
        }

      }
    }
    //If the person has added collaborators before
    let gra = await JSON.parse(check.members)
    let actualCheck = gra.includes(`${repuser}`)
    if (actualCheck) return message.reply({ content: "This user is a registered member of the project!" })

    if (!actualCheck) {
      let inserver = await message.guild.members.fetch(`${repuser}`)
      if (inserver) {
        let logging = await message.client.channels.cache.find(c => c.id === 'LOGS')
        const usurekigu = new EmbedBuilder()
          .setColor('#4585ed')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Membership add - Are you sure?")
          .setDescription(`Do you wish to add <@${repuser}> as a collaborator of this project?`)
          .setTimestamp()
          .setFooter({ text: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })

        const Log = new EmbedBuilder()
          .setColor('#FFDB59')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Action Log!")
          .setDescription(`A **Staff Member** has taken action on a project. Please view the details below.`)
          .addFields([
            { name: "Channel involved:", value: `<#${message.channel.id}> (ID: ${message.channel.id})`, inline: true },
            { name: "Project Leader", value: `<@${check.projectLeader}> (UID: ${check.projectLeader})`, inline: true },
            { name: "Action Type:", value: "**Add Member (Forced)**" },
            { name: "Member added:", value: `<@${repuser}> (UID: ${repuser})` },
            { name: "Reason", value: `${reason}` },
            { name: "Executor:", value: `<@${message.author.id}> (UID: ${message.author.id})` },
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
              .setLabel('Add Member'),
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
                i.editReply({ content: `Member added!`, embeds: [], components: [] })
                await message.channel.permissionOverwrites.edit(`${repuser}`, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageWebhooks: true,
                })
                gra.push(`${repuser}`)
                await logging.send({ embeds: [Log] })
                let newData = {}
                newData['projectLeader'] = `${check.projectLeader}`
                newData['members'] = JSON.stringify(gra)
                await db.set(`${message.channel.id}`, newData)
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