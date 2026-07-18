import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
    build: {
        outDir: resolve(
            __dirname,
            'dist/qc-core'
        ),

        emptyOutDir: true,

        lib: {
            entry: resolve(
                __dirname,
                'qc-core/index.js'
            ),

            name: 'QuiConvertCore',
            formats: ['es'],
            fileName: 'qc-core',
            cssFileName: 'qc-core'
        },

        cssCodeSplit: false,
        sourcemap: true
    }
});