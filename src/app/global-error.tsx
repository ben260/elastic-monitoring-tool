'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <div>{JSON.stringify(error)}</div>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
