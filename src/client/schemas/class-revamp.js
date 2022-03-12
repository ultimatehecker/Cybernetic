const timer = require('util').promisify(setTimeout)
const mineflayer = require('mineflayer')

class Client {
	minecraft = null

	constructor() {
		this.minecraft = mineflayer.createBot({
			host: process.env.IP_ADDR, 
			username: process.env.MINECRAFT_USERNAME_ALT,       
			auth: 'microsoft'   
		})
	}

	getClient() {
		return this.minecraft
	}

	afkClient = async() => {
		while (true) {
			createClient()
			online.toggleStatus()
			await timer(600000)
			this.minecraft.quit()
			online.toggleStatus()
		}
	}	

	quitClient() {
		this.minecraft.quit()
	}
}