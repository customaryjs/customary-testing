const CopyPlugin = require("copy-webpack-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');
const path = require('path');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');

module.exports = {
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    // we copy .ts files too because browsers can step debug them
                    from: 'src/',
                },
                {
                    from: 'node_modules/customary/.dist/bundled/customary.mjs',
                    to: 'node_modules/customary/.dist/bundled/',
                },
                {
                    context: 'node_modules',
                    from: 'chai/chai.js',
                    to: 'node_modules/chai/',
                },
                {
                    context: 'node_modules',
                    from: 'mocha/mocha.*',
                    to: 'node_modules/',
                }
            ]
        }),
        new RemovePlugin({
           after: {
               root: '.dist/development',
               include: [
                   '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
               ]
           }
        }),
        new ReplaceInFileWebpackPlugin([{
            dir: '.dist/development',
            test: /\.html$/,
            rules: [
                {
                    // code: only used in development (live compile)
                    search: /,?\s*\n\s+"#customary\/": ".*"/m,
                    replace: '',
                },
                {
                    // code: only used in development (bundled mjs has lit essentials)
                    search: /,?\s*\n\s+"#customary\/lit": ".*"/m,
                    replace: '',
                },
                {
                    // code: from development (live compile) to production (bundled)
                    search: /("#customary": ".*)node_modules\/customary\/web\/_script\/now.js/g,
                    replace: '$1node_modules/customary/.dist/bundled/customary.mjs',
                },
                {
                    // node_modules: from development (sibling) to production (child)
                    search: / "(.*)..\/node_modules(.*)"/g,
                    replace: ' "$1./node_modules$2"',
                },
            ]
        }]),
    ],
    mode: "none",
    entry: './webpack-entry-SKIP.json',
    output: {
        path: path.resolve(__dirname, '.dist/development'),
        filename: '__JUST_HERE_BECAUSE_CANT_SKIP_WEBPACK_ENTRY.js',
    },
}
