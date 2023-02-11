const axios = require('axios');
const { Client } = require('discord.js');
const { hypixel } = require('./hypixel');
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

async function getSkyblock(ign, uuid) {
    if(uuid) {
        let { collections } = (await axios.get(`${hypixelUrl}/resources/skyblock/collections?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { skills } = (await axios.get(`${hypixelUrl}/resources/skyblock/skills?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { election } = (await axios.get(`${hypixelUrl}/resources/skyblock/election?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { bingo } = (await axios.get(`${hypixelUrl}/resources/skyblock/bingo?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))

        let { news } = (await axios.get(`${hypixelUrl}/resources/skyblock/news?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { auction } = (await axios.get(`${hypixelUrl}/resources/skyblock/auction?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { activeAuctions } = (await axios.get(`${hypixelUrl}/resources/skyblock/auctions?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { endedAuctions } = (await axios.get(`${hypixelUrl}/resources/skyblock/auctions_ended?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))
        let { bazaar } = (await axios.get(`${hypixelUrl}/resources/skyblock/bazaar?uuid=${uuid}&key=${process.env.HYPIXEL_API_KEY}`))

        let skyblock = { collections, skills, election, bingo, news, auction, activeAuctions, endedAuctions, bazaar }
        return skyblock

    } else if(ign) {
        let { collections } = (await axios.get(`${hypixelUrl}/resources/skyblock/collections?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { skills } = (await axios.get(`${hypixelUrl}/resources/skyblock/skills?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { election } = (await axios.get(`${hypixelUrl}/resources/skyblock/election?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { bingo } = (await axios.get(`${hypixelUrl}/resources/skyblock/bingo?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))

        let { news } = (await axios.get(`${hypixelUrl}/resources/skyblock/news?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { auction } = (await axios.get(`${hypixelUrl}/resources/skyblock/auction?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { activeAuctions } = (await axios.get(`${hypixelUrl}/resources/skyblock/auctions?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { endedAuctions } = (await axios.get(`${hypixelUrl}/resources/skyblock/auctions_ended?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))
        let { bazaar } = (await axios.get(`${hypixelUrl}/resources/skyblock/bazaar?name=${ign}&key=${process.env.HYPIXEL_API_KEY}`))

        let skyblock = { collections, skills, election, bingo, news, auction, activeAuctions, endedAuctions, bazaar }
        return skyblock
    }
};

exports.getSkyblock = getSkyblock

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

const Errors = {
    CACHE_FILTER_INVALID: string,
    CACHE_LIMIT_MUST_BE_A_NUMBER: string,
    CACHE_TIME_MUST_BE_A_NUMBER: string,
    CONNECTION_ERROR: string,
    ERROR_CODE_CAUSE: string,
    ERROR_STATUSTEXT: string,
    GUILD_DOES_NOT_EXIST: string,
    INVALID_API_KEY: string,
    INVALID_GUILD_ID: string,
    INVALID_GUILD_SEARCH_PARAMETER: string,
    INVALID_OPTION_VALUE: string,
    INVALID_KEY_LIMIT_OPTION: string,
    INVALID_HEADER_SYNC_OPTION: string,
    INVALID_BURST_OPTION: string,
    INVALID_RATE_LIMIT_OPTION: string,
    INVALID_RESPONSE_BODY: string,
    KEY_MUST_BE_A_STRING: string,
    MALFORMED_UUID: string,
    NO_API_KEY: string,
    NO_GUILD_QUERY: string,
    NO_NICKNAME_UUID: string,
    NO_UUID: string,
    OPTIONS_MUST_BE_AN_OBJECT: string,
    PAGE_INDEX_ERROR: string,
    PLAYER_DISABLED_ENDPOINT: string,
    PLAYER_DOES_NOT_EXIST: string,
    PLAYER_HAS_NEVER_LOGGED: string,
    PLAYER_IS_INACTIVE: string,
    RATE_LIMIT_INIT_ERROR: string,
    SOMETHING_WENT_WRONG: string,
    UUID_NICKNAME_MUST_BE_A_STRING: string,
    MULTIPLE_INSTANCES: string,
};

const errors = hypixel.Errors
exports.errors = errors