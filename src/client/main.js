console.time("Loaded all Cybernetic Dependancies in")

const currentDate = new Date(Date.now());

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
    dsn: "https://d5ca07bf8f4845adb0bbd96aec2a7d96@o922460.ingest.sentry.io/6123054",
    release: "0.1.1",
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    environment: "development",
});

Sentry.setTag("appProcess", "bot-core");

const startupTransaction = Sentry.startTransaction({
    op: "startup",
    name: "startup",
});

Sentry.configureScope((scope) => {
    scope.setSpan(startupTransaction);
});

const Discord = require("discord.js");
const client = new Discord.Client({
    partials: ["REACTION", "MESSAGE", "CHANNEL"],
    intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES"],
    failIfNotExists: true,
});

require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const databaseConnectionTransaction = startupTransaction.startChild({
    op: "connection",
    name: "MongoDB Database Connection",
});

const db = mongoose.connection;
db.once("open", () => {
    databaseConnectionTransaction.finish();

    const myprofileSchema = new mongoose.Schema({
        userID: String,
        guildID: String,
        infractions: Array,
        profile: String,
        netherite: Number,
        emeralds: Number,
        diamonds: Number,
        bank: Number,
        experience: Number,
        items: Array,
        rareItems: Array,
    });

    const serverSchema = new mongoose.Schema({
        guildID: String,
        prefix: String,
        welcomeMessage: String,
        welcomeChannelID: String,
        leaveChannelID: String,
        leaveMessage: String,
        reactionRoles: Array,
    });

    const mylevelSchema = new mongoose.Schema({
        userID: String,
        guildID: String,
        level: Number,
        lifetimeExperience: Number,
    });

    myprofileSchema.index({ guildID: 1, userID: -1 });
    mylevelSchema.index({ guildID: 1, userID: -1 });
    myprofileSchema.index({ guildID: 1 });

    client.myprofileSchema = mongoose.model("Profiles", myprofileSchema);
    client.serverModel = mongoose.model("Servers", serverSchema);
    client.mylevelSchema = mongoose.model("Levels", mylevelSchema);

    client.commands = new Discord.Collection();
    client.contexts = new Discord.Collection();
    client.events = new Discord.Collection();
    client.utils = {};

    client.login(process.env.DISCORD_TOKEN);
    const loginTransaction = startupTransaction.startChild({
        op: "connection",
        name: "Login to Discord API",
    });

    const mineflayer = require("mineflayer")

    const minecraft = mineflayer.createBot({
        host: 'halarnkar.ghostnation.org',
        username: process.env.MINECRAFT_USERNAME_ALT,
        version: '1.18.1',
        auth: 'microsoft'  
    });

    const { mineflayer: mineflayerViewer } = require('prismarine-viewer')
        minecraft.once('spawn', () => {
        mineflayerViewer(minecraft, { port: 3007, firstPerson: true }) // port is the minecraft server port, if first person is false, you get a bird's-eye view
    });


    client.once("ready", () => {
        console.log("Cybernetic Client PFP", client.user.displayAvatarURL());
        console.timeEnd("Loaded all Cybernetic Dependancies in");
        console.log(`Cybernetic's Database & Dependanices have been loaded and the client has been successfully started at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);
        client.user.setPresence({
            activities: [
                { name: "https://github.com/ultimatehecker/Cybernetic", type: "WATCHING" },
            ],
            status: "online",
        });
    });

    ["command_handler", "event_handler", "util_handler"].forEach((handler) => {
        require(`./config/${handler}`)(client, Discord);
    });
    loginTransaction.finish();
});
