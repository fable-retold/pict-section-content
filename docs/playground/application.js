// Application Code for the pict-section-content playground.
//
// `Base` is the synthesized PictApplication wrapper that registers the
// ContentDemo view from your Pict Config (under `ContentDemoViewConfig`).
// Return a class that extends `Base` to customize lifecycle hooks.
//
// The demo view auto-registers the PictContentProvider, reads the
// markdown source from `AppData.ContentDemo.Markdown`, parses it, and
// pushes the resulting HTML through the base view's displayContent
// pipeline (which also handles Mermaid + KaTeX post-processing if
// those globals are available).
//
// To get Mermaid diagrams and KaTeX equations rendered, load the
// `mermaid` and `katex` libraries.  The block below pulls them from
// jsdelivr the first time the iframe boots; once they're on `window`,
// the view's displayContent() finds them automatically.
//
return class extends Base
{
	onAfterInitialize()
	{
		super.onAfterInitialize();

		// Load KaTeX CSS once.
		if (!document.querySelector('link[data-pict-content-katex]'))
		{
			let tmpLink = document.createElement('link');
			tmpLink.rel = 'stylesheet';
			tmpLink.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css';
			tmpLink.setAttribute('data-pict-content-katex', 'true');
			document.head.appendChild(tmpLink);
		}

		// Helper to inject a <script> once.
		let fInjectScript = (pSrc, pOnLoad) =>
		{
			let tmpExisting = document.querySelector('script[data-src="' + pSrc + '"]');
			if (tmpExisting)
			{
				if (typeof pOnLoad === 'function') { pOnLoad(); }
				return;
			}
			let tmpScript = document.createElement('script');
			tmpScript.src = pSrc;
			tmpScript.setAttribute('data-src', pSrc);
			tmpScript.onload = pOnLoad || null;
			document.head.appendChild(tmpScript);
		};

		// Re-render the content view once Mermaid + KaTeX globals exist
		// so the diagram / equation blocks get post-processed.
		let fRerender = () =>
		{
			let tmpView = this.pict.views.ContentDemo;
			if (tmpView && typeof tmpView.render === 'function') { tmpView.render(); }
		};

		fInjectScript('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js', () =>
		{
			fInjectScript('https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.js', fRerender);
		});
	}
};
