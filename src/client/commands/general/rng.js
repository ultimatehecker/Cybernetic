const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "rng",
	aliases: ["random"],
	description: "Generates a random number from an array number from what you supply",
	options: [
		{ 
			name: "number1",
			description: "First number for the random number picker",
			required: true,
			type: ApplicationCommandOptionType.String
		},
		{ 
			name: "number2",
			description: "First number for the random number picker",
			required: true,
			type: ApplicationCommandOptionType.String
		}
	],
    defaultPermission: true,
	usage: "`rng [Min] [Max]`",
	example: "`rng 1 10`",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		let response = [Math.round(Math.random() * (Number(args[1]) - Number(args[0])) + Number(args[0]))]; // rng

		if (!args[1]) {
			const nonumbers = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${prefix}rng 1 10\`)`);

			return message.reply({ embeds: [nonumbers], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
					message.delete();
                    sent.delete();
                }, 5000);
            })
		}

		if (Number.isNaN(args[1])) {
			const nan = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!");

			return message.reply({ embeds: [nan], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
					message.delete();
                    sent.delete();
                }, 5000);
            })
		}

		const rng = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
		message.reply({ embeds: [rng], allowedMentions: { repliedUser: true } });
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
		
		let response = [Math.round(Math.random() * (Number(interaction.options.get("number2")?.value) - Number(interaction.options.get("number1")?.value)) + Number(interaction.options.get("number1")?.value))];

		if(!interaction.options.get("number1") || !interaction.options.get("number2")){
			const nonumbers = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${serverDoc.prefix}rng 1 10\`)`)

			return interaction.editReply({ embeds: [nonumbers], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		if(Number.isNaN(interaction.options.get("number1")?.value) || Number.isNaN(interaction.options.get("number2")?.value)){
			const nan = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!")

			return interaction.editReply({ embeds: [nan], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const embed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
			
		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	},
};
