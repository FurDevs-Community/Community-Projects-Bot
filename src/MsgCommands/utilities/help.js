const { EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
  name: 'help',
  aliases: ['cmdlist', 'commands'],

  async execute(message, args) {

    const genhelp = new EmbedBuilder()
      .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
      .setColor('#e0b0ff')
      .setTitle("Fenix Help Tab")
      .setDescription("General Commands List for Fenix (Community Projects, Proj. Leader)")
      .addFields([
        { name: "Add Members `add-member`", value: "Needs the `member` argument. Adds a user as a collaborator for your project." },
        { name: "Remove Members `remove-member`", value: "Needs the `member` and `reason` argument. Removes a collaborator from your project." },
        { name: "Transfer Ownership `owner-transfer`", value: "Needs the `member` and `reason` argument. Passes ownership of the project. ***as a leader, this is irreversible!***" },
        { name: "Status Checker `ping`", value: "Just making sure to see if I continue to respond." },
        { name: "About me `info`", value: "Learn about what am I and who made me! Aliases: `about`" },
      ])
      .setTimestamp()
      .setFooter({ text: "FurDevs - Com. Proj. Commands List", iconURL: message.client.user.avatarURL() })

    //make embeds for staff members
    const modhelp1 = new EmbedBuilder()
      .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
      .setColor('#e0b0ff')
      .setTitle("Fenix Help Tab")
      .setDescription("Commands List for Project Approval/Rejection. ***requires a `user` argument for all commands***")
      .addFields([
        { name: "Approve project `accept`", value: "Accepts the application. (`user`)" },
        { name: "Reject project `decline`", value: "Rejects the application. Users may appeal if they wish to. (`user`, `reason`)" },
        { name: "Approve the appeal `appeal-approve`", value: "Accepts the appeal of users who had their projects initially rejected. (`user`)" },
        { name: "Reject the appeal `appeal-reject`", value: "Rejects the appeal of users who had their projects initially rejected, with finality. (`user`, `reason`)" },
      ])
      .setTimestamp()
      .setFooter({ text: "FurDevs - Com. Proj. Commands List", iconURL: message.client.user.avatarURL() })

    const modhelp2 = new EmbedBuilder()
      .setAuthor({ name: message.client.user.username, iconURL: message.client.user.avatarURL() })
      .setColor('#e0b0ff')
      .setTitle("Fenix Help Tab")
      .setDescription("Commands List for Project Management. **All commands require a `member` argument (`channel` for archiving, restoring, and deleting), as well as the `reason` argument.")
      .addFields([
        { name: "Force member addition `forceadd`", value: "Force Adds members to the target project. (`user`, `reason`)" },
        { name: "Force member removal `forceremove`", value: "Force removes members from the target project. (`user`, `reason`)" },
        { name: "Force ownership transfer `forcetransfer`", value: "Executes a forced transfer of project ownership between an old and new owner. (`user`, `reason`)" },
        { name: "Archive project `archive`", value: "Archives a project. (`channel`, `reason`)" },
        { name: "Restore project `restore`", value: "Restores a project, opposite of `archive`. (`channel`, `reason`)" },
        { name: "Delete Project `delete`", value: "Deletes a project. ***THIS IS IRREVERSIBLE.*** (`channel`, `reason`)" },
      ])
      .setTimestamp()
      .setFooter({ text: "FurDevs - Com. Proj. Commands List", iconURL: message.client.user.avatarURL() })


    let puta = args[0]

    if (!puta) {
      message.reply("Please indicate if this is mainly general help (`f.help general`), or assistance with Moderation (`f.help moderation`).")
      return
    } else
      if (puta == "proj-management") {
        message.reply("Alrighty, I'll send it to you in DMs! (General Assistance)")
        message.author.send({ embeds: [genhelp]
        }).catch(() => message.channel.send({ content: "Erm, I can't access DMs. Check your privacy settings first before trying again!" }))
      } else
          if (puta == "proj-moderation") {
            if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply("Access Denied (You do not have permission.)")
            message.reply("Alrighty, I'll send it to you in DMs! (Staff Commands List)")
            message.author.send({embeds: [modhelp1, modhelp2]}).catch(() => message.channel.send({ content: "Erm, I can't access DMs. Check your privacy settings first before trying again!" }))
          } else
            await message.reply("Please indicate if this is mainly general help with Project Management (`f.help proj-management`), or Staff Commands (`f.help proj-moderation`).")
  }
}