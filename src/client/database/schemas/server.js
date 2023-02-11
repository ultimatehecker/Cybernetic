const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
    guildID: String,
    prefix: String,
    welcomeMessage: String,
    welcomeChannelID: String,
    leaveChannelID: String,
    leaveMessage: String,
    reactionRoles: Array,
});

client.serverSchema = mongoose.model("Servers", serverSchema);