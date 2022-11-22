const moment = require('moment')
const ms = require('ms')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: "transcript",
  async execute(message, messages, nameda) {
    let data = "";
    const embed = new EmbedBuilder()
      .setTitle("Transcript Alert!")
      .setDescription(`Transcripted ${messages.size} messages from ${nameda}`)
      .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
      .setColor("#be1919")
      .addFields([{ name: "Ticket closed by:", value: `${message.author}` }])
      .setTimestamp()
      .setFooter({ text: `Channel ID: ${message.channel.id}` });
    const Blep = message.client.channels.cache.find(c => c.id === "LOGS")

    messages.toJSON().map(async (message) => {
      data += `+++Message by ${message.author.username}#${message.author.discriminator} (${message.author.id}), ID ${message.id}, channel ${message.channel.name}+++\n`;
      data += `-Time: ${moment(message.createdAt).format()}\n`;
      message.attachments.toJSON().map((attachment) => {
        data += `-Attachment: ${attachment.url}\n`;
      });
      message.embeds.forEach((embed) => {
        data += `-Embed: ${JSON.stringify(embed)}\n`;
      });
      // Write the clean version of the message content
      data += `${message.cleanContent}\n\n\n`;
    })
    // Create a buffer with the data
    let buffer = Buffer.from(data, "utf-8");
    Blep.send({ content: "Transcript from deleted project!", embeds: [embed], files: [{ attachment: buffer, name: `transcript_${moment().valueOf()}.txt` }] })
    let time = '10s'
    setTimeout(async () => {
      message.channel.delete()
    }, ms(time));
  }
}