import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { nanoid } from 'nanoid';
import { Form, Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { ForwardLink, useReturnNavigationOptions } from '@briandlee/remix-return-navigation';
import { OptionsCookieData, setOptionsCookieData } from '~/session.server';

interface LoaderData {
  next: string;
}

function generateJunk(): [string, number, string] {
  const num = Math.round(Math.random() * 1000);
  const [start, end] = ['a'.charCodeAt(0), 'z'.charCodeAt(0)];
  const char = String.fromCharCode(start + Math.round(Math.random() * (end - start)));

  return [char, num, nanoid(8)];
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const updatedOptions = Object.fromEntries(formData.entries()) as Partial<OptionsCookieData>;

  if (
    typeof updatedOptions.clientSideReturnLocationStorage !== 'string' ||
    !['locationState', 'searchParam'].includes(updatedOptions.clientSideReturnLocationStorage)
  ) {
    throw json('invalid clientSideReturnLocationStorage', { status: 400 });
  }

  if (typeof updatedOptions.defaultReturnLocationSearchParam !== 'string') {
    throw json('invalid defaultReturnLocationSearchParam: not a string', { status: 400 });
  }

  if (updatedOptions.defaultReturnLocationSearchParam.trim().length === 0) {
    throw json('invalid defaultReturnLocationSearchParam: cannot be empty', { status: 400 });
  }

  if (typeof updatedOptions.defaultReturnLocationStateKey !== 'string') {
    throw json('invalid defaultReturnLocationStateKey: not a string', { status: 400 });
  }

  if (updatedOptions.defaultReturnLocationStateKey.trim().length === 0) {
    throw json('invalid defaultReturnLocationStateKey: cannot be empty', { status: 400 });
  }

  const options: OptionsCookieData = {
    clientSideReturnLocationStorage: updatedOptions.clientSideReturnLocationStorage,
    defaultReturnLocationSearchParam: updatedOptions.defaultReturnLocationSearchParam.trim(),
    defaultReturnLocationStateKey: updatedOptions.defaultReturnLocationStateKey.trim(),
    shouldUseNavigateOnHydrate: !!updatedOptions.shouldUseNavigateOnHydrate,
  };

  return json(
    { options },
    {
      headers: {
        'Set-Cookie': await setOptionsCookieData(request, options),
      },
    }
  );
};

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
  const options = useReturnNavigationOptions();

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
        <ForwardLink className={'target'} to={'target'} state={{ color: 'blue' }}>
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
      <hr />
      <Form method="post">
        <h3>Return Navigation Options</h3>
        <div>Client-side Return Location Storage Mechanism:</div>
        <div>
          <label>
            <input
              type="radio"
              name="clientSideReturnLocationStorage"
              value="locationState"
              defaultChecked={options.clientSideReturnLocationStorage === 'locationState'}
            />
            In location state
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="clientSideReturnLocationStorage"
              value="searchParam"
              defaultChecked={options.clientSideReturnLocationStorage === 'searchParam'}
            />
            In the URL
          </label>
        </div>
        <div>
          <label>
            Use Back Navigation When Available:
            <input
              type="checkbox"
              name="shouldUseNavigateOnHydrate"
              defaultChecked={options.shouldUseNavigateOnHydrate}
            />
          </label>
        </div>
        <div>
          <label>
            Default Search Parameter:
            <input
              name="defaultReturnLocationSearchParam"
              defaultValue={options.defaultReturnLocationSearchParam}
            />
          </label>
        </div>
        <div>
          <label>
            Default State Key:
            <input
              name="defaultReturnLocationStateKey"
              defaultValue={options.defaultReturnLocationStateKey}
            />
          </label>
        </div>
        <div>
          <button type="submit">Update</button>
        </div>
      </Form>
    </div>
  );
}
