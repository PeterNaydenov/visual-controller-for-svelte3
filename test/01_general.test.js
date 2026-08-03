import { describe, it, expect, beforeEach, vi } from 'vitest'
import VisualController from '../src/main.js'

const tick = () => new Promise(resolve => setTimeout(resolve, 0))
const resetAll = () => {
    document.body.innerHTML = '<main id="main"></main>'
    let main = document.querySelector('#main')
    if (!main) {
        main = document.createElement('main')
        main.id = 'main'
        document.body.appendChild(main)
    }
    main.innerHTML = ''
}

class SvelteComponent {
    constructor ( options ) {
        this.target = options.target
        this.props = options.props || {}
        this.$destroy = vi.fn()
        if (this.props.setupUpdates) {
            this.props.setupUpdates({ setupTest: () => 'ok' })
        }
    }
}

describe('Visual Controller for Svelte 3 — v3 region API', () => {

    let html

    beforeEach(() => {
        resetAll()
        html = new VisualController({})
    })

    it('set registers a region and adds the alias to list()', () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        expect(html.list()).toContain('header')
    })

    it('publish mounts an app into a declared alias', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', SvelteComponent)
        expect(html.has('header')).toBe(true)
    })

    it('publish into undeclared alias resolves to false and logs', async () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('nope', SvelteComponent)
        expect(result).toBe(false)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })

    it('publish with no component resolves to false and logs', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('header', undefined)
        expect(result).toBe(false)
        errSpy.mockRestore()
    })

    it('destroy empties the range, has() becomes false, alias stays in list()', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', SvelteComponent)
        expect(html.has('header')).toBe(true)
        expect(html.destroy('header')).toBe(true)
        expect(html.has('header')).toBe(false)
        expect(html.list()).toContain('header')
    })

    it('destroy on an unknown alias returns false', () => {
        expect(html.destroy('never-published')).toBe(false)
    })

    it('getApp returns the setupUpdates interface', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        await html.publish('header', SvelteComponent)
        const app = html.getApp('header')
        expect(typeof app).toBe('object')
    })

    it('getApp on missing alias returns false and logs', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(html.getApp('never')).toBe(false)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })

    it('supports multiple regions in the same parent', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        expect(html.list()).toEqual(expect.arrayContaining(['header', 'sidebar']))
        await html.publish('header', SvelteComponent)
        await html.publish('sidebar', SvelteComponent)
        expect(html.has('header')).toBe(true)
        expect(html.has('sidebar')).toBe(true)
    })

    it('orphaned markers (parent removed) make publish resolve to false', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        document.querySelector('#main').remove()
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const result = await html.publish('header', SvelteComponent)
        expect(result).toBe(false)
        errSpy.mockRestore()
    })

    it('reset unmounts all apps and clears list()', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', SvelteComponent)
        await html.publish('sidebar', SvelteComponent)
        expect(html.list().length).toBe(2)

        html.reset()
        expect(html.list().length).toBe(0)
        expect(html.has('header')).toBe(false)
        expect(html.has('sidebar')).toBe(false)
    })

    it('destroy() with no args destroys every published app and returns the count', async () => {
        const main = document.querySelector('#main')
        html.set(({ start, end }) => { main.append(start, end); return 'header' })
        html.set(({ start, end }) => { main.append(start, end); return 'sidebar' })
        await html.publish('header', SvelteComponent)
        await html.publish('sidebar', SvelteComponent)
        const count = html.destroy()
        expect(count).toBe(2)
        expect(html.has('header')).toBe(false)
        expect(html.has('sidebar')).toBe(false)
    })

    it('isEmpty returns true for an empty region and false after publish', async () => {
        html.set(({ start, end }) => {
            document.querySelector('#main').append(start, end)
            return 'header'
        })
        expect(html.isEmpty('header')).toBe(true)
        await html.publish('header', SvelteComponent)
        expect(html.isEmpty('header')).toBe(false)
    })

    it('isEmpty returns undefined and logs for an unknown alias', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(html.isEmpty('nope')).toBe(undefined)
        expect(errSpy).toHaveBeenCalled()
        errSpy.mockRestore()
    })
})
