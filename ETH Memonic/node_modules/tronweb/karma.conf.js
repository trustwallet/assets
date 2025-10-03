const globby = require('globby');
const puppeteer = require('puppeteer');

process.env.CHROME_BIN = puppeteer.executablePath();

const basePlugins = [
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
    'source-map-support'
];

const files = globby.sync([ 'test/**/*.test.js', '!test/**/abi.test.js', '!test/**/typedData.test.js' ]);

module.exports = function (config) {
    config.set({
        frameworks: [ 'mocha' ],
        browsers : [ 'ChromeHeadless', /* 'Firefox'  , 'Edge' */ ],
        preprocessors: {
            'test/**/*.test.js': [ 'webpack', 'sourcemap' ]
        },
        reporters: [ 'spec', 'coverage' ],
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text' },
                { type: 'text-summary' }
            ],
            instrumenterOptions: {
                istanbul: { noCompact: true }
            }
        },
        webpack: {
            output: {
                libraryTarget: 'umd',
                libraryExport: 'default',
                umdNamedDefine: true
            },
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /(test|node_modules|bower_components)/,
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/env', {
                                    targets: {
                                        browsers: [
                                            '>0.25%',
                                            'not dead'
                                        ]
                                    }
                                }]
                            ],
                            plugins: [
                                ...basePlugins,
                                "istanbul"
                            ]
                        },
                    }
                ]
            },
            resolve: {
                modules: [
                    'node_modules',
                    'src'
                ],
            },
            mode: process.env.NODE_ENV || 'development',
            target: 'web',
            node: {
                fs: "empty",
                module: "empty"
            }
        },
        webpackMiddleware: {
            noInfo: true
        },
        plugins: [
            require("karma-webpack"),
            require("istanbul-instrumenter-loader"),
            require("karma-mocha"),
            require("karma-coverage"),
            require("karma-chrome-launcher"),
            require("karma-spec-reporter"),
            require('karma-sourcemap-loader'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-firefox-launcher'),
            require('karma-edge-launcher')
        ],
        files
    });
};
