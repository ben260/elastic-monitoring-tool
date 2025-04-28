'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { priorities, Priority } from './Table';
import { DataStreamTableItem } from './page';
import dynamic from 'next/dynamic';

/*export type DataStream = {
    name: string;
    priority: string;
    status: ReactNode;
    full: any;
}*/

export const columns: ColumnDef<DataStreamTableItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return row.original.colour;
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row, table }) => {
      return (
        <>
          <Select
            onValueChange={(value) => {
              table.options.meta!.updatePriority(
                row.original.name,
                value as Priority,
              );
              console.log('ive changed a value');
            }}
          >
            <SelectTrigger
              className='h-8 w-40'
              id={`${row.original.name}-reviewer`}
            >
              <SelectValue placeholder={row.original.priority} />
            </SelectTrigger>
            <SelectContent align='end'>
              {priorities.map((priority) => {
                return (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const DynamicReactJson = dynamic(() => import('react-json-view'), {
        ssr: false,
      });
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <DialogTrigger asChild>
                  <div>View JSON</div>
                </DialogTrigger>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle>{row.original.name}</DialogTitle>
              <DialogDescription>View data stream object</DialogDescription>
            </DialogHeader>
            <div className='flex items-center space-x-2'>
              <div className='grid max-h-96 flex-1 gap-2 overflow-y-auto'>
                <DynamicReactJson
                  src={row.original ?? { fallback: 'fallback' }}
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
    },
  },
];
