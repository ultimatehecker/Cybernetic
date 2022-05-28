console.log('Event File Successfully Scanned - guildMemberAdd')

module.exports = async (Discord, client, member) => {
    const serverDoc = await client.utils.loadGuildInfo(client, member.guild);
    const channel = member.guild.channels.resolve(serverDoc.welcomeChannelID);

    if (!channel) return

    const tagRegex = /{member-tag}/g;
    const nameRegex = /{member-name}/g;
    const mentionRegex = /{member-mention}/g;

    let welcomeMessage = serverDoc.welcomeMessage.replace(
        tagRegex, `${member.user.tag}`
    );

    welcomemessage = welcomemessage.replace(nameRegex, `${member.user.username}`);
    welcomemessage = welcomemessage.replace(mentionRegex, `<@${member.user.id}>`);

    channel.send({ content: welcomeMessage });
};