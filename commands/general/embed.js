const colors = require('../../data/colors.json');

module.exports = {
    name: "embed",
    aliases: ["sayembed"],
    description: "Makes anything you want into an embed",
    usage: "embed (title) (color) (content)",
    example: 'embed "Cybernetic Review" RED Cybernetic is the best bot ever',
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        const title = args.shift();
        const color = args.shift();

        let content = args.join(" ");

        if(!args[0]) {
            const embed = new Discord.MessageEmbed()
			    .setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			    .setColor(colors["ErrorColor"])
			    .setDescription("You need to enter a title for the embed");

		    return message.channel.send({ embeds: [embed] });
        }else if(!args[1]) {
            const embed = new Discord.MessageEmbed()
			    .setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			    .setColor(colors["ErrorColor"])
			    .setDescription("You need to enter a color for the embed");

		    return message.channel.send({ embeds: [embed] });
        }else if(!args[2]) {
            const embed = new Discord.MessageEmbed()
			    .setAuthor("Error", "https://cdn.discordapp.com/avatars/879180094650863727/3040c2fb097ef6a9fb59005cab44626c.webp")
			    .setColor(colors["ErrorColor"])
			    .setDescription("You need to enter something to say in the embed");

		    return message.channel.send({ embeds: [embed] });
        }

        if(args[0] && args[1] && args[2]) {
            if(message.member.permissions.has("ADMINISTRATOR")) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                    .setTitle(title)
                    .setColor(color)
                    .setDescription(content)
    
                return message.channel.send({ embeds: [embed] }).then(() => {
                    message.delete();
                });
            }else {
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Error", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                    .setColor(colors["ErrorColor"])
                    .setDescription("You need administrative permissions to send embeds, learn more about this in our FAQ")
    
                return message.reply({ embeds: [embed] })
            }
        }
    }
};