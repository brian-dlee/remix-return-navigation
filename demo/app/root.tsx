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
import { getOptionsCookieData } from './session.server';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Return Navigation Demo',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const state = getReturnNavigationState(request);
  const options = await getOptionsCookieData(request);

  return json<RootLoaderData>({ referrer: state.referrer, requestUrl: state.requestUrl, options });
};

export default function App() {
  const { referrer, requestUrl, options } = useLoaderData<RootLoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ReturnNavigationContextProvider
          referrer={referrer}
          requestUrl={requestUrl}
          clientSideReturnLocationStorage={
            options.clientSideReturnLocationStorage as 'searchParam' | 'locationState' | undefined
          }
          defaultReturnLocationSearchParam={options.defaultReturnLocationSearchParam}
          defaultReturnLocationStateKey={options.defaultReturnLocationStateKey}
          useNavigateOnHydrate={options.useNavigateOnHydrate}
        >
          <Outlet />
        </ReturnNavigationContextProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
