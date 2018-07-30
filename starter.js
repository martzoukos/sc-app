// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
// I did this to support ES6-like import statements
require('babel-register')({
    presets: [ 'env' ]
})

// Import the rest of our application.
module.exports = require('./app.js')
