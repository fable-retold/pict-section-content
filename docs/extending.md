# Extending the View

The `PictContentView` class is designed to be extended. Consumers inherit the content CSS, templates, and post-render hooks, then customize the container IDs, loading messages, or add application-specific behavior.

## Basic Extension

Override `displayContent` and `showLoading` to pass your own container ID:

```javascript
const libPictContentView = require('pict-section-content');

const _ViewConfiguration =
{
	ViewIdentifier: "MyApp-Content",

	DefaultRenderable: "MyApp-Content-Display",
	DefaultDestinationAddress: "#MyApp-Content-Container",

	AutoRender: false,

	Templates:
	[
		{
			Hash: "MyApp-Content-Template",
			Template: '<div class="pict-content" id="MyApp-Content-Body"><div class="pict-content-loading">Loading...</div></div>'
		}
	],

	Renderables:
	[
		{
			RenderableHash: "MyApp-Content-Display",
			TemplateHash: "MyApp-Content-Template",
			DestinationAddress: "#MyApp-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class MyContentView extends libPictContentView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	displayContent(pHTMLContent)
	{
		super.displayContent(pHTMLContent, 'MyApp-Content-Body');
	}

	showLoading()
	{
		super.showLoading('Loading content...', 'MyApp-Content-Body');
	}
}

module.exports = MyContentView;
module.exports.default_configuration = _ViewConfiguration;
```

The CSS from the parent class is inherited automatically. The `.pict-content` wrapper class in your template picks up all the content styling.

## Real-World Example: pict-docuserve

The `pict-docuserve` documentation server extends `pict-section-content` for its content display. Here is the pattern it uses:

```javascript
const libPictContentView = require('pict-section-content');

const _ViewConfiguration =
{
	ViewIdentifier: "Docuserve-Content",
	DefaultRenderable: "Docuserve-Content-Display",
	DefaultDestinationAddress: "#Docuserve-Content-Container",
	AutoRender: false,

	// Application-specific CSS added alongside inherited content CSS
	CSS: /*css*/`
		.docuserve-not-found {
			text-align: center;
			padding: 2em;
			color: #8A7F72;
		}
	`,

	Templates:
	[
		{
			Hash: "Docuserve-Content-Template",
			Template: '<div class="pict-content" id="Docuserve-Content-Body"><div class="pict-content-loading">Loading documentation...</div></div>'
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Docuserve-Content-Display",
			TemplateHash: "Docuserve-Content-Template",
			DestinationAddress: "#Docuserve-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class DocuserveContentView extends libPictContentView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	displayContent(pHTMLContent)
	{
		super.displayContent(pHTMLContent, 'Docuserve-Content-Body');
	}

	showLoading()
	{
		super.showLoading('Loading documentation...', 'Docuserve-Content-Body');
	}
}
```

Key points from this pattern:

1. **Custom container ID** -- `'Docuserve-Content-Body'` instead of the default `'Pict-Content-Body'`
2. **Additional CSS** -- Application-specific styles alongside inherited content styles
3. **Custom loading message** -- `'Loading documentation...'` instead of the generic default
4. **Inherited rendering** -- Mermaid and KaTeX post-render hooks work automatically

## Adding Post-Render Behavior

Override `displayContent` to add behavior after the base content is displayed:

```javascript
class HighlightedContentView extends libPictContentView
{
	displayContent(pHTMLContent, pContainerID)
	{
		super.displayContent(pHTMLContent, pContainerID);

		// Add syntax highlighting after content is rendered
		this.highlightCodeBlocks(pContainerID);
	}

	highlightCodeBlocks(pContainerID)
	{
		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpContainer = document.getElementById(tmpContainerID);
		if (!tmpContainer || typeof hljs === 'undefined')
		{
			return;
		}

		let tmpCodeBlocks = tmpContainer.querySelectorAll('pre code');
		for (let i = 0; i < tmpCodeBlocks.length; i++)
		{
			hljs.highlightElement(tmpCodeBlocks[i]);
		}
	}
}
```

## Using with a Provider

Typically, the view is paired with the content provider. The provider parses markdown and the view displays the result:

```javascript
const libPictSectionContent = require('pict-section-content');
const PictContentProvider = libPictSectionContent.PictContentProvider;

// Register both provider and view
let tmpProvider = tmpPict.addProvider('Content',
	PictContentProvider.default_configuration, PictContentProvider);

let tmpView = tmpPict.addView('Content',
	libPictSectionContent.default_configuration, libPictSectionContent);

// Parse and display
let tmpHTML = tmpProvider.parseMarkdown(pMarkdownText);
tmpView.render();
tmpView.displayContent(tmpHTML);
```
