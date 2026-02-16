const libPictProvider = require('pict-provider');

/**
 * Content Provider for Pict Section Content
 *
 * A general-purpose markdown-to-HTML parser with support for:
 * - Headings, paragraphs, lists, blockquotes, horizontal rules
 * - Fenced code blocks with language tags (nested fence support)
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
	 * Parse a markdown string into HTML.
	 *
	 * @param {string} pMarkdown - The raw markdown text
	 * @param {Function} [pLinkResolver] - Optional callback for link resolution: (pHref, pLinkText) => { href, target, rel } or null
	 * @returns {string} The parsed HTML
	 */
	parseMarkdown(pMarkdown, pLinkResolver)
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
					// Close any open list or blockquote
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
						tmpInList = false;
					}
					if (tmpInBlockquote)
					{
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver) + '</blockquote>');
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
							tmpHTML.push('<pre><code class="language-' + this.escapeHTML(tmpCodeLang) + '">' + this.escapeHTML(tmpCodeLines.join('\n')) + '</code></pre>');
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
					// Close any open list or blockquote
					if (tmpInList)
					{
						tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
						tmpInList = false;
					}
					if (tmpInBlockquote)
					{
						tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver) + '</blockquote>');
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
				tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver) + '</blockquote>');
				tmpInBlockquote = false;
				tmpBlockquoteLines = [];
			}

			// Horizontal rule
			if (tmpLine.match(/^(-{3,}|\*{3,}|_{3,})\s*$/))
			{
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
				if (tmpInList)
				{
					tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
					tmpInList = false;
				}
				let tmpLevel = tmpHeadingMatch[1].length;
				let tmpText = this.parseInline(tmpHeadingMatch[2], pLinkResolver);
				let tmpID = tmpHeadingMatch[2].toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
				tmpHTML.push('<h' + tmpLevel + ' id="' + tmpID + '">' + tmpText + '</h' + tmpLevel + '>');
				continue;
			}

			// Unordered list items
			let tmpULMatch = tmpLine.match(/^(\s*)[-*+]\s+(.*)/);
			if (tmpULMatch)
			{
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
				tmpHTML.push('<li>' + this.parseInline(tmpULMatch[2], pLinkResolver) + '</li>');
				continue;
			}

			// Ordered list items
			let tmpOLMatch = tmpLine.match(/^(\s*)\d+\.\s+(.*)/);
			if (tmpOLMatch)
			{
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
				tmpHTML.push('<li>' + this.parseInline(tmpOLMatch[2], pLinkResolver) + '</li>');
				continue;
			}

			// Close list if we've left list items
			if (tmpInList && tmpLine.trim() !== '')
			{
				tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
				tmpInList = false;
			}

			// Empty line
			if (tmpLine.trim() === '')
			{
				continue;
			}

			// Table detection
			if (tmpLine.match(/^\|/) && i + 1 < tmpLines.length && tmpLines[i + 1].match(/^\|[\s-:|]+\|/))
			{
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
					tmpTableHTML += '<th>' + this.parseInline(tmpHeaders[h].trim(), pLinkResolver) + '</th>';
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
						tmpTableHTML += '<td>' + this.parseInline(tmpCells[c].trim(), pLinkResolver) + '</td>';
					}
					tmpTableHTML += '</tr>';
				}
				tmpTableHTML += '</tbody></table>';
				tmpHTML.push(tmpTableHTML);
				continue;
			}

			// Regular paragraph
			tmpHTML.push('<p>' + this.parseInline(tmpLine, pLinkResolver) + '</p>');
		}

		// Close any trailing open elements
		if (tmpInList)
		{
			tmpHTML.push(tmpListType === 'ul' ? '</ul>' : '</ol>');
		}
		if (tmpInBlockquote)
		{
			tmpHTML.push('<blockquote>' + this.parseMarkdown(tmpBlockquoteLines.join('\n'), pLinkResolver) + '</blockquote>');
		}
		if (tmpInCodeBlock)
		{
			tmpHTML.push('<pre><code>' + this.escapeHTML(tmpCodeLines.join('\n')) + '</code></pre>');
		}

		return tmpHTML.join('\n');
	}

	/**
	 * Parse inline markdown elements (bold, italic, code, links, images, KaTeX).
	 *
	 * @param {string} pText - The text to parse
	 * @param {Function} [pLinkResolver] - Optional callback: (pHref, pLinkText) => { href, target, rel } or null
	 * @returns {string} HTML with inline elements
	 */
	parseInline(pText, pLinkResolver)
	{
		if (!pText)
		{
			return '';
		}

		let tmpResult = pText;

		// Inline code (backticks) - handle first to avoid interfering with other patterns
		tmpResult = tmpResult.replace(/`([^`]+)`/g, '<code>$1</code>');

		// Inline LaTeX equations ($...$) — must be processed before other inline patterns
		// Match single $ delimiters that aren't adjacent to spaces (to avoid false positives with currency)
		tmpResult = tmpResult.replace(/\$([^\$\s][^\$]*?[^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');
		// Also match single-character inline math like $x$
		tmpResult = tmpResult.replace(/\$([^\$\s])\$/g, '<span class="pict-content-katex-inline">$1</span>');

		// Images
		tmpResult = tmpResult.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

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
