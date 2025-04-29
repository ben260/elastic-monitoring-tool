import { Change, Priority } from '@/app/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WatcherGetWatchResponse } from '../../node_modules/@elastic/elasticsearch/lib/api/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Finds which items were added in the updated list compared to the original.
 * @param {string[]} list1 - The original list.
 * @param {string[]} list2 - The updated list.
 * @returns An array of tuples representing added items and a '+' change.
 */
export function findAdded(
  list1: string[], // original list
  list2: string[], // updated list
): [string, Change][] {
  const added: [string, Change][] = [];
  list2.map((name) => {
    if (!list1.includes(name)) {
      added.push([name, '+']);
    }
  });
  return added;
}

/**
 * Finds which items were removed in the updated list compared to the original.
 * @param {string[]} list1 - The original list.
 * @param {string[]} list2 - The updated list.
 * @returns An array of tuples representing added items and a '+' change.
 */
export function findRemoved(
  list1: string[],
  list2: string[],
): [string, Change][] {
  const removed: [string, Change][] = [];
  list1.map((name) => {
    if (!list2.includes(name)) {
      removed.push([name, '-']);
    }
  });
  return removed;
}

/**
 * Compares two lists of items and returns a map of changes.
 * Identifies added and removed items based on the difference between the original and updated lists.
 * @param {string[]} list1 - The original list of items.
 * @param {string[]} list2 - The updated list of items.
 * @returns A Map where each key is the item name and the value is a Change ('+' for added, '-' for removed).
 */
export function findChanges(
  list1: string[],
  list2: string[],
): Map<string, Change> {
  return new Map([...findAdded(list1, list2), ...findRemoved(list1, list2)]);
}

/**
 * Generates a PUT watcher request string for updated data stream watches.
 * @param {WatcherGetWatchResponse} watcher - The original watcher object.
 * @param {Map<string, Priority>} updatedPriorityMap - A map of data stream names to their assigned priority levels.
 * @returns {string} A formatted string to update the watcher via Elasticsearch's `_watcher/watch` endpoint.
 */
export function generateDataStreamPutWatcherRequest(
  priorityLevel: string,
  watcher: WatcherGetWatchResponse,
  updatedPriorityMap: Map<string, Priority>,
): string {
  const indices = Array.from(updatedPriorityMap.entries())
    .filter(([, priority]) => priority === priorityLevel)
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
