exports.config = {
  namespace: 'gx-web-controls',
  generateDistribution: true,
  bundles: [
    { components: ['gx-textblock', 'gx-button'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
