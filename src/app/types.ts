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
    resetChanges: () => void;
  }
}

export type Priority = 'High' | 'Medium' | 'Low' | 'Unset';
export type Change = '+' | '-';

export type DataStreamTableItem = IndicesDataStream & {
  priority: Priority;
  colour: ReactNode;
  name: string;
};

export type TabEntry = [string, Map<string, Change>, WatcherGetWatchResponse][];

export type AgentTableItem = AgentResponse & {
  colour: string;
  priority: string;
};

export type AgentResponse = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    united: {
      agent: {
        enrolled_at: string;
        policy_id: string;
        last_checkin_status: string;
        local_metadata: {
          os: {
            name: string;
          };
          host: {
            hostname: string;
          };
        };
        last_checkin: string;
      };
    };
  };
};
