const colors = require("../../tools/colors.json");
const distube = require ("../../schemas/distube");
const { IntegrationApplication } = require("discord.js");

module.exports = {
	name: "play",
	aliases: [],
	description: "Allows you to play a song in a voice channel",
	options: [
		{
			name: "play",
			description: "Allows you to play a song",
			type: "STRING",
			required: true,
		}
	],
    defaultPermission: true,
	usage: "play (song)",
	example: "play Dancefloor",
	async execute(client, message, args, Discord, prefix) {

		await message.channel.sendTyping();

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const VoiceChannel = message.member.voice.channel;

		if(!VoiceChannel) {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription('You must be in a voice channel to be able to use my music commands!')

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`I am already play music in <#${guild.me.voice.channelId}>`)

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		client.distube.play(message.member.voice.channel, string, {
			member: message.member,
			textChannel: message.channel,
			message
		}).then(() => {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Success! Now playing: ${song.name}`)

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } });
		})
    },
	async slashExecute(client, Discord, interaction) {

		await interaction.deferReply({ ephemeral: false });

		let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }
    
        let authorSuccess = {
            name: "Success",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

		const VoiceChannel = interaction.user.voice.channel;

		if(!VoiceChannel) {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription('You must be in a voice channel to be able to use my music commands!')

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId) {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription(`I am already play music in <#${guild.me.voice.channelId}>`)

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } }).then((sent) => {
				setTimeout(() => {
					sent.delete();
				}, 5000);
			});
		}

		client.distube.play(interaction.user.voice.channel, string, {
			member: interaction.user,
			textChannel: interaction.channel,
			interaction
		}).then(() => {
			const voice404 = new Discord.MessageEmbed()
				.setAuthor(authorSuccess)
				.setColor(colors["MainColor"])
				.setDescription(`Success! Now playing: ${song.name}`)

			return message.reply({ embeds: [voice404], allowedMentions: { repliedUser: true } });
		})

	}
}