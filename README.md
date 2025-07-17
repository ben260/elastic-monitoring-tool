# Elastic Monitoring Tool - Set up alerts for unresponsive Elasticsearch Agents and Data Streams

**Elastic Monitoring Tool** is a lightweight utility to help you set up Elastic Watches for detecting unresponsive Elasticsearch Agents and Data Streams.

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

If you don't have git installed then you can download a ZIP file from this repository.

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
