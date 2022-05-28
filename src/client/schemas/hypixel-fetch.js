const axios = require("axios")

axios.get(`https://api.hypixel.net/key?key=${process.env.HYPIXEL_API_KEY}`).then(result => result.json()).then(({ record }) => {
    console.log("Your Hypixel API key has been fetched").then(() => {
        setTimeout(function() {
            console.log(body.player.achievements.bedwars_level)
        }, 5000);
    });
})

module.exports.betterHypixel = betterHypixel;