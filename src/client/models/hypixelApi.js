const axios = require('axios')
const hypixelUrl = 'https://api.hypixel.net'

async function getPlayer(uuid) {
    (await axios.get(`${hypixelUrl}/player?key=${process.env.HYPIXEL_API_KEY}&player=${uuid}`)).data
};

export { getPlayer };