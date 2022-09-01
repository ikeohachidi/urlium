import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/builder.ts'),
            fileName: (format: string) => `url-builder.${format}.js`,
            name: 'url-builder'
        },
    }
});