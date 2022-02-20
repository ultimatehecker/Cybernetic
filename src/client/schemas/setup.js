const mineflayer = require('mineflayer')
const online = require(`./online`)
const timer = require('util').promisify(setTimeout)

let minecraft = null

const createClient = () => {
    minecraft = mineflayer.createBot({
    host: process.env.IP_ADDR, 
    username: process.env.MINECRAFT_USERNAME,       
    auth: 'microsoft'             
    });
}

const getClient = () => {
    return minecraft;
}

const afkClient = async() => {
    while (true) {
        createClient()
        online.toggleStatus()
        await timer(300000)
        minecraft.quit()
        online.toggleStatus()
    }
}

const quitClient = () => {
    minecraft.quit()
}

exports.createClient = createClient;
exports.getClient = getClient;
exports.afkClient = afkClient;
exports.quitClient = quitClient;