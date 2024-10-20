import BaseCommand from "./BaseCommand";
import {BotCommandContext} from "@twurple/easy-bot";
import {getConfig} from "../../../helper/ConfigHelper";
import {logRegular, logWarn} from "../../../helper/LogHelper";
import {addAlert} from "../../../helper/AlertHelper";

export default class ShoutoutCommand extends BaseCommand {
    command = 'shoutout'
    aliases: string[] = ['so'];
    requiresMod = true
    params = [
        {
            name: 'userName',
            type: 'user'
        },
    ]

    async handle(params: any, context: BotCommandContext) {
        const user = await this.bot.api.users.getUserByName(params.userName)

        if(!user) {
            await context.reply('Dieses Benutzer wurde leider nicht gefunden')
            return
        }

        const channelInfo = await this.bot.api.channels.getChannelInfoById(user)

        const clipUrl = `https://streamgood.gg/clips/player?mode=random&current_game=false&info=false&volume=50&max_length=60&filter_long_videos=false&show_timer=false&recent_clips=0&channel=${user.name}`

        const primaryChannel = await this.bot.api.users.getUserByName(
            getConfig(/twitch/g)[0]['channels'][0])

        try {
            await this.bot.api.chat.shoutoutUser(primaryChannel, user)
        } catch (error) {
            logWarn('twitch shout failed:')
            logWarn(JSON.stringify(error, Object.getOwnPropertyNames(error)))
        }

        await context.say(`${user.displayName} hat zuletzt ${channelInfo.gameName} gespielt`)
        await context.say(`checkt denn channel ab -> https://twitch.tv/${user.name}`)

        logRegular(`shout from ${context.userDisplayName} to ${user.displayName}`)

        addAlert({
            'logo': user.profilePictureUrl,
            'iframe': clipUrl,
            'duration': 30,
            'icon': '',
            'message': `checkt ${user.displayName} aus`,
            'event-uuid': `shoutout-${user.id}`
        })
    }
}