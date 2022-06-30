const { DisTube } = require('distube')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { SpotifyPlugin } = require('@distube/spotify')


const distube = new Distube(client, {
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    searchSongs: 5,
    leaveOnEmpty: false,
    leaveOnFinish: false,
    leaveOnStop: false,
});

module.exports.distube = distube;