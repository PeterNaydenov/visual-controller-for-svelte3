import { describe, it, expect, beforeEach } from 'vitest'
import VisualController from '../src/main.js'
import Header from '../demo/Header.svelte'
import Sidebar from '../demo/Sidebar.svelte'

describe('demo: external button survives a swap', () => {
    let html, main, headerLib

    beforeEach(() => {
        document.body.innerHTML = `
            <main id="main"></main>
            <button id="incrementHeader">Increment</button>
            <button id="swapApps">Swap</button>
        `
        main = document.querySelector('#main')
        headerLib = null
        html = new VisualController({})
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })

        document.getElementById('incrementHeader').addEventListener('click', () => {
            if (headerLib) headerLib.increment()
        })

        let swapped = false
        document.getElementById('swapApps').addEventListener('click', () => {
            swapped = !swapped
            const [h, s] = swapped ? [Sidebar, Header] : [Header, Sidebar]
            html.publish('header', h).then(lib => { if (h === Header) headerLib = lib })
            html.publish('sidebar', s).then(lib => { if (s === Header) headerLib = lib })
        })
    })

    it('initial: counter on the right column, external increment button works', async () => {
        html.publish('header', Header).then(lib => { headerLib = lib })
        html.publish('sidebar', Sidebar)
        await new Promise(r => setTimeout(r, 0))

        const counter = document.querySelector('.header p')
        expect(counter.textContent).toBe('Count: 0')

        document.getElementById('incrementHeader').click()
        document.getElementById('incrementHeader').click()
        document.getElementById('incrementHeader').click()
        await new Promise(r => setTimeout(r, 0))

        expect(counter.textContent).toBe('Count: 3')
    })

    it('after swap: counter moves to the left column, external increment button still works', async () => {
        html.publish('header', Header).then(lib => { headerLib = lib })
        html.publish('sidebar', Sidebar)
        await new Promise(r => setTimeout(r, 0))

        document.getElementById('swapApps').click()
        await new Promise(r => setTimeout(r, 0))

        const counter = document.querySelector('.header p')
        expect(counter.textContent).toBe('Count: 0')

        document.getElementById('incrementHeader').click()
        document.getElementById('incrementHeader').click()
        await new Promise(r => setTimeout(r, 0))

        expect(counter.textContent).toBe('Count: 2')
    })
})