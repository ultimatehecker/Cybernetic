function splitCommandLine(commandLine) {
    let doubleDoubleQuote = "<DDQ>";
    while (commandLine.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += "@"
    let noDoubleDoubleQuotes = commandLine.replace(/""/g, doubleDoubleQuote);
    let spaceMarker = "<SP>";
    while (commandLine.indexOf(spaceMarker) > -1)spaceMarker += "@";
    let noSpacesInQuotes = noDoubleDoubleQuotes.replace(
		/"([^"]*)"?/g,
		(fullMatch, capture) => {
			return capture
				.replace(/ /g, spaceMarker)
				.replace(RegExp(doubleDoubleQuote, "g"), '"');
		}
	);
    let mangledParamArray = noSpacesInQuotes.split(/ +/);
    let paramArray = mangledParamArray.map((angledParam) => {
        return angledParam
            .replace(RegExp(spaceMarker, "g"), " ")
            .replace(RegExp(doubleDoubleQuote, "g"), "");
    });
    return paramArray;
}

module.exports = async (Discord, client, message) => {
    if (message.author.bot || message.channel.type === "DM") return

    let serverDoc;

    await client.utils.loadGuildInfo(client, message.guild).then(async (server) => {
        serverDoc = server;
    }).catch((err) => {
        console.log(err);
    });

    if(serverDoc === "err") return message.channel.send(serverDoc);

    const mention = new RegExp(`^<@!${client.user.id}>$|^<@${client.user.id}>$`);
    if(message.content.match(mention)) {
        const botprefix = new Discord.MessageEmbed()
            .setAuthor("Cybernetic", "https://i.imgur.com/OuoECfX.jpeg")
            .setDescription(`My prefix is: \`.\``);

        return message.reply({ embeds: [botprefix], allowedMentions: { repliedUser: false } });
    }

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `)
    const prefix = message.content.match(prefixMention)
        ? message.content.match(prefixMention)[0]
        : serverDoc.prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const currentDate = new Date(Date.now());

    const args = splitCommandLine(message.content.slice(prefix.length));
    const cmd = args.shift().toLowerCase();

    const command =
        client.commands.get(cmd) ||
        client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

    if(!command) return;

    if(!command.guildOnly && message.channel.type === "DM") {
        const cmdguildonly = new Discord.MessageEmbed()
            .setAuthor("Error", "https://i.imgur.com/OuoECfX.jpeg")
            .setDescription("I can't execute that command inside DMs!")
        return message.reply({ embeds: [cmdguildonly], allowedMentions: { repliedUser: false }});
    }

    try {
        command.execute(client, message, args, Discord, prefix, serverDoc);
        console.log(`Old Message Based Command Recieved - ${command.name} by ${message.author.tag} in ${message.guild.name} at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);
    }catch (err) {
        consolor.error(err);
        const errorEmbed = new Discord.MessageEmbed()
            .setAuthor("Error", "https://i.imgur.com/OuoECfX.jpeg")
            .setDescription(`Uhoh! There was an error trying to execute the command. If this is your first time encounting this error, please check the command, and check our quick fix error handling. If this keep on appearing, please DM ultimatehecker#1165 with this context: \`\`\`${err}\`\`\``)
        message.reply({ embed: [errorEmbed], allowedMentions: { repliedUser: false}});
    }
};
