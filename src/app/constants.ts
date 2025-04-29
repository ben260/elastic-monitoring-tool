import { Priority } from './types';

export const priorities: { label: string; value: Priority }[] = [
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
  { label: 'Unset', value: 'Unset' },
];

/*
 {`PUT _watcher/watch/${highWatcher._id}
                      \n
                        
                     ${JSON.stringify({
                        ...highWatcher.watch,
                        input: {
                          search: {
                            request: {
                              ...highWatcher.watch?.input.search?.request,
                              indices: Array.from(updatedPriorityMap.entries()).filter(
                                ([, priority]) => priority === 'High',
                              ).map((item) => item[0])
                            }
                          }
                        }
                      })


                        }
            
                    `}

*/
