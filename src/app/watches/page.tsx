import client from '@/lib/elastic';
import WatcherCard from './WatcherCard';

export type WatcherCardDetails = {
  name: string;
  active: boolean;
  conditionLastMet: Date;
  lastChecked: Date;
};

export default async function Page() {
  let dsHigh;
  // let dsMedium;
  // let dsLow;

  try {
    // Data Stream Watches
    if (!client) {
      return <></>;
    }
    dsHigh = await client.watcher.getWatch({
      id: process.env.HIGH_DATASTREAM_WATCHER_ID ?? '',
    });
    //dsMedium = await client.watcher.getWatch({ id: process.env.MEDIUM_DATASTREAM_WATCHER_ID ?? "" });
    // dsLow = await client.watcher.getWatch({ id: process.env.LOW_DATASTREAM_WATCHER_ID ?? "" });
    // agent watches
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
      {JSON.stringify(dsHigh)}
      <div className='flex justify-evenly gap-4'>
        <WatcherCard
          name={dsHigh._id}
          priority={'High'}
          conditionLastMet={
            dsHigh.status?.last_met_condition?.toString() ?? 'Unknown'
          }
          active={false}
        ></WatcherCard>
      </div>
      <div className='my-3 px-4 md:px-6'>
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>
          Data Stream Watches
        </h2>
      </div>
      <div className='flex justify-evenly gap-4'></div>
    </>
  );
}
