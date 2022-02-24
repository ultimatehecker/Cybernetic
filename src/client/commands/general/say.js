const colors = require("../../tools/colors.json");

module.exports = {
    name: "say",
    aliases: [],
    description: "Says anything that you tell the bot to",
    usage: "say {content}",
    example: "say Cybernetic is the best Discord bot ever!",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        let authorSuccess = {
            name: "Restart",
            iconURL: "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp"
        }

        const content = args.join(" ");
        const user = message.mentions.users.first();

        if(message.member.permissions.has("ADMINISTRATOR")) {
            message.channel.send(content).then(() => {
                message.delete();
            }).catch((err) => {
                if(err.message === "MESSAGE_CONTENT_TYPE") {
                    const content404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`You need to enter something to say`)

                    return message.reply({ embeds: [content404] })
                }else {
                    const error = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`Uhoh! A problem has been detected and the command has been aborted. If this is your first time encounting this error, please check the command, and check our quick fix error handling. If this keep on appearing, please DM ultimatehecker#1165 with this context: \`\`\`${err}\`\`\``)

                    return message.reply({ embeds: [error] })
                }
            });
        }else {
            message.channel.send(message.author.tag, "said", content).then(() => {
                message.delete();
            }).catch((err) => {
                if(err.message === "MESSAGE_CONTENT_TYPE") {
                    const content404 = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`You need to enter something to say`)

                    return message.reply({ embeds: [content404] })
                }else {
                    const error = new Discord.MessageEmbed()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription(`Uhoh! A problem has been detected and the command has been aborted. If this is your first time encounting this error, please check the command, and check our quick fix error handling. If this keep on appearing, please DM ultimatehecker#1165 with this context: \`\`\`${err}\`\`\``)

                    return message.reply({ embeds: [error] })
                }
            });
        }
    }
};