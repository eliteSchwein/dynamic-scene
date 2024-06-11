import TwitchAuth from "./Auth";
import {getConfig} from "../../helper/ConfigHelper";
import {Bot} from "@twurple/easy-bot";
import registerCommands from "../../commands/TwitchCommands";
import buildCommands from "../../commands/TwitchCommands";

export default class TwitchClient {
    protected auth: TwitchAuth
    protected bot: Bot

    public async connect() {
        this.auth = new TwitchAuth()

        const config = getConfig()['twitch']

        const authProvider = await this.auth.getAuthCode()

        this.bot = new Bot({ authProvider, channels: config.channels, commands: buildCommands()})
    }

    public async registerEvents() {

    }
}