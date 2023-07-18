<p>
  <a href="https://www.tinybird.co/join-our-slack-community"><img alt="Slack Status" src="https://img.shields.io/badge/slack-chat-1FCC83?style=flat&logo=slack"></a>
</p>

# Signatures POC

 This repository is dedicated to generating dummy data and a sample dashboard that mirrors a company that manages digital document signatures in real-time. This tool is particularly useful for testing and development purposes.

 ![screenshot of Signatures Dashboard](https://github.com/tinybirdco/signatures-POC/assets/4650739/6187241a-b811-42fa-99f2-4d2d17e9aa81)

## Setup

### Requirements

* Node.js < v. 18
* Python < v. 3.8

1. Setup your Tinybird account

Click this button to deploy the data project to Tinybird 👇

[![Deploy to Tinybird](https://cdn.tinybird.co/button)](https://ui.tinybird.co/workspaces/new?name=signatures_poc)

Follow the guided process, and your Tinybird workspace is now ready to start receiving events.

2. Setup this repository locally

```bash
git clone https://github.com/tinybirdco/signatures-POC.git
cd signatures-POC
```

3. Install dependencies

```bash
npm install
```

4. Setup Tinybird CLI

The install script above will automatically install and configure the `tinybird-cli` for this project.

Choose your region: 1 for `us-east`, 2 for `eu`. A new `.tinyb` file will be created.tb

Go to [https://ui.tinybird.co/tokens](https://ui.tinybird.co/tokens) and copy the token with admin rights.

⚠️Warning! The Admin token, the one you copied following this guide, is your admin token. Don't share it or publish it in your application. You can manage your tokens via API or using the Auth Tokens section in the UI. More detailed info at [Auth Tokens management](https://www.tinybird.co/docs/api-reference/token-api.html)

This script will also push the data project to your Tinybird workspace.

5. Start generating data!

In the terminal, run the following command:

```bash
npm run seed
```

Go to your [Tinybird workspace](https://ui.tinybird.co) and check the data is flowing.

6. Setup the `organizations` materialized view

Go to the `all_unique_organizations` pipe in your Tinybird workspace and click the dropdown carrot button next to "Create API Endpoint, and select "Create Materialized View". This will create the `organizations` materialized view data source in your workspace.

7. Copy the environment variables to .env

Locally, be sure to paste the admin token from Step 3 into the `.env` file.

8. Run the Dashboard locally

```bash
npm run dev
```

9. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### License

This project is licensed under the MIT License.

### Need help?

&bull; [Community Slack](https://www.tinybird.co/join-our-slack-community) &bull; [Tinybird Docs](https://docs.tinybird.co/) &bull;

## Authors

* [Joe Karlsson](https://github.com/joekarlsson)
