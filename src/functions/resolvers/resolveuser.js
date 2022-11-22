const { EveryonePattern } = require('discord.js')
module.exports = {
  name: 'resolveuser',
  async execute(message, target) {

    let idregex = /([0-9]{17,19})/g;
    let stuffmatch = /^(?:<@!?)?(\d{17,19})>?$/
    let linkregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/

    let idmatch = target.match(idregex)
    let mentionmatch = target.match(stuffmatch)
    let eberibadi = message.mentions.has(EveryonePattern)
    let urlmatch = target.match(linkregex)

    let repuser = {}

    if (urlmatch) {
      repuser = 'undefined'
      return repuser
    }

    if (idmatch) {
      try {
        let arole = await message.guild.roles.fetch(`${idmatch}`)
        let achannel = await message.guild.channels.fetch(`${idmatch}`)
        if (arole || achannel) {
          repuser = 'undefined'
          return repuser
        }
      } catch (err) {
        repuser = idmatch
        return repuser
      }
    }

    if (mentionmatch) {
      var myId = await message.guild.members.resolveId(mentionmatch)
      let arole = await message.guild.roles.fetch(myId)
      let achannel = await message.guild.channels.fetch(myId)
      if (arole || achannel) {
        repuser = 'undefined'
        return repuser
      }
      repuser = myId
      return repuser
    }

    if (target.includes('https')) {
      repuser = 'undefined'
      return repuser
    }

    if (eberibadi) {
      repuser = 'undefined'
      return repuser
    }

    else {
      repuser = 'undefined'
      return repuser
    }
  }
}