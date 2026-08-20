const libPictView = require('pict-view');

const libContentCSS = require('../Pict-Content-CSS.js');

const _ViewConfiguration =
{
	ViewIdentifier: "Pict-Content",

	DefaultRenderable: "Pict-Content-Display",
	DefaultDestinationAddress: "#Pict-Content-Container",

	AutoRender: false,

	// Shared with the provider under one hash so the CSS injects once whether the view, the
	// provider (parseMarkdown), or both are used.
	CSS: libContentCSS,
	CSSHash: 'Pict-Section-Content-CSS',

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

		// Ensure the container carries the `.pict-content` class so the
		// 30+ theme-scoped CSS rules below (`.pict-content a`, `.pict-content
		// h1`, `.pict-content pre`, ...) actually match when a host passes
		// a custom container ID.  Idempotent — re-adding the class is a
		// no-op if it's already there from the host's markup.
		if (tmpContentContainer && !tmpContentContainer.classList.contains('pict-content'))
		{
			tmpContentContainer.classList.add('pict-content');
		}

		// Tag images and code blocks immediately so they're clickable.
		// Mermaid blocks are tagged after mermaid.run() resolves (see below).
		this.enableFullscreenViewers(tmpContainerID, { skipMermaid: true });

		// Post-render: initialize Mermaid diagrams if mermaid is available.
		// Once mermaid finishes, retag so the rendered SVGs are also clickable.
		this.renderMermaidDiagrams(tmpContainerID);

		// Post-render: render ```excalidraw fenced scenes if the
		// pict-section-excalidraw wrapper bundle is loaded.  Each fence
		// becomes a static SVG (with the scene embedded for re-edit by
		// retold-content-system).
		this.renderExcalidrawDiagrams(tmpContainerID);

		// Post-render: make ```video cards for third-party players click-to-load.
		this.hydrateVideoEmbeds(tmpContainerID);

		// Post-render: render KaTeX equations if katex is available
		this.renderKaTeXEquations(tmpContainerID);
	}

	/**
	 * Wire the click-to-load video cards the markdown parser emitted for third-party players.
	 *
	 * Until a reader clicks, nothing has been requested from the provider: no player, no cookies, no
	 * thumbnail, no record that this document was opened. The click is the consent, and only then is the
	 * iframe created. This is the whole reason the card exists rather than an iframe -- an embed that loads
	 * with the page has already told a third party who is reading before anyone chose anything.
	 *
	 * Degrades to a link. With no JavaScript, or before this runs, the card is an anchor to the video, which
	 * is what a server-rendered or printed copy of a document is left with.
	 *
	 * Idempotent: a hydrated figure carries data-hydrated, so a re-render does not double-bind.
	 *
	 * @param {string} [pContainerID]
	 */
	hydrateVideoEmbeds(pContainerID)
	{
		if (typeof document === 'undefined') { return; }
		let tmpContainer = pContainerID ? document.getElementById(String(pContainerID).replace(/^#/, '')) : document;
		if (!tmpContainer) { return; }
		let tmpFigures = tmpContainer.querySelectorAll('.pict-content-video-embed[data-embed]:not([data-hydrated])');
		for (let i = 0; i < tmpFigures.length; i++)
		{
			let tmpFigure = tmpFigures[i];
			tmpFigure.setAttribute('data-hydrated', 'true');
			let tmpCard = tmpFigure.querySelector('.pict-content-video-card');
			if (!tmpCard) { continue; }
			tmpCard.addEventListener('click', (pEvent) =>
			{
				// A modified click is the reader asking for a new tab; leave the anchor to do that.
				if (pEvent.metaKey || pEvent.ctrlKey || pEvent.shiftKey || pEvent.altKey || pEvent.button > 0) { return; }
				pEvent.preventDefault();
				let tmpEmbed = tmpFigure.getAttribute('data-embed') || '';
				if (!tmpEmbed) { return; }
				let tmpFrame = document.createElement('iframe');
				tmpFrame.setAttribute('src', tmpEmbed);
				tmpFrame.setAttribute('title', (tmpFigure.querySelector('.pict-content-video-title') || {}).textContent || 'Video');
				tmpFrame.setAttribute('frameborder', '0');
				tmpFrame.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; picture-in-picture');
				tmpFrame.setAttribute('allowfullscreen', 'allowfullscreen');
				// The player gets no referrer: which document someone watched a video from is not the
				// provider's business, and nothing about playback needs it.
				tmpFrame.setAttribute('referrerpolicy', 'no-referrer');
				tmpFrame.className = 'pict-content-video-frame';
				tmpCard.parentNode.replaceChild(tmpFrame, tmpCard);
			});
		}
	}

	/**
	 * Render any `.pict-excalidraw-fence` placeholders inside the container
	 * as static SVGs using the pict-section-excalidraw wrapper bundle's
	 * exportToSvg helper.  Each fence's scene JSON travels through a
	 * URI-component-encoded data-scene attribute (placed there by the
	 * markdown parser in Pict-Provider-Content).
	 *
	 * Gracefully degrades when the wrapper bundle isn't on the page:
	 * leaves the loading placeholder visible with a one-time console hint.
	 * Idempotent — placeholders carry `data-rendered="true"` after the
	 * first pass so re-renders don't double-emit.
	 *
	 * @param {string} [pContainerID]
	 */
	renderExcalidrawDiagrams(pContainerID)
	{
		if (typeof document === 'undefined') return;

		let tmpContainerID = pContainerID || 'Pict-Content-Body';
		let tmpContentBody = document.getElementById(tmpContainerID);
		if (!tmpContentBody) return;

		let tmpFences = tmpContentBody.querySelectorAll('.pict-excalidraw-fence:not([data-rendered])');
		if (tmpFences.length < 1) return;

		let tmpVendor = (typeof window !== 'undefined') ? window.PictSectionExcalidrawVendor : null;
		if (!tmpVendor || typeof tmpVendor.exportToSvg !== 'function')
		{
			// Bundle not loaded — leave the placeholder visible.  The host
			// can load the wrapper bundle and call renderExcalidrawDiagrams
			// again, or include the script tag in its HTML shell.
			if (this.log && this.log.warn && !this._excalidrawBundleWarnLogged)
			{
				this.log.warn('pict-excalidraw fence(s) found but pict-section-excalidraw wrapper bundle is not loaded — leaving as placeholders.');
				this._excalidrawBundleWarnLogged = true;
			}
			return;
		}

		for (let i = 0; i < tmpFences.length; i++)
		{
			let tmpFence = tmpFences[i];
			let tmpEncoded = tmpFence.getAttribute('data-scene') || '';
			let tmpJson = '';
			try { tmpJson = decodeURIComponent(tmpEncoded); }
			catch (pErr) { tmpJson = ''; }

			let tmpScene;
			try { tmpScene = JSON.parse(tmpJson); }
			catch (pErr)
			{
				this._renderExcalidrawFenceError(tmpFence, 'Invalid scene JSON: ' + pErr.message);
				continue;
			}

			let tmpExportArgs = {
				elements: tmpScene.elements || [],
				appState: Object.assign({ exportEmbedScene: true }, tmpScene.appState || {}),
				files:    tmpScene.files    || {}
			};

			tmpVendor.exportToSvg(tmpExportArgs).then((pSvgEl) =>
			{
				if (!pSvgEl) return;
				// Style the SVG to fit the fence's content width while preserving aspect.
				pSvgEl.removeAttribute('width');
				pSvgEl.removeAttribute('height');
				pSvgEl.setAttribute('style', 'max-width: 100%; height: auto;');
				tmpFence.innerHTML = '';
				tmpFence.appendChild(pSvgEl);
				tmpFence.setAttribute('data-rendered', 'true');
			}).catch((pErr) =>
			{
				this._renderExcalidrawFenceError(tmpFence,
					'Excalidraw render failed: ' + (pErr && pErr.message ? pErr.message : pErr));
			});
		}
	}

	_renderExcalidrawFenceError(pFence, pMessage)
	{
		pFence.setAttribute('data-rendered', 'true');
		pFence.classList.add('pict-excalidraw-fence-error');
		pFence.innerHTML = '<div class="pict-excalidraw-fence-error-message"></div>';
		// Use textContent on the inner div so any user-supplied error
		// substrings (e.g. parser error positions) can't introduce HTML.
		let tmpMsg = pFence.querySelector('.pict-excalidraw-fence-error-message');
		if (tmpMsg) tmpMsg.textContent = pMessage;
		if (this.log && this.log.warn) this.log.warn('pict-excalidraw fence: ' + pMessage);
	}

	/**
	 * Lazily wire mermaid into the active pict-provider-theme via the
	 * shared Theme-Diagram-Adapter. The adapter handles:
	 *   - mermaid.initialize() with the canonical pict token map
	 *   - onApply subscription (re-init + re-render on theme/mode change)
	 *   - source stashing + data-processed reset for refresh
	 *
	 * Idempotent: the first call binds the adapter, subsequent calls are
	 * no-ops.  When the provider isn't installed, mermaid still gets
	 * initialized once against whatever CSS variables happen to exist.
	 */
	_ensureMermaidAdapter()
	{
		if (this._mermaidAdapter) { return this._mermaidAdapter; }
		if (typeof mermaid === 'undefined' || typeof window === 'undefined') { return null; }
		let tmpProvider = this.pict && this.pict.providers && this.pict.providers.Theme;
		try
		{
			if (tmpProvider && tmpProvider.diagram && typeof tmpProvider.diagram.adaptMermaid === 'function')
			{
				this._mermaidAdapter = tmpProvider.diagram.adaptMermaid(mermaid, {});
			}
			else
			{
				// No provider: lazy-require the adapter directly so the
				// static base theme still picks up any CSS vars on :root.
				let libDiagramAdapter = require('pict-provider-theme/source/Theme-Diagram-Adapter.js');
				libDiagramAdapter.initializeMermaid(mermaid);
				this._mermaidAdapter =
				{
					refresh: function () { return libDiagramAdapter.refreshMermaidDiagrams(); },
					reinitialize: function () { libDiagramAdapter.initializeMermaid(mermaid); },
					dispose: function () {},
					subscribed: false
				};
			}
		}
		catch (pError)
		{
			if (this.log && this.log.warn) { this.log.warn('Mermaid theme adapter init failed: ' + pError.message); }
			this._mermaidAdapter = null;
		}
		return this._mermaidAdapter;
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

		// First-time setup: bind the Theme-Diagram-Adapter, which initializes
		// mermaid against the active palette and subscribes to onApply so a
		// theme/mode change triggers re-render of every pre.mermaid on the page.
		this._ensureMermaidAdapter();

		// Cache each diagram's source on the element so theme-change
		// re-renders can restore it. Mermaid replaces textContent with
		// the rendered SVG during run(), so we lose the source unless
		// we stash it here first.
		let tmpProviderForStash = this.pict && this.pict.providers && this.pict.providers.Theme;
		if (tmpProviderForStash && tmpProviderForStash.diagram && typeof tmpProviderForStash.diagram.stashMermaidSource === 'function')
		{
			tmpProviderForStash.diagram.stashMermaidSource(tmpMermaidElements);
		}
		else
		{
			for (let i = 0; i < tmpMermaidElements.length; i++)
			{
				let tmpEl = tmpMermaidElements[i];
				if (!tmpEl.hasAttribute('data-mermaid-source'))
				{
					tmpEl.setAttribute('data-mermaid-source', tmpEl.textContent);
				}
			}
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
					// Strip mermaid 11's inline !important fill/stroke flags
					// so the view's theme-aware .theme-dark CSS rules can win
					// against the per-node colors mermaid bakes inline.  The
					// adapter strips on every re-render; the initial render
					// runs through mermaid.run() directly so we have to call
					// the strip here too.  Without this the dark-mode rect
					// fill override silently loses to inline `!important`.
					let tmpProvider = this.pict && this.pict.providers && this.pict.providers.Theme;
					if (tmpProvider && tmpProvider.diagram && typeof tmpProvider.diagram.stripMermaidStyleImportance === 'function')
					{
						tmpProvider.diagram.stripMermaidStyleImportance(tmpMermaidElements);
					}
					this.enableFullscreenViewers(tmpContainerID, { onlyMermaid: true });
				}).catch((pError) =>
				{
					this.log.error('Mermaid rendering error: ' + (pError && pError.message ? pError.message : pError));
				});
			}
			else
			{
				// Synchronous fallback (older mermaid)
				let tmpProvider = this.pict && this.pict.providers && this.pict.providers.Theme;
				if (tmpProvider && tmpProvider.diagram && typeof tmpProvider.diagram.stripMermaidStyleImportance === 'function')
				{
					tmpProvider.diagram.stripMermaidStyleImportance(tmpMermaidElements);
				}
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
			currentKind: '',
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

		// Wheel zoom — for images and mermaid diagrams.
		// For code blocks, let the browser handle native scrolling
		// so the user can scroll through long code.
		tmpStage.addEventListener('wheel', (pEvent) =>
		{
			if (tmpState.currentKind === 'code')
			{
				return;
			}
			pEvent.preventDefault();
			let tmpDelta = -pEvent.deltaY;
			let tmpStep = (tmpDelta > 0 ? 1 : -1) * 0.15;
			fZoomAt(tmpState.scale + tmpStep, pEvent.clientX, pEvent.clientY);
		}, { passive: false });

		// Drag-to-pan when zoomed (not for code blocks — they scroll natively)
		tmpStage.addEventListener('pointerdown', (pEvent) =>
		{
			if (tmpState.currentKind === 'code')
			{
				return;
			}
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
				tmpState.currentKind = tmpKind || '';
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
				else if (tmpKind === 'diagram')
				{
					// Inline SVG diagram (bespoke pict-renderer-graph / excalidraw):
					// clone the <svg> and drop its intrinsic sizing so the fullscreen
					// stage controls the dimensions -- same approach as mermaid, but
					// the source element may BE the svg or a wrapper around it.
					let tmpSvg = (String(pSourceEl.tagName).toLowerCase() === 'svg') ? pSourceEl : pSourceEl.querySelector('svg');
					if (tmpSvg)
					{
						tmpClone = tmpSvg.cloneNode(true);
						tmpClone.classList.add('pict-fullscreen-diagram-svg');
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

				// Hide zoom controls for code blocks (they scroll natively)
				let tmpZoomBtns = tmpOverlay.querySelectorAll('[data-action="zoom-in"], [data-action="zoom-out"], [data-action="zoom-reset"]');
				for (let i = 0; i < tmpZoomBtns.length; i++)
				{
					tmpZoomBtns[i].style.display = (tmpKind === 'code') ? 'none' : '';
				}

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
