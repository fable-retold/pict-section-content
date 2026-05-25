// Pict-Section-Content — Demo view
//
// A thin renderable wrapper around the canonical Pict-View-Content view.
// The base view is "lazy" — it shows a Loading placeholder until its host
// application explicitly calls `displayContent(parsedHTML)`.  That works
// fine when an application has its own page logic, but it's awkward for
// the docuserve playground (which doesn't know anything about
// markdown / parseMarkdown).
//
// This demo view bridges that gap:
//   1. Ensures the PictContentProvider is registered with `pict`.
//   2. Reads markdown text from an AppData address (configurable via
//      `MarkdownDataAddress`, e.g. "AppData.ContentDemo.Markdown").
//   3. On every render, parses the markdown via the provider and calls
//      the parent view's `displayContent` to push HTML into the DOM.
//
// Host applications that need anything more elaborate (navigation,
// multiple documents, link resolvers) should keep using the canonical
// Pict-View-Content view directly.  This demo view exists for the
// playground and other "just render this markdown blob" surfaces.

const libPictViewContent = require('./Pict-View-Content.js');
const libPictContentProvider = require('../providers/Pict-Provider-Content.js');

const _ViewConfiguration =
{
	ViewIdentifier: "Pict-Content-Demo",

	DefaultRenderable: "Pict-Content-Display",
	DefaultDestinationAddress: "#Pict-Content-Container",

	// Where to read the markdown source from. Resolved against the
	// pict instance with simple dot-walking — "AppData.X.Y.Z".
	MarkdownDataAddress: "AppData.ContentDemo.Markdown",

	// AutoRender on, so the playground's wrapper just instantiates the
	// view and the markdown shows up on next tick.
	AutoRender: true,

	// Inherit CSS / Templates / Renderables from the base view so we
	// render into the same #Pict-Content-Container with the same shell.
	CSS: libPictViewContent.default_configuration.CSS,
	Templates: libPictViewContent.default_configuration.Templates,
	Renderables: libPictViewContent.default_configuration.Renderables
};

class PictContentDemoView extends libPictViewContent
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Ensure the content provider is registered. Use a stable hash
		// so repeat instantiation is a no-op.
		let tmpProviderHash = 'Pict-Content';
		if (!this.pict.providers[tmpProviderHash])
		{
			this.pict.addProvider(tmpProviderHash, libPictContentProvider.default_configuration, libPictContentProvider);
		}
	}

	/**
	 * Walk a dotted address ("AppData.X.Y.Z") against the pict instance
	 * and return the value, or null if any segment is missing.
	 */
	_readMarkdownFromAddress()
	{
		let tmpAddress = this.options.MarkdownDataAddress;
		if (!tmpAddress || typeof tmpAddress !== 'string')
		{
			return null;
		}
		let tmpParts = tmpAddress.split('.');
		let tmpCurrent = this.pict;
		for (let i = 0; i < tmpParts.length; i++)
		{
			if (tmpCurrent === null || tmpCurrent === undefined)
			{
				return null;
			}
			tmpCurrent = tmpCurrent[tmpParts[i]];
		}
		return (typeof tmpCurrent === 'string') ? tmpCurrent : null;
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		// Pull markdown from AppData and push parsed HTML through the
		// parent view's pipeline (which also wires Mermaid / KaTeX /
		// fullscreen viewers).
		let tmpMarkdown = this._readMarkdownFromAddress();
		let tmpProvider = this.pict.providers['Pict-Content'];
		if (tmpProvider && typeof tmpMarkdown === 'string')
		{
			let tmpHTML = tmpProvider.parseMarkdown(tmpMarkdown);
			this.displayContent(tmpHTML);
		}

		this.pict.CSSMap.injectCSS();
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = PictContentDemoView;

module.exports.default_configuration = _ViewConfiguration;
