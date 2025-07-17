<h1 align="center">Elastic Monitoring Tool</h1>
<p align="center"><em>Set up alerts for unresponsive Elasticsearch Agents and Data Streams</em></p>
<br>

![Demo](/datastreamspage.png 'Demo')

<br>
<p align="center">Lightweight, self-hosted utility built with Next.js that helps you monitor unresponsive Elasticsearch Agents and Data Streams by setting up and managing Elastic Watches. It prioritizes alerts into Low, Medium, and High categories and provides interactive tables for viewing and managing your alert setups. The tool automatically generates ready-to-use Watcher API requests for easy alert updates via Kibana’s Dev Tools Console, making it simpler and faster to set up reliable monitoring for data sources at scale.</p>



## Features

- Monitors Elasticsearch Data Streams and Agents using Elastic [Watches](https://www.elastic.co/docs/explore-analyze/alerts-cases/watcher/how-watcher-works).
- Categorises watches into three priority levels:
  - High
  - Medium
  - Low
- Automatically generates updated **Elasticsearch Watcher API requests** when
  priorities are updated which are ready to use in **Kibana's Dev Tools Console**

## How to Use

1. Create High, Medium, and Low priority Watches for both Agents and Datastreams.
2. Make updates in the tables on the Agents and Datastreams pages then use the generated API requests to update Watches in the **Kibana's Dev Tools Console**
3. View watcher status and details using the Watches page.

## Setup

### Prerequisites

- Node.js ([Download Link](https://nodejs.org/en/download))

### Download the code

`git clone https://github.com/ben260/elastic-monitoring-tool.git`

### Install dependencies using the NPM package manager

`npm install`

### Configure the environment variables

Rename `.env.example` to `.env.local` and then configure the environment variables.

### Build the application

`npm run build`

This will create a production ready build of the application.

### Run the application

`npm run start`

The application should now be running at [http://localhost:3000](http://localhost:3000)

## 💬 Feedback & Contributions

If you find this tool useful or have ideas for improvement, I’d love to hear from you.

- Submit an issue or feature request [here](https://github.com/ben260/elastic-monitoring-tool/issues)
- Or reach out via email: benharris146@gmail.com

If this project helps you, please consider ⭐ starring the repo.

Contributions are welcome!
