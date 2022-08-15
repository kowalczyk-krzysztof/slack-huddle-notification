import { app } from '..';
import { HuddleInfo } from '../lib';

export const activeHuddleNotification = async (activeHuddle?: HuddleInfo) => {
  // TODO: Notify users
  if (activeHuddle) {
    const { channel_id, call_id, active_members } = activeHuddle;
    await app.client.chat.postMessage({
      channel: process.env.CHANNEL_ID as string,
      text: `Huddle: {
        channel_id: ${channel_id}
        call_id: ${call_id}
        active_members: ${
          active_members ? active_members.map((m) => `${m},\n`) : 'none'
        }
    }`,
    });
  }
};
