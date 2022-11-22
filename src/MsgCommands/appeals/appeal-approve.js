const transcript = require('../../functions/comprojappeal/appealtranscript.js')
const resolver = require('../../functions/resolvers/resolveuser.js')
const { PermissionsBitField, ChannelType } = require('discord.js')
const Database = require('@replit/database')
const db = new Database()

module.exports = {
  name: 'appeal-approve',
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("You do not have permission to do that.")
    if(args.length < 2) return message.reply({content: "Holdup! You need the `user` and `reason` parameters."})
    let target = args[0]
    let issuer = message.author.id
    if (!target) return message.reply({ content: "Erm, you forgot to target the user you want to accept their application tho- :eyes:" })
    let repuser = await resolver.execute(message, target)
    if (repuser == 'undefined') return message.reply("Invalid user! It should be a mention or an ID.")
    if (repuser == issuer) return message.reply("ehh, why you using it on yourself?")

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
      await message.reply({content: "Appeal approved! closing ticket."})
      if (message.channel.name.includes('appeal-')) {
        message.channel.send("QnA Ticket detected. Closing ticket and transcripting messages!")
        const channel = message.channel
        let nameda = message.channel.name
        var messages = await channel.messages.cache;
        transcript.execute(message, messages, nameda)
      }
      try{
        await message.guild.channels.create({
          name: `${mate[0]}`,
          type: ChannelType.GuildText
        }).then(async channel => {
          await channel.setParent('PROJMAIN')
          await channel.setTopic(`${mate[1]}`)
          await channel.permissionOverwrites.create(`${repuser}`, {
            ViewChannel: true,
            SendMessages: true,
            ManageWebhooks: true,
            ManageMessages: true
          })
          await channel.send(`Hi there <@${repuser}>` + ", and welcome to your community project channel! To view the commands, please view with `f.help proj-management` for your powers. Please remember to abide by the **Community Projects Rules** in <#825203154181947392> and we hope you enjoy! Why not introduce your project to us here?")
          await confirm.send({content: `Eyy, your appeal for the project named "${mate[0]}" has been Approved! Let's visit your channel, shall we? (<#${channel.id}>)`})
          let newproj = {}
          newproj['projectLeader'] = nya.id
          newproj['members'] = 'none'
          await db.set(`${channel.id}`, newproj)
        })
      } catch(err){
        message.reply({content: "Something went wrong!\n\n```" + err.stack + "```"})}
      const logit = message.client.channels.cache.find(c => c.id === 'PROJAPPLOGS')
        await db.delete(checkapp)
      await logit.send({content: `Appeal of <@${repuser}> for their project entitled "${mate[0]}" has been approved by <@${message.author.id}>`})
    }
  }
}