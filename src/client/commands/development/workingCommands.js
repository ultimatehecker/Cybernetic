const EmojiConstructor  = require("../../tools/emojis.json");
const colors = require("../../tools/colors.json");

module.exports = {
    name: "working-commands",
    aliases: ["wcommands"],
    description: "Shows the current command status",
    options: [],
    defaultPermission: true,
    usage: "workingCommands",
    example: "workingCommands",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let author = {
            name: "Working Commands",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(message.author.id == "724798908278112309" || "722092754510807133") {
            const commands = new Discord.EmbedBuilder()
                .setAuthor(author)
                .setColor(colors["MainColor"])
                .setDescription(`*This the is current status of the commands, and how they want to be worked on! An X stands for not working. The caution symbol stands for the command needs reworking or UI change, and a check mark means is works fine!* \n \n 
                \`conflip\` - ${EmojiConstructor["alt"].yep} \n 
                \`credits\` - ${EmojiConstructor["alt"].yep} \n 
                \`discord\` - ${EmojiConstructor["alt"].yep} \n 
                \`embed\` - ${EmojiConstructor["nope"].yep} \n 
                \`faq\` - ${EmojiConstructor["alt"].yep} \n 
                \`github\` - ${EmojiConstructor["alt"].yep} \n 
                \`help\` - ${EmojiConstructor["alt"].yep} \n 
                \`info\` - ${EmojiConstructor["alt"].yep} \n 
                \`invite\` - ${EmojiConstructor["alt"].yep} \n 
                \`latency\` - ${EmojiConstructor["alt"].yep} \n 
                \`overview\` - ${EmojiConstructor["alt"].yep} \n 
                \`rng\` - ${EmojiConstructor["alt"].yep} \n 
                \`say\` - ${EmojiConstructor["alt"].yep} \n 
                \`xkcd\` - ${EmojiConstructor["alt"].yep} \n 
                \`bedwars\` - ${EmojiConstructor["alt"].yep} \n 
                \`blitzsurvivalgames\` - ${EmojiConstructor["alt"].yep} \n 
                \`buildbattle\` - ${EmojiConstructor["alt"].yep} \n 
                \`copsandcrims\` - ${EmojiConstructor["alt"].yep} \n 
                \`guild\` - ${EmojiConstructor["alt"].yep} \n 
                \`link\` - ${EmojiConstructor["alt"].yep} \n 
                \`megawalls\` - ${EmojiConstructor["alt"].yep} \n 
                \`murdermystery\` - ${EmojiConstructor["alt"].yep} \n 
                \`player\` - ${EmojiConstructor["alt"].yep} \n 
                \`skywars\` - ${EmojiConstructor["alt"].yep} \n 
                \`smashheroes\` - ${EmojiConstructor["alt"].yep} \n 
                \`socials\` - ${EmojiConstructor["alt"].yep} \n 
                \`speeduhc\` - ${EmojiConstructor["alt"].yep} \n 
                \`tntgames\` - ${EmojiConstructor["alt"].yep} \n 
                \`uhc\` - ${EmojiConstructor["alt"].yep} \n 
                \`unlink\` - ${EmojiConstructor["alt"].yep} \n 
                \`vampirez\` - ${EmojiConstructor["alt"].yep} \n 
                \`watchdog\` - ${EmojiConstructor["alt"].yep} \n 
                \`seed\` - ${EmojiConstructor["alt"].yep} \n 
                \`server\` - ${EmojiConstructor["alt"].yep} \n 
                \`skin\` - ${EmojiConstructor["alt"].yep} \n 
                \`uuid\` - ${EmojiConstructor["alt"].yep} \n 
                \`prefix\` - ${EmojiConstructor["alt"].yep} \n
                \`leavemessage\` - ${EmojiConstructor["alt"].yep} \n
                \`welcomemessage\` - ${EmojiConstructor["alt"].yep} \n
                \`ban\` - ${EmojiConstructor["alt"].clue} \n
                \`clear\` - ${EmojiConstructor["alt"].clue} \n
                \`infractions\` - ${EmojiConstructor["alt"].clue} \n
                \`kick\` - ${EmojiConstructor["alt"].clue} \n
                \`mute\` - ${EmojiConstructor["alt"].clue} \n
                \`nickname\` - ${EmojiConstructor["alt"].clue} \n
                \`reactionrole\` - ${EmojiConstructor["alt"].clue} \n
                \`unban\` - ${EmojiConstructor["alt"].clue} \n
                \`unmute\` - ${EmojiConstructor["alt"].clue} \n
                \`warn\` - ${EmojiConstructor["alt"].clue}`)

            message.reply({ embeds: [commands], allowedMentions: { repliedUser: true } });
        } else {
            const prem404 = new Discord.EmbedBuilder()
                .setAuthor(author)
                .setColor(colors["MainColor"])
                .setDescription(`Only the developers can view this, unless you join our support server: https://discord.gg/3b5rUekJkF`)

            message.reply({ embeds: [prem404], allowedMentions: { repliedUser: true } });
        }
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Working Commands",
            iconURL: "https://cdn.discordapp.com/app-icons/923947315063062529/588349026faf50ab631528bad3927345.png?size=256"
        }

        if(interaction.user.id == "724798908278112309" || "722092754510807133") {
            const commands = new Discord.EmbedBuilder()
                .setAuthor(author)
                .setColor(colors["MainColor"])
                .setDescription(`*This the is current status of the commands, and how they want to be worked on! An X stands for not working. The caution symbol stands for the command needs reworking or UI change, and a check mark means is works fine!* \n \n 
                \`conflip\` - ${EmojiConstructor["alt"].yep} \n 
                \`credits\` - ${EmojiConstructor["alt"].yep} \n 
                \`discord\` - ${EmojiConstructor["alt"].yep} \n 
                \`embed\` - ${EmojiConstructor["nope"].yep} \n 
                \`faq\` - ${EmojiConstructor["alt"].yep} \n 
                \`github\` - ${EmojiConstructor["alt"].yep} \n 
                \`help\` - ${EmojiConstructor["alt"].yep} \n 
                \`info\` - ${EmojiConstructor["alt"].yep} \n 
                \`invite\` - ${EmojiConstructor["alt"].yep} \n 
                \`latency\` - ${EmojiConstructor["alt"].yep} \n 
                \`overview\` - ${EmojiConstructor["alt"].yep} \n 
                \`rng\` - ${EmojiConstructor["alt"].yep} \n 
                \`say\` - ${EmojiConstructor["alt"].yep} \n 
                \`bedwars\` - ${EmojiConstructor["alt"].yep} \n 
                \`blitzsurvivalgames\` - ${EmojiConstructor["alt"].yep} \n 
                \`buildbattle\` - ${EmojiConstructor["alt"].yep} \n 
                \`copsandcrims\` - ${EmojiConstructor["alt"].yep} \n 
                \`guild\` - ${EmojiConstructor["alt"].yep} \n 
                \`link\` - ${EmojiConstructor["alt"].yep} \n 
                \`megawalls\` - ${EmojiConstructor["alt"].yep} \n 
                \`murdermystery\` - ${EmojiConstructor["alt"].yep} \n 
                \`player\` - ${EmojiConstructor["alt"].yep} \n 
                \`skywars\` - ${EmojiConstructor["alt"].yep} \n 
                \`smashheroes\` - ${EmojiConstructor["alt"].yep} \n 
                \`socials\` - ${EmojiConstructor["alt"].yep} \n 
                \`speeduhc\` - ${EmojiConstructor["alt"].yep} \n 
                \`tntgames\` - ${EmojiConstructor["alt"].yep} \n 
                \`uhc\` - ${EmojiConstructor["alt"].yep} \n 
                \`unlink\` - ${EmojiConstructor["alt"].yep} \n 
                \`vampirez\` - ${EmojiConstructor["alt"].yep} \n 
                \`watchdog\` - ${EmojiConstructor["alt"].yep} \n 
                \`seed\` - ${EmojiConstructor["alt"].yep} \n 
                \`server\` - ${EmojiConstructor["alt"].yep} \n 
                \`skin\` - ${EmojiConstructor["alt"].yep} \n 
                \`uuid\` - ${EmojiConstructor["alt"].yep} \n 
                \`prefix\` - ${EmojiConstructor["alt"].yep} \n
                \`leavemessage\` - ${EmojiConstructor["alt"].yep} \n
                \`welcomemessage\` - ${EmojiConstructor["alt"].yep} \n
                \`ban\` - ${EmojiConstructor["alt"].clue} \n
                \`clear\` - ${EmojiConstructor["alt"].clue} \n
                \`infractions\` - ${EmojiConstructor["alt"].clue} \n
                \`kick\` - ${EmojiConstructor["alt"].clue} \n
                \`mute\` - ${EmojiConstructor["alt"].clue} \n
                \`nickname\` - ${EmojiConstructor["alt"].clue} \n
                \`reactionrole\` - ${EmojiConstructor["alt"].clue} \n
                \`unban\` - ${EmojiConstructor["alt"].clue} \n
                \`unmute\` - ${EmojiConstructor["alt"].clue} \n
                \`warn\` - ${EmojiConstructor["alt"].clue}`)

            interaction.editReply({ embeds: [commands], allowedMentions: { repliedUser: true } });
        } else {
            const prem404 = new Discord.EmbedBuilder()
                .setAuthor(author)
                .setColor(colors["MainColor"])
                .setDescription(`Only the developers can view this, unless you join our support server: https://discord.gg/3b5rUekJkF`)

            interaction.editReply({ embeds: [prem404], allowedMentions: { repliedUser: true } });
        }
    }
}