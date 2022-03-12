const fs = require("fs");

module.exports = (client) => {
	const util_files = fs
		.readdirSync("./src/client/util/")
		.filter((file) => file.endsWith("js"));

	for (const file of util_files) {
		const util = require(`../util/${file}`);
		client.utils[file.split(".")[0]] = util;
	}

	console.log(`Utils Successfully Binded - ${util_files}`);

};