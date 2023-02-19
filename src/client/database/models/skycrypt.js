const axios = require('axios');
const skycryptUrl = 'https://sky.shiiyu.moe/api/v2'

async function getSkyblock(ign, profileName) {
    let { profile } = (await axios.get(`${skycryptUrl}/profile/${ign}`))
    let { talismen } = (await axios.get(`${skycryptUrl}/talismans/${ign}`)) // maybe add the other option
    let { slayers } = (await axios.get(`${skycryptUrl}/slayers/${ign}`)) // maybe add the other option
    let { coins } = (await axios.get(`${skycryptUrl}/coins/${ign}`)) // maybe add the other option
    let { bazaar } = (await axios.get(`${skycryptUrl}/bazaar`)) 
    let { dungeons } = (await axios.get(`${skycryptUrl}/dungeons/${ign}`)) // maybe add the other option

    let skyblock = { profile, talismen, slayers, coins, bazaar, dungeons }
    return skyblock
}

exports.getSkyblock = getSkyblock;