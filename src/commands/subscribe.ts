import { AckFn, RespondArguments, SlashCommand } from '@slack/bolt'
import { app } from '..'
import { User } from '../db/models/user'
import { SubscribeEvent } from '../lib/types'

export const subscribe = async (command: SlashCommand, ack: AckFn<string | RespondArguments>, type: SubscribeEvent) => {
  await ack()
  const isSubEvent = type === SubscribeEvent.SUBSCRIBE
  const { user_id } = command
  await User.findOneAndUpdate({ user_id }, { isSubscribing: isSubEvent }, { upsert: true })
  await app.client.chat.postMessage({
    channel: user_id,
    text: isSubEvent
      ? `Succesfully subscribed to Huddle notifications. Use ${SubscribeEvent.UNSUBSCRIBE} to unsubscribe.`
      : `Succesfully unsubscribed from Huddle notifications. Use ${SubscribeEvent.SUBSCRIBE} to subscribe again.`,
  })
}
