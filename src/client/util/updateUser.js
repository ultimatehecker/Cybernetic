console.log('Util File Successfully Scanned - updateUser')

module.exports = async (client, guildID, userID, data) => {
    await client.userModel
        .replaceOne({ guildID: guildID, userID, userID }, data)
        .exec();
};