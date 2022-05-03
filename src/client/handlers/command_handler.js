const fs = require("fs");

module.exports = (client, Discord) => {

    let basicCmds = new Discord.Collection();

	const commandFolders = fs.readdirSync(`./src/client/commands`);

	for (const folder of commandFolders) {
		const commandFiles = fs
			.readdirSync(`./src/client/commands/${folder}`)
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`../commands/${folder}/${file}`);
			client.commands.set(command.name, command);
			basicCmds.set(command.name, command);
		}
	}

	client.user.id = process.env.CLIENT_ID;
	let slashCommands = basicCmds.map((command) => {
		let slashCmd = {
			name: command.name,
			type: command.type,
			description: command.description,
			options: command.options,
			defaultPermission: command.defaultPermission,
			example: command.example,
			notes: command.notes,
			execute: command.execute,
			slashExecute: command.slashExecute,
		};
	
		client.commands.set(slashCmd.name, slashCmd);
		return slashCmd;
	});

	console.timeEnd("Finished Loading Slash (/) Command Data in");

	console.log("Loading Context Menu Data...");
	console.time("Finished Loading Context Menu Data in");

	const context_files = fs
		.readdirSync("./contexts/")
		.filter((file) => file.endsWith("js"));

	for (const file of context_files) {
		const context = require(`../contexts/${file}`);
		if (context.name) {
			client.contexts.set(context.name, context);
			slashCommands.push({
				name: context.name,
				type: context.type,
			});
		} else {
			continue;
		}
	}

	console.timeEnd("Finished Loading Context Menu Data in");

	console.log("Cybernetic Commands Set");

	if (process.argv[2] === "-d") {
		console.log(
			`Sending Slash (/) Command Data to Discord for Guild ${process.env.DEV_GUILD_ID}...`
		);
		if (!process.env.DEV_GUILD_ID) {
			throw new ReferenceError("The development guild ID is not set!");
		}
		console.time(
			`Finished Sending Slash (/) Command Data to Discord for Guild ${process.env.DEV_GUILD_ID} in`
		);

		client.application.commands
			.set(slashCommands, process.env.DEV_GUILD_ID)
			.then(() => {
				console.timeEnd(
					`Finished Sending Slash (/) Command Data to Discord for Guild ${process.env.DEV_GUILD_ID} in`
				);
			});
	} else if (process.argv[2] === "-D") {
		console.log(`Sending Slash (/) Command Data to Discord Globally`);
		console.time(
			`Finished Sending Slash (/) Command Data to Discord Globally in`
		);
		client.application.commands.set(slashCommands).then(() => {
			console.timeEnd(
				`Finished Sending Slash (/) Command Data to Discord Globally in`
			);
		});
	} else if (process.argv[2] === "-r") {
		console.log(
			`Removing All Slash (/) Commands from Guild ${process.env.DEV_GUILD_ID}...`
		);
		console.time(
			`Removed All Slash (/) Commands from Guild ${process.env.DEV_GUILD_ID} in`
		);
		client.application.commands.set([], process.env.DEV_GUILD_ID).then(() => {
			console.timeEnd(
				`Removed All Slash (/) Commands from Guild ${process.env.DEV_GUILD_ID} in`
			);
		});
	} else if (process.argv[2] === "-R") {
		console.log(`Removing All Slash (/) Commands Globally...`);
		console.time(`Removed All Slash (/) Commands Globally in`);
		client.application.commands.set([]).then(() => {
			console.timeEnd(`Removed All Slash (/) Commands Globally in`);
		});
	}
};