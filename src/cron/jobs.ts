import { CronJob } from 'cron';
import { apiErrorHandler, fetchHuddlesInfo } from '../lib';
import { activeHuddleNotification } from '../notifications';

export const huddleCron = new CronJob('*/10 * * * * *', async () => {
  const data = await fetchHuddlesInfo();
  data.ok
    ? activeHuddleNotification(
        data?.huddles?.find(
          (c) => c.channel_id === process.env.CHANNEL_ID && c.active_members
        )
      )
    : apiErrorHandler(data?.error);
});
