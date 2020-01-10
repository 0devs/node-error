module.exports = {
    extends: [
        './node_modules/@0devs/package/config/eslint-ts.js',
    ],
    rules: {
        'import/no-unresolved': 'off',
        'implicit-arrow-linebreak': ['off'],
        'import/prefer-default-export': ['off'],
        '@typescript-eslint/ban-ts-ignore': ['off'],
    }
}
