const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier: "Pict-Content",

	DefaultRenderable: "Pict-Content-Display",
	DefaultDestinationAddress: "#Pict-Content-Container",

	AutoRender: false,

	CSS: /*css*/`
		.pict-content {
			padding: 2em 3em;
			max-width: 900px;
			margin: 0 auto;
		}
		.pict-content-loading {
			display: flex;
			align-items: center;
			justify-content: center;
			min-height: 200px;
			color: #8A7F72;
			font-size: 1em;
		}
		.pict-content h1 {
			font-size: 2em;
			color: #3D3229;
			border-bottom: 1px solid #DDD6CA;
			padding-bottom: 0.3em;
			margin-top: 0;
		}
		.pict-content h2 {
			font-size: 1.5em;
			color: #3D3229;
			border-bottom: 1px solid #EAE3D8;
			padding-bottom: 0.25em;
			margin-top: 1.5em;
		}
		.pict-content h3 {
			font-size: 1.25em;
			color: #3D3229;
			margin-top: 1.25em;
		}
		.pict-content h4, .pict-content h5, .pict-content h6 {
			color: #5E5549;
			margin-top: 1em;
		}
		.pict-content p {
			line-height: 1.7;
			color: #423D37;
			margin: 0.75em 0;
		}
		.pict-content a {
			color: #2E7D74;
			text-decoration: none;
		}
		.pict-content a:hover {
			text-decoration: underline;
		}
		.pict-content pre {
			background: #3D3229;
			color: #E8E0D4;
			padding: 1.25em;
			border-radius: 6px;
			overflow-x: auto;
			line-height: 1.5;
			font-size: 0.9em;
		}
		.pict-content code {
			background: #F0ECE4;
			padding: 0.15em 0.4em;
			border-radius: 3px;
			font-size: 0.9em;
			color: #9E6B47;
		}
		.pict-content-code-wrap {
			display: flex;
			flex-direction: row;
			font-family: 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'Courier New', monospace;
			font-size: 14px;
			line-height: 1.5;
			border-radius: 6px;
			overflow: auto;
			margin: 1em 0;
			background: #3D3229;
		}
		.pict-content-code-wrap .pict-content-code-line-numbers {
			position: sticky;
			left: 0;
			width: 40px;
			min-width: 40px;
			padding: 1.25em 0;
			text-align: right;
			background: #342A22;
			border-right: 1px solid #4A3F35;
			color: #8A7F72;
			font-size: 13px;
			line-height: 1.5;
			user-select: none;
			pointer-events: none;
			box-sizing: border-box;
			z-index: 1;
		}
		.pict-content-code-wrap .pict-content-code-line-numbers span {
			display: block;
			padding: 0 8px 0 0;
		}
		.pict-content-code-wrap pre {
			margin: 0;
			background: #3D3229;
			color: #E8E0D4;
			padding: 1.25em 1.25em 1.25em 8px;
			border-radius: 0 6px 6px 0;
			overflow-x: auto;
			line-height: 1.5;
			font-size: inherit;
			flex: 1;
			min-width: 0;
		}
		.pict-content-code-wrap pre code {
			background: none;
			padding: 0;
			color: inherit;
			font-size: inherit;
			font-family: inherit;
		}
		.pict-content-code-wrap .keyword { color: #C678DD; }
		.pict-content-code-wrap .string { color: #98C379; }
		.pict-content-code-wrap .number { color: #D19A66; }
		.pict-content-code-wrap .comment { color: #7F848E; font-style: italic; }
		.pict-content-code-wrap .operator { color: #56B6C2; }
		.pict-content-code-wrap .punctuation { color: #E8E0D4; }
		.pict-content-code-wrap .function-name { color: #61AFEF; }
		.pict-content-code-wrap .property { color: #E06C75; }
		.pict-content-code-wrap .tag { color: #E06C75; }
		.pict-content-code-wrap .attr-name { color: #D19A66; }
		.pict-content-code-wrap .attr-value { color: #98C379; }
		.pict-content pre code {
			background: none;
			padding: 0;
			color: inherit;
			font-size: inherit;
		}
		.pict-content blockquote {
			border-left: 4px solid #2E7D74;
			margin: 1em 0;
			padding: 0.5em 1em;
			background: #F7F5F0;
			color: #5E5549;
		}
		.pict-content blockquote p {
			margin: 0.25em 0;
		}
		.pict-content ul, .pict-content ol {
			padding-left: 2em;
			line-height: 1.8;
		}
		.pict-content li {
			margin: 0.25em 0;
			color: #423D37;
		}
		.pict-content hr {
			border: none;
			border-top: 1px solid #DDD6CA;
			margin: 2em 0;
		}
		.pict-content table {
			width: 100%;
			border-collapse: collapse;
			margin: 1em 0;
		}
		.pict-content table th {
			background: #F5F0E8;
			border: 1px solid #DDD6CA;
			padding: 0.6em 0.8em;
			text-align: left;
			font-weight: 600;
			color: #3D3229;
		}
		.pict-content table td {
			border: 1px solid #DDD6CA;
			padding: 0.5em 0.8em;
			color: #423D37;
		}
		.pict-content table tr:nth-child(even) {
			background: #F7F5F0;
		}
		.pict-content img {
			max-width: 100%;
			height: auto;
		}
		.pict-content pre.mermaid {
			background: #fff;
			color: #3D3229;
			text-align: center;
			padding: 1em;
		}
		.pict-content .pict-content-katex-display {
			text-align: center;
			margin: 1em 0;
			padding: 0.5em;
			overflow-x: auto;
		}
		.pict-content .pict-content-katex-inline {
			display: inline;
		}
	`,

	Templates:
	[
		{
			Hash: "Pict-Content-Template",
			Template: /*html*/`
<div class="pict-content" id="Pict-Content-Body">
	<div class="pict-content-loading">Loading content...</div>
</div>
`
		}
	],

	Renderables:
	[
		{
			RenderableHash: "Pict-Content-Display",
			TemplateHash: "Pict-Content-Template",
			DestinationAddress: "#Pict-Content-Container",
			RenderMethod: "replace"
		}
	]
};

class PictContentView extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);
	}

	/**
	 * Display parsed HTML content in the content area.
	 *
	 * @param {string} pHTMLContent - The HTML to display
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */
	displayContent(pHTMLContent, pContainerID)
	{
		let tmpContainerID = pContainerID || 'Pict-Content-Body';

		this.pict.ContentAssignment.assignContent('#' + tmpContainerID, pHTMLContent);

		// Scroll to top of content area
		let tmpContentContainer = document.getElementById(tmpContainerID);
		if (tmpContentContainer && tmpContentContainer.parentElement)
		{
			tmpContentContainer.parentElement.scrollTop = 0;
		}

		// Post-render: initialize Mermaid diagrams if mermaid is available
		this.renderMermaidDiagrams(tmpContainerID);

		// Post-render: render KaTeX equations if katex is available
		this.renderKaTeXEquations(tmpContainerID);
	}

	/**
	 * Render any Mermaid diagram blocks in the content area.
	 * Mermaid blocks are `<pre class="mermaid">` elements produced by parseMarkdown.
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */
	renderMermaidDiagrams(pContainerID)
	{
		if (typeof mermaid === 'undefined')
		{
			return;
		}

		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpContentBody = document.getElementById(tmpContainerID);
		if (!tmpContentBody)
		{
			return;
		}

		let tmpMermaidElements = tmpContentBody.querySelectorAll('pre.mermaid');
		if (tmpMermaidElements.length < 1)
		{
			return;
		}

		// mermaid.run() will process all pre.mermaid elements in the container
		try
		{
			mermaid.run({ nodes: tmpMermaidElements });
		}
		catch (pError)
		{
			this.log.error('Mermaid rendering error: ' + pError.message);
		}
	}

	/**
	 * Render KaTeX inline and display math elements in the content area.
	 * Inline: `<span class="pict-content-katex-inline">`
	 * Display: `<div class="pict-content-katex-display">`
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */
	renderKaTeXEquations(pContainerID)
	{
		if (typeof katex === 'undefined')
		{
			return;
		}

		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpContentBody = document.getElementById(tmpContainerID);
		if (!tmpContentBody)
		{
			return;
		}

		// Render inline math
		let tmpInlineElements = tmpContentBody.querySelectorAll('.pict-content-katex-inline');
		for (let i = 0; i < tmpInlineElements.length; i++)
		{
			try
			{
				katex.render(tmpInlineElements[i].textContent, tmpInlineElements[i], { throwOnError: false, displayMode: false });
			}
			catch (pError)
			{
				this.log.warn('KaTeX inline error: ' + pError.message);
			}
		}

		// Render display math
		let tmpDisplayElements = tmpContentBody.querySelectorAll('.pict-content-katex-display');
		for (let i = 0; i < tmpDisplayElements.length; i++)
		{
			try
			{
				katex.render(tmpDisplayElements[i].textContent, tmpDisplayElements[i], { throwOnError: false, displayMode: true });
			}
			catch (pError)
			{
				this.log.warn('KaTeX display error: ' + pError.message);
			}
		}
	}

	/**
	 * Show a loading indicator.
	 *
	 * @param {string} [pMessage] - Loading message (defaults to 'Loading content...')
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 */
	showLoading(pMessage, pContainerID)
	{
		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpMessage = pMessage || 'Loading content...';
		this.pict.ContentAssignment.assignContent('#' + tmpContainerID, '<div class="pict-content-loading">' + tmpMessage + '</div>');
	}
}

module.exports = PictContentView;

module.exports.default_configuration = _ViewConfiguration;
