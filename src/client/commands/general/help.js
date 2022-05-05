const colors = require("../../tools/colors.json");

module.exports = {
    name: "help",
    aliases: ["commands", "commandlist"],
    description: "Shows you a list of commands and information about a specific commands",
    options: [
		{ 
			name: "command",
			description: "Information for a specific command",
			required: false,
			type: "STRING"
		}
	],
    defaultPermission: true,
    usage: "help [command]",
    example: "hel`, help coinflip",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorGeneral = {
            name: "Cybernetic Help & Command List",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorHelp = {
            name: "Command Help",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(!args.length) {
            const general = new Discord.MessageEmbed()
                .setAuthor(authorGeneral)
                .setColor(colors["MainColor"])
                .setDescription(`Do \`${prefix}help [command]\` to see what a command does. Anything put in parenthesis "()" means that argument is required, but anything in brackets "[]" is optional! \n \n *The prefix of the bot is currently: \`${prefix}\`. If you want to change the prefix, that will come in another update, sorry for the inconvience!* \n \n 🛠️ General: \`coinflip\`, \`credits\`, \`discord\`, \`embed\`, \`github\`, \`info\`, \`invite\`, \`latency\`, \`overview\`, \`rng\`, \`say\` \n \n 🌆 Hypixel: \`bedwars\`, \`blizsurvivalgames\`, \`buildbattle\`, \`copsandcrims\`, \`crazywalls\`, \`duels\`, \`guild\`, \`link\`, \`megawalls\`, \`miniwalls\`, \`murdermystery\`, \`player\`, \`skywars\`, \`smashheroes\`, \`soccer\`, \`socials\`, \`speeduhc\`, \`tntgames\`, \`uhc\`, \`unlink\`, \`vampirez\`, \`watchdog\`, \`zombies\`, \n \n 🏗️Minecraft: \`seed\`, \`server\`, \`skin\`, \`uuid\`, \`namehistory\`,`)

            return message.reply({ embeds: [general], allowedMentions: { repliedUser: true } })
        }

        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases.includes(args[0].toLowerCase()));

        if(!command) {
            const command404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["MainColor"])
                .setDescription(`That command list isn't a valid command!`)

            return message.reply({ embeds: [command404], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    message.delete()
                }, 5000);
            });
        }

        const help = new Discord.MessageEmbed()
            .setAuthor(authorHelp)
            .setColor(colors["MainColor"])
            .setTitle(`${command.name} Command Description`)
            .addField("Description:", `\`\`\`${command.description}\`\`\``)

            if (command.aliases)
                help
                    .addField("Aliases:", `\`\`\`${prefix}${command.aliases}\`\`\``)
                    .addField("Usage", `\`\`\`${command.usage}\`\`\``)
                    .addField("Example", `\`\`\`${command.example}\`\`\``)

        message.reply({ embeds: [help], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction, serverDoc){

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorGeneral = {
            name: "Cybernetic Help & Command List",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorHelp = {
            name: "Command Help",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		if (!interaction.options.get("command")) {

			const general = new Discord.MessageEmbed()
				.setAuthor(authorGeneral)
				.setColor(colors["MainColor"])
				.setDescription(`Do \`${serverDoc.prefix}help [command]\` to see what that command does.\n \n 🛠️ General: \`${serverDoc.prefix}help\`, \`${serverDoc.prefix}info\`, \`${serverDoc.prefix}latency\`, \`${serverDoc.prefix}links\`, \`${serverDoc.prefix}coinflip\`, \`${serverDoc.prefix}credits\`, \n \`${serverDoc.prefix}overview\`, \`${serverDoc.prefix}say\`, \`${serverDoc.prefix}sayembed\`, \`${serverDoc.prefix}rng\` \n \n 🚔 Moderation: \`${serverDoc.prefix}clear\`, \`${serverDoc.prefix}ban\`, \`${serverDoc.prefix}kick\`, \`${serverDoc.prefix}promote\`, \`${serverDoc.prefix}demote\`, \`${serverDoc.prefix}prefix\`, \n \`${serverDoc.prefix}leavemessage\`, \`${serverDoc.prefix}welcomemessage\`, \`${serverDoc.prefix}mute\`, \`${serverDoc.prefix}nickname\`, \`${serverDoc.prefix}reactionrole\`, \n \`${serverDoc.prefix}unban\`, \`${serverDoc.prefix}unmute\` \n \n 🎮 Hypixel: \`${serverDoc.prefix}player\`, \`${serverDoc.prefix}guild\`, \`${serverDoc.prefix}bedwars\`, \`${serverDoc.prefix}skywars\`, \`${serverDoc.prefix}duels\`, \`${serverDoc.prefix}uhc\`, \n \`${serverDoc.prefix}socials\`, \`${serverDoc.prefix}link\`, \`${serverDoc.prefix}unlink\`, \`${serverDoc.prefix}blitzsurvivalgames\`, \`${serverDoc.prefix}buildbattle\`, \n \`${serverDoc.prefix}copsandcrims\`, \`${serverDoc.prefix}crazywalls\`, \`${serverDoc.prefix}megawalls\`, \`${serverDoc.prefix}murdermystery\`, \n \`${serverDoc.prefix}smashheros\`, \`${serverDoc.prefix}speeduhc\`, \`${serverDoc.prefix}tntgames\`, \`${serverDoc.prefix}vampirez\` \n \n  ⛏ Minecraft: \`${serverDoc.prefix}namehistory\`, \`${serverDoc.prefix}uuid\`, \`${serverDoc.prefix}skin\`, \`${serverDoc.prefix}mcserver\``)

				interaction.editReply({embeds: [general], allowedMentions: { repliedUser: true }});

		}

		const command =
			client.commands.get(interaction.options.get("command").value.toLowerCase()) ||
			client.commands.find((c) => c.aliases && c.aliases.includes(interaction.options.get("command").value.toLowerCase()));

			if (!command) {
				const command404 = new Discord.MessageEmbed()
					.setAuthor(authorError)
					.setColor(colors["ErrorColor"])
					.setDescription("That isn't a valid command!");
				return interaction.editReply({ embeds: [command404], allowedMentions: { repliedUser: true } }).then(() => {
                    setTimeout(function() {
                        message.delete()
                    }, 5000);
                });
			}

			const help = new Discord.MessageEmbed()

			.setAuthor("Help", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			.setColor(colors["MainColor"])
			.setTitle(`${command.name} Command Description`)
			.addField("Description:", `\`\`\`${command.description}\`\`\``);

		if (command.aliases)
			help
				.addField("Aliases:", `\`\`\`${serverDoc.prefix}${command.aliases}\`\`\``)
				.addField("Usage:", `\`\`${command.usage}\`\``)
				.addField("Example:", `\`\`${command.example}\`\``);

		interaction.editReply({ embeds: [help], allowedMentions: { repliedUser: true } });

	}
};