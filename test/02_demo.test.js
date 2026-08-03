import { describe, it, expect, beforeEach } from 'vitest'
import VisualController from '../src/main.js'
import Header from '../demo/Header.svelte'
import Sidebar from '../demo/Sidebar.svelte'

describe('demo smoke test', () => {
    let html, main

    beforeEach(() => {
        document.body.innerHTML = ''
        main = document.createElement('main')
        main.id = 'main'
        document.body.appendChild(main)
        html = new VisualController({})
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
    })

    it('clicking the increment button updates the count', async () => {
        await html.publish('header', Header)

        const button = document.querySelector('.header button')
        const para = document.querySelector('.header p')
        expect(button).toBeTruthy()
        expect(para.textContent).toBe('Count: 0')

        button.click()
        await new Promise(r => setTimeout(r, 0))
        expect(para.textContent).toBe('Count: 1')

        button.click()
        button.click()
        await new Promise(r => setTimeout(r, 0))
        expect(para.textContent).toBe('Count: 3')
    })

    it('changeMessage updates the header text', async () => {
        const updates = await html.publish('header', Header)
        updates.changeMessage('hello world')
        await new Promise(r => setTimeout(r, 0))
        const h3 = document.querySelector('.header h3')
        expect(h3.textContent).toBe('hello world')
    })

    it('clicking the sidebar remove button drops the item', async () => {
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('sidebar', Sidebar)

        const removeBtn = document.querySelector('.sidebar li button')
        expect(removeBtn).toBeTruthy()

        const before = document.querySelectorAll('.sidebar li').length
        removeBtn.click()
        await new Promise(r => setTimeout(r, 0))
        expect(document.querySelectorAll('.sidebar li').length).toBe(before - 1)
    })

    it('external increment button works when Header is in the header alias (initial)', async () => {
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', Header)
        await html.publish('sidebar', Sidebar)

        const app = html.getApp('header')
        expect(app.increment).toBeTypeOf('function')

        app.increment()
        app.increment()
        await new Promise(r => setTimeout(r, 0))

        const counter = document.querySelector('.header p')
        expect(counter.textContent).toBe('Count: 2')
    })

    it('external increment button works when Header is in the sidebar alias (after swap)', async () => {
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', Header)
        await html.publish('sidebar', Sidebar)

        // swap
        await html.publish('header', Sidebar)
        await html.publish('sidebar', Header)

        const app = html.getApp('sidebar')
        expect(app.increment).toBeTypeOf('function')

        app.increment()
        app.increment()
        await new Promise(r => setTimeout(r, 0))

        const counter = document.querySelector('.header p')
        expect(counter.textContent).toBe('Count: 2')
    })
})