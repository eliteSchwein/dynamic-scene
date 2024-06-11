import {Bot} from "@twurple/easy-bot";
import {getConfig} from "../../helper/ConfigHelper";
import {logRegular} from "../../helper/LogHelper";

const moderators = {}
const vips = {}

export default async function registerPermissions(bot: Bot) {
    const channels = getConfig(/twitch/g)[0]['channels']

    for(const channel of channels) {
        logRegular(`register permissions: ${channel}`);

        moderators[channel] = []
        vips[channel] = []

        const channelMods = await bot.getMods(channel)
        const channelVips = await bot.getVips(channel)

        for (const channelMod of channelMods) {
            moderators[channel].push(channelMod.userId)
        }

        for (const channelVip of channelVips) {
            vips[channel].push(channelVip.id)
        }
    }
}

export function hasVip(channel: string, userId: string) {
    if(!vips[channel]) return false

    return vips[channel] && vips[channel].includes(userId)
}

export function hasModerator(channel: string, userId: string) {
    if(!moderators[channel]) return false

    return moderators[channel] && moderators[channel].includes(userId)
}