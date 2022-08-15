import { AckFn, RespondArguments, SlashCommand } from '@slack/bolt';
import { app } from '..';
import { SubscribeEvent } from '../lib';
import { userDb } from '../notifications';

export const subscribe = async (
  command: SlashCommand,
  ack: AckFn<string | RespondArguments>,
  type: SubscribeEvent
) => {
  await ack();
  const isSubEvent = type === SubscribeEvent.SUBSCRIBE;
  const { user_id } = command;
  userDb.set(user_id, isSubEvent ? true : false);
  await app.client.chat.postMessage({
    channel: user_id,
    text: isSubEvent
      ? 'Succesfully subscribed to Huddle notifications. Use `/evounsub` to unsubscribe.'
      : 'Succesfully unsubscribed from Huddle notifications. Use `/evosub` to subscribe again.',
  });
};
