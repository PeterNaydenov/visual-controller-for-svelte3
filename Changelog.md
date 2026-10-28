# Release History



### 3.0.2 (2026-10-28)
- [x] **Added TypeScript declarations.** The package shipped without any, so TypeScript consumers got `TS2307: Cannot find module '@peter.naydenov/visual-controller-for-svelte3'`. The types are generated from the JSDoc in `src/main.js` — `dist/main.d.ts` for the instance types and `dist/index.d.ts` for the public entry — and the `exports` map now points each condition at its own declaration file.
- [x] **`new VisualController()` now type-checks** (`TS7009: 'new' expression, whose target lacks a construct signature`). TypeScript's declaration emit for a JSDoc function is always `declare function X(...)` — a call signature with no construct signature — and a JSDoc type literal cannot express `new (...)` either. A new type-only entry (`src/index.ts` → `dist/index.d.ts`) declares the default export with both a call signature and a construct signature. Both forms work at runtime — `VisualController` returns the instance object, and a constructor returning an object hands that object back.
- [x] `SetupUpdates` is typed as `Record<string, any>`, so `html.getApp('header').changeMessage('...')` type-checks without a cast — the component decides which methods it exposes.
- [x] CommonJS declarations (`dist/main.d.cts`, `dist/index.d.cts`) are generated next to the ESM ones, so `require()` consumers get types as well (`TS1479` otherwise).
- [x] Added TypeScript as a dev dependency, plus `tsconfig.types.json` and a `types` build step, so the declarations are generated from the JSDoc like in the other packages of the family.



## 3.0.1 (2026-08-30)
- [x] Fix: Wrong dependencies moved the library to svelte 5 and the plugin fails;
- [x] Some possible dev dependencies update;



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