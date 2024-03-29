console.time("Loaded all Cybernetic Dependancies in");

const currentDate = new Date(Date.now());

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
require("dotenv").config();

Sentry.init({
    dsn: "https://d5ca07bf8f4845adb0bbd96aec2a7d96@o922460.ingest.sentry.io/6123054",
    release: process.env.RELEASE,
    tracesSampleRate: 1.0,
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    environment: process.env.DEVELOPMENT,
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
const { GatewayIntentBits, Partials, ActivityType } = require("discord.js");
const client = new Discord.Client({
    partials: [Partials.Reaction, Partials.Message, Partials.Channel],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages],
    failIfNotExists: true,
});

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
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
        infractions: [],
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
    
    client.serverSchema = mongoose.model("Servers", serverSchema);
    myprofileSchema.index({ guildID: 1, userID: -1 });
    client.myprofileSchema = mongoose.model("Profiles", myprofileSchema);

    client.commands = new Discord.Collection();
    client.contexts = new Discord.Collection();
    client.events = new Discord.Collection();
    client.utils = {};

    client.login(process.env.DISCORD_TOKEN);
    const loginTransaction = startupTransaction.startChild({
        op: "connection",
        name: "Login to Discord API",
    });

    client.once("ready", () => {
        console.log("Cybernetic Client PFP", client.user.displayAvatarURL());
        console.timeEnd("Loaded all Cybernetic Dependancies in");
        console.log(`Cybernetic's Database & Dependanices have been loaded and the client has been successfully started at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);
        client.user.setPresence({
            activities: [
                { name: "https://github.com/ultimatehecker/Cybernetic", type: ActivityType.Watching},
            ],
            status: "online",
        });

        process.on('unhandledRejection', error => {
            console.error('Unhandled promise rejection:', error);
        });

        ["command_handler", "event_handler", "util_handler"].forEach((handler) => {
            require(`./components/${handler}`)(client, Discord);
        });
    });
    loginTransaction.finish();
});
