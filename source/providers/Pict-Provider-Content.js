const libPictProvider = require('pict-provider');
const libCreateHighlighter = require('pict-section-code').createHighlighter;

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
	 * @returns {string} The parsed HTML
	 */
	parseMarkdown(pMarkdown, pLinkResolver, pImageResolver)
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
				tmpHTML.push('<p>' + tmpParagraphLines.map((pLine) => { return this.parseInline(pLine, pLinkResolver, pImageResolver); }).join(' ') + '</p>');
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
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
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
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
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
				tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
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
				let tmpText = this.parseInline(tmpHeadingMatch[2], pLinkResolver, pImageResolver);
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
				tmpHTML.push('<li>' + this.parseInline(tmpULMatch[2], pLinkResolver, pImageResolver) + '</li>');
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
				tmpHTML.push('<li>' + this.parseInline(tmpOLMatch[2], pLinkResolver, pImageResolver) + '</li>');
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
					tmpTableHTML += '<th>' + this.parseInline(tmpHeaders[h].trim(), pLinkResolver, pImageResolver) + '</th>';
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
						tmpTableHTML += '<td>' + this.parseInline(tmpCells[c].trim(), pLinkResolver, pImageResolver) + '</td>';
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
			tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver, pImageResolver) + '</blockquote>');
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
	 * @returns {string} HTML with inline elements
	 */
	parseInline(pText, pLinkResolver, pImageResolver)
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
		tmpResult = tmpResult.replace(/__([^_]+)__/g, '<strong>$1</strong>');

		// Italic
		tmpResult = tmpResult.replace(/\*([^*]+)\*/g, '<em>$1</em>');
		tmpResult = tmpResult.replace(/_([^_]+)_/g, '<em>$1</em>');

		// Restore inline code spans from placeholders
		tmpResult = tmpResult.replace(/\x00CODEINLINE(\d+)\x00/g, (pMatch, pIndex) =>
		{
			return tmpCodeSpans[parseInt(pIndex)];
		});

		return tmpResult;
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
