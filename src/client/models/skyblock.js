const axios = require('axios');

module.exports = (async function() {
    const baseURL = (await axios.get(`https://sky.shiiyu.moe/api/v2/`)).data
});

