const { getDefaultConfig } = require('expo/metro-config')
const { withNativewind } = require('nativewind/metro')

// globalClassNamePolyfill deja usar className en View y Text sin envolverlos
module.exports = withNativewind(getDefaultConfig(__dirname), {
  globalClassNamePolyfill: true,
})
