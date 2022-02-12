const colors = require("../../tools/colors.json");
const currentDate = new Date(Date.now());

module.exports = {
    name: "help",
    aliases: ["commands", "commandlist"],
    description: "Shows you a list of commands for information about a specific commands",
    usage: "help [command]",
    example: "`help`, `help coinflip`",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        if(!args.length) {
            const general = new Discord.MessageEmbed()
                .setAuthor("Cybernetic Help & Command List", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["MainColor"])
                .setDescription(`Do \`${prefix}help [command]\` to see what a command does. Anything put in parenthesis "()" means that argument is required, but anything in brackets "[]" is optional! \n \n 🛠️ General: \`coinflip\`, \`credits\`, \`discord\`, \`embed\`, \`github\`, \`info\`, \`invite\`, \`latency\`, \`overview\`, \`rng\`, \`say\``)
                .setFooter(`Cybernetic Help and Command List requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            return message.reply({ embeds: [general], allowedMentions: {repliedUser: false } })
        }

        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases.includes(args[0].toLowerCase()));

        if(!command) {
            const command404 = new Discord.MessageEmbed()
                .setAuthor("Error - 404", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
                .setColor(colors["MainColor"])
                .setDescription(`That command list isn't a valid command!`)

            return message.reply({ embeds: [command404], allowedMentions: { repliedUser: false } });
        }

        const help = new Discord.MessageEmbed()
            .setAuthor("Command Help", "https://cdn.discordapp.com/avatars/923947315063062529/0a3bc17096585739484e4c6dfb7c184b.webp")
            .setColor(colors["MainColor"])
            .setTitle(`${command.name} Command Description`)
            .addField("Description:", `\`\`\`${command.description}\`\`\``)
            .setFooter(`Command Information requested by ${message.author.tag} • ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`, message.author.displayAvatarURL())

            if (command.aliases)
                help
                    .addField("Aliases:", `\`\`\`${prefix}${command.aliases}\`\`\``)
                    .addField("Usage", `\`\`\`${command.usage}\`\`\``)
                    .addField("Example", `\`\`\`${command.example}\`\`\``)

        message.reply({ embeds: [help], allowedMentions: { repliedUser: false } });
    }
}