import {
  getReturnNavigationState,
  ReturnNavigationContextProvider,
} from '@briandlee/remix-return-navigation';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import { RootLoaderData } from '~/loaders/root';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Return Navigation Demo',
  viewport: 'width=device-width,initial-scale=1',
});

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
