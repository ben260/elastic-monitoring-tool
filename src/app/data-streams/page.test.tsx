import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from './page';
import { describe, it } from 'node:test';
import { ReactNode } from 'react';

describe('Page', () => {
  it('renders a heading called "Data Streams"', async () => {
    const pageContent: ReactNode = (await Page()) ?? <></>;
    render(pageContent);

    const heading = await screen.findByRole('heading', {
      name: 'Data Streams',
      level: 1,
    });

    expect(heading).toBeInTheDocument();
  });
});
