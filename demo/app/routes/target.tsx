import { useReturnLocation, BackwardLink } from '@briandlee/remix-return-navigation';
import { Link } from '@remix-run/react';
import { useRootLoaderData } from '~/loaders/root';

export default function () {
  const { referrer } = useRootLoaderData();
  const returnLocation = useReturnLocation();

  console.log('return location in page', returnLocation);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Return Navigation Example: Target</h1>
      <p>
        The `referrer` header is extracted and returned by the Loader. Without Javascript enabled,
        this is the only value we can rely upon.
      </p>
      <p>
        <strong>Referrer:</strong>
      </p>
      <pre style={{ fontFamily: 'monospace', fontSize: 12 }}>
        <pre>{referrer || 'n/a'}</pre>
      </pre>
      <p>
        The `returnLocation` as computed by this library, listens for client side transitions and
        the `referrer` as returned by the server. With the combination of both of these components,
        the library resolves to a single return location.
      </p>
      <p>
        <strong>Return location:</strong>
      </p>
      <pre style={{ fontFamily: 'monospace', fontSize: 12 }}>
        <pre>{JSON.stringify(returnLocation)}</pre>
      </pre>
      <hr />
      <p>Using the content extracted (shown above) the return link is generated.</p>
      <p>
        If you do not see "Return" that means you got to this page without any information that
        could return you. You can cause this by focusing the address bar and hitting enter. This is
        essentially what would happen if you navigated here all on your own or if someone shared a
        link with you. Otherwise you should see a "Return" link below that will send you back to the
        link you came from.
      </p>
      {returnLocation && <BackwardLink>Return</BackwardLink>}
      <br />
      <Link to={'./..'}>Start Over</Link>
    </div>
  );
}
