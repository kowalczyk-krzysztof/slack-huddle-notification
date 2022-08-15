import { App } from '@slack/bolt'
import { config } from 'dotenv'
import { subscribe } from './commands'
import { huddleCron } from './cron'
import { SubscribeEvent } from './lib'
import { connect } from 'mongoose'

config()

const isDev = process.env.ENV === 'DEV'

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: isDev,
  appToken: process.env.SLACK_APP_TOKEN,
  port: (process.env.PORT as unknown as number) || 8080,
  developerMode: isDev,
})

app.command(SubscribeEvent.SUBSCRIBE, async ({ command, ack }) => {
  await subscribe(command, ack, SubscribeEvent.SUBSCRIBE)
})

app.command(SubscribeEvent.UNSUBSCRIBE, async ({ command, ack }) => {
  await subscribe(command, ack, SubscribeEvent.UNSUBSCRIBE)
})

;(async () => {
  await app.start()
  console.log(`EvoCoffee is running on port: ${process.env.PORT}`)
  await connect(process.env.MONGO_CONNECTION_STRING as string)
  console.log(`MongoDB connected: ${new Date(Date.now()).toISOString()}`)
  huddleCron.start()
  console.log(`Huddle CRON started: ${new Date(Date.now()).toISOString()}`)
})()
