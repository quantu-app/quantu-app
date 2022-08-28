import { defineConfig } from 'vite'
import path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
    plugins: [svelte({ hot: !process.env.VITEST })],
    test: {
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        globals: true,
        environment: 'jsdom',
        alias: {
            "$app": path.resolve(__dirname, ".svelte-kit/runtime/app"),
            "$lib": path.resolve(__dirname, "src/lib")
        }
    },
})