require('dotenv').config()
module.exports = {
  name: 'say',
  async execute(message, args) {
    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return

    let deets = args.slice(0).join(" ");

    message.delete()
    message.channel.send(deets)
  }
}