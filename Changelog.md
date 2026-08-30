# Release History

## 3.0.1 (2026-08-30)
- [x] Fix: Wrong dependencies moved the library to svelte 5 and the plugin fails;
- Some possible dev dependencies update;



### 3.0.0 (2026-08-03)
- [x] **Breaking change.** Region-based API. The v2 `id`-based API (`publish(Component, data, id)` etc.) is removed. Regions are defined with the inlined dim subset (see `src/dim.js`) via the new `set` method, which mirrors `dim.set` exactly.
- [x] New API: `set`, `publish(alias, component, data?, extraParams?)`, `destroy`, `has`, `getApp`, `isEmpty`, `list`, `reset`.
- [x] Multiple placeholders can coexist inside a single parent without DOM `id` collisions — selection is by alias returned from the `set` callback.
- [x] Destroying an app empties the region but keeps the markers, so the same alias can host a different app later.
- [x] Mount container is a bare `<span style="display:contents">` — invisible to layout, no DOM wrapper authored by the user.
- [x] SSR hydration preserved: when the range already contains content at publish time, the controller picks it as the mount target (single element → direct mount, multiple siblings → wrapped in a mount span).
- [x] `isEmpty(alias)` delegates to the inlined dim's `range.isEmpty()` — returns `true` for collapsed or orphaned ranges, `undefined` for unknown aliases.
- [x] `destroy()` is polymorphic — accepts no argument (destroys every published app, returns count), an alias string, or an array of alias strings. Markers stay in the DOM in every form.
- [x] No `@peter.naydenov/dim` dependency. The slim subset of dim the controller uses is inlined in `src/dim.js`. The file header documents the upstream reference for syncing if the official package changes.
- [x] `extraParams` slot accepted but ignored — reserved for future use.
- [ ] Bug: Wrong dependencies moved the library to svelte 5 and the plugin fails;


### 2.1.2 ( 2024-12-21 )
- [x] Fix: Wrong install instruction in documentation.



## 2.1.1 ( 2024-12-20 )
- [x] Dependency update. Ask-for-promise@3.0.1;
- [ ] Bug: Wrong install instruction in documentation.



## 2.1.0 ( 2024-02-09 )
- [x] Folder 'dist' was added to the project. Includes commonjs, umd and esm versions of the library;
- [x] Package.json: "exports" section was added. Allows you to use package as commonjs or es6 module without additional configuration;
- [x] Rollup was added to the project. Used to build the library versions;
- [ ] Bug: Wrong install instruction in documentation.


## 2.0.4 ( 2023-10-31)
- [x] Dependency update. Ask-for-promise@1.5.0;
- [ ] Bug: Wrong install instruction in documentation.


## 2.0.2 ( 2023-06-25)
- [x] Using svelte version 4.x.x;
- [x] No other changes in the product;
- [ ] Bug: Wrong install instruction in documentation.


## 2.0.1 ( 2023-06-06)
- [x] Works with vite version 4.x.x;
- [ ] Bug: Wrong install instruction in documentation.


## 2.0.0 ( 2022-11-22)
- [x] Full rewrite of the library;
- [x] Method 'has' was added;
- [x] Support for SSR hydration;
- [x] Method 'publish' returns a promise;
- [x] Testing;
- [x] Documentation update;



## 1.0.0 (2021-05-11)
- [x] Code;
- [x] Documentation;