module.exports = (Discord, guild, prefix) => {
    const channel = guild.channels.cache.find((channel) => channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"))

    let author = {
        name: "Cybernetic",
        iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
    }

    const greetings = new Discord.MessageEmbed()
        .setAuthor(author)
        .setDescription(`**Thank you for adding me!** \n \n \`•\` My prefix is \`${prefix}\` \n \`•\` You can see all commands by typing \`${prefix}help\` \n \`•\` Try using a command, such as \`${[prefix]}info\` \n \n You can always **change the prefix with** \`${prefix}prefix [prefix]\`. \n \n You can also **link** yourself by doing \`.link (minecraft-username)\`. This allows you to use commands without typing any arguments such as \`.bedwars\` or \`.socials\`. \n \n *Please do remember that Cybernetic is in BETA, and the bugs will appear. If you find a bug put in the the GitHub Repository. If you have a suggestion you can either DM \`ultimate_heckerALT#3171\`* \n \n **Links:** \n [Cybernetic Support Server]: (https://discord.gg/UNJMDyBstq.) \n [Website]: (currently under working) \n[GitHub Page]: (https://github.com/ultimatehecker/Cybernetic)`)

    channel.send({ embeds: [greetings] });
};