const { resolve } = require('path');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'test/**/*',
    ],
    preprocessors: {
      'src/**/*': ['babel', 'coverage'],
      'test/**/*': ['webpack', 'sourcemap'],
    },
    webpack: {
      devtool: 'cheap-module-eval-source-map',
      module: {
        rules: [{
          test: /\.js$/,
          include: [
            resolve(__dirname, 'src'),
            resolve(__dirname, 'test'),
          ],
          use: { loader: 'babel-loader' },
        }],
      },
      plugins: [
        new webpack.EnvironmentPlugin({
          ISO_LOG: false,
          WEB_ENV: true,
        }),
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    client: { captureConsole: true },
    coverageReporter: {
      reporters: [
        { type: 'lcov', dir: 'coverage/' },
        { type: 'text-summary' },
      ],
      check: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  });
};
