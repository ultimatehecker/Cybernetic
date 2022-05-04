const colors = require("../../../tools/colors.json");

module.exports  = async (Discord, client, interaction) => {

    if(!client.commands.has(interaction.commandName) || !interaction.guild) return;

    let serverDoc;
    await client.utils.loadGuildInfo(client, interaction.guild).then(async (server) => {
        serverDoc = server;
    });

    if (serverDoc === "error") return;

    let executor = client.commands.get(interaction.commandName).slashExecute;

    try {
        await executor(client, Discord, interaction, serverDoc)
    } catch(error) {
        console.error(error);
        const embed = new Discord.MessageMebed()
            .setColor(colors["ErrorColor"])
            .setDescription("There was an error encountered while executing this command!")

        await interaction.editReply({ embeds: [embed], ephemeral: true })
    }
}