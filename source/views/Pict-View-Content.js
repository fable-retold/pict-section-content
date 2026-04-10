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
			overflow: hidden;
			margin: 1em 0;
			background: #3D3229;
		}
		.pict-content-code-wrap .pict-content-code-line-numbers {
			width: 40px;
			min-width: 40px;
			padding: 1.25em 0;
			text-align: right;
			background: #342A22;
			border-right: 1px solid #4A3F35;
			color: #8A7F72;
			font-family: inherit;
			font-size: inherit;
			line-height: inherit;
			user-select: none;
			pointer-events: none;
			box-sizing: border-box;
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
			color: #2A241E;
			text-align: center;
			padding: 1em;
		}
		.pict-content pre.mermaid text,
		.pict-content pre.mermaid .nodeLabel,
		.pict-content pre.mermaid .edgeLabel,
		.pict-content pre.mermaid .label,
		.pict-content pre.mermaid .cluster-label,
		.pict-content pre.mermaid span,
		.pict-content pre.mermaid foreignObject p,
		.pict-content pre.mermaid foreignObject div,
		.pict-content pre.mermaid foreignObject span {
			color: #2A241E !important;
			fill: #2A241E !important;
		}
		.pict-content pre.mermaid .edgePath .path {
			stroke: #5E5549 !important;
		}
		.pict-content pre.mermaid .arrowheadPath {
			fill: #5E5549 !important;
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

		/* Fullscreen viewer for images and mermaid diagrams (click-to-zoom) */
		.pict-content [data-fullscreen-source] {
			cursor: zoom-in;
			outline: 1px solid transparent;
			outline-offset: 3px;
			border-radius: 4px;
			transition: outline-color 0.15s ease;
		}
		.pict-content [data-fullscreen-source]:hover {
			outline-color: var(--docuserve-accent, #2E7D74);
		}
		/* Code block container with hover-revealed action buttons */
		.pict-content-code-container {
			position: relative;
			display: flex;
			align-items: flex-start;
			gap: 8px;
			margin: 1em 0;
		}
		.pict-content-code-container > .pict-content-code-wrap {
			margin: 0;
			flex: 1 1 auto;
			min-width: 0;
		}
		.pict-content-code-actions {
			position: sticky;
			top: 64px;
			align-self: flex-start;
			display: flex;
			flex-direction: column;
			gap: 6px;
			flex: 0 0 auto;
			padding-top: 6px;
			opacity: 0;
			transform: translateX(-4px);
			transition: opacity 0.15s ease, transform 0.15s ease;
			pointer-events: none;
		}
		.pict-content-code-container:hover .pict-content-code-actions,
		.pict-content-code-container:focus-within .pict-content-code-actions {
			opacity: 1;
			transform: translateX(0);
			pointer-events: auto;
		}
		.pict-content-code-action-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 28px;
			height: 28px;
			padding: 0;
			background: var(--docuserve-bg-elevated, #FFFFFF);
			color: var(--docuserve-text-muted, #5E5549);
			border: 1px solid var(--docuserve-border, #DDD6CA);
			border-radius: 6px;
			cursor: pointer;
			box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
			transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
		}
		.pict-content-code-action-btn svg {
			display: block;
			width: 14px;
			height: 14px;
			stroke: currentColor;
			fill: none;
			stroke-width: 1.6;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
		.pict-content-code-action-btn:hover {
			background: var(--docuserve-accent, #2E7D74);
			color: #FFFFFF;
			border-color: var(--docuserve-accent, #2E7D74);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
		}
		.pict-content-code-action-btn:focus-visible {
			outline: 2px solid var(--docuserve-accent, #2E7D74);
			outline-offset: 2px;
		}
		.pict-content-code-action-btn.is-copied {
			background: var(--docuserve-accent, #2E7D74);
			color: #FFFFFF;
			border-color: var(--docuserve-accent, #2E7D74);
		}
		.pict-content-code-action-btn.is-copy-failed {
			background: #B23A3A;
			color: #FFFFFF;
			border-color: #B23A3A;
		}
		.pict-fullscreen-overlay {
			position: fixed;
			inset: 0;
			z-index: 9999;
			display: flex;
			flex-direction: column;
			background: rgba(0, 0, 0, 0.62);
			backdrop-filter: blur(6px);
			-webkit-backdrop-filter: blur(6px);
			color: var(--docuserve-text, #2A241E);
		}
		.pict-fullscreen-overlay[hidden] {
			display: none;
		}
		.pict-fullscreen-titlebar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1em;
			height: 48px;
			padding: 0 1em;
			background: var(--docuserve-bg-elevated, #FFFFFF);
			color: var(--docuserve-text-strong, #1A1612);
			border-bottom: 1px solid var(--docuserve-border, #DDD6CA);
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
			flex: 0 0 auto;
		}
		.pict-fullscreen-title {
			font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
			font-size: 0.95em;
			font-weight: 600;
			letter-spacing: 0.01em;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			color: var(--docuserve-text-strong, #1A1612);
		}
		.pict-fullscreen-controls {
			display: inline-flex;
			align-items: center;
			gap: 4px;
		}
		.pict-fullscreen-btn {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			padding: 0;
			background: transparent;
			border: 1px solid transparent;
			border-radius: 6px;
			color: var(--docuserve-text-muted, #5E5549);
			cursor: pointer;
			transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
		}
		.pict-fullscreen-btn svg {
			display: block;
			width: 16px;
			height: 16px;
			stroke: currentColor;
			fill: none;
			stroke-width: 1.75;
			stroke-linecap: round;
			stroke-linejoin: round;
		}
		.pict-fullscreen-btn:hover {
			background: var(--docuserve-border-soft, #EAE3D8);
			color: var(--docuserve-text-strong, #1A1612);
		}
		.pict-fullscreen-btn:focus-visible {
			outline: 2px solid var(--docuserve-accent, #2E7D74);
			outline-offset: 2px;
		}
		.pict-fullscreen-close:hover {
			background: var(--docuserve-accent, #2E7D74);
			color: #FFFFFF;
		}
		.pict-fullscreen-stage {
			flex: 1 1 auto;
			display: flex;
			align-items: center;
			justify-content: center;
			overflow: hidden;
			padding: 1.5em;
			cursor: zoom-in;
			touch-action: none;
		}
		.pict-fullscreen-stage.is-zoomed {
			cursor: grab;
		}
		.pict-fullscreen-stage.is-panning {
			cursor: grabbing;
		}
		.pict-fullscreen-content {
			display: flex;
			align-items: center;
			justify-content: center;
			max-width: 100%;
			max-height: 100%;
			transform-origin: center center;
			transition: transform 0.05s linear;
			will-change: transform;
		}
		.pict-fullscreen-content > * {
			box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
		}
		.pict-fullscreen-content .pict-fullscreen-img {
			max-width: 90vw;
			max-height: calc(100vh - 96px);
			width: auto;
			height: auto;
			object-fit: contain;
			background: var(--docuserve-bg-elevated, #FFFFFF);
			padding: 12px;
			border-radius: 6px;
		}
		.pict-fullscreen-content .pict-fullscreen-mermaid-svg {
			width: min(90vw, 1400px);
			height: auto;
			max-height: calc(100vh - 96px);
			background: var(--docuserve-mermaid-bg, #FFFFFF);
			padding: 16px;
			border-radius: 6px;
		}
		.pict-fullscreen-content .pict-fullscreen-codewrap {
			max-width: 90vw;
			max-height: calc(100vh - 96px);
			margin: 0;
			overflow: auto;
			box-shadow: 0 12px 48px rgba(0, 0, 0, 0.45);
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

		// Tag images and code blocks immediately so they're clickable.
		// Mermaid blocks are tagged after mermaid.run() resolves (see below).
		this.enableFullscreenViewers(tmpContainerID, { skipMermaid: true });

		// Post-render: initialize Mermaid diagrams if mermaid is available.
		// Once mermaid finishes, retag so the rendered SVGs are also clickable.
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

		// mermaid.run() will process all pre.mermaid elements in the container.
		// It returns a promise; once it resolves the inner SVG exists and we
		// can tag the diagrams as fullscreen-clickable.
		try
		{
			let tmpResult = mermaid.run({ nodes: tmpMermaidElements });
			if (tmpResult && typeof tmpResult.then === 'function')
			{
				tmpResult.then(() =>
				{
					this.enableFullscreenViewers(tmpContainerID, { onlyMermaid: true });
				}).catch((pError) =>
				{
					this.log.error('Mermaid rendering error: ' + (pError && pError.message ? pError.message : pError));
				});
			}
			else
			{
				// Synchronous fallback (older mermaid)
				this.enableFullscreenViewers(tmpContainerID, { onlyMermaid: true });
			}
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
	 * Walk the freshly-rendered content and tag images, mermaid diagrams,
	 * and fenced code blocks so they're click-to-fullscreen.  Also installs
	 * a single delegated click listener on the container the first time it
	 * is called for that container.
	 *
	 * @param {string} [pContainerID] - The container element ID (defaults to 'Pict-Content-Body')
	 * @param {Object} [pOptions] - { skipMermaid: bool, onlyMermaid: bool }
	 */
	enableFullscreenViewers(pContainerID, pOptions)
	{
		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpContentBody = document.getElementById(tmpContainerID);
		if (!tmpContentBody)
		{
			return;
		}
		let tmpOptions = pOptions || {};

		if (!tmpOptions.onlyMermaid)
		{
			// Images
			let tmpImages = tmpContentBody.querySelectorAll('img:not([data-fullscreen-source])');
			for (let i = 0; i < tmpImages.length; i++)
			{
				let tmpImg = tmpImages[i];
				tmpImg.setAttribute('data-fullscreen-source', 'image');
				let tmpAlt = tmpImg.getAttribute('alt');
				if (!tmpAlt)
				{
					let tmpSrc = tmpImg.getAttribute('src') || '';
					tmpAlt = tmpSrc.split('/').pop().split('?')[0] || 'Image';
				}
				tmpImg.setAttribute('data-fullscreen-title', tmpAlt);
			}

			// Code wraps (fenced blocks): do NOT tag for click-to-fullscreen —
			// that would conflict with text selection for copy/paste.
			// Instead wrap each in a container with hover-revealed action
			// buttons (fullscreen + copy) floating to the right.
			let tmpCodeWraps = tmpContentBody.querySelectorAll('.pict-content-code-wrap:not([data-code-actions-wired])');
			for (let i = 0; i < tmpCodeWraps.length; i++)
			{
				this._wireCodeActions(tmpCodeWraps[i]);
			}
		}

		if (!tmpOptions.skipMermaid)
		{
			// Mermaid diagrams (after mermaid.run() has replaced the inner pre)
			let tmpMermaid = tmpContentBody.querySelectorAll('pre.mermaid:not([data-fullscreen-source])');
			for (let i = 0; i < tmpMermaid.length; i++)
			{
				let tmpPre = tmpMermaid[i];
				// Only tag once mermaid has actually rendered an svg into it
				if (tmpPre.querySelector('svg'))
				{
					tmpPre.setAttribute('data-fullscreen-source', 'mermaid');
					tmpPre.setAttribute('data-fullscreen-title', 'Mermaid Diagram');
				}
			}
		}

		// Install delegated click listener once per container.
		if (!tmpContentBody.__pictFullscreenWired)
		{
			tmpContentBody.__pictFullscreenWired = true;
			tmpContentBody.addEventListener('click', (pEvent) =>
			{
				let tmpTarget = pEvent.target;
				while (tmpTarget && tmpTarget !== tmpContentBody && !tmpTarget.hasAttribute('data-fullscreen-source'))
				{
					tmpTarget = tmpTarget.parentElement;
				}
				if (tmpTarget && tmpTarget !== tmpContentBody && tmpTarget.hasAttribute('data-fullscreen-source'))
				{
					pEvent.preventDefault();
					this._openFullscreen(tmpTarget);
				}
			});
		}
	}

	/**
	 * Wrap a fenced code block in a container that holds the existing
	 * .pict-content-code-wrap plus a hover-revealed action column with
	 * fullscreen + copy buttons.  The action column is sticky-positioned
	 * so it follows the page scroll while the user is alongside a long
	 * code block.
	 *
	 * @param {HTMLElement} pCodeWrap - The .pict-content-code-wrap element
	 */
	_wireCodeActions(pCodeWrap)
	{
		if (!pCodeWrap || pCodeWrap.hasAttribute('data-code-actions-wired'))
		{
			return;
		}
		pCodeWrap.setAttribute('data-code-actions-wired', 'true');

		// Determine the fullscreen title from the language tag, if any.
		let tmpCodeEl = pCodeWrap.querySelector('code[class*="language-"]');
		let tmpLang = 'Code';
		if (tmpCodeEl)
		{
			let tmpMatch = (tmpCodeEl.getAttribute('class') || '').match(/language-(\S+)/);
			if (tmpMatch)
			{
				tmpLang = tmpMatch[1] + ' code';
			}
		}
		pCodeWrap.setAttribute('data-code-language', tmpLang);

		// Build the wrapping container.
		let tmpContainer = document.createElement('div');
		tmpContainer.className = 'pict-content-code-container';

		let tmpActions = document.createElement('div');
		tmpActions.className = 'pict-content-code-actions';
		tmpActions.setAttribute('aria-hidden', 'false');

		let tmpFullscreenBtn = document.createElement('button');
		tmpFullscreenBtn.type = 'button';
		tmpFullscreenBtn.className = 'pict-content-code-action-btn';
		tmpFullscreenBtn.setAttribute('aria-label', 'Open code in fullscreen');
		tmpFullscreenBtn.setAttribute('title', 'Open in fullscreen');
		tmpFullscreenBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3 6 3 3 6 3"></polyline><polyline points="13 6 13 3 10 3"></polyline><polyline points="3 10 3 13 6 13"></polyline><polyline points="13 10 13 13 10 13"></polyline></svg>';

		let tmpCopyBtn = document.createElement('button');
		tmpCopyBtn.type = 'button';
		tmpCopyBtn.className = 'pict-content-code-action-btn';
		tmpCopyBtn.setAttribute('aria-label', 'Copy code to clipboard');
		tmpCopyBtn.setAttribute('title', 'Copy code');
		tmpCopyBtn.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="9" height="9" rx="1.25"></rect><path d="M11 5V3.25A1.25 1.25 0 0 0 9.75 2H3.25A1.25 1.25 0 0 0 2 3.25v6.5A1.25 1.25 0 0 0 3.25 11H5"></path></svg>';

		tmpActions.appendChild(tmpFullscreenBtn);
		tmpActions.appendChild(tmpCopyBtn);

		// Insert the container in the place of the code wrap, then move the
		// code wrap inside it followed by the actions column.
		let tmpParent = pCodeWrap.parentNode;
		tmpParent.insertBefore(tmpContainer, pCodeWrap);
		tmpContainer.appendChild(pCodeWrap);
		tmpContainer.appendChild(tmpActions);

		// Click handlers
		tmpFullscreenBtn.addEventListener('click', (pEvent) =>
		{
			pEvent.preventDefault();
			pEvent.stopPropagation();
			this._openCodeFullscreen(pCodeWrap);
		});
		tmpCopyBtn.addEventListener('click', (pEvent) =>
		{
			pEvent.preventDefault();
			pEvent.stopPropagation();
			this._copyCodeToClipboard(pCodeWrap, tmpCopyBtn);
		});
	}

	/**
	 * Open the fullscreen overlay for a fenced code block.  Reuses the
	 * same overlay singleton as image / mermaid.
	 */
	_openCodeFullscreen(pCodeWrap)
	{
		let tmpOverlay = this._buildFullscreenOverlay();
		// Stamp the source attributes the overlay's open() expects.
		pCodeWrap.setAttribute('data-fullscreen-source', 'code');
		pCodeWrap.setAttribute('data-fullscreen-title', pCodeWrap.getAttribute('data-code-language') || 'Code');
		tmpOverlay.open(pCodeWrap);
	}

	/**
	 * Copy the raw text of a code block to the clipboard and briefly flash
	 * a "Copied!" state on the trigger button.
	 */
	_copyCodeToClipboard(pCodeWrap, pButton)
	{
		let tmpCodeEl = pCodeWrap.querySelector('code');
		let tmpText = tmpCodeEl ? tmpCodeEl.textContent : pCodeWrap.textContent;

		let fFlashOk = () =>
		{
			pButton.classList.add('is-copied');
			pButton.setAttribute('title', 'Copied!');
			setTimeout(() =>
			{
				pButton.classList.remove('is-copied');
				pButton.setAttribute('title', 'Copy code');
			}, 1400);
		};
		let fFlashFail = () =>
		{
			pButton.classList.add('is-copy-failed');
			pButton.setAttribute('title', 'Copy failed');
			setTimeout(() =>
			{
				pButton.classList.remove('is-copy-failed');
				pButton.setAttribute('title', 'Copy code');
			}, 1400);
		};

		try
		{
			if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function')
			{
				navigator.clipboard.writeText(tmpText).then(fFlashOk).catch(fFlashFail);
				return;
			}
		}
		catch (e)
		{
			// fall through to legacy fallback
		}

		// Legacy fallback for non-secure contexts.
		try
		{
			let tmpTextarea = document.createElement('textarea');
			tmpTextarea.value = tmpText;
			tmpTextarea.style.position = 'fixed';
			tmpTextarea.style.opacity = '0';
			document.body.appendChild(tmpTextarea);
			tmpTextarea.select();
			let tmpOk = document.execCommand('copy');
			document.body.removeChild(tmpTextarea);
			if (tmpOk) { fFlashOk(); } else { fFlashFail(); }
		}
		catch (e)
		{
			fFlashFail();
		}
	}

	/**
	 * Lazily build the singleton fullscreen overlay element and attach it
	 * to <body>.  Returns the existing instance if already built.
	 */
	_buildFullscreenOverlay()
	{
		if (PictContentView._FullscreenOverlay)
		{
			return PictContentView._FullscreenOverlay;
		}

		let tmpOverlay = document.createElement('div');
		tmpOverlay.className = 'pict-fullscreen-overlay';
		tmpOverlay.setAttribute('role', 'dialog');
		tmpOverlay.setAttribute('aria-modal', 'true');
		tmpOverlay.setAttribute('aria-labelledby', 'pict-fullscreen-title');
		tmpOverlay.setAttribute('hidden', '');
		tmpOverlay.innerHTML = ''
			+ '<div class="pict-fullscreen-titlebar">'
			+   '<span class="pict-fullscreen-title" id="pict-fullscreen-title"></span>'
			+   '<div class="pict-fullscreen-controls">'
			+     '<button type="button" class="pict-fullscreen-btn" data-action="zoom-out" aria-label="Zoom out" title="Zoom out"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line></svg></button>'
			+     '<button type="button" class="pict-fullscreen-btn" data-action="zoom-reset" aria-label="Reset zoom" title="Reset zoom"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5"></circle><line x1="8" y1="5" x2="8" y2="11"></line><line x1="5" y1="8" x2="11" y2="8"></line></svg></button>'
			+     '<button type="button" class="pict-fullscreen-btn" data-action="zoom-in" aria-label="Zoom in" title="Zoom in"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="3" y1="8" x2="13" y2="8"></line><line x1="8" y1="3" x2="8" y2="13"></line></svg></button>'
			+     '<button type="button" class="pict-fullscreen-btn pict-fullscreen-close" data-action="close" aria-label="Close" title="Close (Esc)"><svg viewBox="0 0 16 16" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12"></line><line x1="12" y1="4" x2="4" y2="12"></line></svg></button>'
			+   '</div>'
			+ '</div>'
			+ '<div class="pict-fullscreen-stage">'
			+   '<div class="pict-fullscreen-content"></div>'
			+ '</div>';
		document.body.appendChild(tmpOverlay);

		let tmpState = {
			scale: 1,
			translateX: 0,
			translateY: 0,
			isPanning: false,
			didPan: false,
			panStartX: 0,
			panStartY: 0,
			panOrigX: 0,
			panOrigY: 0,
			pinchInitialDistance: 0,
			pinchInitialScale: 1
		};

		let tmpStage = tmpOverlay.querySelector('.pict-fullscreen-stage');
		let tmpContent = tmpOverlay.querySelector('.pict-fullscreen-content');
		let tmpTitleEl = tmpOverlay.querySelector('.pict-fullscreen-title');

		let fApplyTransform = () =>
		{
			tmpContent.style.transform = 'translate(' + tmpState.translateX + 'px, ' + tmpState.translateY + 'px) scale(' + tmpState.scale + ')';
			tmpStage.classList.toggle('is-zoomed', tmpState.scale > 1.001);
		};

		let fClampScale = (pValue) =>
		{
			if (pValue < 0.5) return 0.5;
			if (pValue > 8) return 8;
			return pValue;
		};

		let fZoomAt = (pNewScale, pAnchorClientX, pAnchorClientY) =>
		{
			let tmpClamped = fClampScale(pNewScale);
			let tmpStageRect = tmpStage.getBoundingClientRect();
			let tmpAnchorX = (pAnchorClientX !== undefined) ? pAnchorClientX : (tmpStageRect.left + tmpStageRect.width / 2);
			let tmpAnchorY = (pAnchorClientY !== undefined) ? pAnchorClientY : (tmpStageRect.top + tmpStageRect.height / 2);
			// Convert anchor into the local coordinate of the content (which is centered)
			let tmpCenterX = tmpStageRect.left + tmpStageRect.width / 2;
			let tmpCenterY = tmpStageRect.top + tmpStageRect.height / 2;
			let tmpDX = tmpAnchorX - tmpCenterX;
			let tmpDY = tmpAnchorY - tmpCenterY;
			let tmpRatio = tmpClamped / tmpState.scale;
			tmpState.translateX = tmpDX - tmpRatio * (tmpDX - tmpState.translateX);
			tmpState.translateY = tmpDY - tmpRatio * (tmpDY - tmpState.translateY);
			tmpState.scale = tmpClamped;
			fApplyTransform();
		};

		let fResetTransform = () =>
		{
			tmpState.scale = 1;
			tmpState.translateX = 0;
			tmpState.translateY = 0;
			fApplyTransform();
		};

		let fClose = () =>
		{
			tmpOverlay.setAttribute('hidden', '');
			tmpContent.innerHTML = '';
			fResetTransform();
			document.documentElement.style.removeProperty('overflow');
			document.removeEventListener('keydown', fKeydown);
		};

		let fKeydown = (pEvent) =>
		{
			if (pEvent.key === 'Escape')
			{
				pEvent.preventDefault();
				fClose();
			}
			else if (pEvent.key === '+' || pEvent.key === '=')
			{
				pEvent.preventDefault();
				fZoomAt(tmpState.scale + 0.25);
			}
			else if (pEvent.key === '-' || pEvent.key === '_')
			{
				pEvent.preventDefault();
				fZoomAt(tmpState.scale - 0.25);
			}
			else if (pEvent.key === '0')
			{
				pEvent.preventDefault();
				fResetTransform();
			}
		};

		// Backdrop click closes (only when clicking the backdrop itself or
		// the stage area, not the inner content).  Suppress if a
		// drag-to-pan just finished — the pointerup that ended the pan
		// also fires a click event which we must ignore.
		tmpOverlay.addEventListener('click', (pEvent) =>
		{
			if (tmpState.didPan)
			{
				tmpState.didPan = false;
				return;
			}
			if (pEvent.target === tmpOverlay || pEvent.target === tmpStage)
			{
				fClose();
			}
		});

		// Toolbar buttons
		tmpOverlay.querySelectorAll('[data-action]').forEach((pBtn) =>
		{
			pBtn.addEventListener('click', (pEvent) =>
			{
				pEvent.stopPropagation();
				let tmpAction = pBtn.getAttribute('data-action');
				if (tmpAction === 'close')
				{
					fClose();
				}
				else if (tmpAction === 'zoom-in')
				{
					fZoomAt(tmpState.scale + 0.25);
				}
				else if (tmpAction === 'zoom-out')
				{
					fZoomAt(tmpState.scale - 0.25);
				}
				else if (tmpAction === 'zoom-reset')
				{
					fResetTransform();
				}
			});
		});

		// Wheel zoom
		tmpStage.addEventListener('wheel', (pEvent) =>
		{
			pEvent.preventDefault();
			let tmpDelta = -pEvent.deltaY;
			let tmpStep = (tmpDelta > 0 ? 1 : -1) * 0.15;
			fZoomAt(tmpState.scale + tmpStep, pEvent.clientX, pEvent.clientY);
		}, { passive: false });

		// Drag-to-pan when zoomed
		tmpStage.addEventListener('pointerdown', (pEvent) =>
		{
			if (tmpState.scale <= 1.001)
			{
				return;
			}
			if (pEvent.target.closest('.pict-fullscreen-controls'))
			{
				return;
			}
			tmpState.isPanning = true;
			tmpState.panStartX = pEvent.clientX;
			tmpState.panStartY = pEvent.clientY;
			tmpState.panOrigX = tmpState.translateX;
			tmpState.panOrigY = tmpState.translateY;
			tmpStage.setPointerCapture(pEvent.pointerId);
			tmpStage.classList.add('is-panning');
		});
		tmpStage.addEventListener('pointermove', (pEvent) =>
		{
			if (!tmpState.isPanning)
			{
				return;
			}
			tmpState.translateX = tmpState.panOrigX + (pEvent.clientX - tmpState.panStartX);
			tmpState.translateY = tmpState.panOrigY + (pEvent.clientY - tmpState.panStartY);
			fApplyTransform();
		});
		let fEndPan = (pEvent) =>
		{
			if (!tmpState.isPanning)
			{
				return;
			}
			tmpState.isPanning = false;
			// Flag that a pan just ended so the subsequent click event
			// (which the browser fires after pointerup) does not close
			// the overlay via the backdrop-close handler.
			tmpState.didPan = true;
			tmpStage.classList.remove('is-panning');
			try { tmpStage.releasePointerCapture(pEvent.pointerId); } catch (e) {}
		};
		tmpStage.addEventListener('pointerup', fEndPan);
		tmpStage.addEventListener('pointercancel', fEndPan);

		// Touch pinch zoom
		let tmpActiveTouches = {};
		tmpStage.addEventListener('touchstart', (pEvent) =>
		{
			for (let i = 0; i < pEvent.touches.length; i++)
			{
				let tmpT = pEvent.touches[i];
				tmpActiveTouches[tmpT.identifier] = { x: tmpT.clientX, y: tmpT.clientY };
			}
			if (pEvent.touches.length === 2)
			{
				let tmpA = pEvent.touches[0];
				let tmpB = pEvent.touches[1];
				let tmpDX = tmpB.clientX - tmpA.clientX;
				let tmpDY = tmpB.clientY - tmpA.clientY;
				tmpState.pinchInitialDistance = Math.sqrt(tmpDX * tmpDX + tmpDY * tmpDY);
				tmpState.pinchInitialScale = tmpState.scale;
			}
		}, { passive: true });
		tmpStage.addEventListener('touchmove', (pEvent) =>
		{
			if (pEvent.touches.length === 2 && tmpState.pinchInitialDistance > 0)
			{
				pEvent.preventDefault();
				let tmpA = pEvent.touches[0];
				let tmpB = pEvent.touches[1];
				let tmpDX = tmpB.clientX - tmpA.clientX;
				let tmpDY = tmpB.clientY - tmpA.clientY;
				let tmpDist = Math.sqrt(tmpDX * tmpDX + tmpDY * tmpDY);
				let tmpRatio = tmpDist / tmpState.pinchInitialDistance;
				let tmpMidX = (tmpA.clientX + tmpB.clientX) / 2;
				let tmpMidY = (tmpA.clientY + tmpB.clientY) / 2;
				fZoomAt(tmpState.pinchInitialScale * tmpRatio, tmpMidX, tmpMidY);
			}
		}, { passive: false });
		tmpStage.addEventListener('touchend', () =>
		{
			tmpActiveTouches = {};
			tmpState.pinchInitialDistance = 0;
		});

		PictContentView._FullscreenOverlay = {
			element: tmpOverlay,
			content: tmpContent,
			titleEl: tmpTitleEl,
			state: tmpState,
			open: (pSourceEl) =>
			{
				let tmpTitle = pSourceEl.getAttribute('data-fullscreen-title') || '';
				tmpTitleEl.textContent = tmpTitle;
				tmpContent.innerHTML = '';

				let tmpKind = pSourceEl.getAttribute('data-fullscreen-source');
				let tmpClone;
				if (tmpKind === 'mermaid')
				{
					let tmpSvg = pSourceEl.querySelector('svg');
					if (tmpSvg)
					{
						tmpClone = tmpSvg.cloneNode(true);
						tmpClone.classList.add('pict-fullscreen-mermaid-svg');
						// Drop mermaid's inline max-width / width / height style so the
						// fullscreen CSS rule actually controls the size.
						tmpClone.removeAttribute('style');
						tmpClone.removeAttribute('width');
						tmpClone.removeAttribute('height');
					}
					else
					{
						tmpClone = pSourceEl.cloneNode(true);
					}
				}
				else if (tmpKind === 'image')
				{
					tmpClone = pSourceEl.cloneNode(true);
					tmpClone.classList.add('pict-fullscreen-img');
				}
				else
				{
					tmpClone = pSourceEl.cloneNode(true);
					tmpClone.classList.add('pict-fullscreen-codewrap');
				}
				tmpContent.appendChild(tmpClone);

				fResetTransform();
				tmpOverlay.removeAttribute('hidden');
				document.documentElement.style.overflow = 'hidden';
				document.addEventListener('keydown', fKeydown);
			},
			close: fClose
		};
		return PictContentView._FullscreenOverlay;
	}

	/**
	 * Open the fullscreen overlay for a tagged source element.
	 */
	_openFullscreen(pSourceEl)
	{
		let tmpOverlay = this._buildFullscreenOverlay();
		tmpOverlay.open(pSourceEl);
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
