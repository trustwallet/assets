const { override, addDecoratorsLegacy, disableEsLint, overrideDevServer, watchAll } = require('customize-cra');

const rewiredMap = () => config => {
  config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
  return config;
};

module.exports = {
  webpack: override(
    // enable legacy decorators babel plugin
    addDecoratorsLegacy(),
    // usual webpack plugin
    disableEsLint(),
    rewiredMap()
  ),
  devServer: overrideDevServer(
    // dev server plugin
    watchAll()
  )
};
