const fs = require("fs");

module.exports = (client, Discord) => {

    let basicCmds = new Discord.Collection();

	const commandFolders = fs.readdirSync("./commands");

	for (const folder of commandFolders) {
		const commandFiles = fs
			.readdirSync(`./commands/${folder}`)
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
			basicCmds.set(command.name, command);
		}
	}
};