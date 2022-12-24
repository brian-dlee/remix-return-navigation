# Changelog

## 1.2.0 - Revive location state and performance enhancements

**Breaking Changes**

- `defaultReturnLocationParam` is not `defaultReturnLocationSearchParam`
- `ReturnNavigationContextProvider` now requires `referrer` and `requestUrl` to work without Javascript enabled

The dependence on `referrer` works well when Javascript is disabled. Therefore, more transparent
mechanisms can be used for client-side return location storage. On top of
optimizing the context and rendering of the `BackwardLink` and `ForwardLink`
components, this release reintroduces location state storage and the configuration
options that accompany it.

Also, `BackwardLink` components will automatically fallback to `navigate(-1)` when possible in an attempt to
utilize bfcache. This can be disabled by a configuration option.

## 1.1.0 - Use search parameters for return location storage

**Breaking Changes**

- Removes withUrlData()
- Eliminates use of location state

Using `referrer` header and a client-side location listener, expose a context
`ReturnNavigationContext` to power two new React components: `ForwardLink` and
`BackwardLink` to move to same-origin pages and return from them,
respectively. Their URLs are computed autmatically and the migration from URL
storage vs location state and referrer usage means maximum compatibilty
between JS and non-JS applications and corrects an issue where non-JS
applications lose their return location on refresh.

Resol1ves: https://github.com/brian-dlee/remix-return-navigation/issues/3

## 1.0.0 - Initial release

Use client-side location listeners, the server-side `referrer` header, and
location state to track and generate links to return the user to their
previous location.
