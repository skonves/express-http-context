# CHANGELOG

## 2.0.1 (2025-04-19)

Fix:

- All instances of express-http-context now share the same global `AsyncLocalStorage` instance

## 2.0.0 (2025-04-02)

Migration notes:

- 🎉 The `get`, `set`, and `middleware` methods are unchanged. Applications consuming _only_ these method can upgrade to v2 without any issue.
- ⚠️ Consumers of `ns` (namespace) will need to also migrate to `AsyncLocalStorage` (from `cls-hooked`). The `ns` instance is no longer exported. Instead, developers have access to `asyncLocalStorage` which exposes the internal instance of `AsyncLocalStorage`.

  - Before:

    ```js
    import { ns } from "express-http-context";
    ```

  - After:

    ```js
    import { asyncLocalStorage } from "express-http-context";
    ```

Features:

- Migrate internals to `AsyncLocalStorage` (from `cls-hooked`). `AsyncLocalStorage` is a production-ready, first-class feature of Node and provides predicable and stable access to the continuation context. See: https://nodejs.org/api/async_context.html#async_context_class_asynclocalstorage

Security:

- Removes all 3rd party production dependencies (all dependencies are now contained within NodeJS)
- Update dev dependencies to address known CVEs

Fix:

- Prevents context from being lost in popular middlewares such as `body-parser` and `express-jwt`.

## 1.2.5 (2025-03-16)

Security:

- Package is now published with provenance
- Update dependencies to address known CVEs

## 1.2.4 (2020-07-12)

Fix:

- Assume an ES5 target in browser-facing code

## 1.2.3 (2019-07-12)

Security:

- Update dependencies to address known CVEs

## 1.2.2 (2019-04-27)

Fix:

- Move `cls-hooked` and `@types/express` to dependencies (from dev dependencies)

## 1.2.1 (2019-03-25)

Security:

- Update dependencies to address known CVEs

Fix:

- Correctly disallows certain versions of Node 10

## 1.2.0 (2018-10-23)

Features:

- Add a browser-safe API (that does nothing)
- Reduce bundle size by ignoring unnecessary files

## 1.1.0 (2018-09-16)

Features:

- Expose the continuation namespace. This may be useful if you want to apply some patch to it.
- Add `cls-hooked` and `@types/express` as dev dependencies

Docs:

- Add contributing guidelines

## 1.0.4 (2018-07-25)

Docs:

- Updated instructions to use middleware as late as possible, to overcome problems of context getting lost in various 3rd party middlewares.

## 1.0.3 (2018-06-06)

Features:

- Disallow Node 10.0.x - 10.3.x. V8 version 6.6 introduced a bug breaks async_hooks during async/await. Node 10.4.x uses V8 v6.7 in which the bug is fixed. See: https://github.com/nodejs/node/issues/20274
- Remove `bluebird` as a dev dependency

## 1.0.2 (2018-05-21)

Security:

- Improve build process

## 1.0.1 (2018-05-16)

Features:

- Add Typescript typings

## 1.0.0 (2018-02-15)

Migration notes:

- 🎉 The `get`, `set`, and `middleware` methods are unchanged. Applications consuming _only_ these method can upgrade to v1 without any issue.
- ⚠️ Consumers of `ns` (namespace) will need to also migrate `cls-hooked` (from `continuation-local-storage`). Applications that need to remain on `continuation-local-storage` cannot upgrade to v1.

Features:

- Migrate internals to `cls-hooked` (from `continuation-local-storage`).
- Adds support for async/await

Security:

- Update dependencies to address known CVEs

## 0.3.4 (2017-04-02)

Features:

- Reduce bundle size by ignoring unnecessary files

## 0.3.3 (2017-04-01)

Fix:

- Don't error if namespace doesn't exist

## 0.3.2 (2017-04-01)

Fix:

- Don't error when called outside of a request

## 0.3.1 (2017-01-23)

Fix:

- Creates a new namespace if one does not exist rather than erroring

## 0.3.0 (2017-01-23)

Fix:

- Improve namespace access.

## 0.2.0 (2017-01-14)

Feature:

- Initial release
