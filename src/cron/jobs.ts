import { CronJob } from 'cron';
import { fetchHuddlesInfo } from '../lib';

export const huddleCron = new CronJob('*/10 * * * * *', async () => {
  const data = await fetchHuddlesInfo();
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
