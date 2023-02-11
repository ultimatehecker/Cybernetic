const mongoose = require("mongoose");

const myprofileSchema = new mongoose.Schema({
    userID: String,
    guildID: String,
    infractions: Array,
    profile: String,
    netherite: Number,
    emeralds: Number,
    diamonds: Number,
    bank: Number,
    experience: Number,
    items: Array,
    rareItems: Array,
    infractions: [],
});

myprofileSchema.index({ guildID: 1, userID: -1 });
client.myprofileSchema = mongoose.model("Profiles", myprofileSchema);