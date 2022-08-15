import { App } from '@slack/bolt';
import { config } from 'dotenv';
import axios from 'axios';

config();

const isDev = process.env.ENV === 'DEV';

type HuddleInfo = {
  readonly channel_id: string;
  readonly call_id: string;
  readonly active_members: ReadonlyArray<string> | null;
  readonly dropped_members: ReadonlyArray<string> | null;
};

type HuddleAPIResponse = {
  readonly ok: boolean;
  readonly error?: string;
  readonly huddles?: ReadonlyArray<HuddleInfo>;
};

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: isDev,
  appToken: process.env.SLACK_APP_TOKEN,
  port: (process.env.PORT as unknown as number) || 8080,
  developerMode: isDev,
});

app.event('user_huddle_changed', async () => {
  const { data }: { data: HuddleAPIResponse } = await axios.post(
    `https://edgeapi.slack.com/cache/${process.env.TEAM_ID}/huddles/info`,
    {
      channel_ids: [process.env.CHANNEL_ID],
      token: process.env.SLACK_USER_TOKEN,
    },
    {
      // TODO: Figure out which part of cookie is needed
      headers: {
        Cookie: process.env.COOKIE as string,
      },
    }
  );
  if (data.ok) {
    const isHuddleActive = data?.huddles?.some(
      (c) => c.channel_id === process.env.CHANNEL_ID && c.active_members
    );
    // TODO: Notify users
    console.log(isHuddleActive);
  } else {
    console.log(data.error);
  }
});

(async () => {
  await app.start();
  console.log(`EvoCoffee is running on port: ${process.env.PORT}`);
})();
