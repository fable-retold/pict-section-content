/**
* Unit tests for Pict Section Content
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

var libPict = require('pict');
var libPictSectionContent = require('../source/Pict-Section-Content.js');
var libPictContentProvider = libPictSectionContent.PictContentProvider;

/**
 * Create a provider instance for testing.
 */
var createProvider = () =>
{
	let tmpPict = new libPict();
	let tmpEnvironment = new libPict.EnvironmentLog(tmpPict);

	return tmpPict.addProvider('Pict-Content', libPictContentProvider.default_configuration, libPictContentProvider);
};

suite
(
	'Pict Section Content',
	function()
	{
		setup
		(
			() =>
			{
			}
		);

		suite
		(
			'Object Sanity',
			function()
			{
				test
				(
					'The module should export the view class and provider class.',
					(fDone) =>
					{
						Expect(libPictSectionContent).to.be.a('function', 'Module should export the view class.');
						Expect(libPictSectionContent.PictContentProvider).to.be.a('function', 'Module should export the provider class.');
						Expect(libPictSectionContent.default_configuration).to.be.an('object', 'Module should export a default configuration.');
						fDone();
					}
				);
				test
				(
					'The provider should initialize itself into a happy little object.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider).to.be.an('object', 'Provider should initialize as an object.');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Markdown Parsing',
			function()
			{
				test
				(
					'parseMarkdown should handle headings.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('# Hello World\n## Subheading');
						Expect(tmpResult).to.contain('<h1');
						Expect(tmpResult).to.contain('Hello World');
						Expect(tmpResult).to.contain('<h2');
						Expect(tmpResult).to.contain('Subheading');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should generate heading IDs.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('## My Section');
						Expect(tmpResult).to.contain('id="my-section"');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle code blocks with syntax highlighting and line numbers.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```javascript\nvar x = 1;\n```');
						Expect(tmpResult).to.contain('<div class="pict-content-code-wrap">');
						Expect(tmpResult).to.contain('<div class="pict-content-code-line-numbers">');
						Expect(tmpResult).to.contain('<pre>');
						Expect(tmpResult).to.contain('<code');
						Expect(tmpResult).to.contain('language-javascript');
						// Syntax highlighting should produce keyword spans
						Expect(tmpResult).to.contain('<span class="keyword">');
						Expect(tmpResult).to.contain('var');
						// Line numbers should be present
						Expect(tmpResult).to.contain('<span>1</span>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle mermaid blocks.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```mermaid\ngraph TD\n  A-->B\n```');
						Expect(tmpResult).to.contain('<pre class="mermaid">');
						Expect(tmpResult).to.contain('graph TD');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle unordered lists.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('- Item 1\n- Item 2\n- Item 3');
						Expect(tmpResult).to.contain('<ul>');
						Expect(tmpResult).to.contain('<li>');
						Expect(tmpResult).to.contain('Item 1');
						Expect(tmpResult).to.contain('Item 3');
						Expect(tmpResult).to.contain('</ul>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle ordered lists.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('1. First\n2. Second\n3. Third');
						Expect(tmpResult).to.contain('<ol>');
						Expect(tmpResult).to.contain('<li>');
						Expect(tmpResult).to.contain('First');
						Expect(tmpResult).to.contain('</ol>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle blockquotes.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('> This is a quote');
						Expect(tmpResult).to.contain('<blockquote>');
						Expect(tmpResult).to.contain('This is a quote');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle horizontal rules.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseMarkdown('---')).to.contain('<hr>');
						Expect(tmpProvider.parseMarkdown('***')).to.contain('<hr>');
						Expect(tmpProvider.parseMarkdown('___')).to.contain('<hr>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle tables.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown(
							'| Name | Type |\n'
							+ '|------|------|\n'
							+ '| foo  | bar  |'
						);
						Expect(tmpResult).to.contain('<table>');
						Expect(tmpResult).to.contain('<th>');
						Expect(tmpResult).to.contain('Name');
						Expect(tmpResult).to.contain('<td>');
						Expect(tmpResult).to.contain('foo');
						Expect(tmpResult).to.contain('</table>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle empty input.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseMarkdown('')).to.equal('');
						Expect(tmpProvider.parseMarkdown(null)).to.equal('');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle math blocks.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('$$\nE = mc^2\n$$');
						Expect(tmpResult).to.contain('pict-content-katex-display');
						Expect(tmpResult).to.contain('E = mc^2');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle nested code fences.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('````\n```\ninner\n```\n````');
						Expect(tmpResult).to.contain('<div class="pict-content-code-wrap">');
						Expect(tmpResult).to.contain('<pre>');
						Expect(tmpResult).to.contain('inner');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle paragraphs.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('Hello world');
						Expect(tmpResult).to.contain('<p>Hello world</p>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should escape HTML in code blocks.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```\n<script>alert("xss")</script>\n```');
						Expect(tmpResult).to.contain('&lt;script&gt;');
						Expect(tmpResult).to.not.contain('<script>alert');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should generate correct line numbers for multi-line code blocks.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```javascript\nline1\nline2\nline3\nline4\nline5\n```');
						Expect(tmpResult).to.contain('<span>1</span>');
						Expect(tmpResult).to.contain('<span>2</span>');
						Expect(tmpResult).to.contain('<span>3</span>');
						Expect(tmpResult).to.contain('<span>4</span>');
						Expect(tmpResult).to.contain('<span>5</span>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should syntax-highlight JSON code blocks.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```json\n{"key": true}\n```');
						Expect(tmpResult).to.contain('<div class="pict-content-code-wrap">');
						Expect(tmpResult).to.contain('<span class="string">');
						Expect(tmpResult).to.contain('<span class="keyword">');
						fDone();
					}
				);
				test
				(
					'highlightCode should return highlighted HTML for known languages.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.highlightCode('const x = 42;', 'javascript');
						Expect(tmpResult).to.contain('<span class="keyword">');
						Expect(tmpResult).to.contain('<span class="number">');
						fDone();
					}
				);
				test
				(
					'highlightCode should handle empty input.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.highlightCode('', 'javascript')).to.equal('');
						Expect(tmpProvider.highlightCode(null, 'javascript')).to.equal('');
						fDone();
					}
				);
				test
				(
					'generateLineNumbers should produce the correct number of lines.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.generateLineNumbers('a\nb\nc');
						Expect(tmpResult).to.contain('<span>1</span>');
						Expect(tmpResult).to.contain('<span>2</span>');
						Expect(tmpResult).to.contain('<span>3</span>');
						Expect(tmpResult).to.not.contain('<span>4</span>');
						fDone();
					}
				);
				test
				(
					'generateLineNumbers should handle single-line code.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.generateLineNumbers('single line');
						Expect(tmpResult).to.equal('<span>1</span>');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Multi-line Paragraph Handling',
			function()
			{
				test
				(
					'parseMarkdown should join consecutive lines into a single paragraph.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('This is the first line\nof a single paragraph\nthat spans three lines.');
						// All three lines should be in one <p> tag
						Expect(tmpResult).to.contain('<p>This is the first line of a single paragraph that spans three lines.</p>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should separate paragraphs on blank lines.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('First paragraph line one\nfirst paragraph line two.\n\nSecond paragraph line one\nsecond paragraph line two.');
						Expect(tmpResult).to.contain('<p>First paragraph line one first paragraph line two.</p>');
						Expect(tmpResult).to.contain('<p>Second paragraph line one second paragraph line two.</p>');
						// Should produce exactly two <p> tags
						var tmpParagraphCount = (tmpResult.match(/<p>/g) || []).length;
						Expect(tmpParagraphCount).to.equal(2);
						fDone();
					}
				);
				test
				(
					'parseMarkdown should flush paragraph before a heading.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('Some introductory text\nthat spans two lines.\n## A Heading');
						Expect(tmpResult).to.contain('<p>Some introductory text that spans two lines.</p>');
						Expect(tmpResult).to.contain('<h2');
						Expect(tmpResult).to.contain('A Heading');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should flush paragraph before a list.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('Here is a paragraph\nbefore a list.\n- Item 1\n- Item 2');
						Expect(tmpResult).to.contain('<p>Here is a paragraph before a list.</p>');
						Expect(tmpResult).to.contain('<ul>');
						Expect(tmpResult).to.contain('<li>Item 1</li>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should flush paragraph before a code block.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('Some text before code\nstill the same paragraph.\n```\ncode here\n```');
						Expect(tmpResult).to.contain('<p>Some text before code still the same paragraph.</p>');
						Expect(tmpResult).to.contain('<pre>');
						Expect(tmpResult).to.contain('code here');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should flush paragraph before a blockquote.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('A multi-line\nparagraph here.\n> A blockquote');
						Expect(tmpResult).to.contain('<p>A multi-line paragraph here.</p>');
						Expect(tmpResult).to.contain('<blockquote>');
						Expect(tmpResult).to.contain('A blockquote');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle a paragraph after a code block.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('```\ncode\n```\nA paragraph that\nfollows the code block.');
						Expect(tmpResult).to.contain('<pre>');
						Expect(tmpResult).to.contain('<p>A paragraph that follows the code block.</p>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle inline formatting within multi-line paragraphs.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown('This paragraph has **bold** on the first line\nand *italic* on the second line.');
						Expect(tmpResult).to.contain('<strong>bold</strong>');
						Expect(tmpResult).to.contain('<em>italic</em>');
						// Should be a single paragraph
						var tmpParagraphCount = (tmpResult.match(/<p>/g) || []).length;
						Expect(tmpParagraphCount).to.equal(1);
						fDone();
					}
				);
				test
				(
					'parseMarkdown should handle hand-wrapped README-style paragraphs.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpInput = 'Ultravisor is a process supervisor and service\n'
							+ 'orchestrator built on the Fable ecosystem.\n'
							+ 'It manages the lifecycle of multiple child\n'
							+ 'processes from a single configuration.\n'
							+ '\n'
							+ 'Designed for development and production\n'
							+ 'environments alike, it provides log\n'
							+ 'aggregation and automatic restarts.';
						var tmpResult = tmpProvider.parseMarkdown(tmpInput);
						var tmpParagraphCount = (tmpResult.match(/<p>/g) || []).length;
						Expect(tmpParagraphCount).to.equal(2, 'Should produce exactly two paragraphs.');
						// First paragraph should contain all four lines joined
						Expect(tmpResult).to.contain('Ultravisor is a process supervisor and service');
						Expect(tmpResult).to.contain('orchestrator built on the Fable ecosystem.');
						// Second paragraph should contain all three lines joined
						Expect(tmpResult).to.contain('Designed for development and production');
						Expect(tmpResult).to.contain('aggregation and automatic restarts.');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Inline Markdown Parsing',
			function()
			{
				test
				(
					'parseInline should handle bold text.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseInline('**bold**')).to.contain('<strong>bold</strong>');
						Expect(tmpProvider.parseInline('__also bold__')).to.contain('<strong>also bold</strong>');
						fDone();
					}
				);
				test
				(
					'parseInline should handle italic text.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseInline('*italic*')).to.contain('<em>italic</em>');
						fDone();
					}
				);
				test
				(
					'parseInline should handle inline code.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseInline('use `npm install`')).to.contain('<code>npm install</code>');
						fDone();
					}
				);
				test
				(
					'parseInline should handle images.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseInline('![alt text](image.png)');
						Expect(tmpResult).to.contain('<img');
						Expect(tmpResult).to.contain('src="image.png"');
						Expect(tmpResult).to.contain('alt="alt text"');
						fDone();
					}
				);
				test
				(
					'parseInline should handle external links with default behavior.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseInline('[NPM](https://npmjs.com/package/fable)');
						Expect(tmpResult).to.contain('href="https://npmjs.com/package/fable"');
						Expect(tmpResult).to.contain('target="_blank"');
						Expect(tmpResult).to.contain('rel="noopener"');
						fDone();
					}
				);
				test
				(
					'parseInline should handle relative links with default behavior.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseInline('[Guide](guide.md)');
						Expect(tmpResult).to.contain('href="guide.md"');
						Expect(tmpResult).to.not.contain('target="_blank"');
						fDone();
					}
				);
				test
				(
					'parseInline should handle inline LaTeX.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseInline('The equation $E=mc^2$ is famous.');
						Expect(tmpResult).to.contain('pict-content-katex-inline');
						fDone();
					}
				);
				test
				(
					'parseInline should handle empty input.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.parseInline('')).to.equal('');
						Expect(tmpProvider.parseInline(null)).to.equal('');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Link Resolver Callback',
			function()
			{
				test
				(
					'parseInline should use a custom link resolver when provided.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolver = (pHref, pLinkText) =>
						{
							if (pHref.match(/\.md$/))
							{
								return { href: '#/page/' + pHref.replace(/\.md$/, '') };
							}
							return null;
						};
						var tmpResult = tmpProvider.parseInline('[Architecture](architecture.md)', tmpResolver);
						Expect(tmpResult).to.contain('href="#/page/architecture"');
						Expect(tmpResult).to.not.contain('target="_blank"');
						fDone();
					}
				);
				test
				(
					'parseInline should fall back to default when resolver returns null.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolver = (pHref, pLinkText) =>
						{
							// Only handle internal links
							return null;
						};
						var tmpResult = tmpProvider.parseInline('[GitHub](https://github.com)', tmpResolver);
						Expect(tmpResult).to.contain('href="https://github.com"');
						Expect(tmpResult).to.contain('target="_blank"');
						fDone();
					}
				);
				test
				(
					'parseInline resolver should support target and rel attributes.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolver = (pHref, pLinkText) =>
						{
							return { href: pHref, target: '_self', rel: 'nofollow' };
						};
						var tmpResult = tmpProvider.parseInline('[Link](page.html)', tmpResolver);
						Expect(tmpResult).to.contain('target="_self"');
						Expect(tmpResult).to.contain('rel="nofollow"');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should thread the link resolver through to inline parsing.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolverCalled = false;
						var tmpResolver = (pHref, pLinkText) =>
						{
							tmpResolverCalled = true;
							return { href: '#/custom/' + pHref };
						};
						var tmpResult = tmpProvider.parseMarkdown('Check the [docs](docs.md)', tmpResolver);
						Expect(tmpResolverCalled).to.equal(true);
						Expect(tmpResult).to.contain('#/custom/docs.md');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should thread the link resolver into blockquotes.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolver = (pHref, pLinkText) =>
						{
							return { href: '#/resolved/' + pHref };
						};
						var tmpResult = tmpProvider.parseMarkdown('> See [link](target.md)', tmpResolver);
						Expect(tmpResult).to.contain('#/resolved/target.md');
						fDone();
					}
				);
			}
		);

		suite
		(
			'Image Resolver Callback',
			function()
			{
				test
				(
					'parseInline should use a custom image resolver when provided.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpImageResolver = (pSrc, pAlt) =>
						{
							return 'docs/images/' + pSrc;
						};
						var tmpResult = tmpProvider.parseInline('![diagram](diagram.svg)', null, tmpImageResolver);
						Expect(tmpResult).to.contain('src="docs/images/diagram.svg"');
						Expect(tmpResult).to.contain('alt="diagram"');
						fDone();
					}
				);
				test
				(
					'parseInline should leave image src unchanged when resolver returns null.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpImageResolver = (pSrc, pAlt) =>
						{
							return null;
						};
						var tmpResult = tmpProvider.parseInline('![photo](photo.png)', null, tmpImageResolver);
						Expect(tmpResult).to.contain('src="photo.png"');
						fDone();
					}
				);
				test
				(
					'parseInline should pass images through unchanged when no resolver is provided.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseInline('![alt](image.png)');
						Expect(tmpResult).to.contain('src="image.png"');
						Expect(tmpResult).to.contain('alt="alt"');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should thread the image resolver through to inline parsing.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResolverCalled = false;
						var tmpImageResolver = (pSrc, pAlt) =>
						{
							tmpResolverCalled = true;
							return 'resolved/' + pSrc;
						};
						var tmpResult = tmpProvider.parseMarkdown('![graph](graph.svg)', null, tmpImageResolver);
						Expect(tmpResolverCalled).to.equal(true);
						Expect(tmpResult).to.contain('src="resolved/graph.svg"');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should thread the image resolver into blockquotes.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpImageResolver = (pSrc, pAlt) =>
						{
							return 'base/' + pSrc;
						};
						var tmpResult = tmpProvider.parseMarkdown('> ![img](pic.png)', null, tmpImageResolver);
						Expect(tmpResult).to.contain('src="base/pic.png"');
						fDone();
					}
				);
			}
		);

		suite
		(
			'HTML Escaping',
			function()
			{
				test
				(
					'escapeHTML should escape special characters.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.escapeHTML('<script>alert("xss")</script>')).to.equal('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
						Expect(tmpProvider.escapeHTML("it's")).to.equal("it&#39;s");
						Expect(tmpProvider.escapeHTML('a & b')).to.equal('a &amp; b');
						fDone();
					}
				);
				test
				(
					'escapeHTML should handle empty input.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						Expect(tmpProvider.escapeHTML('')).to.equal('');
						Expect(tmpProvider.escapeHTML(null)).to.equal('');
						fDone();
					}
				);
			}
		);
	}
);
