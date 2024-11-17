const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('obj', 'mtl', 'jpg', 'png', 'jpeg');

module.exports = defaultConfig; 