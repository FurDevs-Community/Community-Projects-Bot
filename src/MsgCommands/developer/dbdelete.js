require('dotenv').config
const Database = require("@replit/database")
const db = new Database()

module.exports = {
  name: 'dbdelete',
  async execute(message, args) {
    let botDev = process.env.BOT_OWNER
    if (message.author.id !== botDev) return

    if (args.length == 0) return message.reply({ content: "You did not specify the entry to be deleted." })

    let check = await db.get(args[0])
    if(!check) return message.reply("Not a valid DB entry.")
    
      await db.delete(args[0])
      await message.reply({ content: "Deleted entry." })
  }
}