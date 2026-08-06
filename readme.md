# Visual Controller for Svelte 3 & 4

![version](https://img.shields.io/github/package-json/v/peterNaydenov/visual-controller-for-svelte3)
![license](https://img.shields.io/github/license/peterNaydenov/visual-controller-for-svelte3)
![npm downloads](https://img.shields.io/npm/dw/@peter.naydenov/visual-controller-for-svelte3)
![bundle size](https://img.shields.io/bundlephobia/minzip/@peter.naydenov/visual-controller-for-svelte3)

Run multiple Svelte apps on the same page from a single controller. Each app gets its own region defined by invisible markers — **no DOM ids, no wrapper elements, no `getElementById` calls**.

*NOTE: After version 2.0.2 the library works with `Svelte 4`. Product is not changed, just the dependency. If you need version 3 of Svelte, use version 2.0.1 of this library. This package is the legacy branch — for Svelte 5 see [visual-controller-for-svelte5](https://github.com/PeterNaydenov/visual-controller-for-svelte5).*

```js
import VisualController from '@peter.naydenov/visual-controller-for-svelte3'
import HeaderApp from './apps/Header.svelte'
import SidebarApp from './apps/Sidebar.svelte'
import CartApp from './apps/Cart.svelte'

const html = new VisualController({ /* shared dependencies */ })

// Place markers anywhere in the DOM. Whatever string the callback returns
// becomes the alias. Multiple regions can share a parent.
html.set(({ start, end }) => { document.querySelector('header').append(start, end); return 'header' })
html.set(({ start, end }) => { document.querySelector('aside').append(start, end);  return 'sidebar' })
html.set(({ start, end }) => { document.querySelector('main').append(start, end);   return 'cart' })

// Publish apps into the regions.
html.publish('header', HeaderApp)
html.publish('sidebar', SidebarApp)
html.publish('cart', CartApp)
```

Each `publish` is independent — apps can be added, removed, swapped, or destroyed at runtime. Each app gets access to the same shared dependencies (event buses, stores, services) via dependency injection.

> **v3.0.0 — breaking change.** The v2 `id`-based API is gone. v3 is region-only. See [Migration from v2](#migration-from-v2) if you're upgrading.



## Why use this

Most pages need more than one Svelte app — a header from team A, a sidebar from team B, a checkout widget from team C. The challenge is coordinating them without coupling.

The marker model is what makes this library simple. Instead of authoring `<div id="app">` and looking it up with `document.getElementById('app')`, you place invisible markers directly in the DOM and the controller finds them by alias:

```js
// v2: tag the element, look it up, pass the id
<div id="app"></div>
html.publish(MyComponent, props, 'app')

// v3: place markers, return the alias — no DOM id, no wrapper
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'app'
})
html.publish('app', MyComponent, props)
```

The nesting of `set` and `publish` looks like extra steps, but the payoff is that the controller owns the location. No ids to manage, no collisions, no wrapper elements. The HTML author doesn't need to know which app will live where — they just write `<main>` and the JS declares the regions.

The dynamic lifecycle is the other half:

```js
// Swap apps in a region without touching the DOM
html.publish('header', HeaderApp)        // first app
html.publish('header', PromoBannerApp)   // same alias, different app
html.destroy('header')                   // markers stay, region is empty
html.publish('header', HeaderApp)        // re-publish
```

Same parent, multiple regions, no DOM ids, no wrapper elements.



## Quick start

```js
import VisualController from '@peter.naydenov/visual-controller-for-svelte3'
import HeaderApp from './Header.svelte'
import SidebarApp from './Sidebar.svelte'

const html = new VisualController({ /* dependencies */ })

// 1. Define regions. Each callback receives { start, end } markers
//    (invisible text nodes) and must attach both to the DOM.
//    Whatever string the callback returns becomes the alias.
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'sidebar'
})

// 2. Publish apps into regions.
html.publish('header', HeaderApp, { greeting: 'Hi!' })
html.publish('sidebar', SidebarApp)
```

```html
<main id="main">
    <h2>Static page heading</h2>
    <!-- regions are placed by the JS above. No <div id="..."> wrappers. -->
</main>
```

The same parent (`#main`) hosts two regions with no `id` collisions. Selection is by alias, not by DOM lookup.

> The marker model is the same one used by [`@peter.naydenov/dim`](https://github.com/PeterNaydenov/dim). A slim inlined subset of dim lives in `src/dim.js` (no separate install). See that file's header for the upstream reference.



## API

```js
  set     : 'Define a region by placing markers in the DOM'
, publish : 'Mount a Svelte app into a region by alias'
, destroy : 'Unmount the app(s); empty the range(s); keep the markers'
, has     : 'Is an app currently published in this region?'
, getApp  : 'Returns the setupUpdates interface for a published app'
, isEmpty : 'Is the region empty (no content between markers)?'
, list    : 'Returns every alias registered via set'
, reset   : 'Unmount all apps, clear internal state, remove the markers'
```



### `html.set(fn, ...args)`

Define a region. The callback receives `{ start, end }` text-node markers and must attach both to the DOM. Whatever string the callback returns becomes the alias used by all other methods.

```js
html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

// Extra args are forwarded to the callback.
html.set(({ start, end }, locale) => {
    // ...
    return 'l10n-header'
}, 'en')
```

The placement is entirely up to you — anywhere the markers can be inserted. Multiple regions can live inside the same parent. Markers stay where you put them for the lifetime of the page (or until `reset()`).



### `html.publish(alias, component, data?, extraParams?)`

Mount a Svelte app into a region. The controller inserts a `<span style="display:contents">` between the markers, instantiates the Svelte component into it, and tracks the app under the alias.

| Arg           | Required | Default | Description |
| ------------- | -------- | ------- | ----------- |
| `alias`       | yes      | —       | Region alias (returned from `set`). |
| `component`   | yes      | —       | A Svelte component class. |
| `data`        | no       | `{}`    | Component props. |
| `extraParams` | no       | `{}`    | Reserved for future use. Accepted, ignored. |

Returns a `Promise` resolving to the `setupUpdates` object, or `false` on error.

```js
// Bare minimum
html.publish('header', MyComponent)

// With props
html.publish('header', MyComponent, { greeting: 'Hi!' })

// All four
html.publish('header', MyComponent, { greeting: 'Hi!' }, { /* future */ })
```

Calling `publish` for an alias that already has a published app silently destroys the old one first, then mounts the new one. Same alias, different component, same location.



### `html.destroy(target?)`

Unmount the app published in a region and empty the range. Markers stay in the DOM, so the alias can be `publish`-ed again later.

```js
html.destroy('header')              // → true / false
html.destroy()                      // → count of apps destroyed across all aliases
html.destroy(['header', 'sidebar']) // → count of those actually destroyed
```

Three forms:

- **`destroy(alias)`** — single alias string. Returns `true` on success, `false` if the alias has no published app.
- **`destroy()`** — no args. Destroys every published app across all aliases. Returns the count of apps destroyed.
- **`destroy(aliases)`** — array of alias strings. Destroys each; missing aliases are silently skipped. Returns the count actually destroyed.

**What `destroy()` touches:** the Svelte app (calls `$destroy()` on it), the mount span (removes from DOM), and the cache entry (so `has(alias)` is `false`).
**What `destroy()` does NOT touch:** the markers (stay in the DOM), the alias in `list()` (stays registered, can be re-published), or the dim registry (no re-`set()` needed).

For a full cleanup that also removes markers, use `reset()`.



### `html.has(alias)`

Returns `true` if an app is currently published in this region, `false` otherwise. Empty regions (markers exist but no app published) return `false`.

```js
html.has('header')   // → boolean
```



### `html.getApp(alias)`

Returns the `setupUpdates` object provided from inside the published component, or `false` if the alias has no published app.

```js
const app = html.getApp('header')
if (app)   app.changeMessage('New value')
else       console.error('App not published')
```



### `html.isEmpty(alias)`

Is the region empty (no content between its markers)? Returns `true` if the range is collapsed (empty) **or** if the markers are orphaned (no longer in the DOM). Returns `undefined` for an unknown alias and logs an error.

```js
html.isEmpty('header')   // → true / false / undefined
```

Useful for pre-publish checks: `if (html.isEmpty('header')) await html.publish(...)`. After `destroy`, the range is empty again (markers stay, app gone), so `isEmpty` returns `true`.



### `html.list()`

Returns an array of every alias registered via `set`, regardless of whether each region currently has a published app. Cleared by `reset()`.

```js
html.list()   // → ['header', 'sidebar']
```



### `html.reset()`

Unmounts every published app, clears internal state, and removes every marker from the DOM. After `reset()`, the aliases are gone and the regions must be re-created with `set()` before publishing again.

```js
html.reset()
```



## Inside a component

If your component needs access to external libraries, export `dependencies`. Everything passed to the `VisualController` constructor is available, plus a special `setupUpdates` method that registers an interface for external component manipulation.

```svelte
<script>
  export let dependencies;
  export let setupUpdates;

  let message = 'Hello from Svelte!';
  let count = 0;

  function changeMessage ( newMsg ) {
        message = newMsg;
    }

  function increment () {
        count += 1;
    }

  function getCount () {
        return count;
    }

  setupUpdates ({
        changeMessage
      , increment
      , getCount
    });
</script>

<div class="hello">
  <h2>{message}</h2>
  <p>Count: {count}</p>
  <button on:click={increment}>Increment</button>
</div>

<style>
  .hello { padding: 10px; background: #f0f0f0; border-radius: 4px; }
  .hello h2 { margin: 0 0 10px; }
</style>
```

External access goes through the alias:

```js
const updates = html.getApp('header')
updates.changeMessage('New message content')
updates.increment()
updates.getCount()   // → 1
```



## Other details

### SSR hydration

When you pre-populate a region with HTML (server-rendered or static markup), `publish` detects it and uses the existing element as the mount target instead of inserting a fresh `<span>`. No configuration needed.

```js
// Render on the server, then drop the HTML into the region
const ssrHtml = await renderComponentToString(HeaderApp)

html.set(({ start, end }) => {
    document.querySelector('#main').append(start, end)
    return 'header'
})

// Manually insert the SSR HTML between the markers
const tmpl = document.createElement('template')
tmpl.innerHTML = ssrHtml
document.querySelector('#main').insertBefore(tmpl.content.firstElementChild, /* end marker */)

// Publish — will hydrate the SSR HTML instead of replacing it
await html.publish('header', HeaderApp)
```

Three cases:

- **Empty range** → controller inserts a `<span style="display:contents">` and mounts fresh.
- **Single element between markers** → mounts to that element directly. Svelte takes over the existing DOM in place.
- **Multiple sibling nodes between markers** (fragment template) → wraps them in a `<span style="display:contents">` and mounts to the wrapper.



## Development

Setup and common commands:

```bash
npm install
npm test         # run the test suite (21 tests)
npm run cover    # coverage report
npm run build    # build the library
npm run dev      # run the demo at http://localhost:5173/
```

Source layout:

| Path | Purpose |
| --- | --- |
| `src/main.js` | The controller. |
| `src/dim.js` | Slim inlined subset of the dim marker model. |
| `test/01_general.test.js` | General API tests. |
| `test/02_demo.test.js` | End-to-end demo flow tests. |
| `test/03_swap.test.js` | App swap tests. |
| `demo/` | Runnable demo (Header.svelte, Sidebar.svelte, main.js). |
| `index.html` | Entry point for `npm run dev`. |
| `dist/` | Build artifacts (committed for npm publishing). |

#### Adding a new method

1. Add the function to `src/main.js` with a JSDoc block.
2. Export it from the `return { ... }` block at the bottom.
3. Add tests in `test/01_general.test.js`.
4. Update the README's API table and section.
5. Add a bullet to `Changelog.md` under the current version.

#### Keeping the inlined dim in sync

The dim model is owned by the official `@peter.naydenov/dim` package. If the upstream API changes, diff `src/dim.js` against the reference implementation (see the file header for the GitHub URL) and update the inlined subset to match. The methods used by the controller are `set`, `get`, `reset`, `aliases`, and the range's `isEmpty`.



## Migration from v2

v3.0.0 is a breaking change. The `id`-based API (`document.getElementById(id)` and `<div id="app">` wrappers) is gone. v3 is region-based: invisible dim markers define regions, and an alias returned from `set` selects them.

### Summary

- **Region-based API.** `<div id="...">` placeholders replaced by `set(callback)` + alias.
- **`publish` arg order reshuffled.** Alias first, component second.
- **New methods:** `isEmpty`, `list`, `reset`.
- **Removed:** `containerID` parameter on `publish`/`destroy`/`has`/`getApp`.
- **No `dim` dependency at install time.** The controller doesn't pull in the official `@peter.naydenov/dim` package — instead, a slim inlined subset of dim lives in `src/dim.js`. Consumers don't install anything extra, and the bundle is smaller.

### TL;DR

```js
// v2
html.publish(MyComponent, { greeting: 'Hi' }, 'app')

// v3
html.set(({ start, end }) => {
    document.body.append(start, end)
    return 'app'
})
html.publish('app', MyComponent, { greeting: 'Hi' })
```

Three things changed in this single line:

1. A new `set(...)` call defines the region before any `publish`.
2. The containerID `'app'` is now an alias returned from `set` (`return 'app'`).
3. The `publish` argument order swapped: alias first, then component.

### Step-by-step migration

**Step 1 — Wrap each `<div id="...">` with a `set()` call.**

```html
<!-- v2 -->
<div id="header"></div>
<div id="sidebar"></div>
```

```js
// v3
html.set(({ start, end }) => {
    const headerEl = document.querySelector('header')
    headerEl.append(start, end)
    return 'header'
})

html.set(({ start, end }) => {
    const sidebarEl = document.querySelector('aside')
    sidebarEl.append(start, end)
    return 'sidebar'
})
```

**Step 2 — Swap `publish` arg order.**

```js
// v2
html.publish(MyComponent, { greeting: 'Hi' }, 'header')

// v3
html.publish('header', MyComponent, { greeting: 'Hi' })
```

**Step 3 — Update `destroy` / `has` / `getApp` calls.**

Same names, just keyed by alias now:

```js
html.destroy('header')
html.has('header')
html.getApp('header')
```

**Step 4 — Nothing else changes inside components.**

The `export let dependencies` / `export let setupUpdates` block is identical between v2 and v3. `dependencies`, `setupUpdates`, and the component-side injection all work the same.

### Common patterns

**One placeholder:**

```js
// v2
const html = new VisualController({ eBus })
html.publish(MyComponent, { greeting: 'Hi' }, 'app')

// v3
const html = new VisualController({ eBus })
html.set(({ start, end }) => {
    document.body.append(start, end)
    return 'app'
})
html.publish('app', MyComponent, { greeting: 'Hi' })
```

**Swap the component in a region:**

```js
// v2
html.publish(HeaderApp, {}, 'header')
html.publish(SidebarApp, {}, 'header')   // replaces HeaderApp with SidebarApp

// v3
html.publish('header', HeaderApp)
html.publish('header', SidebarApp)        // replaces HeaderApp with SidebarApp
```

**Destroy every app at once (new in v3):**

```js
// v3 only — no v2 equivalent
html.destroy()                          // → count of apps destroyed across all aliases
html.destroy(['header', 'sidebar'])     // → count of those actually destroyed
```

Use `reset()` if you also want markers removed and the alias registration cleared.

### Checklist

- [ ] Find every `<div id="...">` placeholder in your HTML.
- [ ] Replace each with a `set((markers) => { ... return alias })` call.
- [ ] Find every `publish(` call. Swap argument order: `publish(component, data, id)` → `publish(id, component, data)`.
- [ ] Verify `destroy`/`has`/`getApp` arguments are still strings (they are — just aliases now).
- [ ] Remove any DOM-id bookkeeping — no more looking up elements yourself.
- [ ] Optional: leverage the new `isEmpty`/`list`/`reset` for cleaner SPA-style flows.
- [ ] Run your tests. The Svelte component code itself should not need changes.



## Extra

Visual Controller has versions for other front-end frameworks:
- [Vue 3](https://github.com/PeterNaydenov/visual-controller-for-vue3)
- [React](https://github.com/PeterNaydenov/visual-controller-for-react)
- [Svelte 5](https://github.com/PeterNaydenov/visual-controller-for-svelte5)
- [Preact](https://github.com/PeterNaydenov/visual-controller-for-preact)
- [Solid](https://github.com/PeterNaydenov/visual-controller-for-solid)
- [Lit](https://github.com/PeterNaydenov/visual-controller-for-lit)
- [Vue 2](https://github.com/PeterNaydenov/visual-controller-for-vue)



## Links

- [History of changes](https://github.com/PeterNaydenov/visual-controller-for-svelte3/blob/master/Changelog.md)
- [License](https://github.com/PeterNaydenov/visual-controller-for-svelte3/blob/master/LICENSE)



## Credits

'visual-controller-for-svelte3' is created and supported by Peter Naydenov.



## License

'visual-controller-for-svelte3' is released under the [MIT license](https://github.com/PeterNaydenov/visual-controller-for-svelte3/blob/master/LICENSE).