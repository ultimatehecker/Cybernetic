module.exports = async (Discord, client, member) => {
    console.log(member);

    const serverDoc = await client.serverModel.findOne({
        guildID: member.guild.id
    });

    const channel = member.guild.channels.resolve(serverDoc.leaveChannelID);

    if(!channel) return;

    const tagRegex = /{member-tag}/g;
    const nameRegex = /{member-name}/g;

    let leaveMessage1 = serverDoc.leaveMessage.replace(
        tagRegex,
        `${member.user.tag}`
    );

    let leaveMessage2 = leaveMessage1.replace(
        nameRegex,
        `${member.user.username}`
    );

    channel.send(leaveMessage2);
};