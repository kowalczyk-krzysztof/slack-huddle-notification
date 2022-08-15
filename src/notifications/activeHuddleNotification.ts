import { app } from '..';
import { HuddleDocument, HuddleInfo } from '../lib';

// TODO: Replace this and logic related to this with real database
const db = new Map<string, HuddleDocument>();
export const userDb = new Map<string, boolean>();

const sendNotifications = async (huddle: HuddleDocument) => {
  await Promise.all(
    Array.from(userDb).map(async ([key, value]: [string, boolean]) => {
      if (!huddle.members?.includes(key) && value) {
        await app.client.chat.postMessage({
          channel: key,
          text: `Huddle has started`,
        });
      }
    })
  ).then(() => {
    db.set(huddle.call_id, { ...huddle, notificationSent: true });
  });
};

export const activeHuddleNotification = async (activeHuddle?: HuddleInfo) => {
  if (activeHuddle) {
    const { call_id, active_members } = activeHuddle;
    const huddle = db.get(call_id);
    if (huddle && !huddle.notificationSent) sendNotifications(huddle);
    else if (!huddle) {
      db.set(call_id, {
        call_id,
        members: active_members,
        notificationSent: false,
        hasEnded: false,
      });
      sendNotifications(db.get(call_id) as HuddleDocument);
    }
  }
};
