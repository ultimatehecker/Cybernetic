require("dotenv").config({ path: "./.env" });
const HypixelAPIReborn = require("hypixel-api-reborn");
const hypixel = new HypixelAPIReborn.Client(process.env.HYPIXEL_API_KEY, {
    cache: true,
});

const errors = HypixelAPIReborn.Errors;

module.exports.hypixel = hypixel;
module.exports.errors = errors;