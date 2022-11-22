require('dotenv').config()
const fs = require('fs')
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent] });

var http = require('http');
http.createServer(function(req, res) {
  res.write("I'm Alive");
  res.end();
}).listen(8080); //originally 8080

client.rest.on("rateLimited", ({ timeToReset, global }) => {
  if (timeToReset > 10000 && !global) {
    console.log("Rate limit: restarting");
    process.kill(1);
  }
})

client.login(process.env.BOT_TOKEN);

setTimeout(async () => {
  console.log(client.isReady())
  if (client.isReady() == false) {
    console.log("Fenix touched 429. Switching containers.")
    process.kill(1)
  } else {
    console.log("Fenix has logged in, OK.")
  }
}, 10000);


client.commands2 = new Collection();
const commandFolders = fs.readdirSync('./src/MsgCommands');

for (const folder of commandFolders) {
  const commandFiles2 = fs.readdirSync(`./src/MsgCommands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles2) {
    const command2 = require(`./src/MsgCommands/${folder}/${file}`);
    client.commands2.set(command2.name, command2);
  }
}
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

process.on('uncaughtException', function(err) {
  console.log(`Caught exception: ${err.stack}`);
});