import client from '@/lib/elastic';
import { DataTable, Priority } from './Table';
import { ReactNode } from 'react';
import {
  IndicesGetDataStreamResponse,
  IndicesDataStream,
} from '../../../node_modules/@elastic/elasticsearch/lib/api/types';
import { columns } from './columns';

export type DataStreamTableItem = IndicesDataStream & {
  priority: Priority;
  colour: ReactNode;
};

// .metrics-endpoint.metadata_united_default/_search

export default async function Page(): Promise<React.ReactNode> {
  let data: DataStreamTableItem[];
  let highWatcherIndices: string[];
  let mediumWatcherIndices: string[];
  let lowWatcherIndices: string[];
  try {
    const dataStreams: IndicesGetDataStreamResponse =
      await client.indices.getDataStream({ name: '*' });

    highWatcherIndices =
      (
        await client.watcher.getWatch({
          id: process.env.HIGH_DATASTREAM_WATCHER_ID ?? '',
        })
      ).watch?.input.search?.request.indices ?? [];
    mediumWatcherIndices =
      (
        await client.watcher.getWatch({
          id: process.env.MEDIUM_DATASTREAM_WATCHER_ID ?? '',
        })
      ).watch?.input.search?.request.indices ?? [];
    lowWatcherIndices =
      (
        await client.watcher.getWatch({
          id: process.env.LOW_DATASTREAM_WATCHER_ID ?? '',
        })
      ).watch?.input.search?.request.indices ?? [];

    data = dataStreams.data_streams.map((stream) => {
      let colour: ReactNode = <></>;
      let priority: Priority;

      switch (stream.status) {
        case 'GREEN':
          colour = (
            <span
              className='inline-block h-3 w-3 rounded-full bg-green-500'
              aria-label='Healthy'
            ></span>
          );
          break;
        case 'YELLOW':
          colour = (
            <span
              className='inline-block h-3 w-3 rounded-full bg-yellow-400'
              aria-label='Warning'
            ></span>
          );

          break;
        case 'RED':
          colour = (
            <span
              className='inline-block h-3 w-3 rounded-full bg-red-500'
              aria-label='Critical'
            ></span>
          );
          break;
        default:
          colour = (
            <span
              className='inline-block h-3 w-3 rounded-full bg-gray-500'
              aria-label='Unknown'
            ></span>
          );
          break;
      }

      switch (true) {
        case highWatcherIndices.includes(stream.name):
          priority = 'High';
          break;
        case mediumWatcherIndices.includes(stream.name):
          priority = 'Medium';
          break;
        case lowWatcherIndices.includes(stream.name):
          priority = 'Low';
          break;
        default:
          priority = 'Unset';
      }

      return { ...stream, priority: priority, colour: colour };
    });
  } catch (error) {
    console.log(error);
    throw new Error('There was an error getting the data streams');
  }

  return (
    <div className='container mx-auto py-5'>
      <div className='space-y-4'>
        <h4 className='text-sm leading-none font-medium'>Data Streams</h4>
        <p className='text-muted-foreground text-sm'>
          View and set the priorities for data streams
        </p>
      </div>
      <DataTable
        data={data}
        columns={columns}
        highWatcherIndices={highWatcherIndices}
        mediumWatcherIndices={mediumWatcherIndices}
        lowWatcherIndices={lowWatcherIndices}
      />
    </div>
  );
}
