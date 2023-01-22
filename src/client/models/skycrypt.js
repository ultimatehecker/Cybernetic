const axios = require('axios')
const skyblockAPI = `https://sky.shiiyu.moe/api/v2`

async function profileRequest() {
    let path = `/profile/${player}`;

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let profile = JSON.stringify(response);

    return profile;
};

async function talismansRequest(player, profileName) {
    let path = `/talismans/${player}/${profileName}`;

    if(!profileName) {
        path = `/talismans/${player}`;
    }

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let talismans = JSON.stringify(response);

    return talismans;
};

async function slayersRequest(player, profileName) {
    let path = `/slayers/${player}/${profileName}`;

    if(!profileName) {
        path = `/slayers/${player}`;
    }

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let slayers = JSON.stringify(response);

    return slayers;
};

async function coinsRequest(player, profileName) {
    let path = `/coins/${player}/${profileName}`;

    if(!profileName) {
        path = `/coins/${player}`;
    }

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let coins = JSON.stringify(response);

    return coins;
};

async function dungeonsRequest(player, profileName) {
    let path = `/dungeons/${player}/${profileName}`;

    if(!profileName) {
        path = `/dungeons/${player}`;
    }

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let dungeons = JSON.stringify(response);

    return dungeons;
};

async function bazaarRequest() {
    let path = `/bazaar`;

    let response = (await axios.get(`${skyblockAPI}${path}`)).data;
    let dungeons = JSON.stringify(response);

    return dungeons;
};

export { profileRequest, talismansRequest, slayersRequest, coinsRequest, dungeonsRequest, bazaarRequest };

