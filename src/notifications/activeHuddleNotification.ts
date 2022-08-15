import { app } from '..';
import { HuddleDocument, HuddleInfo } from '../lib';

// TODO: Replace this and logic realted to this with real database
const db = new Map<string, HuddleDocument>();
export const userDb = new Map<string, boolean>();

// TODO: Make this happen on first iteration
const sendNotifications = async (huddle: HuddleDocument) => {
  userDb.forEach(async (value, key) => {
    // Only send to people who are not in huddle already
    if (!huddle.members?.includes(key) && value) {
      await app.client.chat.postMessage({
        channel: key,
        text: `Huddle has started`,
      });
    }
  });
  // TODO: Promise all this
  db.set(huddle.call_id, { ...huddle, notificationSent: true });
};

export const activeHuddleNotification = async (activeHuddle?: HuddleInfo) => {
  if (activeHuddle) {
    const { call_id, active_members } = activeHuddle;
    const huddle = db.get(call_id);
    if (huddle) {
      if (!huddle.notificationSent) sendNotifications(huddle);
    } else
      db.set(call_id, {
        call_id,
        members: active_members,
        notificationSent: false,
        hasEnded: false,
      });
  }
};
