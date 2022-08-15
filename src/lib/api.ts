import axios from 'axios';
import { HuddleAPIResponse } from './types';

export const fetchHuddlesInfo = async () => {
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
  return data;
};
