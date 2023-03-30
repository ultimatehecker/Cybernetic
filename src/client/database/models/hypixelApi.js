const axios = require('axios');
const hypixelUrl = 'https://api.hypixel.net'
const mojangUrl = 'https://api.mojang.com'
require("dotenv").config({ path: "./.env" });

async function getPlayer(ign) {
    let uuidGET = await axios.get(`${mojangUrl}/users/profiles/minecraft/${ign}`)
    let uuid = uuidGET.data.id

    let { data } = (await axios.get(`${hypixelUrl}/player?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let player = data

    player = player.player
    return player
};

exports.getPlayer = getPlayer

async function getGuild(guildName, guildId, ign) {
    if(ign) {
        let uuidGET = await axios.get(`${mojangUrl}/users/profiles/minecraft/${ign}`)
        let uuid = uuidGET.data.id
    
        let { data } = (await axios.get(`${hypixelUrl}/guild?player=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))

        let guild = data
        guild = guild.guild
        return guild

    } else if(guildId) {
        let { data } = (await axios.get(`${hypixelUrl}/guild?player=${guildId}&key=${process.env.HYPIXEL_API_KEY}`))

        let guild = data
        guild = guild.guild
        return guild

    } else if(guildName) {
        let { data } = (await axios.get(`${hypixelUrl}/guild?name=${guildName}&key=${process.env.HYPIXEL_API_KEY}`))

        let guild = data
        guild = guild.guild
        return guild
    }
};

exports.getGuild = getGuild

async function getPunishments() {
    let { watchdog } = (await axios.get(`${hypixelUrl}/punishmentstats?key=${process.env.HYPIXEL_API_KEY}`))
    let stats = watchdog
    return stats
};

exports.getPunishments = getPunishments

async function getLeaderboards() {
    let { leaderboard } = (await axios.get(`${hypixelUrl}/leaderboards?key=${process.env.HYPIXEL_API_KEY}`))
    let leaderboards = leaderboard.leaderboards
    return leaderboards
};

exports.getLeaderboards = getLeaderboards