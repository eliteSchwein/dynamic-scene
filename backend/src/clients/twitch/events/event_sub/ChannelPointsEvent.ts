import BaseEvent from "./BaseEvent";
import {EventSubChannelRedemptionAddEvent} from "@twurple/eventsub-base";
import {logError, logNotice, logRegular, logWarn} from "../../../../helper/LogHelper";
import {getAssetConfig, getConfig} from "../../../../helper/ConfigHelper";
import BoostChannelPoint from "../channel_points/BoostChannelPoint";
import {addEventToCooldown, isEventFull, removeEventFromCooldown} from "../../helper/CooldownHelper";
import {v4 as uuidv4} from "uuid";
import {sleep} from "../../../../../../helper/GeneralHelper";
import {addAlert} from "../../../../helper/AlertHelper";
import {triggerScene} from "../../../../helper/SceneHelper";
import isShieldActive from "../../../../helper/ShieldHelper";
import FAChannelPoint from "../channel_points/FAChannelPoint";
import getWebsocketServer from "../../../../App";
import HudChannelPoint from "../channel_points/HudChannelPoint";
import {fetchChannelPointData, updateChannelPoints} from "../../../../helper/ChannelPointHelper";
import {getGameInfoData} from "../../../website/WebsiteClient";

export default class ChannelPointsEvent extends BaseEvent {
    name = 'ChannelPointsEvent'
    eventTypes = ['onChannelRedemptionAdd']

    protected channelPoints = []

    async handleRegister() {
        const primaryChannel = await this.bot.api.users.getUserByName(
            getConfig(/twitch/g)[0]['channels'][0])

        this.channelPoints.push(new BoostChannelPoint(this.eventSubWs, this.bot))
        this.channelPoints.push(new FAChannelPoint(this.eventSubWs, this.bot))
        this.channelPoints.push(new HudChannelPoint(this.eventSubWs, this.bot))

        const presentChannelPoints = await this.bot.api.channelPoints.getCustomRewards(primaryChannel.id)
        const rewardNames = presentChannelPoints.map(reward => reward.title)
        const configChannelPoints = getConfig(/channel_point /g)
        const gameData = await getGameInfoData()
        const gameChannelPoints = gameData.channel_points

        for(const channelPoint of this.channelPoints) {
            const channelPointTitle = channelPoint.getTitle()

            if(rewardNames.includes(channelPointTitle)) continue

            logNotice(`create channel point: ${channelPointTitle}`)

            await this.bot.api.channelPoints.createCustomReward(primaryChannel.id, {title: channelPointTitle, cost: 991})
        }

        for(const channelPoint of configChannelPoints) {
            if(rewardNames.includes(channelPoint.label)) continue

            logNotice(`create config channel point: ${channelPoint.label}`)

            await this.bot.api.channelPoints.createCustomReward(primaryChannel.id, {title: channelPoint.label, cost: 992})
        }

        for(const channelPoint of gameChannelPoints) {
            if(rewardNames.includes(channelPoint.name)) continue

            logNotice(`create website channel point: ${channelPoint.name}`)

            await this.bot.api.channelPoints.createCustomReward(primaryChannel.id, {title: channelPoint.name, cost: 993})
        }

        await updateChannelPoints()
    }

    async handle(event: EventSubChannelRedemptionAddEvent) {
        let isValid = false
        const configChannelPoints = getConfig(/channel_point /g)
        const eventUuid = uuidv4()

        if(isShieldActive()) {
            logWarn(`channel point denied for ${event.userName} because shield mode is active!`)
            if(event.broadcasterName !== event.userName) {
                await this.bot.whisper(event.userName, 'Deine Kanalpunkte wurden dir zurück gegeben weil der Schild Modus aktiv ist.')
            }
            await event.updateStatus('CANCELED')
            return
        }

        if(isEventFull(this.name, event.broadcasterName, this.eventLimit)) {
            if(event.broadcasterName !== event.userName) {
                await this.bot.whisper(event.userName, 'Deine Kanalpunkte wurden dir zurück gegeben weil aktuell die Punkte Warteschlange voll ist.')
            }

            logWarn(`channel point denied for ${event.userName} because global spam protection is active!`)
            await event.updateStatus('CANCELED')
            return
        }

        for(const configChannelPoint of configChannelPoints) {
            if(configChannelPoint.label !== event.rewardTitle) continue

            if(!configChannelPoint.auto_accept) {
                addEventToCooldown(eventUuid, this.name, event.broadcasterName)
            }

            const asset = getAssetConfig(configChannelPoint.asset)

            if(asset) {
                addAlert({
                    'channel': asset.channel,
                    'sound': asset.sound,
                    'duration': asset.duration,
                    'icon': (asset.icon) ? asset.icon : '',
                    'message': (asset.message) ? asset.message : '',
                    'event-uuid': `alert-${configChannelPoint.label}_${uuidv4()}`,
                    'video': (asset.video) ? asset.video : '',
                    'lamp_color': asset.lamp_color
                })
            }

            switch (configChannelPoint.type) {
                case 'alert':
                    if(!asset) {
                        if(event.broadcasterName !== event.userName) {
                            await this.bot.whisper(event.userName, 'Deine Kanalpunkte wurden dir zurück gegeben weil ein Fehler aufgetreten ist.')
                        }

                        logWarn(`channel point denied for ${event.userName} because asset is invalid configured!`)
                        await event.updateStatus('CANCELED')
                        return
                    }

                    break
                case 'keystrokes':
                    const keyStrokes = configChannelPoint.key_strokes

                    for(const keyStroke of keyStrokes) {
                        const subKeyStrokes = keyStroke.split(',')
                        const websocketServer = getWebsocketServer()

                        websocketServer.send('trigger_keyboard', {'name': configChannelPoint.label, 'keys': subKeyStrokes})
                    }

                    break
                case 'scene':
                    if(!await triggerScene(configChannelPoint.trigger)) {
                        if(event.broadcasterName !== event.userName) {
                            await this.bot.whisper(event.userName, 'Deine Kanalpunkte wurden dir zurück gegeben weil ein Fehler aufgetreten ist.')
                        }

                        logWarn(`channel point denied for ${event.userName} because scene was not found!`)
                        await event.updateStatus('CANCELED')
                        return
                    }
                    break
            }

            logRegular(`channel point redeemed by ${event.userName}: ${event.rewardTitle} ${event.input}`)

            if(configChannelPoint.auto_accept) {
                await event.updateStatus('FULFILLED')
                return
            }

            await sleep(this.eventCooldown * 1000)

            removeEventFromCooldown(eventUuid, this.name, event.broadcasterName)
            return
        }

        for(const channelPoint of this.channelPoints) {
            if(channelPoint.getTitle() !== event.rewardTitle) continue

            isValid = true
            break
        }

        if(!isValid) return

        addEventToCooldown(eventUuid, this.name, event.broadcasterName)

        for(const channelPoint of this.channelPoints) {
            try {
                await channelPoint.handleChannelPoint(event)
            } catch (error) {
                if(event.broadcasterName !== event.userName) {
                    await this.bot.whisper(event.userName, 'Deine Kanalpunkte wurden dir zurück gegeben weil ein Fehler aufgetreten ist.')
                }

                logError(`channel point denied for ${event.userName} because of a exception:`)
                logError(JSON.stringify(error, Object.getOwnPropertyNames(error)))
                await event.updateStatus('CANCELED')
                return
            }
        }

        await sleep(this.eventCooldown * 1000)

        removeEventFromCooldown(eventUuid, this.name, event.broadcasterName)
    }
}