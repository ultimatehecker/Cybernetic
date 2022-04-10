console.log('Util File Successfully Scanned - loadUserInfo')

module.exports = (client, serverDoc, id) => {
	return new Promise((resolve, reject) => {
		client.userModel
			.findOne({ userID: id, guildID: serverDoc.guildID })
			.then((user) => {
				if (!user) {
					client.userModel
						.create({
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
						})
						.then((userDoc) => {
							serverDoc.myprofile.push(userDoc._id);
							client.utils
								.serverQueue(client, serverDoc)
								.then(() => {
									resolve(userDoc);
								})
								.catch((err) => {
									reject(err);
								});
						});
				} else {
					resolve(user);
				}
			});
	});
};
