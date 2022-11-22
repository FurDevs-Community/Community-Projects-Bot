const { PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
let getchannel = require('../../functions/resolvers/channelresolve.js')
let transcript = require('../../functions/channeltranscript.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'delete',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return message.reply("You do not have permission to do that.")
    if (args.length < 2) return message.reply({ content: "Specify the project to delete and reason, please! (missing args: `channel`, `reason`" })
    let target = args[0]
    let repuser = await getchannel.execute(message, target)
    if (repuser == 'undefined') return message.reply({ content: "Not a valid channel! It should be a mention or an ID." })
    const reason = args.slice(1).join(" ")

    try {
      message.guild.channels.fetch(`${repuser}`)
    } catch (err) {
      message.reply({ content: "That channel doesn't even exist! Are you sure it's still in the guild?" })
    }
    let check = await db.get(`${repuser}`)
    if (!check) return message.reply({ content: "That channel is not registered as a community project!" })
    if (check) {
      let inserver = await message.guild.channels.fetch(`${repuser}`)
      if (inserver) {
        let logging = await message.client.channels.cache.find(c => c.id === 'LOGS')
        const usurekigu = new EmbedBuilder()
          .setColor('#4585ed')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
          .setTitle("Project Deletion - Are you sure?")
          .setDescription(`Do you really need to delete this project? ***THIS ACTION IS IRREVERSIBLE.**`)
          .setTimestamp()
          .setFooter({ text: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })

        const Log = new EmbedBuilder()
          .setColor('#FFDB59')
          .setAuthor({ name: 'FurDevs Community Projects', iconURL: message.client.user.avatarURL() })
          .setTitle("Action Log!")
          .setDescription(`A **Staff Member** has taken action on a project. Please view the details below.`)
          .addFields([
            { name: "Channel involved:", value: `<#${inserver.name}> (ID: ${repuser})`, inline: true },
            { name: "Project Leader", value: `<@${check.projectLeader}> (UID: ${check.projectLeader})`, inline: true },
            { name: "Action Type:", value: "**Project Deletion**" },
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
              .setLabel('Delete Project'),
          )
        await message.channel.send({ embeds: [usurekigu], components: [kiguselect] })
        let filter = i => i.member.id === message.author.id
        var collector = message.channel.createMessageComponentCollector({ componentType: 'BUTTON', filter: filter, max: 1, idle: 1 * 60000, time: 1 * 60000, errors: ['time'] })
        if (collector) {
          collector.on('collect', async i => {
            if (i) {
              await i.deferUpdate();
              if (i.customId == 'bignono') {
                i.reply({ content: `Alright, I've cancelled the operation!`, embeds: [], components: [] })
              } else if (i.customId == 'fineproceed') {
                console.log('OK')
                i.reply({ content: `Project will be deleted shortly. Goodbye!`, embeds: [], components: [] })
                await logging.send({ embeds: [Log] })
                let owner = await message.guild.members.fetch(`${check.projectLeader}`)
                owner.send({ content: "Hey there! I regret to inform you that your project named" + `${inserver.name} has been deleted. If you think this is a mistake, please let us know.\n\n> **Reason for Deletion: ${reason}**` })
                const channel = message.channel
                let nameda = message.channel.name
                var messages = await channel.messages.cache;
                transcript.execute(message, messages, nameda)
                await db.delete(`${repuser}`)
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