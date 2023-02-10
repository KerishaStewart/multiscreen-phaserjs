const path = require('path');

module.exports = {
  // Production Mode
  mode: "production",

  // Input file
  entry: '../src/game.js',

  // Output file
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};