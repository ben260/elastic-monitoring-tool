import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex flex-col space-y-6 p-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-48' />
        <div className='flex space-x-4'>
          <Skeleton className='h-8 w-8 rounded-full' />
          <Skeleton className='h-8 w-24' />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-32 w-full rounded-xl' />
        ))}
      </div>

      <div className='space-y-2'>
        <Skeleton className='h-6 w-40' />
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className='h-10 w-full rounded-md' />
          ))}
        </div>
      </div>
    </div>
  );
}
