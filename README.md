<h1 align="center">Elastic Monitoring Tool</h1>
<p align="center"><em>A self-hosted web tool for setting up and managing Elastic Watches to monitor unresponsive Elasticsearch Agents and Data Streams.</em></p>
<br>

![Demo](/datastreamspage.png 'Demo')

<br>
<p align="center">
  
A lightweight, self-hosted tool built with Next.js for identifying and managing unresponsive Elasticsearch Agents and Data Streams. It uses Elastic Watches with Low, Medium, and High priority levels to organise alerts and reduce noise. The interface provides interactive tables for reviewing alerts, and the tool generates Watcher API requests for use in Kibana’s Dev Tools Console.
  
</p>

## Features

<ul>
  <li>Monitors Elasticsearch Data Streams and Agents using Elastic Watches</li>
  <li>Assigns watches to three priority levels: High, Medium, Low</li>
  <li>Provides a web UI with interactive tables</li>
  <li>Generates Elasticsearch Watcher API requests when priorities are updated</li>
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

## Feedback

Submit issues and feature requests [here](https://github.com/ben260/elastic-monitoring-tool/issues)
