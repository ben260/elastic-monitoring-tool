import { Change, Priority } from '@/app/data-streams/Table';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//const high_datastreams_watcher = high;
// check all of the datastream watchers to see...

// build map of the data streams returned by the queries in each watcher.
// for each data stream check which watcher it maps to, if any.
// return a map of data streams : priority which can then be mapped further before
// added to the table.

// env variables for index patterns to check to add and take away from watcher searches?

/**
 * Determines the priority level of each data stream by checking the high, medium
 * and low watchers.
 *
 * More info goes here
 *
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
/*export async function getDataStreamPriorites(names : string[] ) : Promise<Priority[]> {
  
  //const highWatcherQuery = high.watch.input.search;
  //const test = await client.indices.getDataStream();
 // const test = await client.search({index:highWatcherQuery.request.indices,query:highWatcherQuery.request.body.query});
  //console.log(test.hits);
  return names.map((name)=> "High");
}*/

export type WatcherStats = {
  id: string;
};

/**
 * Determines the priority level of each data stream by checking the high, medium
 * and low watchers.
 *
 * More info goes here
 *
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
/*export async function getWatcherStats(id:string) : Promise<WatcherStats>{
  return {id:""}
}

export async function getDataStreamsInWatcher(){

}*/

export function findAdded(
  map1: Map<string, Priority>, // original list
  map2: Map<string, Priority>, // updated list
): [string, Change][] {
  const added: [string, Change][] = [];
  map2.forEach((priority, name) => {
    if (!map1.has(name)) {
      added.push([name, '+']);
    }
  });

  return added;
}

export function findRemoved(
  map1: Map<string, Priority>,
  map2: Map<string, Priority>,
): [string, Change][] {
  const removed: [string, Change][] = [];
  map1.forEach((priority, name) => {
    if (!map2.has(name)) {
      removed.push([name, '-']);
    }
  });

  return removed;
}
