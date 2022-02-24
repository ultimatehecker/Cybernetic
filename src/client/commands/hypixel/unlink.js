const axios = require("axios");
const colors = require(`../../tools/colors.json`);
const currentDate = new Date(Date.now());
const User = require('../../schemas/user');

module.exports = {
	name: "unlink",
	aliases: ["unverify"],
	description: "Allows you to unlink your Minecraft account from your Discord",
	usage: "`unlink`",
	example: "`unlink`",
	async execute(client, message, args, Discord) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        let authorSuccess = {
            name: "Unlink",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }
		
		const user = await User.findOne({ id: message.author.id });
		if (!user) {
			const notconnected = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("Your account is not connected!")
			return message.reply({embeds: [notconnected], allowedMentions: { repliedUser: false }});
		}

		const username = await axios.get(`https://playerdb.co/api/player/minecraft/${user.uuid}`).then((res) => res.json());

        user.deleteOne(() => {
			const unlinked = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`${username.data.player.username} has been successfully unlinked from your account.`)
				.setFooter(`Account Unlinking Services requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())
			message.reply({embeds: [unlinked], allowedMentions: { repliedUser: false },});
		});
	}
};
