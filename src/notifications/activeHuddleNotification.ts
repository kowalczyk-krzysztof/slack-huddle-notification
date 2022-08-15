import { HydratedDocument } from 'mongoose';
import { app } from '..';
import { Huddle, User } from '../db/models';
import { HuddleDocument, HuddleInfo } from '../lib';

const sendNotifications = async (huddle: HydratedDocument<HuddleDocument>) => {
  const users = await User.find({ isSubscribing: true });
  await Promise.all(
    users.map(async ({ user_id, isSubscribing }) => {
      if (!huddle.members?.includes(user_id) && isSubscribing) {
        await app.client.chat.postMessage({
          channel: user_id,
          text: `A Huddle has just started!`,
        });
      }
    })
  ).then(async () => {
    huddle.notificationSent = true;
    await huddle.save();
  });
};

export const activeHuddleNotification = async (activeHuddle?: HuddleInfo) => {
  if (!activeHuddle) return;
  const { call_id, active_members } = activeHuddle;
  const huddle = await Huddle.findOne({ call_id });
  if (huddle && !huddle.notificationSent) sendNotifications(huddle);
  else if (!huddle)
    sendNotifications(
      await Huddle.create({
        call_id,
        members: active_members,
        notificationSent: false,
      })
    );
};
