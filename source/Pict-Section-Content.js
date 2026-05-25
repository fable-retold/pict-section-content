// The container for all the Pict-Section-Content related code.

// The main content view class
module.exports = require('./views/Pict-View-Content.js');

// The content provider (markdown parsing, HTML escaping)
module.exports.PictContentProvider = require('./providers/Pict-Provider-Content.js');

// A thin demo view that auto-registers the provider, reads markdown
// from an AppData address, and pushes parsed HTML through the base
// view's displayContent pipeline.  Used by the docuserve playground;
// host applications can pick it up too if they just want "render this
// markdown blob" without writing the parse-and-display glue.
module.exports.PictContentDemoView = require('./views/PictView-Content-Demo.js');
