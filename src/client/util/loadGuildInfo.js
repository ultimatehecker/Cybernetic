console.log('Util File Successfully Scanned - loadGuildInfo')

module.exports = (client, guildResolvable) => {
    return new Promise((resolve, reject) => {
        let guild = client.guilds.resolve(guildResolvable);
        client.serverSchema
            .findOne({ guildID: guild.id })
            .exec()
            .then((serverDoc) => {
                if(serverDoc === null) {
                    client.serverSchema.create(
                        {
                            guildID: guild.id,
                            prefix: "-",
                            welcomeMessage: "{member-mention} has joined the server",
                            welcomeChannelID: "none",
                            leaveChannelID: "none",
                            leaveMessage: "{member-tag} has left the server :(",
                            reactionRoles: [],
                        },
                        (err, newServer) => {
                            if (err) {
                                reject(err);
                            }else {
                                resolve(newServer);
                            }
                        }
                    );
                }else {
                    resolve(serverDoc);
                }
            });
    });
};