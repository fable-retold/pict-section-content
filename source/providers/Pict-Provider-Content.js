const libPictProvider = require('pict-provider');
const libCreateHighlighter = require('pict-section-code').createHighlighter;

const libContentCSS = require('../Pict-Content-CSS.js');

/**
 * Content Provider for Pict Section Content
 *
 * A general-purpose markdown-to-HTML parser with support for:
 * - Headings, paragraphs, lists, blockquotes, horizontal rules
 * - Fenced code blocks with language tags (nested fence support)
 * - Syntax highlighting and line numbers for code blocks (via pict-section-code)
 * - Tables (GFM pipe syntax)
 * - Mermaid diagram blocks
 * - KaTeX math (inline and display)
 * - Bold, italic, inline code, links, images
 *
 * Link resolution is customizable via an optional callback.
 */
class PictContentProvider extends libPictProvider
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		// Register the content CSS at the PROVIDER layer. parseMarkdown emits the
		// .pict-content-code-wrap markup (a line-number gutter + a <pre>), and that CSS makes the
		// wrap a flex row so the numbers sit to the LEFT of the code. Consumers like the
		// inline-documentation reader use this provider WITHOUT instantiating the view, so the
		// view's CSS never shipped and the numbers stacked ABOVE the code -- the recurring bug.
		// Registering here fixes it for every consumer; the view uses the same hash, so it still
		// injects only once. (pict CLAUDE.md: providers must addCSS() themselves.)
		if (this.pict && this.pict.CSSMap && typeof this.pict.CSSMap.addCSS === 'function')
		{
			this.pict.CSSMap.addCSS('Pict-Section-Content-CSS', libContentCSS, 500);
		}
	}

	/**
	 * Highlight a code string using pict-section-code's syntax highlighter.
	 * Uses a mock element to interface with the highlighter's DOM-based API.
	 *
	 * @param {string} pCode - The raw code string
	 * @param {string} pLanguage - The language identifier (e.g. "javascript", "html")
	 * @returns {string} The syntax-highlighted HTML
	 */
	highlightCode(pCode, pLanguage)
	{
		if (!pCode)
		{
			return '';
		}

		let tmpHighlighter = libCreateHighlighter(pLanguage);
		// Create a mock element to interface with the highlighter
		let tmpMockElement = { textContent: pCode, innerHTML: '' };
		tmpHighlighter(tmpMockElement);
		return tmpMockElement.innerHTML;
	}

	/**
	 * Generate line number HTML for a code block.
	 *
	 * @param {string} pCode - The raw code string
	 * @returns {string} HTML string with line number spans
	 */
	generateLineNumbers(pCode)
	{
		if (!pCode)
		{
			return '<span>1</span>';
		}

		let tmpLineCount = pCode.split('\n').length;
		let tmpHTML = '';

		for (let i = 1; i <= tmpLineCount; i++)
		{
			tmpHTML += '<span>' + i + '</span>';
		}

		return tmpHTML;
	}

	/**
	 * Parse a markdown string into HTML.
	 *
	 * @param {string} pMarkdown - The raw markdown text
	 * @param {Function} [pLinkResolver] - Optional callback for link resolution: (pHref, pLinkText) => { href, target, rel } or null
	 * @param {Function} [pImageResolver] - Optional callback for image URL resolution: (pSrc, pAlt) => resolvedSrc or null
	 * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. Passed through to parseInline() for vocabulary term auto-linking.
	 * @returns {string} The parsed HTML
	 */
	parseMarkdown(pMarkdown, pLinkResolver, pImageResolver, pVocabularyResolver)
	{
		if (!pMarkdown)
		{
			return '';
		}

		let tmpLines = pMarkdown.split('\n');
		let tmpHTML = [];
		let tmpInCodeBlock = false;
		let tmpCodeFenceLength = 0;
		let tmpCodeLang = '';
		let tmpCodeLines = [];
		let tmpInList = false;
		let tmpListType = '';
		let tmpInBlockquote = false;
		let tmpBlockquoteLines = [];
		let tmpInMathBlock = false;
		let tmpMathLines = [];
		let tmpParagraphLines = [];

		// Helper to flush accumulated paragraph lines into a single <p> tag
		let fFlushParagraph = () =>
		{
			if (tmpParagraphLines.length > 0)
			{
				tmpHTML.push('<p>' + tmpParagraphLines.map((pLine) => { return this.parseInline(pLine, pLinkResolver, pImageResolver, pVocabularyResolver); }).join(' ') + '</p>');
				tmpParagraphLines = [];
			}
		};

		for (let i = 0; i < tmpLines.length; i++)
		{
			let tmpLine = tmpLines[i];

			// Display math blocks ($$...$$) — skip if inside a code block
			if (!tmpInCodeBlock && tmpLine.trim().match(/^\$\$/))
			{
				if (tmpInMathBlock)
				{
					// End math block
					tmpHTML.push('<div class="pict-content-katex-display">' + tmpMathLines.join('\n') + '</div>');
					tmpInMathBlock = false;
					tmpMathLines = [];
				}
				else
				{
					// Flush any pending paragraph
					fFlushParagraph();
					// Close any open list or blockquote
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
						tmpInList = false;
					}
					if (tmpInBlockquote)
					{
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
						tmpInBlockquote = false;
						tmpBlockquoteLines = [];
					}
					tmpInMathBlock = true;
				}
				continue;
			}

			if (tmpInMathBlock)
			{
				tmpMathLines.push(tmpLine);
				continue;
			}

			// Code blocks (fenced) — track fence length so ````x```` nests around ```y```
			let tmpFenceMatch = tmpLine.match(/^(`{3,})/);
			if (tmpFenceMatch)
			{
				let tmpFenceLen = tmpFenceMatch[1].length;

				if (tmpInCodeBlock)
				{
					// Only close if the closing fence is at least as long as the opening
					if (tmpFenceLen >= tmpCodeFenceLength && tmpLine.trim() === tmpFenceMatch[1])
					{
						// End code block
						if (tmpCodeLang === 'mermaid')
						{
							// Mermaid diagrams: output raw content for client-side rendering
							tmpHTML.push('<pre class="mermaid">' + tmpCodeLines.join('\n') + '</pre>');
						}
						else if (tmpCodeLang === 'video')
						{
							// Video: one fence, two outcomes, decided by where the video lives.
							// Self-hosted (a relative URL, or a file with a video extension) plays inline;
							// a third-party watch page becomes a click-to-load card. See videoEmbedHTML.
							tmpHTML.push(this.videoEmbedHTML(tmpCodeLines.join('\n')));
						}
						else if (tmpCodeLang === 'excalidraw')
						{
							// Excalidraw scenes: emit a placeholder div with the
							// scene JSON URI-component encoded into a data
							// attribute.  Pict-View-Content's
							// renderExcalidrawDiagrams() swaps these for rendered
							// SVGs once the wrapper bundle is ready.  We don't
							// validate the JSON here — invalid fences just stay
							// as the loading placeholder until the runtime
							// reports the error.
							let tmpRawScene = tmpCodeLines.join('\n');
							let tmpEncoded;
							try { tmpEncoded = encodeURIComponent(tmpRawScene); }
							catch (pErr) { tmpEncoded = ''; }
							tmpHTML.push('<div class="pict-excalidraw-fence" data-scene="' + tmpEncoded + '">' +
								'<div class="pict-excalidraw-fence-loading">Rendering Excalidraw diagram…</div>' +
								'</div>');
						}
						else
						{
							let tmpCodeText = tmpCodeLines.join('\n');
						let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
						let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
						tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code class="language-' + this.escapeHTML(tmpCodeLang) + '">' + tmpHighlightedCode + '</code></pre></div>');
						}
						tmpInCodeBlock = false;
						tmpCodeFenceLength = 0;
						tmpCodeLang = '';
						tmpCodeLines = [];
						continue;
					}
					else
					{
						// Inner fence with fewer backticks — treat as content
						tmpCodeLines.push(tmpLine);
						continue;
					}
				}
				else
				{
					// Flush any pending paragraph
					fFlushParagraph();
					// Close any open list or blockquote
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
						tmpInList = false;
					}
					if (tmpInBlockquote)
					{
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
						tmpInBlockquote = false;
						tmpBlockquoteLines = [];
					}
					// Start code block — record fence length
					tmpCodeFenceLength = tmpFenceLen;
					tmpCodeLang = tmpLine.replace(/^`{3,}/, '').trim();
					tmpInCodeBlock = true;
					continue;
				}
			}

			if (tmpInCodeBlock)
			{
				tmpCodeLines.push(tmpLine);
				continue;
			}

			// Blockquotes
			if (tmpLine.match(/^>\s?/))
			{
				if (!tmpInBlockquote)
				{
					// Flush any pending paragraph
					fFlushParagraph();
					// Close any open list
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
						tmpInList = false;
					}
					tmpInBlockquote = true;
					tmpBlockquoteLines = [];
				}
				tmpBlockquoteLines.push(tmpLine.replace(/^>\s?/, ''));
				continue;
			}
			else if (tmpInBlockquote)
			{
				tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
				tmpInBlockquote = false;
				tmpBlockquoteLines = [];
			}

			// Horizontal rule
			if (tmpLine.match(/^(-{3,}|\*{3,}|_{3,})\s*$/))
			{
				fFlushParagraph();
				if (tmpInList)
				{
					tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					tmpInList = false;
				}
				tmpHTML.push('<hr>');
				continue;
			}

			// Headings
			let tmpHeadingMatch = tmpLine.match(/^(#{1,6})\s+(.+)/);
			if (tmpHeadingMatch)
			{
				fFlushParagraph();
				if (tmpInList)
				{
					tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					tmpInList = false;
				}
				let tmpLevel = tmpHeadingMatch[1].length;
				let tmpText = this.parseInline(tmpHeadingMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver);
				let tmpID = tmpHeadingMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
				tmpHTML.push('<h' + tmpLevel + ' id="' + tmpID + '">' + tmpText + '</h' + tmpLevel + '>');
				continue;
			}

			// Unordered list items
			let tmpULMatch = tmpLine.match(/^(\s*)[-*+]\s+(.*)/);
			if (tmpULMatch)
			{
				fFlushParagraph();
				if (!tmpInList || tmpListType !== 'ul')
				{
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					}
					tmpHTML.push('<ul>');
					tmpInList = true;
					tmpListType = 'ul';
				}
				tmpHTML.push('<li>' + this.parseInline(tmpULMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>');
				continue;
			}

			// Ordered list items
			let tmpOLMatch = tmpLine.match(/^(\s*)\d+\.\s+(.*)/);
			if (tmpOLMatch)
			{
				fFlushParagraph();
				if (!tmpInList || tmpListType !== 'ol')
				{
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					}
					tmpHTML.push('<ol>');
					tmpInList = true;
					tmpListType = 'ol';
				}
				tmpHTML.push('<li>' + this.parseInline(tmpOLMatch[2], pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>');
				continue;
			}

			// Indented continuation line of a wrapped list item — fold its
			// content into the last <li> instead of closing the list. Closing
			// here would split a real <ol>/<ul>, and each fragment restarts
			// ordered numbering. A non-indented non-marker line still closes
			// the list (handled below); blank lines never reach this branch.
			if (tmpInList && tmpLine.match(/^\s+\S/) && tmpHTML.length > 0 && tmpHTML[tmpHTML.length - 1].endsWith('</li>'))
			{
				let tmpLastIndex = tmpHTML.length - 1;
				let tmpListItemBody = tmpHTML[tmpLastIndex].slice(0, -'</li>'.length);
				tmpHTML[tmpLastIndex] = tmpListItemBody + ' ' + this.parseInline(tmpLine.trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</li>';
				continue;
			}

			// Close list if we've left list items
			if (tmpInList && tmpLine.trim() !== '')
			{
				tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
				tmpInList = false;
			}

			// Empty line — flush any accumulated paragraph
			if (tmpLine.trim() === '')
			{
				fFlushParagraph();
				continue;
			}

			// Table detection
			if (tmpLine.match(/^\|/) && i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|[\s-:|]+\|/))
			{
				fFlushParagraph();
				// Close any open list
				if (tmpInList)
				{
					tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					tmpInList = false;
				}

				let tmpTableHTML = '<table>';

				// Header row
				let tmpHeaders = tmpLine.split('|').filter((pCell) => { return pCell.trim() !== ''; });
				tmpTableHTML += '<thead><tr>';
				for (let h = 0; h < tmpHeaders.length; h++)
				{
					tmpTableHTML += '<th>' + this.parseInline(tmpHeaders[h].trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</th>';
				}
				tmpTableHTML += '</tr></thead>';

				// Skip separator row
				i++;

				// Body rows
				tmpTableHTML += '<tbody>';
				while (i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|/))
				{
					i++;
					let tmpCells = tmpLines[i].split('|').filter((pCell) => { return pCell.trim() !== ''; });
					tmpTableHTML += '<tr>';
					for (let c = 0; c < tmpCells.length; c++)
					{
						tmpTableHTML += '<td>' + this.parseInline(tmpCells[c].trim(), pLinkResolver, pImageResolver, pVocabularyResolver) + '</td>';
					}
					tmpTableHTML += '</tr>';
				}
				tmpTableHTML += '</tbody></table>';
				tmpHTML.push(tmpTableHTML);
				continue;
			}

			// Accumulate paragraph lines — consecutive non-blank text lines
			// will be joined into a single <p> tag when flushed
			tmpParagraphLines.push(tmpLine);
		}

		// Flush any remaining accumulated paragraph
		fFlushParagraph();

		// Close any trailing open elements
		if (tmpInList)
		{
			tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
		}
		if (tmpInBlockquote)
		{
			tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver, pVocabularyResolver) + '</blockquote>');
		}
		if (tmpInCodeBlock)
		{
			let tmpCodeText = tmpCodeLines.join('\n');
			let tmpHighlightedCode = this.highlightCode(tmpCodeText, tmpCodeLang);
			let tmpLineNumbersHTML = this.generateLineNumbers(tmpCodeText);
			tmpHTML.push('<div class="pict-content-code-wrap"><div class="pict-content-code-line-numbers">' + tmpLineNumbersHTML + '</div><pre><code>' + tmpHighlightedCode + '</code></pre></div>');
		}

		return tmpHTML.join('\n');
	}

	/**
	 * Parse inline markdown elements (bold, italic, code, links, images, KaTeX).
	 *
	 * @param {string} pText - The text to parse
	 * @param {Function} [pLinkResolver] - Optional callback: (pHref, pLinkText) => { href, target, rel } or null
	 * @param {Function} [pImageResolver] - Optional callback: (pSrc, pAlt) => resolvedSrc or null
	 * @param {Function} [pVocabularyResolver] - Optional callback: (pWord) => { slug, title, short } or null. When provided, known vocabulary terms in the rendered text are wrapped in <span class="pict-vocab-term"> with data attributes carrying the popover content.
	 * @returns {string} HTML with inline elements
	 */
	parseInline(pText, pLinkResolver, pImageResolver, pVocabularyResolver)
	{
		if (!pText)
		{
			return '';
		}

		let tmpResult = pText;

		// Extract inline code spans into placeholders so bold/italic regexes don't mangle their contents
		let tmpCodeSpans = [];
		tmpResult = tmpResult.replace(/`([^`]+)`/g, (pMatch, pCode) =>
		{
			let tmpIndex = tmpCodeSpans.length;
			tmpCodeSpans.push('<code>' + pCode + '</code>');
			return '\x00CODEINLINE' + tmpIndex + '\x00';
		});

		// Inline LaTeX equations ($...$) — must be processed before other inline patterns
		// Match single $ delimiters that aren't adjacent to spaces (to avoid false positives with currency)
		tmpResult = tmpResult.replace(/\$([^\$\s][^\$]*?[^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');
		// Also match single-character inline math like $x$
		tmpResult = tmpResult.replace(/\$([^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');

		// Images
		tmpResult = tmpResult.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (pMatch, pAlt, pSrc) =>
		{
			let tmpSrc = pSrc;
			if (typeof pImageResolver === 'function')
			{
				let tmpResolved = pImageResolver(pSrc, pAlt);
				if (tmpResolved)
				{
					tmpSrc = tmpResolved;
				}
			}
			// A video file written with the image form. Authors reach for `![clip](demo.mp4)` because it is
			// the syntax their fingers know, and an <img> pointed at an mp4 is a broken image icon -- so it
			// renders a player instead. Only a real video EXTENSION qualifies; see hasVideoExtension.
			if (this.hasVideoExtension(tmpSrc) && this.isSafeMediaURL(tmpSrc))
			{
				return '<video class="pict-content-video-inline" controls preload="metadata" src="' + this.escapeHTML(tmpSrc) + '">' +
					'<a href="' + this.escapeHTML(tmpSrc) + '">' + this.escapeHTML(pAlt || 'Download the video') + '</a></video>';
			}
			return '<img src="' + tmpSrc + '" alt="' + pAlt + '">';
		});

		// Links
		tmpResult = tmpResult.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (pMatch, pLinkText, pHref) =>
		{
			if (typeof pLinkResolver === 'function')
			{
				let tmpResolved = pLinkResolver(pHref, pLinkText);
				if (tmpResolved)
				{
					let tmpTarget = tmpResolved.target ? ' target="' + tmpResolved.target + '"' : '';
					let tmpRel = tmpResolved.rel ? ' rel="' + tmpResolved.rel + '"' : '';
					return '<a href="' + tmpResolved.href + '"' + tmpTarget + tmpRel + '>' + pLinkText + '</a>';
				}
			}
			// Default behavior: external links open in new tab
			if (pHref.match(/^https?:\/\//))
			{
				return '<a href="' + pHref + '" target="_blank" rel="noopener">' + pLinkText + '</a>';
			}
			return '<a href="' + pHref + '">' + pLinkText + '</a>';
		});

		// Bold
		tmpResult = tmpResult.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
		// Underscore strong only at word boundaries (CommonMark intraword rule) so
		// identifiers / URLs like a__b or foo__bar aren't treated as emphasis.
		tmpResult = tmpResult.replace(/(^|[^A-Za-z0-9_])__([^_]+?)__(?![A-Za-z0-9_])/g, '$1<strong>$2</strong>');

		// Italic
		tmpResult = tmpResult.replace(/\*([^*]+)\*/g, '<em>$1</em>');
		// Underscore italic only at word boundaries — a single underscore inside a
		// word or a URL (e.g. hello_world in a link href) must NOT become <em>.
		tmpResult = tmpResult.replace(/(^|[^A-Za-z0-9_])_([^_]+?)_(?![A-Za-z0-9_])/g, '$1<em>$2</em>');

		// Restore inline code spans from placeholders
		tmpResult = tmpResult.replace(/\x00CODEINLINE(\d+)\x00/g, (pMatch, pIndex) =>
		{
			return tmpCodeSpans[parseInt(pIndex)];
		});

		// Vocabulary term auto-linking: scan the rendered text for
		// known vocabulary terms and wrap each first occurrence in a
		// span with data attributes for the popover system. Skips
		// content inside <code>, <a>, <pre>, and <strong> tags to
		// avoid mangling links, code, or already-emphasized text.
		if (typeof pVocabularyResolver === 'function')
		{
			tmpResult = this._applyVocabularyLinks(tmpResult, pVocabularyResolver);
		}

		return tmpResult;
	}

	/**
	 * Scan HTML for vocabulary terms and wrap the first occurrence
	 * of each in a <span class="pict-vocab-term"> element. The
	 * resolver callback is called for each candidate word/phrase
	 * and returns { slug, title, short } if it's a known term.
	 *
	 * Skips content inside HTML tags to avoid breaking links,
	 * code spans, and other markup.
	 *
	 * @param {string} pHTML
	 * @param {Function} pResolver - (word) => {slug, title, short} | null
	 * @returns {string}
	 */
	_applyVocabularyLinks(pHTML, pResolver)
	{
		if (!pHTML || typeof pResolver !== 'function')
		{
			return pHTML;
		}

		// Track which terms we've already linked to avoid duplicate
		// links for the same term appearing multiple times.
		let tmpLinked = {};

		// Split the HTML into segments: tags vs text nodes. We only
		// scan text nodes for vocabulary terms; tags pass through.
		// This regex captures HTML tags as separators.
		let tmpParts = pHTML.split(/(<[^>]+>)/g);

		// Track whether we're inside a tag that should be skipped
		let tmpSkipDepth = 0;
		let tmpSkipTags = ['code', 'a', 'pre', 'span'];

		for (let i = 0; i < tmpParts.length; i++)
		{
			let tmpPart = tmpParts[i];

			// Check if this is an HTML tag
			if (tmpPart.charAt(0) === '<')
			{
				// Opening tag?
				let tmpOpenMatch = tmpPart.match(/^<(\w+)/);
				if (tmpOpenMatch && tmpSkipTags.indexOf(tmpOpenMatch[1].toLowerCase()) !== -1)
				{
					tmpSkipDepth++;
				}
				// Closing tag?
				let tmpCloseMatch = tmpPart.match(/^<\/(\w+)/);
				if (tmpCloseMatch && tmpSkipTags.indexOf(tmpCloseMatch[1].toLowerCase()) !== -1)
				{
					tmpSkipDepth = Math.max(0, tmpSkipDepth - 1);
				}
				continue; // Don't modify tags
			}

			// Skip text inside protected elements
			if (tmpSkipDepth > 0) continue;

			// Scan this text node for vocabulary terms. Use word
			// boundary regex to match whole words only.
			tmpParts[i] = tmpPart.replace(/\b([A-Za-z][A-Za-z0-9_-]{1,30})\b/g, (pMatch, pWord) =>
			{
				// Skip very short words and common English words
				if (pWord.length < 3) return pMatch;

				let tmpLower = pWord.toLowerCase();
				if (tmpLinked[tmpLower]) return pMatch; // already linked

				let tmpResult = pResolver(tmpLower);
				if (!tmpResult) return pMatch;

				tmpLinked[tmpLower] = true;
				let tmpShortEsc = (tmpResult.short || '').replace(/"/g, '&quot;');
				return '<span class="pict-vocab-term" data-vocab-slug="' + tmpResult.slug +
					'" data-vocab-title="' + (tmpResult.title || '').replace(/"/g, '&quot;') +
					'" data-vocab-short="' + tmpShortEsc + '">' + pMatch + '</span>';
			});
		}

		return tmpParts.join('');
	}

	/**
	 * The file extensions that mean "these bytes ARE the video", as opposed to a page about one.
	 */
	static get VIDEO_EXTENSIONS()
	{
		return ['mp4', 'webm', 'ogv', 'ogg', 'mov', 'm4v'];
	}

	/**
	 * Recognize a third-party video URL and return { Provider, Embed, Watch }, or null when the URL is not
	 * one this knows how to embed.
	 *
	 * Only YouTube and Vimeo are recognized on purpose: an embed is a third party running code in the
	 * reader's page, so the set of parties allowed to do that is a list, not a guess.
	 *
	 * @param {string} pURL
	 * @returns {Object|null}
	 */
	videoProviderFor(pURL)
	{
		let tmpURL = String(pURL || '').trim();
		let tmpYouTube = tmpURL.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
		if (tmpYouTube)
		{
			// youtube-nocookie.com is the same player without the tracking cookies it would otherwise set
			// the moment the frame loads.
			return {
				Provider: 'YouTube',
				Embed: 'https://www.youtube-nocookie.com/embed/' + tmpYouTube[1] + '?autoplay=1&rel=0',
				Watch: 'https://www.youtube.com/watch?v=' + tmpYouTube[1]
			};
		}
		let tmpVimeo = tmpURL.match(/vimeo\.com\/(?:video\/)?(\d{6,})/);
		if (tmpVimeo)
		{
			return {
				Provider: 'Vimeo',
				Embed: 'https://player.vimeo.com/video/' + tmpVimeo[1] + '?autoplay=1',
				Watch: 'https://vimeo.com/' + tmpVimeo[1]
			};
		}
		return null;
	}

	/**
	 * Is this URL safe to put in an href or a src? Only http(s) and same-document relative URLs are, which
	 * is what keeps a javascript: or data: URL in a document from becoming script when a reader clicks it.
	 *
	 * @param {string} pURL
	 * @returns {boolean}
	 */
	isSafeMediaURL(pURL)
	{
		let tmpURL = String(pURL || '').trim();
		if (!tmpURL) { return false; }
		if (/^https?:\/\//i.test(tmpURL)) { return true; }
		// A relative or root-relative path: same origin by construction, so it carries the document's own
		// trust. Anything with a scheme that is not http(s) is refused.
		return !/^[A-Za-z][A-Za-z0-9+.-]*:/.test(tmpURL);
	}

	/**
	 * Does this URL end in a video file extension? Strictly the extension, nothing inferred.
	 *
	 * The inline image form uses THIS rather than isDirectVideoURL: in a ```video fence the author has
	 * already said the thing is a video, so a relative URL can be taken at its word, but `![logo](/img/x)`
	 * is an image and treating every extensionless relative source as video would turn the whole media
	 * library into broken players.
	 *
	 * @param {string} pURL
	 * @returns {boolean}
	 */
	hasVideoExtension(pURL)
	{
		let tmpPath = String(pURL || '').trim().split('?')[0].split('#')[0];
		return PictContentProvider.VIDEO_EXTENSIONS.indexOf((tmpPath.split('.').pop() || '').toLowerCase()) >= 0;
	}

	/**
	 * Does this URL point at video BYTES rather than a page about a video?
	 *
	 * A known video extension says yes. So does any relative URL: those are served by the application
	 * itself, which is how an uploaded recording is addressed (a blob route often carries no extension at
	 * all), and the application does not serve watch pages to its own markdown.
	 *
	 * @param {string} pURL
	 * @returns {boolean}
	 */
	isDirectVideoURL(pURL)
	{
		let tmpURL = String(pURL || '').trim();
		if (!tmpURL) { return false; }
		if (this.hasVideoExtension(tmpURL)) { return true; }
		return !/^https?:\/\//i.test(tmpURL);
	}

	/**
	 * The HTML for a ```video fence.
	 *
	 * Body shape: the URL on the first non-empty line, then optional `key: value` lines (title, poster).
	 *
	 *     ```video
	 *     https://www.youtube.com/watch?v=abc123
	 *     title: How the deploy pipeline works
	 *     poster: /1.0/Media/42/Blob
	 *     ```
	 *
	 * Two outcomes, decided by where the video lives:
	 *
	 * - Self-hosted (relative URL, or a file with a video extension) renders a plain <video controls
	 *   preload="metadata">. The bytes come from the same place the page did, so there is nothing to
	 *   consent to, and preload="metadata" paints the real first frame as its own thumbnail.
	 * - A third-party watch page renders a CLICK-TO-LOAD card. Nothing is fetched from that party until the
	 *   reader asks for it -- not the player, and not the poster image either, since fetching a thumbnail
	 *   from the provider would leak the reader to them exactly as the player does. A poster is shown only
	 *   when the author supplied one. Without JavaScript the card is still a working link to the video,
	 *   which is what a server-rendered or printed copy of the document falls back to.
	 *
	 * @param {string} pBody - The fence contents
	 * @returns {string} The HTML
	 */
	videoEmbedHTML(pBody)
	{
		let tmpLines = String(pBody || '').split('\n').map((pLine) => { return pLine.trim(); }).filter((pLine) => { return pLine.length > 0; });
		if (!tmpLines.length)
		{
			return '<figure class="pict-content-video pict-content-video-empty"><figcaption>No video URL was given.</figcaption></figure>';
		}
		let tmpURL = tmpLines[0];
		let tmpOptions = {};
		for (let i = 1; i < tmpLines.length; i++)
		{
			let tmpMatch = tmpLines[i].match(/^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
			if (tmpMatch) { tmpOptions[tmpMatch[1].toLowerCase()] = tmpMatch[2].trim(); }
		}
		if (!this.isSafeMediaURL(tmpURL))
		{
			return '<figure class="pict-content-video pict-content-video-empty"><figcaption>That video link was not a http(s) or relative URL.</figcaption></figure>';
		}

		let tmpTitle = tmpOptions.title || '';
		let tmpPoster = (tmpOptions.poster && this.isSafeMediaURL(tmpOptions.poster)) ? tmpOptions.poster : '';
		// The caption belongs under a PLAYER, which has nowhere else to say what it is. A card already
		// carries the title inside it, so captioning that one prints the same sentence twice.
		let tmpCaption = tmpTitle ? ('<figcaption>' + this.escapeHTML(tmpTitle) + '</figcaption>') : '';

		if (this.isDirectVideoURL(tmpURL))
		{
			return '<figure class="pict-content-video pict-content-video-file">' +
				'<video controls preload="metadata" src="' + this.escapeHTML(tmpURL) + '"' +
				(tmpPoster ? (' poster="' + this.escapeHTML(tmpPoster) + '"') : '') + '>' +
				'<a href="' + this.escapeHTML(tmpURL) + '">' + this.escapeHTML(tmpTitle || 'Download the video') + '</a>' +
				'</video>' + tmpCaption + '</figure>';
		}

		let tmpProvider = this.videoProviderFor(tmpURL);
		let tmpWatch = tmpProvider ? tmpProvider.Watch : tmpURL;
		let tmpLabel = tmpProvider
			? (tmpProvider.Provider + ' - plays from ' + tmpProvider.Provider + ' when you start it')
			: 'Opens in a new tab';
		// data-embed is what the view swaps in on click. A card with no data-embed (an unrecognized site)
		// stays a link, which is the honest outcome: this cannot promise to embed a page it does not know.
		return '<figure class="pict-content-video pict-content-video-embed"' +
			(tmpProvider ? (' data-embed="' + this.escapeHTML(tmpProvider.Embed) + '"') : '') +
			' data-provider="' + this.escapeHTML(tmpProvider ? tmpProvider.Provider : 'link') + '">' +
			'<a class="pict-content-video-card" href="' + this.escapeHTML(tmpWatch) + '" target="_blank" rel="noopener noreferrer">' +
			(tmpPoster ? ('<img class="pict-content-video-poster" src="' + this.escapeHTML(tmpPoster) + '" alt="">') : '') +
			'<span class="pict-content-video-play" aria-hidden="true">' +
			'<svg viewBox="0 0 68 48" width="54" height="38"><path class="pict-content-video-play-bg" d="M66.5 7.7a8 8 0 0 0-5.6-5.7C55.9.6 34 .6 34 .6s-21.9 0-26.9 1.4a8 8 0 0 0-5.6 5.7A83 83 0 0 0 .1 24a83 83 0 0 0 1.4 16.3 8 8 0 0 0 5.6 5.7c5 1.4 26.9 1.4 26.9 1.4s21.9 0 26.9-1.4a8 8 0 0 0 5.6-5.7A83 83 0 0 0 67.9 24a83 83 0 0 0-1.4-16.3z"/><path d="M27 34V14l18 10z" fill="#fff"/></svg>' +
			'</span>' +
			'<span class="pict-content-video-label">' +
			'<span class="pict-content-video-title">' + this.escapeHTML(tmpTitle || tmpWatch) + '</span>' +
			'<span class="pict-content-video-source">' + this.escapeHTML(tmpLabel) + '</span>' +
			'</span></a></figure>';
	}

	/**
	 * Escape HTML special characters.
	 *
	 * @param {string} pText - The text to escape
	 * @returns {string} The escaped text
	 */
	escapeHTML(pText)
	{
		if (!pText)
		{
			return '';
		}
		return pText
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	}
}

module.exports = PictContentProvider;

module.exports.default_configuration =
{
	ProviderIdentifier: "Pict-Content",

	AutoInitialize: true,
	AutoInitializeOrdinal: 0
};
