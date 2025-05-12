'use client';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Priority } from '../types';
import { WatcherGetWatchResponse } from '@elastic/elasticsearch/lib/api/types';
import dynamic from 'next/dynamic';
import { formatDate } from '@/lib/utils';

type WatcherCardProps = {
  watch: WatcherGetWatchResponse;
  priority: Priority;
};

export default function WatcherCard(props: WatcherCardProps) {
  const DynamicReactJson = dynamic(() => import('react-json-view'), {
    ssr: false,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          key={props.watch._id}
          className='@container/card flex-1 cursor-pointer'
        >
          <CardHeader className='relative'>
            <CardDescription>
              {props.watch._id}{' '}
              {props.watch.status?.state.active ? (
                <span
                  className='mx-2 inline-block h-3 w-3 rounded-full bg-green-500'
                  aria-label='Active'
                ></span>
              ) : (
                <span
                  className='mx-2 inline-block h-3 w-3 rounded-full bg-red-500'
                  aria-label='Inactive'
                ></span>
              )}
            </CardDescription>
            <CardTitle>{props.priority}</CardTitle>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1 text-sm'>
            <div>
              Condition last met:{' '}
              {props.watch.status?.last_met_condition
                ? formatDate(new Date(props.watch.status?.last_met_condition))
                : 'Unknown'}
            </div>
            <div>
              Last checked:{' '}
              {props.watch.status?.last_checked
                ? formatDate(new Date(props.watch.status?.last_checked))
                : 'Unknown'}
            </div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>View watcher object</DialogDescription>
        </DialogHeader>
        <div className='flex max-h-96 items-center space-x-2 overflow-y-auto'>
          <DynamicReactJson
            src={props.watch}
            name={false}
            collapsed={1}
            enableClipboard={true}
            displayDataTypes={false}
            style={{
              backgroundColor: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
            }}
          />
        </div>
        <DialogFooter className='sm:justify-start'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
