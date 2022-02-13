const mineflayer = require('mineflayer')

const getClient = () => {
    const client = mineflayer.createBot({
        host: process.env.IP_ADDR, 
        username: process.env.MINECRAFT_USERNAME_ALT,       
        auth: 'microsoft'             
    });
}

exports.getClient = getClient;
