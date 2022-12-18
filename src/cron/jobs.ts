import { CronJob } from 'cron'
import { apiErrorHandler, fetchHuddlesInfo } from '../lib/api'
import { HuddleInfo } from '../lib/types'

import { activeHuddleNotification } from '../notifications/activeHuddleNotification'

const isActiveHuddleInChosenChannel = (c: HuddleInfo) => c.channel_id === process.env.CHANNEL_ID && c.active_members

export const huddleCron = new CronJob('*/10 * * * * *', async () => {
  const data = await fetchHuddlesInfo()
  const huddle = data?.huddles?.find(isActiveHuddleInChosenChannel)
  if (data.ok && huddle) activeHuddleNotification(huddle)
  if (data?.error) apiErrorHandler(data?.error)
})
