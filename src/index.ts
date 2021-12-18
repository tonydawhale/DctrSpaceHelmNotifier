import config from "./data/config.json"
import { promisify } from "util";
import Discord, {
    Client,
    ClientOptions,
    Collection, ColorResolvable, GuildMember,
    GuildMemberRoleManager,
    Interaction,
    Message,
    MessageEmbed, Permissions,
    Snowflake, User
} from "discord.js"
import fs, { PathLike } from "fs";
import path from "path";
import klaw from "klaw";

export interface Bot extends Client {
    config: typeof config;
    owners: Snowflake[];
    wait(ms: number): Promise<void>;
}

export class Bot extends Client {
    constructor(options: ClientOptions) {
        super(options)
        this.config = config;
        this.owners = this.config.owners
    }
}

export const client = new Bot({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
    ],
    partials: ["MESSAGE", "GUILD_MEMBER"],
    allowedMentions: { parse: ["users"], roles: ["921866683197562890"] },
});

const init = async () => {
    const evtFiles = await fs.readdirSync("./build/events/");
    console.log(`Loading a total of ${evtFiles.length} events.`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        console.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)]
    })
    await client.login(client.config.bot_token);
}

init().catch(console.error);

process.on("unhandledRejection", error => {
    console.error(error)
})