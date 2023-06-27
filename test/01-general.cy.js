
import VisualController from '../src/main'
import notice from '@peter.naydenov/notice'

import App from '../src/App.svelte'


    


const 
      cid = id => `[data-cy-${id}]`
    , root = document.querySelector ( cid`root` )
    , eBus = notice ()
    , html = new VisualController ({eBus})
    ;

root.id = 'el'



describe ( 'Visual Controller for svelte 3 and 4', () => {

    it ( 'Method "publish" returns a promise', () => {
                const result = html.publish ( App, {}, 'el' )
                expect ( result.constructor.name ).to.be.equal ( 'Promise' )
        }) // it Method "publish" returns a promise



    it ( 'Destroy', () => {
                const node = document.getElementById ( 'el' );
                html.publish ( App, {}, 'el' );
                expect ( node.innerHTML ).not.equal ( '' )

                html.destroy ( 'el' )
                expect ( node.innerHTML ).to.be.equal ( '' )
        }) // it Destroy



    it ( 'Dependencies', done => {
                let a = 0;
                eBus.on ( 'check', () => a = 1 )
                html.publish ( App, {}, 'el' )
                        .then ( app => {
                                    expect ( typeof app.changeMessage ).to.be.equal ( 'function' )
                                    expect ( a ).to.be.equal ( 1 )
                                    done ()
                            })
        }) // it Dependencies



    it ( 'Method "has"', () => {
                html.publish ( App, {}, 'el' )
                const exists = html.has ( 'el' );
                html.destroy ( 'el' )
                const missing = html.has ( 'el' );
                expect ( exists ).to.be.equal ( true )
                expect ( missing ).to.be.equal ( false )
        }) // it Has



    it ( 'Hydrate, SSR support', () => {
                const node = document.getElementById ( 'el' )
                node.innerHTML = '<p>Something...</p>'
                html.publish ( App, {}, 'el' )
                html.destroy ( 'el' )
                expect ( node.innerHTML ).to.be.equal ( '' )
        })
        
}) // describe


