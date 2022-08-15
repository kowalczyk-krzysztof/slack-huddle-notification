import { App } from '@slack/bolt';
import { config } from 'dotenv';
import { huddleCron } from './cron';

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

(async () => {
  await app.start();
  console.log(`EvoCoffee is running on port: ${process.env.PORT}`);
  huddleCron.start();
  console.log(`Huddle CRON started ${Date.now()}`);
})();
