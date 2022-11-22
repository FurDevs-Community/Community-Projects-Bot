const { EveryonePattern } = require('discord.js')
module.exports = {
  name: 'channelresolve',
  async execute(message, target) {

    let idregex = /^([0-9]{17,19})$/g;
    let stuffmatch = /^(?:<#)?(\d{17,19})>?$/
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
      repuser = idmatch
      return repuser
    }

    if (mentionmatch) {
      var myId = await message.guild.channels.resolveId(mentionmatch)
      repuser = myId
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