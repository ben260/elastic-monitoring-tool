import { RowData } from '@tanstack/react-table';
import { Priority } from './data-streams/Table';

declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    _?: TData;
    updatePriority: (id: string, priority: Priority) => void;
    updateWatcherChanges: () => void;
    //updateWatcherChanges : (indices:string[],updatedPriorityMap : Map<string,Priority>) => void;
  }
}
