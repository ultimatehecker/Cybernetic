const colors = require("../../tools/colors.json");

module.exports = {
    name: "faq",
    aliases: [],
    description: "Gives you common questions asked about Cybernetic",
	options: [],
    defaultPermission: true,
    usage: "faq",
    example: "faq",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Cybernetic FAQ",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const faq = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`When will the full version of Cybernetic be released? \n \n *The full version of Cybernetic doesnt currently have a release date, although, once Cybernetic has enough features, it will be released.* \n \n What will your response be to the new message intent being removed for verified bots? \n \n *When I fully release the bot, it will still have the message based commands, but if it gains enough traction and interest, there will be a reason to verify it and then move it to solely interaction based commands* \n \n What is the future for Cybernetic? \n \n *There is still alot of things I want to do for Cybernetic, I want to add some skyblock commands, hypixel game commands, moderation commands, and anything else I decide, then I by that time would leave the Minecraft commands alone and then work on other commands, like a currency system.* \n \n Why is the ping on Cybernetic so bad, and why sometimes is it negative? \n \n *Cybernetic sometimes has negative ping due to the Date.now() function being weird at times, but usually it is high due to using an Atlas cluster on MongoDB, which runs in Virginia.* \n \n Is there any way that you could be contacted? \n \n *By discord your chances are pretty slim, but if there are any issue with the bot, you can open a GitHub pull request to fix it or a new issue*`)

        return message.reply({ embeds: [faq], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction){

		await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Cybernetic FAQ",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

		const faq = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`When will the full version of Cybernetic be released? \n \n *The full version of Cybernetic doesnt currently have a release date, although, once Cybernetic has enough features, it will be released.* \n \n What will your response be to the new message intent being removed for verified bots? \n \n *When I fully release the bot, it will still have the message based commands, but if it gains enough traction and interest, there will be a reason to verify it and then move it to solely interaction based commands* \n \n What is the future for Cybernetic? \n \n *There is still alot of things I want to do for Cybernetic, I want to add some skyblock commands, hypixel game commands, moderation commands, and anything else I decide, then I by that time would leave the Minecraft commands alone and then work on other commands, like a currency system.* \n \n Why is the ping on Cybernetic so bad, and why sometimes is it negative? \n \n *Cybernetic sometimes has negative ping due to the Date.now() function being weird at times, but usually it is high due to using an Atlas cluster on MongoDB, which runs in Virginia.* \n \n Is there any way that you could be contacted? \n \n *By discord your chances are pretty slim, but if there are any issue with the bot, you can open a GitHub pull request to fix it or a new issue*`)

		interaction.editReply({ embeds: [faq], allowedMentions: { repliedUser: true } });
	}
}