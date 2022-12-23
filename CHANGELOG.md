# Changelog

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

