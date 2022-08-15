import { App } from '@slack/bolt';
import { config } from 'dotenv';
import { huddleCron } from './cron';
import { userDb } from './notifications';

config();

const isDev = process.env.ENV === 'DEV';

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: isDev,
  appToken: process.env.SLACK_APP_TOKEN,
  port: (process.env.PORT as unknown as number) || 8080,
  developerMode: isDev,
});

// For some reason commands need to be in the same file as app
app.command('/evosub', async ({ command, ack }) => {
  await ack();
  const { user_id } = command;
  userDb.set(user_id, true);
  await app.client.chat.postMessage({
    channel: user_id,
    text: 'Succesfully subscribed to Huddle notifications. Use `/evounsub` to unsubscribe.',
  });
});

app.command('/evunosub', async ({ command, ack }) => {
  await ack();
  const { user_id } = command;
  userDb.set(user_id, false);
  await app.client.chat.postMessage({
    channel: user_id,
    text: 'Succesfully unsubscribed from Huddle notifications. Use `/evosub` to subscribe again.',
  });
});

(async () => {
  await app.start();
  console.log(`EvoCoffee is running on port: ${process.env.PORT}`);
  huddleCron.start();
  console.log(`Huddle CRON started ${Date.now()}`);
})();
