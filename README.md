# Slack Huddle Notification

# ⚠️Slack now has implemented built-in notifications when someone starts a huddle in a channel. ⚠️

## How this app works

Slack `public API` doesn't expose any information about huddles.

There is an undocumented API endpoint (`https://edgeapi.slack.com/cache/{TEAM_ID}/huddles/info`) returning info about ongoing huddles but it requires `user token` for authorization. Bot accounts are not permitted to access this endpoint, so instead the app pretends to be an actual user by using a real user token for authorization.

### How to get an user token and authenticate?

1. Log in to Slack in browser to the desired workspace
2. Open network tab and look for requests to `edgeapi.slack.com`
3. Choose a request and check `request payload` for `token` - the value of token will start with `xoxc-`
4. Set env variable `SLACK_USER_TOKEN` to the value of the token
5. From the same request, check the `cookie` tab and copy either the whole cookie or only the needed keys - `d` and `x`
6. Set env variable `COOKIE` to the value you get in previous step. The variable should look like this:

```
COOKIE="d=xoxd-%2BmcyU%2BLTIRdfKO%2BmMboAB9weYlV%2BrzLkXRqrZXTnXzUGzLIBAkyRfcUURrNw8VLXZk7tFHVPa%2BwjIHULIepheLJL65mA3YXXeo9wxRD37Mn8c%2By1VcyWvdBdFoy8m%2B0FZ7X19vSRj534xjv2c0ya9jufd7f8sf7dfy7dsfyd7ffd7fydf%3D;   x=enod5kiefgfgfd5mgioqfv8s2.1660519318;"
```

### How to get `TEAM_ID` and `CHANNEL_ID`?

There are many ways to do that but I believe this is the simplest one:

1. Log in to Slack in browser to the desired workspace
2. Open console
3. Join a huddle in the channel of your choice
4. You should see a log of ongoing events, look for a line that looks like this

```
11:02:47.700 Aug-15 11:02:47.700 [HUDDLES] (T03T0K10A2W) sh_room_join, channelId: C03T0K143RQ, participants: 1
```

5. `channelId` is your `CHANNEL_ID` and the value in brackets (but without them) `(T03T0K10A2W)` is `TEAM_ID`. Example:

```
CHANNEL_ID=C03T0K143RQ
TEAM_ID=T03T0K10A2W
```

## Creating a bot account (dev environment)

1. Go to [Slack Apps page](https://api.slack.com/apps?new_app)
2. Click `Create New App` button and select `From an app manifest`
3. Select a workspace - if you don't see your desired workspace, click `Sign into a different workspace` and sign in
4. Click `Next` and paste the contents of `manifest.yml` found in the root directory in this repository into the `YAML` textarea
5. Review the changes if you wish and click `Create`
6. In the `Basic Information` tab, scroll down to `App-Level Tokens` - this is needed for `Socket Mode` funcionality, which you'll be using in development
7. Click `Generate Token and Scopes`. Name the token however you want then click `Add scope` and select `connections:write` and then click `Generate`
8. You'll see your token, write it down - it will be used as value for `SLACK_APP_TOKEN` env variable
9. Scroll up to `App Credentials` section and reveal the `Signing Secret` value - it will be used as `SLACK_SIGNING_SECRET` env variable
10. Scroll up to `Install your app`, click it then click `Install to Workspace` button and then click `Allow`
11. You'll be shown your `Bot User OAuth Token` - the value is used for `SLACK_BOT_TOKEN` env variable. If lost, you can access it from `Install App` or `OAuth & Permissions` pages
12. Inside `Slack app` go to a channel of your choice then and go to options
13. Go to `Integrations` tab and in the `Apps` section click `Add an App` and select your app.

## Running the app locally

1. Add an `.env` file in the root directory and fill it according to `template.env`
2. Run your local MongoDB and fill the `MONGO_CONNECTION_STRING` env variable

```
MONGO_CONNECTION_STRING=mongodb://localhost:27017/{database_name}
```

Or connect to a remote database

3. `npm install`
4. `npm run dev` to compile `.ts` files in watch mode
5. `npm start`
