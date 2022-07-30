import type { LoaderFunction } from '@remix-run/node';
import type { URLData } from '@briandlee/remix-return-navigation';
import { json } from '@remix-run/node';
import { Link, useLoaderData, useLocation } from '@remix-run/react';
import { withURLData, useReturnNavigation } from '@briandlee/remix-return-navigation';

type LoaderData = URLData;

export const loader: LoaderFunction = ({ request }) => {
  return json<LoaderData>(withURLData(request), 200);
};

export default function () {
  const {
    url: { referrer },
  }: LoaderData = useLoaderData<LoaderData>();
  const location = useLocation();
  const source = useReturnNavigation(location, referrer);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Return Navigation Example: Target</h1>
      <p><strong>Referrer:</strong> {referrer || 'n/a'}</p>
      <p><strong>Location State:</strong></p>
      <pre style={{ fontFamily: 'monospace', fontSize: 12 }}>
        {JSON.stringify(location.state, null, 2)}
      </pre>
      <hr />
      <p>Using the content extracted (shown above) the return link is generated.</p>
      <p>
        If you see "Start Over" that means you got to this page without any information that could return you. 
        You can cause this by focusing the address bar and hitting enter. This is essentially what would happen if you
        navigated here all on your own or if someone shared a link with you. Otherwise you should see a "Return" link below
        that will send you back to the link you came from.
      </p>
      {source ? <Link to={source}>Return</Link> : <Link to={'./..'}>Start Over</Link>}
    </div>
  );
}
