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

type WatcherCardProps = {
  name: string;
  priority: Priority;
  conditionLastMet: string;
  active: boolean;
};

// TODO - ADD OPEN IN KIBANA BUTTON
export default function WatcherCard(props: WatcherCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card
          key={props.name}
          className='@container/card flex-1 cursor-pointer'
        >
          <CardHeader className='relative'>
            <CardDescription>{props.name}</CardDescription>
            <CardTitle> {props.active}</CardTitle>
          </CardHeader>
          <CardFooter className='flex-col items-start gap-1 text-sm'>
            <div>Condition last met: {props.conditionLastMet}</div>

            <div>Last checked: TODO</div>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>View watcher object</DialogDescription>
        </DialogHeader>
        <div className='flex max-h-96 items-center space-x-2 overflow-y-auto'></div>
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
