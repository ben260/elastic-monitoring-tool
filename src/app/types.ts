import { RowData } from '@tanstack/react-table';
import { ReactNode } from 'react';
import {
  IndicesDataStream,
  WatcherGetWatchResponse,
} from '../../node_modules/@elastic/elasticsearch/lib/api/types';
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    _?: TData;
    updatePriority: (id: string, priority: Priority) => void;
    updateWatcherChanges: () => void;
  }
}

export type Priority = 'High' | 'Medium' | 'Low' | 'Unset';
export type Change = '+' | '-';

export type DataStreamTableItem = IndicesDataStream & {
  priority: Priority;
  colour: ReactNode;
};

export type TabEntry = [string, Map<string, Change>, WatcherGetWatchResponse][];
