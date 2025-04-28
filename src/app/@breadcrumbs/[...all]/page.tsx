import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';
import type { ReactElement } from 'react';

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ all: string[] }>;
}) {
  const resolvedParams = await params;
  const breadcrumbItems: ReactElement[] = [];
  let breadcrumbPage: ReactElement = <></>;

  resolvedParams.all.map((param, i) => {
    if (i === resolvedParams.all.length - 1) {
      breadcrumbPage = (
        <BreadcrumbItem>
          <BreadcrumbPage className='capitalize'>{param}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    } else {
      breadcrumbItems.push(
        <React.Fragment key={`/${param}`}>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${param}`} className='capitalize'>
              {param}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>,
      );
    }
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href='/'>Elastic Monitoring Tool</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {breadcrumbItems.length == 1 ? (
          <>
            {breadcrumbItems[0]}
            <BreadcrumbSeparator />
            {breadcrumbItems[1]}
          </>
        ) : (
          <></>
        )}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
