console.log('Event File Successfully Scanned - messageReactionAdd')

module.exports = async(Discord, client, reaction, user) => {
    if(reaction.partial) {
        await fetch(true).catch((error) => {
            console.log("Something went wrong when fetching the message ", error)
        });
    }

    if(user.partial) {
        await user.fetch().catch((error) => {
            console.log("Something went wrong when fetching the message ", error);
        });
    }

    let realReaction = reaction;
    let realUser = user;

    const serverDoc = await client.utils.loadGuildInfo(
        client.
        reaction.message.guild
    );

    const roleListener = serverDoc.reactionRoles;

    for (let i = 0; i < roleListener.length; i++) {
        if (
            realReaction.message.id === roleListener[i][2] &&
            realUser.tag !== "Cybernetic#8722"
        ) {
            if (realReaction.emoji.name === roleListener[i][1]) {
                const member = realReaction.message.guild.members.resolve(realUser);
                await realReaction.message.guild.roles.fetch();
                let roleToAddToMember = realReaction.message.guild.roles.cache.find(
                    (role) => role.name === roleListener[i][0]
                );
                member.roles.add(roleToAddToMember.id);
            }
        }
    }
};