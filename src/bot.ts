import {Client, GatewayIntentBits} from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({intents: [GatewayIntentBits.Guilds]})

client.on('ready', () => {
    console.log("hello")
})

client.login(process.env.BOT_TOKEN)