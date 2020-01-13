const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
const howler = path.join(__dirname, '/node_modules/howler/dist/howler.min.js');
const TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
    entry: {
        app: [
            path.resolve(__dirname, './src/index.js')
        ]
    },
    // entry: './src/Game',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
            'howler': howler
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: [".js", ".jsx"]
                },
                use: {
                    loader: "babel-loader"
                }
            }

        ]
    },
    plugins: [
        new TSLintPlugin({
            files: ['./src/**/*.ts']
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};
