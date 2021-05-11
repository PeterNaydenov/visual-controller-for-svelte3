# Visual Controller for Svelte

Install visual controller:
```
npm i @peter.naydenov/visual-controller-for-svelte
```

Initialization process:
```js
import mit from 'mitt' // event emitter by your personal choice.
import VisualController from '@peter.naydenov/visual-controller-for-svelte'

let 
      eBus = mitt ()
    , html = new VisualController ({ eBus }) // provide event emitter to visual controller as part of config object
    ;
// Ready for use...
```

Let's show something on the screen:
```js
// Let's have svelte component 'Hello' with prop 'greeting'

html.publish ( Hello, {greeting:'Hi'}, 'app' )
//arguments are: ( component, props, containerID )
```


## Visual Controller Methods
```js
  publish : 'Render svelte app in container. Associate app instance with the container.'
, getApp  : 'Returns app instance by container name'
, destroy : 'Destroy app by using container name '
```



### VisualController.publish ()
Publish a svelte app.
```js
html.publish ( component, props, containerID )
```
- **component**: *object*. Svelte component
- **props**: *object*. Svelte components props
- **containerID**: *string*. Id of the container where svelte-app will live.

Example:
```js
 let html = new VisualController ({ eBus });

 html.publish ( Hi, { greeting: 'hi'}, 'app' )
```

Render component 'Hi' with prop 'greeting' and render it in html element with id "app".





### VisualController.getApp ()
Returns svelte-app associated with a container. Provides access to the methods of parent svelte-app component.

```js
 let controls = html.getApp ( containerID )
```
- **containerID**: *string*. Id of the container.

Example:
```js
let 
      id = 'videoControls'
    , controls = html.getApp ( id )
    ;
if ( controls )   controls.pushPlay () // use methods of the component
else { // component is not available
       console.error ( `App for id:"${id}" is not available` )
   }
```
If visual controller(html) has a svelte app associated with this name will return it. Otherwise will return **false**.





### VisualController.destroy ()
Will destroy svelte app associated with this container name and container will become empty. Function will return 'true' on success and 'false' on failure. 
Function will not delete content of provided container if there is no svelte app associated with it.

```js
html.destroy ( containerID )
```
- **containerID**: *string*. Id name.

## Other details and requirements

- Visual controller will provide a "**dependency**" object as a prop to every svelte app created by it. Visual controller will require a configuration object with at least one element: [ 'eBus' ];


