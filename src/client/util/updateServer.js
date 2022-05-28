console.log('Util File Successfully Scanned - updateServer')

module.exports = async(client, id, data) => {
    await client.serverModel.updateOne({ guildID: id }, data).exec();
};