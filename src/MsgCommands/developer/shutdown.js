const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, ComponentType } = require('discord.js')
require('dotenv').config()

module.exports = {
  name: "shutdown",
  async execute(message) {
    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return message.channel.send({ content: "https://tenor.com/view/rohan-jjba-daga-kotowaru-i-refuse-refuse-gif-7385649\n\nI refuse! You're not my developer!" })

    const usurekigu = new EmbedBuilder()
      .setColor('#be1919')
      .setAuthor({ name: 'SeirenDevPrompt.exe - Shutdown', iconURL: message.client.user.avatarURL() })
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
      .setTitle("Shutdown Process - Are you sure?")
      .setDescription('To Kigu: Do you want to shut down the bot? This action is irreversible!')
      .addFields([
        { name: 'Note:', value: 'If you shut this bot down, you will have to manually reboot it through the repl.' }
      ])
      .setTimestamp()
      .setFooter({ text: 'WARNING - SHUTDOWN PROMPT', iconURL: message.client.user.avatarURL() })

    const kiguselect = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('bignono')
          .setStyle(ButtonStyle.Danger)
          .setLabel('CANCEL'),

        new ButtonBuilder()
          .setCustomId('fineproceed')
          .setStyle(ButtonStyle.Success)
          .setLabel('PROCEED WITH SHUTDOWN'),
      )

    message.channel.send({ content: "Ehm, sir Kigu, you sure about this??", embeds: [usurekigu], components: [kiguselect] })
    let filter = i => i.member.id === 'BOT_OWNER'
    var collector = message.channel.createMessageComponentCollector({ componentType: ComponentType.Button, filter: filter, max: 1, idle: 1 * 60000, time: 1 * 60000, errors: ['time'] })
    if (collector) {
      collector.on('collect', async i => {
        if (i) {
          await i.deferUpdate();
          if (i.customId == 'bignono') {
            i.editReply({ content: `Alright, shutdown process terminated, master Kigu.`, embeds: [], components: [] })
          } else if (i.customId == 'fineproceed') {
            i.editReply({ content: `Noted! Ending session and shutting down shortly.`, embeds: [], components: [] })
            let meepo = message.client.channels.cache.find(c => c.name == 'ERRLOGS')
            meepo.send({ content: "Kigu has initialized the shutdown process! Please wait until I get manually turned on again. Thanks and see you around!" })
            setTimeout(function() {
              message.client.destroy()
              console.log('Disconnected from the spire, nini~')
            }, 3000);
          }
        }
      });
      collector.on('end', collected => {
        if (collector.endReason != "limit") {
          message.channel.send({ content: `Looks like Kigu forgot to respond. Shutdown procedures terminated!`, embeds: [], components: [] })
        }
      })
    }
  }
}