const ms = require('ms')
const { ActivityType } = require('discord.js')
module.exports = {
  name: "ready",
  execute(client) {
    console.log('I have reconnected to the Spire. Awaiting orders.')

    let activities = [`kigu suffer`, `FurDevs`, `SeirenAI SE: Made by Kigu!`, `lines of code~`, `As a sentry`, `Community Projects!`], i = 6;
    setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: ActivityType.Watching }), 30000)

    client.on('debug', async (e) => console.log(e))
    client.on('error', async (f) => console.log(f))
  }
}