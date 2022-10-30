const colors = require("../../tools/colors.json");

module.exports = {
    name: "seed",
    aliases: [],
    description: "Gives all the credits where credits is due in the making for this Discord Bot",
    usage: "seed",
    example: "seed",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        let authorSuccess = {
            name: "Minecraft Seed Generator",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }

        function mcseed() {
            let response = [Math.floor(Math.random() * (9223372036854775807 - 1 + 1) + 1)];
            let rand = Math.random()

            if(rand <= 0.5) {
                return `${[Math.floor(Math.random() * 1)]}${response}`
            }else if(rand >= 0.5) {
                return `${[Math.floor(Math.random() * -1)]}${response}`
            }
        }

        const seed = new Discord.EmbedBuilder()
            .setAuthor(authorSuccess)
            .setColor(colors["MainColor"])
            .setDescription(`Here is your randomly generated minecraft seed: \`${mcseed()}\``)

        message.reply({ embeds: [seed], allowedMentions: { repliedUser: true } });
    },
    async slashExecute(client, Discord, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let authorSuccess = {
            name: "Minecraft Seed Generator",
            iconURL: "https://cdn.discordapp.com/app-icons/951969820130300015/588349026faf50ab631528bad3927345.png?size=256"
        }


        function mcseed() {
            let response = [Math.floor(Math.random() * (9223372036854775807 - 1 + 1) + 1)];
            let rand = Math.random()

            if(rand <= 0.5) {
                return `${[Math.floor(Math.random() * 1)]}${response}`
            }else if(rand >= 0.5) {
                return `${[Math.floor(Math.random() * -1)]}${response}`
            }
        }

        const seed = new Discord.EmbedBuilder()
            .setAuthor(authorSuccess)
            .setColor(colors["MainColor"])
            .setDescription(`Here is your randomly generated minecraft seed: \`${mcseed()}\``)

        interaction.editReply({ embeds: [seed], allowedMentions: { repliedUser: true } });
    }
};