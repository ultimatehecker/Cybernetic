const colors = require("../../tools/colors.json");
console.log('Command File Successfully Scanned - say');

module.exports = {
    name: "say",
    aliases: [],
    description: "Responds with something that you say that is coming from the client",
    usage: "say {content}",
    example: "say Cybernetic is the best Discord bot ever!",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorSuccess = {
            name: "Restart",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        const content = args.join(" ");
        const user = message.mentions.users.first();

        const joined = `\`${message.author.tag}\` said: ${content}`

        if(!content) {
            const content404 = new Discord.MessageEmbed()
            .setAuthor(authorError)
            .setColor(colors["ErrorColor"])
            .setDescription(`You need to enter something to say`)

            return message.reply({ embeds: [content404] });
        }

        if(message.member.permissions.has("ADMINISTRATOR")) {
            message.channel.send(content).then(() => {
                message.delete();
            })
        }else {
            message.channel.send(joined).then(() => {
                message.delete();
            })
        }
    }
};