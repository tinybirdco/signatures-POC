<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# Signturit POC

This repository is dedicated to generating dummy data that mirrors the schema and behavior of the Signaturit API. It is currently set up to stream data through the event API, but it can be easily reconfigured to utilize Kafka. This tool is particularly useful for testing and development purposes.

## Setup

To run the data generator, you'll need to have Node.js and npm installed on your computer. Then, follow these steps:

1. Setup your Tinybird account

Click this button to deploy the data project to Tinybird 👇

[![Deploy to Tinybird](https://cdn.tinybird.co/button)](https://ui.tinybird.co/workspaces/new?name=signaturit_poc)

Follow the guided process, and your Tinybird workspace is now ready to start receiving events.

2. Setup this repository locally

```bash
git clone https://github.com/tinybirdco/signaturit-poc.git
cd signaturit-poc
```

3. Install dependencies

```bash
npm install
```

4. Install and configure the Tinybird CLI

To start working with data projects as if they were software projects, First, install the Tinybird CLI in a virtual environment.
You'll need python3 installed.

Check the [Tinybird CLI documentation](https://docs.tinybird.co/cli.html) for other installation options and troubleshooting tips.

```bash
python3 -mvenv .e
. .e/bin/activate
pip install tinybird-cli
tb auth --interactive
```

Choose your region: 1 for `us-east`, 2 for `eu`. A new `.tinyb` file will be created.

Go to [https://ui.tinybird.co/tokens](https://ui.tinybird.co/tokens) and copy the token with admin rights into the `.env` file.

⚠️Warning! The Admin token, the one you copied following this guide, is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html)

1. Start generating data!

In the terminal, run the following command:

```bash
npm start
```

### License

This project is licensed under the MIT License.
