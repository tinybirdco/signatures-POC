<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# Signatures POC

 This repository is dedicated to generating dummy data and a sample dashboard that mirrors a company that manages digital document signatures in real-time. This tool is particularly useful for testing and development purposes.

## Setup

### Requirements

* Node.js < v. 18
* Python < v. 3.8

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

This script will automatically install and configure the `tinybird-cli` for this project.

```bash
npm install
```

Choose your region: 1 for `us-east`, 2 for `eu`. A new `.tinyb` file will be created.tb

Go to [https://ui.tinybird.co/tokens](https://ui.tinybird.co/tokens) and copy the token with admin rights.

⚠️Warning! The Admin token, the one you copied following this guide, is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html)

This will also push the data project to your Tinybird workspace.

4. Start generating data!

In the terminal, run the following command:

```bash
npm run seed
```

Go to your [Tinybird workspace](https://ui.tinybird.co) and check the data is flowing.

5. Copy the environment variables to .env

Be sure to paste the token from Step 3 into the `.env` file.

```bash

1. Run the Dashboard locally

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### License

This project is licensed under the MIT License.

### Need help?

&bull; [Community Slack](https://www.tinybird.co/join-our-slack-community) &bull; [Tinybird Docs](https://docs.tinybird.co/) &bull;

## Authors

* [Joe Karlsson](https://github.com/joekarlsson)
