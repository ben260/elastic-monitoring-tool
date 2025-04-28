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
import { DataStreamTableItem } from './page';
import { findAdded, findRemoved } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type Priority = 'High' | 'Medium' | 'Low' | 'Unset';
export type Change = '+' | '-';

// remove colours?
export const priorities: { label: string; value: Priority; colour: string }[] =
  [
    //{ label: "All", value: "All", colour: "text-gray-700" },
    { label: 'High', value: 'High', colour: 'text-orange-600' },
    { label: 'Medium', value: 'Medium', colour: 'text-yellow-600' },
    { label: 'Low', value: 'Low', colour: 'text-green-600' },
    { label: 'Unset', value: 'Unset', colour: 'text-green-600' },
  ];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  highWatcherIndices: string[];
  mediumWatcherIndices: string[];
  lowWatcherIndices: string[];
}

export function DataTable<TData extends DataStreamTableItem, TValue>({
  columns,
  data,
  highWatcherIndices,
  mediumWatcherIndices,
  lowWatcherIndices,
}: DataTableProps<TData, TValue>) {
  const currentPriorityMap = new Map<string, Priority>(
    new Map(data.map((item) => [item.name, item.priority])),
  );

  //const updatedPriorityMap = new Map(currentPriorityMap);
  const [updatedPriorityMap, setUpdatedPriorityMap] =
    useState<Map<string, Priority>>(currentPriorityMap);
  //const highWatcherChangesMap = new Map<string, Change>();
  //const mediumWatcherChangesMap = new Map<string, Change>();
  //const lowWatcherChangesMap = new Map<string, Change>();

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
        //updatedPriorityMap.set(id, priority);

        //console.log(updatedPriorityMap);
        setUpdatedPriorityMap(new Map(updatedPriorityMap.set(id, priority)));
        this.updateWatcherChanges();
        // combine these functions if they do the same thing?
      },
      updateWatcherChanges() {
        // update high watcher changes
        const highAdded = findAdded(
          new Map(highWatcherIndices.map((item) => [item, 'High'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'High',
            ),
          ),
        );
        const highRemoved = findRemoved(
          new Map(highWatcherIndices.map((item) => [item, 'High'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'High',
            ),
          ),
        );

        // [...highAdded, ...highRemoved].map(([key, change]) => highWatcherChangesMap.set(key, change));
        setHighWatcherChangesMap(new Map([...highAdded, ...highRemoved]));

        // update medium watcher changes
        const mediumAdded = findAdded(
          new Map(mediumWatcherIndices.map((item) => [item, 'Medium'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'Medium',
            ),
          ),
        );
        const mediumRemoved = findRemoved(
          new Map(mediumWatcherIndices.map((item) => [item, 'Medium'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'Medium',
            ),
          ),
        );
        setMediumWatcherChangesMap(new Map([...mediumAdded, ...mediumRemoved]));

        // [...mediumAdded, ...mediumRemoved].map(([key, change]) => mediumWatcherChangesMap.set(key, change));
        // update low watcher changes
        const lowAdded = findAdded(
          new Map(lowWatcherIndices.map((item) => [item, 'Low'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'Low',
            ),
          ),
        );
        const lowRemoved = findRemoved(
          new Map(lowWatcherIndices.map((item) => [item, 'Low'])),
          new Map(
            Array.from(updatedPriorityMap.entries()).filter(
              ([, priority]) => priority === 'Low',
            ),
          ),
        );
        //[...lowAdded, ...lowRemoved].map(([key, change]) => setLowWatcherChangesMap(new Map(prevMap).set(key, change)));

        setLowWatcherChangesMap(new Map([...lowAdded, ...lowRemoved]));
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
            onValueChange={(value) =>
              table
                .getColumn('priority')
                ?.setFilterValue(value === 'All' ? '' : value)
            }
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
                  highWatcherChangesMap.size == 0 ||
                  mediumWatcherChangesMap.size == 0 ||
                  lowWatcherChangesMap.size == 0
                }
              >
                View Updates
              </Button>
            </DialogTrigger>
            <DialogContent className='h-screen min-w-fit'>
              <DialogHeader>
                <DialogTitle>Updated Watcher Config</DialogTitle>
                <DialogDescription>View changes</DialogDescription>
              </DialogHeader>
              <div className='w-full'>
                <Tabs defaultValue='high' className='w-full'>
                  <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='high'>High</TabsTrigger>
                    <TabsTrigger value='medium'>Medium</TabsTrigger>
                    <TabsTrigger value='low'>Low</TabsTrigger>
                  </TabsList>
                  <TabsContent value='high'>
                    <table className='min-w-full border-collapse'>
                      <thead>
                        <tr className='bg-gray-200'>
                          <th className='border px-4 py-2'>Key</th>
                          <th className='border px-4 py-2'>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(highWatcherChangesMap.entries()).map(
                          ([key, change]) => (
                            <tr
                              key={key}
                              className={
                                change === '+'
                                  ? 'bg-green-100'
                                  : change === '-'
                                    ? 'bg-red-100'
                                    : ''
                              }
                            >
                              <td className='border px-4 py-2'>{key}</td>
                              <td className='border px-4 py-2'>{change}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    Data streams for updated watcher
                    {Array.from(updatedPriorityMap.entries()).filter(
                      ([, priority]) => priority === 'High',
                    )}
                  </TabsContent>
                  <TabsContent value='medium'>
                    <table className='min-w-full border-collapse'>
                      <thead>
                        <tr className='bg-gray-200'>
                          <th className='border px-4 py-2'>Key</th>
                          <th className='border px-4 py-2'>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(mediumWatcherChangesMap.entries()).map(
                          ([key, change]) => (
                            <tr
                              key={key}
                              className={
                                change === '+'
                                  ? 'bg-green-100'
                                  : change === '-'
                                    ? 'bg-red-100'
                                    : ''
                              }
                            >
                              <td className='border px-4 py-2'>{key}</td>
                              <td className='border px-4 py-2'>{change}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    Data streams for updated watcher
                    {Array.from(updatedPriorityMap.entries()).filter(
                      ([, priority]) => priority === 'Medium',
                    )}
                  </TabsContent>
                  <TabsContent value='low'>
                    <table className='min-w-full border-collapse'>
                      <thead>
                        <tr className='bg-gray-200'>
                          <th className='border px-4 py-2'>Key</th>
                          <th className='border px-4 py-2'>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(lowWatcherChangesMap.entries()).map(
                          ([key, change]) => (
                            <tr
                              key={key}
                              className={
                                change === '+'
                                  ? 'bg-green-100'
                                  : change === '-'
                                    ? 'bg-red-100'
                                    : ''
                              }
                            >
                              <td className='border px-4 py-2'>{key}</td>
                              <td className='border px-4 py-2'>{change}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                    Data streams for updated watcher
                    {Array.from(updatedPriorityMap.entries()).filter(
                      ([, priority]) => priority === 'Low',
                    )}
                  </TabsContent>
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
