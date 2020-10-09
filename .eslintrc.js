module.exports = {
    extends: [
        './node_modules/@0devs/package/config/eslint-ts.js',
    ],
    rules: {
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'implicit-arrow-linebreak': ['off'],
        'import/prefer-default-export': ['off'],
        '@typescript-eslint/ban-ts-ignore': ['off'],
        '@typescript-eslint/interface-name-prefix': ['off']
    }
}
