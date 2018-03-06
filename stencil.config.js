const sass = require('@stencil/sass');

exports.config = {
  namespace: 'gx-web-controls',
  generateDistribution: true,
  serviceWorker: false,
  plugins: [
    sass()
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
