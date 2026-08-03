import VisualController from '/src/main.js'
import Header from '/demo/Header.svelte'
import Sidebar from '/demo/Sidebar.svelte'

const
      html              = new VisualController({})
    , main             = document.getElementById ( 'main' )
    , updateHeaderBtn  = document.getElementById ( 'updateHeader' )
    , incrementBtn     = document.getElementById ( 'incrementHeader' )
    , swapBtn          = document.getElementById ( 'swapApps' )
    , destroyHeaderBtn = document.getElementById ( 'destroyHeader' )
    , destroySidebarBtn = document.getElementById ( 'destroySidebar' )
    , resetBtn         = document.getElementById ( 'resetAll' )
    , resultText       = document.getElementById ( 'resultText' )
    , aliasesList      = document.getElementById ( 'aliasesList' )
    ;

// Track the live lib for each app by identity. The library is alias-based,
// so an app's alias can change when we swap; we capture the lib on every
// publish where the app matches.
let headerLib  = null
let sidebarLib = null

function captureLib ( component, lib ) {
        if ( component === Header )   headerLib  = lib
        if ( component === Sidebar )  sidebarLib = lib
    }

function refreshAliases () {
        aliasesList.textContent = html.list ().join ( ', ' ) || '-'
    }


// 1. Define two regions inside one parent. No <div id="..."> wrappers.
html.set ( ( { start, end } ) => {
        main.append ( start, end )
        return 'header'
    })

html.set ( ( { start, end } ) => {
        main.append ( start, end )
        return 'sidebar'
    })

refreshAliases ()


// 2. Publish apps into the regions.
html.publish ( 'header', Header )
    .then ( lib => {
            captureLib ( Header, lib )
            resultText.textContent = 'Header published: ' + JSON.stringify ( Object.keys ( lib ) )
            refreshAliases ()
        })

html.publish ( 'sidebar', Sidebar, { title: 'Items' } )
    .then ( lib => {
            captureLib ( Sidebar, lib )
            refreshAliases ()
        })



updateHeaderBtn.addEventListener ( 'click', () => {
        if ( headerLib )   headerLib.changeMessage ( `Header updated at ${new Date().toLocaleTimeString()}` )
    })

incrementBtn.addEventListener ( 'click', () => {
        if ( headerLib )   headerLib.increment ()
    })


let swapped = false
swapBtn.addEventListener ( 'click', () => {
        swapped = !swapped
        // Exchange the apps between the two regions. Initial state:
        // header hosts Header, sidebar hosts Sidebar. After swap,
        // header hosts Sidebar and sidebar hosts Header. Toggle again
        // to restore.
        const [ headerApp, sidebarApp ] = swapped
                ? [ Sidebar, Header ]
                : [ Header, Sidebar ]
        html.publish ( 'header', headerApp )
            .then ( lib => captureLib ( headerApp, lib ) )
        html.publish ( 'sidebar', sidebarApp )
            .then ( lib => captureLib ( sidebarApp, lib ) )
        resultText.textContent = swapped
                ? 'Swapped: header and sidebar exchanged apps'
                : 'Restored: header and sidebar back to initial apps'
    })


destroyHeaderBtn.addEventListener ( 'click', () => {
        const ok = html.destroy ( 'header' )
        resultText.textContent = 'Destroy header: ' + ok
        refreshAliases ()
    })


destroySidebarBtn.addEventListener ( 'click', () => {
        const ok = html.destroy ( 'sidebar' )
        resultText.textContent = 'Destroy sidebar: ' + ok
        refreshAliases ()
    })


resetBtn.addEventListener ( 'click', () => {
        html.reset ()
        headerLib  = null
        sidebarLib = null
        resultText.textContent = 'Reset all'
        refreshAliases ()
    })