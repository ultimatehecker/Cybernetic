const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ["REACTION", "MESSAGE", "CHANNEL"],
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"],
    failIfNotExists: true,
});

require("dotenv").config();
const mongoose = require("mongoose")

client.once("ready", () => {
    console.log("Cybernetic is now online!")
});

client.login(process.env.DISCORD_TOKEN);