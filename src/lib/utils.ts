import { Change, Priority } from '@/app/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WatcherGetWatchResponse } from '../../node_modules/@elastic/elasticsearch/lib/api/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Doc string
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
export function findAdded(
  map1: Map<string, Priority>, // original list
  map2: Map<string, Priority>, // updated list
): [string, Change][] {
  const added: [string, Change][] = [];
  map2.forEach((_, name) => {
    if (!map1.has(name)) {
      added.push([name, '+']);
    }
  });
  return added;
}

/**
 * Doc string
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
export function findRemoved(
  map1: Map<string, Priority>,
  map2: Map<string, Priority>,
): [string, Change][] {
  const removed: [string, Change][] = [];
  map1.forEach((_, name) => {
    if (!map2.has(name)) {
      removed.push([name, '-']);
    }
  });
  return removed;
}

/**
 * Doc string
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
export function findChanges(
  map1: Map<string, Priority>,
  map2: Map<string, Priority>,
): Map<string, Change> {
  return new Map([...findAdded(map1, map2), ...findRemoved(map1, map2)]);
}

/**
 * Doc string
 * @param names - An array of data stream names
 * @returns A promise that resolves to an array of priority objects.
 */
export function generatePutWatcherRequest(
  watcher: WatcherGetWatchResponse,
  updatedPriorityMap: Map<string, Priority>,
): string {
  const indices = Array.from(updatedPriorityMap.entries())
    .filter(([, priority]) => priority === 'Medium')
    .map(([index]) => index);

  const updatedWatcher = {
    ...watcher.watch,
    input: {
      search: {
        request: {
          ...watcher.watch?.input.search?.request,
          indices,
        },
      },
    },
  };
  return `PUT _watcher/watch/${watcher._id}\n${JSON.stringify(updatedWatcher, null, 1)}`;
}

// edge case turn pages needs to reset changes??????


export function add(x:number,y:number){return x+y}