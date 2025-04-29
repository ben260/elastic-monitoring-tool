'use client';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from './Pagination';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SelectGroup } from '@radix-ui/react-select';
import { Label } from '@/components/ui/label';
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
import { findChanges, generatePutWatcherRequest } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WatcherGetWatchResponse } from '../../../node_modules/@elastic/elasticsearch/lib/api/types';
import { Change, DataStreamTableItem, Priority, TabEntry } from '../types';
import { priorities } from '../constants';
import { ClipboardCopyIcon } from 'lucide-react';
interface DataStreamTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  highWatcher: WatcherGetWatchResponse;
  mediumWatcher: WatcherGetWatchResponse;
  lowWatcher: WatcherGetWatchResponse;
}

export function DataStreamTable<TData extends DataStreamTableItem, TValue>({
  columns,
  data,
  highWatcher,
  mediumWatcher,
  lowWatcher,
}: DataStreamTableProps<TData, TValue>) {
  const currentPriorityMap = new Map<string, Priority>(
    new Map(data.map((item) => [item.name, item.priority])),
  );

  const [updatedPriorityMap, setUpdatedPriorityMap] =
    useState<Map<string, Priority>>(currentPriorityMap);

  const [highWatcherChangesMap, setHighWatcherChangesMap] = useState<
    Map<string, Change>
  >(new Map());
  const [mediumWatcherChangesMap, setMediumWatcherChangesMap] = useState<
    Map<string, Change>
  >(new Map());
  const [lowWatcherChangesMap, setLowWatcherChangesMap] = useState<
    Map<string, Change>
  >(new Map());

  const [sorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    meta: {
      updatePriority(id: string, priority: Priority) {
        //Update data stream priority and calculate new changes
        setUpdatedPriorityMap(new Map(updatedPriorityMap.set(id, priority)));
        this.updateWatcherChanges();
      },
      updateWatcherChanges() {
        setHighWatcherChangesMap(
          findChanges(
            new Map(
              highWatcher.watch?.input.search?.request.indices?.map((item) => [
                item,
                'High',
              ]),
            ),
            new Map(
              Array.from(updatedPriorityMap.entries()).filter(
                ([, priority]) => priority === 'High',
              ),
            ),
          ),
        );

        setMediumWatcherChangesMap(
          findChanges(
            new Map(
              mediumWatcher.watch?.input.search?.request.indices?.map(
                (item) => [item, 'Medium'],
              ),
            ),
            new Map(
              Array.from(updatedPriorityMap.entries()).filter(
                ([, priority]) => priority === 'Medium',
              ),
            ),
          ),
        );

        setLowWatcherChangesMap(
          findChanges(
            new Map(
              lowWatcher.watch?.input.search?.request.indices?.map((item) => [
                item,
                'Low',
              ]),
            ),
            new Map(
              Array.from(updatedPriorityMap.entries()).filter(
                ([, priority]) => priority === 'Low',
              ),
            ),
          ),
        );
      },
    },
  });

  return (
    <div>
      <div className='flex items-center py-4'>
        <Input
          placeholder='Name'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />

        <div className='mx-3 flex items-center space-x-2'>
          <Label htmlFor='terms'>Priority</Label>
          <Select
            onValueChange={(value) => {
              table
                .getColumn('priority')
                ?.setFilterValue(value === 'All' ? '' : value);
              setUpdatedPriorityMap(new Map(currentPriorityMap)); //reset updates in progress.
              table.options.meta?.updateWatcherChanges();
            }}
          >
            <SelectTrigger className='mx-2 w-[180px]'>
              <SelectValue placeholder='All' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter Priority</SelectLabel>
                <SelectItem value='All'>All</SelectItem>
                {priorities.map((priority) => {
                  return (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className='mx-2'
                variant='outline'
                disabled={
                  highWatcherChangesMap.size == 0 &&
                  mediumWatcherChangesMap.size == 0 &&
                  lowWatcherChangesMap.size == 0
                }
              >
                View Updates
              </Button>
            </DialogTrigger>
            <DialogContent className='flex h-screen max-w-96 min-w-96 flex-col justify-start overflow-auto'>
              <DialogHeader>
                <DialogTitle>Updated Watcher Config</DialogTitle>
                <DialogDescription>View changes</DialogDescription>
              </DialogHeader>
              <div className='flex w-full'>
                <Tabs defaultValue='High' className='w-full'>
                  <TabsList className='top-0 grid w-full grid-cols-3'>
                    <TabsTrigger value='High'>High</TabsTrigger>
                    <TabsTrigger value='Medium'>Medium</TabsTrigger>
                    <TabsTrigger value='Low'>Low</TabsTrigger>
                  </TabsList>
                  {(
                    [
                      ['High', highWatcherChangesMap, highWatcher],
                      ['Medium', mediumWatcherChangesMap, mediumWatcher],
                      ['Low', lowWatcherChangesMap, lowWatcher],
                    ] as TabEntry
                  ).map(([priority, changesMap, watcher]) => {
                    return (
                      <TabsContent key={priority} value={priority as string}>
                        {changesMap.size == 0 ? (
                          <div>No changes</div>
                        ) : (
                          <div>
                            <h1>Updates</h1>
                            <div className='max-h-60 overflow-auto'>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className='w-[100px]'>
                                      Name
                                    </TableHead>
                                    <TableHead className='text-right'>
                                      Change
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Array.from(changesMap.entries()).map(
                                    ([key, change]) => (
                                      <TableRow
                                        key={key}
                                        className={
                                          change === '+'
                                            ? 'bg-green-100 hover:bg-green-100'
                                            : change === '-'
                                              ? 'bg-red-100 hover:bg-red-100'
                                              : ''
                                        }
                                      >
                                        <TableCell className='font-medium'>
                                          {key}
                                        </TableCell>
                                        <TableCell className='text-right'>
                                          {change}
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            <h1>Updated Watcher</h1>
                            <div className='relative'>
                              <pre className='max-h-96 overflow-auto rounded bg-gray-100 p-4 font-mono text-sm whitespace-pre-wrap'>
                                <Button
                                  className='absolute top-2 right-5 p-2'
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      generatePutWatcherRequest(
                                        watcher,
                                        updatedPriorityMap,
                                      ),
                                    );
                                    toast('Copied to clipboard');
                                  }}
                                >
                                  <ClipboardCopyIcon size={40} />
                                </Button>
                                {generatePutWatcherRequest(
                                  watcher,
                                  updatedPriorityMap,
                                )}{' '}
                              </pre>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
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
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='my-3'>
        <DataTablePagination table={table}></DataTablePagination>
      </div>
    </div>
  );
}
