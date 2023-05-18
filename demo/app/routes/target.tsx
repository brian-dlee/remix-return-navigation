import {
  useReturnLocation,
  BackwardLink,
  BackwardLinkFC,
} from '@briandlee/remix-return-navigation';
import { Link, useLocation } from '@remix-run/react';
import { useRootLoaderData } from '~/loaders/root';

export default function () {
  const { referrer } = useRootLoaderData();
  const returnLocation = useReturnLocation();
  const location = useLocation();

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
      <pre style={{ fontFamily: 'monospace', fontSize: 12 }}>{JSON.stringify(returnLocation)}</pre>
      <p>For transparency, the result of `useLocation` is also shown below.</p>
      <p>
        <strong>Location:</strong>
      </p>
      <pre style={{ fontFamily: 'monospace', fontSize: 12 }}>{JSON.stringify(location)}</pre>
      <hr />
      <p>Using the content extracted (shown above) the return link is generated.</p>
      <p>
        If you do not see a link that says "Return Home" that means you got to this page without any
        information that could return you. You can cause this by opening a new tab and pasting the
        URL to this page in the address bar. This is essentially what would happen if someone shared
        a link with you. Otherwise you should see a "Return" link below that will send you back to
        the link you came from.
      </p>
      <h4>
        Examples of: <code>BackwarkLink</code>
      </h4>
      <p>
        A fully customizable version using <code>render</code>:{' '}
        <BackwardLink className={'source'} render={DynamicBackwardLinkContent} />
      </p>

      <p>
        A simpler version with <code>fallbackContent</code>:{' '}
        <BackwardLink className={'source'} fallbackContent={'Return home'}>
          Return to previous location
        </BackwardLink>
      </p>

      <p>
        No fallback: <BackwardLink className={'source'}>Back</BackwardLink>
      </p>

      <hr />

      <Link to={'/'}>Start Over</Link>
    </div>
  );
}

const DynamicBackwardLinkContent: BackwardLinkFC = ({ returnLocation }) => {
  if (!returnLocation) {
    return 'Return home (no return location)';
  }
  return `Return to ${returnLocation.pathname}${returnLocation.search}${returnLocation.hash}`;
};
