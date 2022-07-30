# remix-return-navigation

Create smooth return navigation with Remix. This libraries retains all existing state within a URL, promotes the
use of native web practices for navigation, back navigation with fully working solutions with or without 
Javascript enabled.

## Getting started

```shell
npm i --save @briandlee/remix-return-navigation
```

### Return the referrer from your loader

```typescript
import type { LoaderFunction } from "@remix-run/node";
import { json } from '@remix-run/node'
import { ReferrerData, withReferrerData } from "@brian-dlee/remix-return-navigation";

interface User {
  id: number;
  displayName: string;
}

interface LoaderData extends ReferrerData {
  user: User;
}

const loader: LoaderFunction = async ({request}) => {
  return json<LoaderData>(withReferrerData(request, {user: await getUser(request)}));
}
```

### Add source reference## to your internal `Link`s

```typescript jsx
import { Link } from '@remix-run/react'

export default function () {
  const { referrer, user } = useLoaderData<LoaderData>();
  const location = useLocation()
  
  return (
    <div>
      <h1>Hello, {user.displayName}</h1>
      <Link to={"next-page"} state={{ source: referrer }}
    </div>
  )
}
```