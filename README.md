<h1 align="center">Elastic Monitoring Tool</h1>
<p align="center"><em>Avoid silent data failures. Set up and manage Elastic Watches to monitor unresponsive Elasticsearch Agents and Data Streams with this fast, simple, self-hosted web tool.</em></p>
<br>

![Demo](/datastreamspage.png 'Demo')

<br>
<p align="center">
  
  This lightweight, self-hosted utility built with Next.js helps you quickly spot and manage unresponsive Elasticsearch Agents and Data Streams, so you don’t miss important issues. It uses Elastic Watches, prioritising alerts into Low, Medium, and High levels to help prevent alert fatigue. The interactive tables make managing alerts simple, and the tool automatically creates ready-to-use Watcher API requests to speed up updates in Kibana’s Dev Tools Console. This way, setting up and maintaining monitoring at scale is more efficient and less error-prone.
  
</p>

## Features

<ul>
  <li>
    <strong>Monitors Elasticsearch Data Streams and Agents using Elastic Watches.</strong><br>
    <em>Stay informed about the health of your data sources to avoid unexpected data loss.</em>
  </li>
  <li>
    <strong>Categorises watches into three priority levels: High, Medium, Low</strong><br>
    <em>Helps you focus on the most critical issues first and reduces alert fatigue by organising alerts by severity.</em>
  </li>
  <li>
    <strong>Provides an intuitive, interactive web UI</strong><br>
    <em>Makes it easy to view, edit, and manage alert setups without needing to keep track of the watches manually.</em>
  </li>
  <li>
    <strong>Automatically generates updated Elasticsearch Watcher API requests when priorities are changed</strong><br>
    <em>Saves time and eliminates errors by providing ready-to-use API requests for quick updates via Kibana’s Dev Tools Console.</em>
  </li>
  
</ul>

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

If this tool saves you time or you have ideas for improvement, let me know!

⭐ Star this repo to support it

🐛 Submit issues and feature requests [here](https://github.com/ben260/elastic-monitoring-tool/issues)

📬 Reach out: benharris146@gmail.com
