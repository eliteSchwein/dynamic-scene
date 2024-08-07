import BaseMessage from "./BaseMessage";
import {removeEventFromQuery} from "../../../twitch/helper/CooldownHelper";

export default class ClearEventMessage extends BaseMessage {
    method = 'clear_event'

    async handle(data: any) {
        removeEventFromQuery(data['event-uuid'])
    }
}