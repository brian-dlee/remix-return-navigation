import type { LoaderFunction } from '@remix-run/node';
import { nanoid } from 'nanoid';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { ForwardLink } from '@briandlee/remix-return-navigation';

interface LoaderData {
  next: string;
}

function generateJunk(): [string, number, string] {
  const num = Math.round(Math.random() * 1000);
  const [start, end] = ['a'.charCodeAt(0), 'z'.charCodeAt(0)];
  const char = String.fromCharCode(start + Math.round(Math.random() * (end - start)));

  return [char, num, nanoid(8)];
}

export const loader: LoaderFunction = ({ request }) => {
  const next = ((url) => {
    const [char, num, hash] = generateJunk();
    url.searchParams.set(char, num.toString());
    url.hash = hash;
    return `${url.pathname}${url.search.toString()}${url.hash}`;
  })(new URL(request.url));

  return json<LoaderData>({ next });
};

export default function Index() {
  const { next } = useLoaderData<LoaderData>();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Return Navigation Example: Home</h1>
      <p>
        <strong>First</strong> use the following link to simulate navigation and cause some location
        mutations
      </p>
      <p>
        <Link to={next}>Simulate Navigation</Link>
      </p>
      <p>
        <strong>Next</strong> navigate to the target page to view the results
      </p>
      <p>
        <ForwardLink className={'target'} to={'target'}>
          Go to target page
        </ForwardLink>
      </p>
      <p>
        Repeat the process with and without Javascript enabled. Use the link below to reset your
        location state.
      </p>
      <p>
        <Link to={'.'}>Reset</Link>
      </p>
    </div>
  );
}
