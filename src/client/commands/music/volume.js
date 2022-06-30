module.exports = {
	name: "volume",
	aliases: [],
	description: "Allows you to change the volume of the music",
	options: [
		{
			name: "volume",
			description: "Alter the volmue",
			type: "SUB_COMMAND",
			option: [{ name: "percent", description: "10 -100%", type: "NUMBER", required: true }],
		}
	],
    defaultPermission: true,
	usage: "skin [IGN]",
	example: "skin ultimate_hecker",
	async execute(client, message, args, Discord, prefix) {

    }
}