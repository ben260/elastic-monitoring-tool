
import { ReactNode } from 'react';
import {
  IndicesGetDataStreamResponse,
  WatcherGetWatchResponse,
} from '../../../node_modules/@elastic/elasticsearch/lib/api/types';
import { columns } from './columns';
import { DataStreamTableItem, Priority } from '../types';
import { DataStreamTable } from './Table';

export const dynamic = 'force-dynamic';
import client from '@/lib/elastic';

export default async function Page(): Promise<React.ReactNode> {
  let data: DataStreamTableItem[];
  let highWatcher: WatcherGetWatchResponse;
  let mediumWatcher: WatcherGetWatchResponse;
  let lowWatcher: WatcherGetWatchResponse;
  try {
    highWatcher = await client.watcher.getWatch({
      id: process.env.HIGH_DATASTREAM_WATCHER_ID ?? '',
    });
    mediumWatcher = await client.watcher.getWatch({
      id: process.env.MEDIUM_DATASTREAM_WATCHER_ID ?? '',
    });
    lowWatcher = await client.watcher.getWatch({
      id: process.env.LOW_DATASTREAM_WATCHER_ID ?? '',
    });

    const dataStreams: IndicesGetDataStreamResponse =
      await client.indices.getDataStream({ name: '*' });

    data = dataStreams.data_streams.map((stream) => {
      let colour: ReactNode = <></>;
      let priority: Priority;

      // Find data stream status
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

      // Find data stream priority.
      switch (true) {
        case highWatcher.watch?.input.search?.request.indices?.includes(
          stream.name,
        ):
          priority = 'High';
          break;
        case mediumWatcher.watch?.input.search?.request.indices?.includes(
          stream.name,
        ):
          priority = 'Medium';
          break;
        case lowWatcher.watch?.input.search?.request.indices?.includes(
          stream.name,
        ):
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
      <DataStreamTable
        data={data}
        columns={columns}
        highWatcher={highWatcher}
        mediumWatcher={mediumWatcher}
        lowWatcher={lowWatcher}
      />
    </div>
  );
}

