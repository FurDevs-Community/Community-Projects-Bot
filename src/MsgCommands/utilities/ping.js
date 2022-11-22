const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: "ping",
  aliases: ['latency'],
  async execute(message) {
    const loreresp = ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "nakakapagpabagabag!", "I feel sleepy...", "ヤイヤイと人人人の目がキミを追う, ヤイヤイと人人人の目がキミを見る (Big Brother, Crusher Remix [KakuP-Model]", "Running Seiren.sys...complete. Entering OA Space...", 'No, I will NOT say the full name of the chemical "Titin"!', "I won't crash. this is definitely me when am not lying, right?", "\*is watching Kigu suffer while doing maintenance on me*"]
    const reply = loreresp[Math.floor(Math.random() * loreresp.length)]
    const embedping = new EmbedBuilder()
      .setAuthor({ name: 'Pong!', iconURL: message.client.user.avatarURL() })
      .setColor('#e0b0ff')
      .setTitle(`:bell: Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(message.client.ws.ping)}ms :bell:`)
      .setDescription(reply)
      .setThumbnail(message.client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({ text: "Seiren Latency Tool - FurDevs", iconURL: message.client.user.avatarURL() })

    message.channel.send({ content: "I'm stll awake! >w<\n\n> Pro tip: kept forgetting the commands? Use Slash Commands!", embeds: [embedping] });
  }

}