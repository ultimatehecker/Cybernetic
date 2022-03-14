console.log('Command File Successfully Scanned - help');

const colors = require("../../tools/colors.json");

module.exports = {
    name: "help",
    aliases: ["commands", "commandlist"],
    description: "Shows you a list of commands and information about a specific commands",
    usage: "help [command]",
    example: "hel`, help coinflip",
    async execute(client, message, args, Discord, prefix) {

        await message.channel.sendTyping();

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorGeneral = {
            name: "Cybernetic Help & Command List",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        let authorHelp = {
            name: "Command Help",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(!args.length) {
            const general = new Discord.MessageEmbed()
                .setAuthor(authorGeneral)
                .setColor(colors["MainColor"])
                .setDescription(`Do \`${prefix}help [command]\` to see what a command does. Anything put in parenthesis "()" means that argument is required, but anything in brackets "[]" is optional! \n \n *The prefix of the bot is currently: \`${prefix}\`. If you want to change the prefix, that will come in another update, sorry for the inconvience!* \n \n 🛠️ General: \`coinflip\`, \`credits\`, \`discord\`, \`embed\`, \`github\`, \`info\`, \`invite\`, \`latency\`, \`overview\`, \`rng\`, \`say\` \n \n 🌆 Hypixel: \`bedwars\`, \`blizsurvivalgames\`, \`buildbattle\`, \`copsandcrims\`, \`crazywalls\`, \`duels\`, \`guild\`, \`link\`, \`megawalls\`, \`miniwalls\`, \`murdermystery\`, \`player\`, \`skywars\`, \`smashheroes\`, \`soccer\`, \`socials\`, \`speeduhc\`, \`tntgames\`, \`uhc\`, \`unlink\`, \`vampirez\`, \`watchdog\`, \`zombies\`, \n \n 🏗️Minecraft: \`seed\`, \`server\`, \`skin\`, \`uuid\`, \`namehistory\`,`)

            return message.reply({ embeds: [general] })
        }

        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find((c) => c.aliases.includes(args[0].toLowerCase()));

        if(!command) {
            const command404 = new Discord.MessageEmbed()
                .setAuthor(authorError)
                .setColor(colors["MainColor"])
                .setDescription(`That command list isn't a valid command!`)

            return message.reply({ embeds: [command404] });
        }

        const help = new Discord.MessageEmbed()
            .setAuthor(authorHelp)
            .setColor(colors["MainColor"])
            .setTitle(`${command.name} Command Description`)
            .addField("Description:", `\`\`\`${command.description}\`\`\``)

            if (command.aliases)
                help
                    .addField("Aliases:", `\`\`\`${prefix}${command.aliases}\`\`\``)
                    .addField("Usage", `\`\`\`${command.usage}\`\`\``)
                    .addField("Example", `\`\`\`${command.example}\`\`\``)

        message.reply({ embeds: [help] });
    }
};