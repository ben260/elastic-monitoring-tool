import { Client } from '@elastic/elasticsearch';

const client: Client | null = process.env.CI
  ? null
  : new Client({
      node: process.env.ELASTIC_NODE,
      auth: {
        apiKey: process.env.API_KEY || '',
      },
    });

export default client;
