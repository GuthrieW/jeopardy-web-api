import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        extends: ['eslint:recommended', 'google'],
        rules: {
            semi: 'error',
            'prefer-const': 'error',
        },
    },
])
