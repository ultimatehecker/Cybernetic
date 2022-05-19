const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
	name: "rng",
	aliases: ["random"],
	description: "Generates a random number from an array number from what you supply",
	options: [
		{ 
			name: "number",
			description: "First number for the random number picker",
			required: true,
			type: "STRING"
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

		let response = [Math.floor(Math.random() * (args[1] - 1 + 1) + 1)]; // rng

		if (!args[1]) {
			const nonumbers = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${prefix}rng 1 10\`)`);

			return message.reply({ embeds: [nonumbers], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    message.delete()
                }, 5000);
            })
		}

		if (isNaN(args[1])) {
			const nan = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!");

			return message.reply({ embeds: [nan], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    message.delete()
                }, 5000);
            })
		}

		const rng = new Discord.MessageEmbed()
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
		
		let response = [Math.floor(Math.random() * (interaction.options.get("number") - 1 + 1) + 1)]; // rng

		if(!interaction.options.get("number")){
			const nonumbers = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`You didn't specify a lowest and highest number! (Example: \`${serverDoc.prefix}rng 1 10\`)`)

			return interaction.editReply({ embeds: [nonumbers], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		if(isNaN(interaction.options.get("number"))){
			const nan = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number!")

			return interaction.editReply({ embeds: [nan], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		}

		const embed = new Discord.MessageEmbed()
			.setAuthor(authorSuccess)
			.setColor(colors["MainColor"])
			.setDescription(`You got \`${response}\`!`)
			
		interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
	},
};
