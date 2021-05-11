"use strict"

/**
 *  Visual Controller for Svelte 3
 *  Controls multiple svelte 3 apps with a single controller.
 */

class VisualController {

    constructor ( dependencies ) {
              const { eBus } = dependencies;
              const cache = {}  // collect svelte components
              this.dependencies = { ...dependencies }
              if ( !eBus )   console.error ( 'eBus is required' )
              return {
                          publish : this.publish ( dependencies, cache )
                        , destroy : this.destroy ( cache )
                        , getApp  : this.getApp  ( cache )
                    }
        }



    publish ( dependencies, cache ) {
        return function (Component, data, id) {
                const hasKey = this.destroy ( id );
                let   node;
                if ( !Component ) {
                        console.error ( `Error: Component is undefined` )
                        return false
                   }
                if ( !hasKey ) {   // if container is not registered before 
                        node = document.getElementById ( id )
                        if ( !node ) {  
                                    console.error ( `Can't find node with id: "${id}"`)
                                    return false
                            }
                    }

                let app = new Component ({ target : node, props: { dependencies,...data }   });
                cache[id] = app
                return true
            }} // publish func.



    destroy ( cache ) {
        return function (id) {
                const htmlKeys = Object.keys(cache);
                if ( htmlKeys.includes(id) ) {                    
                        let 
                              item    = cache[id]
                            , unmount = item.$destroy
                            ;
                        unmount ()
                        delete cache[id]
                        return true
                    }
                else    return false
            }} // destroy func.


            
    getApp ( cache ) {
        return function (id) {
                const item = cache[id];
                if ( !item ) {  
                        console.error ( `App with id: "${id}" was not found.`)
                        return false
                    }
                return item
        }} // getApp func.
} // visualController



export default VisualController


