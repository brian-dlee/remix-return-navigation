# remix-return-navigation

Create smooth return navigation with Remix. This library retains all existing state within a URL, promotes the
use of native web practices for navigation, and makes return navigation easy to implement for both clients with and
without Javascript enabled.

## Getting started

```shell
npm i --save @briandlee/remix-return-navigation
```

## View the Demo

The live demo is available at https://remix-return-navigation.vercel.app/.

The code for the demo is in the [demo directory](demo.)

### Return the current URL from your loader

> Note: If you don't do this, it will only work when Javascript is enabled

```typescript
import type { LoaderFunction } from "@remix-run/node";
import { json } from '@remix-run/node'
import { URLData, withURLData } from "@briandlee/remix-return-navigation";

interface User {
  id: number;
  displayName: string;
}

interface LoaderData extends URLData {
  user: User;
}

const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>(withURLData(request, { user: await getUser(request) }));
}
```

### Add source to your internal `Link`s state

```typescript jsx
import { Link } from '@remix-run/react'
import { useCurrentLocation } from "@briandlee/remix-return-navigation";

export default function () {
  const { url: { current }, user } = useLoaderData<LoaderData>();
  const source = useCurrentLocation(current);

  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <Link to={"target"} state={{ source }}>Go</Link>
    </div>
  )
}
```

### Return the referrer from your loader

```typescript
import type { LoaderFunction } from "@remix-run/node";
import { json } from '@remix-run/node'
import { URLData, withURLData } from "@briandlee/remix-return-navigation";

interface User {
  id: number;
  displayName: string;
}

interface LoaderData extends URLData {
  user: User;
}

const loader: LoaderFunction = async ({request}) => {
  return json<LoaderData>(withURLData(request, { user: await getUser(request) }));
}
```


### Use the referrer and location state to compute the return link

```typescript jsx
import { Link } from '@remix-run/react'
import { useReturnLocation } from "@briandlee/remix-return-navigation";

export default function () {
  const { url: { referrer }, user } = useLoaderData<LoaderData>();
  const source = useReturnLocation(referrer);

  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <Link to={source}>Return</Link>
    </div>
  )
}
```

## Related issues

Works around a known issue: https://github.com/remix-run/remix/issues/3510
