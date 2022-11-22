const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const ohshit = require('../../functions/resolvers/resolveuser.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'add-member',
  async execute(message, args) {
    if (args.length < 1) return message.reply({ content: "You need to tell me who you're adding to your team! (missing arguments: `user`)" })
    let check = db.get(`${message.channel.id}`)
    if (check.projectLeader !== message.author.id) return message.reply({ content: "Access denied! You are not this project's leader." })
    let target = args[0]
    let repuser = await ohshit.execute(message, target)
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID.")
    if (repuser == message.author.id) return message.reply("I...don't get what you're trying to achieve here (why are you doing this to yourself?).");
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
          .setColor('#4585ed')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Project membership update!")
          .setDescription(`A project leader has added a member to their project.`)
          .addFields([
            { name: "Channel involved:", value: `<#${message.channel.id}> (ID: ${message.channel.id})`, inline: true },
            { name: "Project Owner:", value: `<@${message.author.id}> (UID: ${message.author.id})`, inline: true },
            { name: "Member added:", value: `<@${repuser}> (UID: ${repuser})`, inline: true }
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
                i.editReply({ content: `Member added!`, embeds: [], components: [] })
                await message.channel.permissionOverwrites.edit(`${repuser}`, {
                  ViewChannel: true,
                  SendMessages: true,
                  ManageWebhooks: true
                })
                let newset = []
                newset.push(`${repuser}`)
                let newData = {}
                newData['projectLeader'] = `${message.author.id}`
                newData['members'] = JSON.stringify(newset)
                await db.set(`${message.channel.id}`, newData)
                await logging.send({ embeds: [Log] })
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
    if (actualCheck) return message.reply({ content: "This user is a registered member of your project!" })

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
          .setColor('#4585ed')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Project membership update!")
          .setDescription(`A project leader has added a member to their project.`)
          .addFields([
            { name: "Channel involved:", value: `<#${message.channel.id}> (ID: ${message.channel.id})`, inline: true },
            { name: "Project Owner:", value: `<@${message.author.id}> (UID: ${message.author.id})`, inline: true },
            { name: "Member added:", value: `<@${repuser}> (UID: ${repuser})`, inline: true }
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
                let newData = {}
                newData['projectLeader'] = `${message.author.id}`
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