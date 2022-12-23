# remix-return-navigation

Create smooth return navigation with Remix. This library retains all existing state within a URL, promotes the
use of native web practices for navigation, and makes return navigation easy to implement for both clients with and
without Javascript enabled.

## Getting started

```shell
npm i --save @briandlee/remix-return-navigation
```

## View the Demo

The live demo is available at https://remix-return-navigation.brian-dlee.dev/.

The code for the demo is in the [demo directory](demo).

### Install the `ReturnNavigationContext`

Installing the context allows the application to encapsulate the server provided
referrer as we as listening for client-side navigations. The context must be installed so
that the `returnLocation` will be computed and available to `ForwardLink` components.

```typescript jsx
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  getReturnNavigationState,
  ReturnNavigationContextProvider,
} from '@briandlee/remix-return-navigation';

export const loader: LoaderFunction = async ({ request }) => {
  const state = getReturnNavigationState(request);

  return json<RootLoaderData>({ referrer: state.referrer });
};

export default function App() {
  const { referrer } = useLoaderData<RootLoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ReturnNavigationContextProvider referrer={referrer}>
          <Outlet />
        </ReturnNavigationContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Using `ForwardLink`

Add a `ForwardLink` to automatically add a return location to a link.

> _Note: `ForwardLink` wraps `Link` from `@remix-run/react`. It only adds the current location as a search param to enable return navigation._

```typescript jsx
import { ForwardLink } from '@briandlee/remix-return-navigation';

export default function SourcePage() {
  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <ForwardLink to={'target'}>Go</ForwardLink>
    </div>
  );
}
```

### Using `BackwardLink`

Add a `BackwardLink` to add a link to return the user to the previous location.

> _Note: `BackwardLink` also wraps `Link` from `@remix-run/react`, but it does not accept `to` since it generates it from the current return location._

```typescript jsx
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { BackwardLink } from '@briandlee/remix-return-navigation';

export default function TargetPage() {
  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <BackwardLink fallback="/profile">Return</Link>
    </div>
  );
}
```

## Related issues

Works around a known issue: https://github.com/remix-run/remix/issues/3510

---

Created by [me](https://brian-dlee.dev/).
