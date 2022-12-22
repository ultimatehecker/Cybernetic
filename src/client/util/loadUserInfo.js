console.log('Util File Successfully Scanned - loadUserInfo')

module.exports = (client, serverDoc, id) => {
	return new Promise((resolve, reject) => {
		client.myprofileSchema.findOne({ userID: id, guildID: serverDoc.guildID }).then((user) => {
			if (!user) {
				client.myprofileSchema.create({
					userID: id,
					guildID: serverDoc.guildID,
					infractions: 0,
					netherite: 0,
					emeralds: 0,
					diamonds: 0,
					bank: 0,
					experience: 0,
					items: [],
					rareItems: [],
					infractions: [],
				}).then((userDoc) => {
					serverDoc.myprofileSchema.push(userDoc._id);
					client.utils.serverQueue(client, serverDoc).then(() => {
						resolve(userDoc);
					}).catch((err) => {
						reject(err);
					});
				});
			} else {
				resolve(user);
			}
		});
	});
};
