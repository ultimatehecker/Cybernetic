const axios = require('axios')
const hypixelUrl = 'https://api.hypixel.net'
require("dotenv").config({ path: "./.env" });

async function getPlayer(ign) {
    let uuidGET = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
    let uuid = uuidGET.data.id

    let { data } = (await axios.get(`${hypixelUrl}/player?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let player = data

    player = player.player
    return player
};

exports.getPlayer = getPlayer

async function getGuild(guildName, guildId, ign) {
    if(ign) {
        let uuidGET = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
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

async function getSkyblock(ign, uuid) {
    let uuidGET = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${ign}`)
    let uuid = uuidGET.data.id

    let { collections } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/collections?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { skills } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/skills?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { election } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/election?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { bingo } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/bingo?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))

    let { news } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/news?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { auction } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/auction?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { activeAuctions } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/auctions?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { endedAuctions } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/auctions_ended?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
    let { bazaar } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/resources/skyblock/bazaar?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))

    let skyblock = collections && skills && election && bingo && news && auction && activeAuctions && endedAuctions && bazaar
    return skyblock
};

exports.getSkyblock = getSkyblock

async function getPunishments() {
    let { watchdog } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/punishmentstats?key=${process.env.HYPIXEL_API_KEY}`))
    let stats = watchdog
    return stats
};

exports.getPunishments = getPunishments

async function getLeaderboards() {
    let { leaderboard } = (await axios.get(`${hypixelUrl}/https://api.hypixel.net/punishmentstats?key=${process.env.HYPIXEL_API_KEY}`))
    let leaderboards = leaderboard.leaderboards
    return leaderboards
};

exports.getLeaderboards = getLeaderboards