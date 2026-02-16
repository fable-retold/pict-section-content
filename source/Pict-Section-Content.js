// The container for all the Pict-Section-Content related code.

// The main content view class
module.exports = require('./views/Pict-View-Content.js');

// The content provider (markdown parsing, HTML escaping)
module.exports.PictContentProvider = require('./providers/Pict-Provider-Content.js');
