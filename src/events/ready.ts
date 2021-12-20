import { Bot } from "../index"
import {Message, MessageManager, TextChannel, VoiceChannel} from "discord.js";
import {roleMention} from "@discordjs/builders";
import axios from "axios";

module.exports = class {
    client: Bot
    constructor(client: Bot) {
        this.client = client;
    }
    async run() {
        console.log(`Logged in as ${this.client.user?.tag}`)
        const dctrUuid = "0593eb6757a241d2afde4517e00a35b5"
        let latestPurse: number = 0
        setInterval(async () => {
            let currentPurse: number | undefined
            await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${this.client.config.api_key}&uuid=0593eb6757a241d2afde4517e00a35b5`)
                .then(data => {
                    data.data.profiles.forEach(
                        (i: any) => {
                            if (i.profile_id === "6cdbd2700e42435d8d2d7b63b3f31711") {
                                currentPurse = i.members[dctrUuid].coin_purse
                            }
                        }
                    )
                })
            if (!currentPurse) return
            if (currentPurse > latestPurse) {
                let i = 0
                const discord = await this.client.guilds.fetch("914418258168393728")
                const channel = await discord.channels.fetch("921872854440607804") as TextChannel
                await channel.send({
                    content: `${roleMention("921866683197562890")} Dctr's purse is rising (is he selling space helmets???)\nPurse is currently at: ${currentPurse}`
                })
            }
            latestPurse = currentPurse
        }, 1000)
    }
}