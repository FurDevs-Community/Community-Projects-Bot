const transcript = require('../../functions/comprojappeal/appealtranscript.js')
const resolver = require('../../functions/resolvers/resolveuser.js')
const { PermissionsBitField } = require('discord.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'appeal-reject',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("You do not have permission to do that.")
    if(args.length < 2) return message.reply({content: "Holdup! You need the `user` and `reason` parameters."})
    let target = args[0]
    let issuer = message.author.id
    if (!target) return message.reply({ content: "Erm, you forgot to target the user you want to accept their application tho- :eyes:" })
    let repuser = await resolver.execute(message, target)
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID.")
    if (repuser == issuer) return message.reply("ehh, why you using it on yourself?")
    const reason = args.slice(1).join(" ")

    try {
      await message.guild.members.fetch(`${repuser}`)
    } catch (err) {
      await message.channel.send("No user found! You sure it's still in the guild?")
      return
    }
    let confirm = await message.guild.members.fetch(`${repuser}`)
    if(confirm){
      let checkapp = 'app' + message.author.id
      let nya = await db.get(checkapp)
      if(!nya) return message.reply({content: "ono! The application is missing! (missing application)"})
      let mate = JSON.parse(nya.responses)
      await message.channel.permissionOverwrites.edit(`${repuser}`, {
        ViewChannel:true,
        SendMessages:false
      })
      await message.reply({content: "Appeal rejected! closing ticket."})
      if (message.channel.name.includes('appeal-')) {
        message.channel.send("QnA Ticket detected. Closing ticket and transcripting messages!")
        const channel = message.channel
        let nameda = message.channel.name
        var messages = await channel.messages.cache;
        await transcript.execute(message, messages, nameda)
      }
      await confirm.send({content: `I am very sorry! The appeal for your project named "${mate[0]}" has been rejected by assigned staff. If you wish to try again, please refile the application. Thanks!\n\n> **Reason for rejection:** ${reason}`})
      await db.delete(checkapp)
      const logit = message.client.channels.cache.find(c => c.id === 'PROJAPPLOGS')
      await logit.send({content: `Appeal of <@${repuser}> for their project entitled "${mate[0]}" has been rejected by <@${message.author.id}> for reason: **${reason}**`})
    }
  }
}