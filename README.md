# EvoCoffee

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

## Running the app locally

1. Add an `.env` file in the root directory and fill it according to `template.env`
2. `npm run dev` to compile `.ts` files in watch mode
3. `npm start`

## TODO: Explain how to create a bot account
