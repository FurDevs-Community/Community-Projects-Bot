const lemodal = require('../functions/comprojapps/comprojmodal.js')
const appbuttonmanager = require('../functions/comprojapps/decisioncomproj.js')
const asfdevsbutton = require('../functions/comprojappeal/appealmodal.js')
const finishdis = require('../functions/comprojapps/appcomproj.js')
const hecc = require('../functions/comprojappeal/channelmake.js')
const nani = require('../functions/comprojapps/reasonproj.js')
const { InteractionType } = require('discord.js')

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {

    if (interaction.isButton()) {
      //check if it is for application purposes
      if (interaction.customId == 'startcomproj') {
        await lemodal.execute(interaction)
      }
      //check if it is Rejection Appeal
      let punyeta = new Array('iunderstand', 'appealmake')
      let supportcheck = punyeta.includes(interaction.customId)
      if (supportcheck) {
        await asfdevsbutton.execute(interaction)
      } else {
        //buttons if approve, reject, or question application
        await appbuttonmanager.execute(interaction)
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      //check if it is a new application
      if (interaction.customId == 'comprojapp') {
        await finishdis.execute(interaction)
      }
      //check if it is appeal statement
      if (interaction.customId == 'projappsappeal') {
        await hecc.execute(interaction)
      } else {
        //statereason for rejection
        await nani.execute(interaction)
      }
    }
    if (interaction.type !== InteractionType.ApplicationCommand) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command! If this persists, please contact any available staff.', ephemeral: true });
    }
  }
}