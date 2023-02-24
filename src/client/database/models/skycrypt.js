const axios = require('axios');
const skycryptUrl = 'https://sky.shiiyu.moe/api/v2'

async function getSkyblock(player, profileName) {
    let profiles = (await axios.get(`${skycryptUrl}/profile/${player}`))
    let talismen = (await axios.get(`${skycryptUrl}/talismans/${player}`)) // maybe add the other option
    let slayers = (await axios.get(`${skycryptUrl}/slayers/${player}`)) // maybe add the other option
    let coins = (await axios.get(`${skycryptUrl}/coins/${player}`)) // maybe add the other option
    let bazaar = (await axios.get(`${skycryptUrl}/bazaar`)) 
    let dungeons = (await axios.get(`${skycryptUrl}/dungeons/${player}`)) // maybe add the other option
    let profileSkills = require(`../../tools/skyblock.json`)

    let skyblock = { profiles, talismen, slayers, coins, bazaar, dungeons, profileSkills }
    return skyblock
}

exports.getSkyblock = getSkyblock;