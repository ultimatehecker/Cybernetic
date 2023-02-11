const hypixel = require(`./hypixelApi`);

player = "ultimate_hecker"
hypixel.getPlayer(player).then((player) => {
    console.log(player.stats.Bedwars.winstreak)
})