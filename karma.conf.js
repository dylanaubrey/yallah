const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
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
    reporters: ['progress', 'coverage'],
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
