module.exports = {
    name: "say",
    aliases: [],
    description: "Says anything that you tell the bot to",
    usage: "say {content}",
    example: "say Cybernetic is the best Discord bot ever!",
    async execute(client, message, args, Discord) {

        await message.channel.sendTyping();

        const content = args.join(" ");
        message.channel.send(content).then(() => {
            message.delete();
        });
    }
}