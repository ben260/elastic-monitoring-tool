import { AgentResponse, AgentTableItem, Priority } from '../types';
import { AgentTable } from './Table';
import { columns } from './columns';
import { WatcherGetWatchResponse } from '../../../node_modules/@elastic/elasticsearch/lib/api/types';
import client from '@/lib/elastic';
import {
  QueryDslQueryContainer,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

export default async function Page(): Promise<React.ReactNode> {
  let data: AgentTableItem[];
  let highWatcher: WatcherGetWatchResponse;
  let mediumWatcher: WatcherGetWatchResponse;
  let lowWatcher: WatcherGetWatchResponse;
  let highWatcherTerms: string[] | undefined;
  let mediumWatcherTerms: string[] | undefined;
  let lowWatcherTerms: string[] | undefined;

  try {
    if (!client) return [];
    highWatcher = await client.watcher.getWatch({
      id: process.env.HIGH_AGENT_WATCHER_ID ?? '',
    });
    mediumWatcher = await client.watcher.getWatch({
      id: process.env.MEDIUM_AGENT_WATCHER_ID ?? '',
    });
    lowWatcher = await client.watcher.getWatch({
      id: process.env.LOW_AGENT_WATCHER_ID ?? '',
    });

    const highWatcherQuery: QueryDslQueryContainer =
      highWatcher.watch?.input.search?.request.body?.query ?? {};
    if (!Array.isArray(highWatcherQuery.bool?.filter)) throw new Error('Error');

    const mediumWatcherQuery: QueryDslQueryContainer =
      mediumWatcher.watch?.input.search?.request.body?.query ?? {};
    if (!Array.isArray(mediumWatcherQuery.bool?.filter))
      throw new Error('Error');

    const lowWatcherQuery: QueryDslQueryContainer =
      lowWatcher.watch?.input.search?.request.body?.query ?? {};
    if (!Array.isArray(lowWatcherQuery.bool?.filter)) throw new Error('Error');

    const result: SearchResponse = await client.search({
      index: '.metrics-endpoint.metadata_united_default',
      size: parseInt(process.env.AGENT_QUERY_SIZE ?? '1000', 10),
      query: {
        bool: {
          must_not: [
            {
              term: {
                'united.agent.policy_id': {
                  value: process.env.EXCLUDE_POLICY_ID ?? '',
                },
              },
            },
          ],
        },
      },
    });

    if (
      !Array.isArray(
        highWatcher.watch?.input.search?.request.body?.query.bool?.filter,
      ) ||
      !Array.isArray(
        mediumWatcher.watch?.input.search?.request.body?.query.bool?.filter,
      ) ||
      !Array.isArray(
        lowWatcher.watch?.input.search?.request.body?.query.bool?.filter,
      )
    ) {
      throw new Error('Invalid watcher configuration.');
    }

    highWatcherTerms =
      highWatcher.watch.input.search.request.body.query.bool.filter.find(
        (f): f is { terms: Record<string, string[]> } =>
          typeof f === 'object' &&
          f !== null &&
          'terms' in f &&
          typeof f.terms === 'object',
      )?.terms?.['host.name'];

    mediumWatcherTerms =
      mediumWatcher.watch.input.search.request.body.query.bool.filter.find(
        (f): f is { terms: Record<string, string[]> } =>
          typeof f === 'object' &&
          f !== null &&
          'terms' in f &&
          typeof f.terms === 'object',
      )?.terms?.['host.name'];

    lowWatcherTerms =
      lowWatcher.watch.input.search.request.body.query.bool.filter.find(
        (f): f is { terms: Record<string, string[]> } =>
          typeof f === 'object' &&
          f !== null &&
          'terms' in f &&
          typeof f.terms === 'object',
      )?.terms?.['host.name'];

    if (!highWatcherTerms || !mediumWatcherTerms || !lowWatcherTerms) {
      throw new Error('error');
    }
    const agents: AgentResponse[] = result.hits.hits.map((hit) => {
      return hit as AgentResponse;
    });

    data = agents.map((agent) => {
      let priority: Priority;

      // Find data stream priority.

      switch (true) {
        case highWatcherTerms?.includes(
          agent._source.united.agent.local_metadata.host.hostname,
        ):
          priority = 'High';
          break;
        case mediumWatcherTerms?.includes(
          agent._source.united.agent.local_metadata.host.hostname,
        ):
          priority = 'Medium';
          break;
        case lowWatcherTerms?.includes(
          agent._source.united.agent.local_metadata.host.hostname,
        ):
          priority = 'Low';
          break;
        default:
          priority = 'Unset';
      }

      return { ...agent, priority: priority, colour: 'blue' };
    });
  } catch (error) {
    console.log(error);
    throw new Error('There was an error getting the agents');
  }

  return (
    <div className='container mx-auto py-5'>
      <div className='space-y-4'>
        <h4 className='text-sm leading-none font-medium'>Agents</h4>
        <p className='text-muted-foreground text-sm'>
          View and set the priorities for Agents
        </p>
      </div>
      <AgentTable
        columns={columns}
        data={data}
        highWatcher={highWatcher}
        mediumWatcher={mediumWatcher}
        lowWatcher={lowWatcher}
        highWatcherTerms={highWatcherTerms}
        mediumWatcherTerms={mediumWatcherTerms}
        lowWatcherTerms={lowWatcherTerms}
      ></AgentTable>
    </div>
  );
}
