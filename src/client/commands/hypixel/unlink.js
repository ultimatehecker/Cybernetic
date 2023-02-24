const axios = require("axios");
const colors = require(`../../tools/colors.json`);
const User = require('../../database/schemas/user');

module.exports = {
	name: "unlink",
	aliases: ["unverify"],
	description: "Allows you to unlink your Minecraft account from your Discord",
	usage: "unlink",
	example: "unlink",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Successfully Unlinked",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }
		
		const user = await User.findOne({ id: message.author.id });
		if (!user) {
			const notconnected = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is not connected!")
			return message.reply({embeds: [notconnected], allowedMentions: { repliedUser: true } }).then((sent) => {
                setTimeout(function() {
					message.delete();
                    sent.delete();
                }, 5000);
            });
		}

		const username = await axios.get(`https://playerdb.co/api/player/minecraft/${user.uuid}`);

        user.deleteOne(() => {
			const unlinked = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`${username.data.data.player.username} has been successfully unlinked from your account.`)
			message.reply({embeds: [unlinked], allowedMentions: { repliedUser: true } });
		});
	},
	async slashExecute(client, Discord, interaction, serverDoc) {

        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Unlink",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const user = await User.findOne({ id: interaction.user.id });
		if (!user) {
			const notconnected = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is not connected!")
			return interaction.editReply({embeds: [notconnected], allowedMentions: { repliedUser: true } }).then(() => {
				setTimeout(function() {
					interaction.deleteReply()
				}, 5000);
			});
		}

		const username = await axios.get(`https://playerdb.co/api/player/minecraft/${user.uuid}`);

        user.deleteOne(() => {
			const unlinked = new Discord.EmbedBuilder()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`\`${username.data.data.player.username}\` has been successfully unlinked from your account.`)
			interaction.editReply({embeds: [unlinked], allowedMentions: { repliedUser: true } });
		});
    }
};
