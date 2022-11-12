const colors = require("../../tools/colors.json");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["commands", "commandlist"],
    description: "Shows you a list of commands and information about a specific commands",
    options: [
		{ 
			name: "command",
			description: "Information for a specific command",
			required: false,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
    usage: "help [command]",
    example: "help, help coinflip",
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
            const general = new Discord.EmbedBuilder()
                .setAuthor(authorGeneral)
                .setColor(colors["MainColor"])
                .setDescription(`Do \`${prefix}help [command]\` to see what a command does. Anything put in parenthesis "()" means that argument is required, but anything in brackets "[]" is optional! \n \n *The prefix of the bot is currently: \`${prefix}\`. You can change the prefix by doing ${prefix}prefix (prefix)* \n \n 🛠️ General: \`coinflip\`, \`credits\`, \`discord\`, \`embed\`, \`github\`, \`info\`, \`invite\`, \`latency\`, \`overview\`, \`rng\`, \`say\` \n \n 🌆 Hypixel: \`bedwars\`, \`blizsurvivalgames\`, \`buildbattle\`, \`copsandcrims\`, \`guild\`, \`link\`, \`megawalls\`, \`murdermystery\`, \`player\`, \`skywars\`, \`smashheroes\`, \`socials\`, \`speeduhc\`, \`tntgames\`, \`uhc\`, \`unlink\`, \`vampirez\`, \`watchdog\`, \n \n 🏗️Minecraft: \`seed\`, \`server\`, \`skin\`, \`uuid\`, \n \n :gear: Settings: \`prefix\`, \`welcomemessage\`, \`leavemessage\``)

            return message.reply({ embeds: [general], allowedMentions: { repliedUser: true } })
        }

        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases.includes(args[0].toLowerCase()));

        if(!command) {
            const command404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["MainColor"])
                .setDescription(`That command list isn't a valid command!`)

            return message.reply({ embeds: [command404], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
                    message.delete();
                    sent.delete();
                }, 5000);
            });
        }

        const help = new Discord.EmbedBuilder()
            .setAuthor(authorHelp)
            .setColor(colors["MainColor"])
            .setTitle(`${command.name} Command Description`)
            .addFields([
                { name: `Description`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
            ]);

            if (command.aliases) {
                help.addFields([
                    { name: `Aliases`, value: `\`\`\`${command.aliases}\`\`\``, required: true, inline: false },
                    { name: `Usage`, value: `\`\`\`${command.usage}\`\`\``, required: true, inline: false },
                    { name: `Example`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
                    { name: `Notes`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
                ]);
            }

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

			const general = new Discord.EmbedBuilder()
				.setAuthor(authorGeneral)
				.setColor(colors["MainColor"])
				.setDescription(`Do \`${serverDoc.prefix}help [command]\` to see what a command does. Anything put in parenthesis "()" means that argument is required, but anything in brackets "[]" is optional! \n \n *The prefix of the bot is currently: \`${serverDoc.prefix}\`. You can change the prefix by doing ${serverDoc.prefix}prefix (prefix)* \n \n 🛠️ General: \`coinflip\`, \`credits\`, \`discord\`, \`embed\`, \`github\`, \`info\`, \`invite\`, \`latency\`, \`overview\`, \`rng\`, \`say\` \n \n 🌆 Hypixel: \`bedwars\`, \`blizsurvivalgames\`, \`buildbattle\`, \`copsandcrims\`, \`guild\`, \`link\`, \`megawalls\`, \`murdermystery\`, \`player\`, \`skywars\`, \`smashheroes\`, \`socials\`, \`speeduhc\`, \`tntgames\`, \`uhc\`, \`unlink\`, \`vampirez\`, \`watchdog\`, \n \n 🏗️Minecraft: \`seed\`, \`server\`, \`skin\`, \`uuid\`, \n \n :gear: Settings: \`prefix\`, \`welcomemessage\`, \`leavemessage\``)

			return interaction.editReply({embeds: [general], allowedMentions: { repliedUser: true }});

		}

		const command =
			client.commands.get(interaction.options.get("command")?.value.toLowerCase()) ||
			client.commands.find((c) => c.aliases && c.aliases.includes(interaction.options.get("command")?.value.toLowerCase()));

        if (!command) {
            const command404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription("That isn't a valid command!");
            return interaction.editReply({ embeds: [command404], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
        } 

        const help = new Discord.EmbedBuilder()
            .setAuthor(authorHelp)
            .setColor(colors["MainColor"])
            .setTitle(`${command.name} Command Description`)
            .addFields([
                { name: `Description`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
            ]);

            if (command.aliases) {
                help.addFields([
                    { name: `Aliases`, value: `\`\`\`${command.aliases}\`\`\``, required: true, inline: false },
                    { name: `Usage`, value: `\`\`\`${command.usage}\`\`\``, required: true, inline: false },
                    { name: `Example`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
                    { name: `Notes`, value: `\`\`\`${command.description}\`\`\``, required: true, inline: false },
                ]);
            }

        interaction.editReply({ embeds: [help], allowedMentions: { repliedUser: true } });

	}
};