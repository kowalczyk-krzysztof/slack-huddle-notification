import { AckFn, RespondArguments, SlashCommand } from '@slack/bolt';
import { app } from '..';
import { User } from '../db/models';
import { SubscribeEvent } from '../lib';

export const subscribe = async (
  command: SlashCommand,
  ack: AckFn<string | RespondArguments>,
  type: SubscribeEvent
) => {
  await ack();
  const isSubEvent = type === SubscribeEvent.SUBSCRIBE;
  const { user_id } = command;
  const user = await User.findOne({ user_id });

  if (user) {
    user.isSubscribing = isSubEvent;
    await user.save();
  } else await User.create({ user_id, isSubscribing: isSubEvent });

  await app.client.chat.postMessage({
    channel: user_id,
    text: isSubEvent
      ? 'Succesfully subscribed to Huddle notifications. Use `/evounsub` to unsubscribe.'
      : 'Succesfully unsubscribed from Huddle notifications. Use `/evosub` to subscribe again.',
  });
};
