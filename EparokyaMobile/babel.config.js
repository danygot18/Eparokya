// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: ['react-native-reanimated/plugin']
//   };
// };
// module.exports = {
//   presets: ['babel-preset-expo'],
//   plugins: ['react-native-reanimated/plugin'], // Add this line
// };

// with tamagui:
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
     '@tamagui/babel-plugin', 
      {
        components: ['tamagui'],
        config: './tamagui.config.js', // or .ts if using TypeScript
      },
    ],
    'react-native-reanimated/plugin',
  ],
}



