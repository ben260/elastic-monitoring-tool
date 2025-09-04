import client from '@/lib/elastic';
import WatcherCard from './WatcherCard';
import { WatcherGetWatchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Priority } from '../types';

export type WatcherCardDetails = {
  name: string;
  active: boolean;
  conditionLastMet: Date;
  lastChecked: Date;
};
export const dynamic = 'force-dynamic';
export default async function Page() {
  let dsHigh: WatcherGetWatchResponse;
  let dsMedium: WatcherGetWatchResponse;
  let dsLow: WatcherGetWatchResponse;
  let aHigh: WatcherGetWatchResponse;
  let aMedium: WatcherGetWatchResponse;
  let aLow: WatcherGetWatchResponse;

  try {
    if (!client) {
      return <></>;
    }
    // Data stream watches
    dsHigh = await client.watcher.getWatch({
      id: process.env.HIGH_DATASTREAM_WATCHER_ID ?? '',
    });
    dsMedium = await client.watcher.getWatch({
      id: process.env.MEDIUM_DATASTREAM_WATCHER_ID ?? '',
    });
    dsLow = await client.watcher.getWatch({
      id: process.env.LOW_DATASTREAM_WATCHER_ID ?? '',
    });
    // Agent watches
    aHigh = await client.watcher.getWatch({
      id: process.env.HIGH_AGENT_WATCHER_ID ?? '',
    });
    aMedium = await client.watcher.getWatch({
      id: process.env.MEDIUM_AGENT_WATCHER_ID ?? '',
    });
    aLow = await client.watcher.getWatch({
      id: process.env.LOW_AGENT_WATCHER_ID ?? '',
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error getting watches');
  }

  return (
    <>
      <div className='px-4 md:px-6'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Agent Watches
        </h2>
      </div>

      <div className='flex justify-evenly gap-4'>
        {[
          ...new Map([
            [aHigh, 'High'],
            [aMedium, 'Medium'],
            [aLow, 'Low'],
          ]).entries(),
        ].map(([agent, priority]) => (
          <WatcherCard
            key={agent._id}
            watch={agent}
            priority={priority as Priority}
          />
        ))}
      </div>
      <div className='my-3 px-4 md:px-6'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Data Stream Watches
        </h2>
      </div>
      <div className='flex justify-evenly gap-4'>
        {[
          ...new Map([
            [dsHigh, 'High'],
            [dsMedium, 'Medium'],
            [dsLow, 'Low'],
          ]).entries(),
        ].map(([ds, priority]) => (
          <WatcherCard
            key={ds._id}
            priority={priority as Priority}
            watch={ds}
          />
        ))}
      </div>
    </>
  );
}
