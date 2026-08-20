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
			'Code block styling',
			function()
			{
				test
				(
					'the provider registers the content CSS so parseMarkdown output is styled without the view',
					(fDone) =>
					{
						let tmpProvider = createProvider();
						let tmpCSS = tmpProvider.pict.CSSMap.generateCSS();
						Expect(tmpCSS).to.contain('.pict-content-code-wrap', 'The code-block CSS must ship at the provider layer.');
						Expect(tmpCSS.replace(/\s+/g, ' ')).to.contain('.pict-content-code-wrap { display: flex', 'The gutter must be a flex row so line numbers sit left of the code.');
						fDone();
					}
				);
				test
				(
					'a fenced code block puts the line-number gutter before the <pre> in source order',
					(fDone) =>
					{
						let tmpProvider = createProvider();
						let tmpResult = tmpProvider.parseMarkdown('```js\nlet a = 1;\nlet b = 2;\n```');
						Expect(tmpResult).to.contain('pict-content-code-line-numbers');
						Expect(tmpResult).to.contain('<pre>');
						Expect(tmpResult.indexOf('pict-content-code-line-numbers')).to.be.lessThan(tmpResult.indexOf('<pre>'), 'Gutter comes before the code (flex-row then places it to the left).');
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
					'parseMarkdown should fold wrapped ordered list item continuation lines into the same <li>.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown(
							'1. First item with text\n'
							+ '   that wraps to a second line.\n'
							+ '2. Second item\n'
							+ '3. Third item'
						);
						// The list must stay a single <ol> so ordered numbering does not restart
						Expect((tmpResult.match(/<ol>/g) || []).length).to.equal(1);
						Expect((tmpResult.match(/<\/ol>/g) || []).length).to.equal(1);
						// The continuation line is folded into the first <li>
						Expect(tmpResult).to.contain('<li>First item with text that wraps to a second line.</li>');
						Expect(tmpResult).to.contain('<li>Second item</li>');
						Expect(tmpResult).to.contain('<li>Third item</li>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should fold wrapped unordered list item continuation lines into the same <li>.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown(
							'- Bullet one with a long\n'
							+ '  description that wraps.\n'
							+ '- Bullet two'
						);
						Expect((tmpResult.match(/<ul>/g) || []).length).to.equal(1);
						Expect((tmpResult.match(/<\/ul>/g) || []).length).to.equal(1);
						Expect(tmpResult).to.contain('<li>Bullet one with a long description that wraps.</li>');
						Expect(tmpResult).to.contain('<li>Bullet two</li>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should parse inline markdown inside folded continuation lines.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown(
							'1. An item whose continuation\n'
							+ '   has **bold** text.'
						);
						Expect(tmpResult).to.contain('<li>An item whose continuation has <strong>bold</strong> text.</li>');
						fDone();
					}
				);
				test
				(
					'parseMarkdown should still close a list on a non-indented non-marker line.',
					(fDone) =>
					{
						var tmpProvider = createProvider();
						var tmpResult = tmpProvider.parseMarkdown(
							'1. First\n'
							+ '2. Second\n'
							+ 'This is a new paragraph.'
						);
						Expect(tmpResult).to.contain('</ol>');
						Expect(tmpResult).to.contain('<p>This is a new paragraph.</p>');
						// The trailing paragraph must not be swallowed into the list
						Expect(tmpResult).to.not.contain('<li>First This is a new paragraph.');
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

/**
 * Video embeds (Work Item #4, Vision 9 "Rich Authoring").
 *
 * One fence, two outcomes, decided by where the video lives. A self-hosted recording plays inline, because
 * the bytes come from the same place the page did. A third-party watch page becomes a click-to-load card,
 * because an embed that loads with the page has already told YouTube who is reading this document before
 * anyone chose anything -- and that is true of the poster image just as much as the player, which is why
 * there is no auto-fetched thumbnail here.
 */
suite('Pict Section Content - Video Embeds', () =>
{
	setup(() => { });

	suite('Recognizing a video URL', () =>
	{
		test('reads the YouTube forms people actually paste', () =>
		{
			let tmpProvider = createProvider();
			let tmpForms =
			[
				'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				'https://youtu.be/dQw4w9WgXcQ',
				'https://www.youtube.com/embed/dQw4w9WgXcQ',
				'https://www.youtube.com/shorts/dQw4w9WgXcQ',
				'https://www.youtube.com/watch?list=PL123&v=dQw4w9WgXcQ'
			];
			tmpForms.forEach((pURL) =>
			{
				let tmpMatch = tmpProvider.videoProviderFor(pURL);
				Expect(tmpMatch, pURL).to.be.an('object');
				Expect(tmpMatch.Provider).to.equal('YouTube');
				Expect(tmpMatch.Embed, 'the no-cookie player, not the tracking one').to.contain('youtube-nocookie.com');
				Expect(tmpMatch.Embed).to.contain('dQw4w9WgXcQ');
			});
		});

		test('reads Vimeo, and refuses a site it does not know', () =>
		{
			let tmpProvider = createProvider();
			Expect(tmpProvider.videoProviderFor('https://vimeo.com/123456789').Provider).to.equal('Vimeo');
			Expect(tmpProvider.videoProviderFor('https://player.vimeo.com/video/123456789').Provider).to.equal('Vimeo');
			// Not a guess: an embed is a third party running code in the reader's page, so the set of
			// parties allowed to do that is a list.
			Expect(tmpProvider.videoProviderFor('https://videos.example.com/watch/9')).to.equal(null);
		});

		test('only http(s) and relative URLs are allowed anywhere near an href or src', () =>
		{
			let tmpProvider = createProvider();
			Expect(tmpProvider.isSafeMediaURL('https://example.com/a.mp4')).to.equal(true);
			Expect(tmpProvider.isSafeMediaURL('/1.0/Media/42/Blob')).to.equal(true);
			Expect(tmpProvider.isSafeMediaURL('clip.mp4')).to.equal(true);
			Expect(tmpProvider.isSafeMediaURL('javascript:alert(1)')).to.equal(false);
			Expect(tmpProvider.isSafeMediaURL('data:text/html;base64,PHN2Zz4=')).to.equal(false);
		});
	});

	suite('A self-hosted recording', () =>
	{
		test('plays inline, with the first frame as its own thumbnail', () =>
		{
			let tmpProvider = createProvider();
			let tmpHTML = tmpProvider.videoEmbedHTML('/1.0/Media/42/Blob\ntitle: The deploy, start to finish');
			Expect(tmpHTML).to.contain('<video controls preload="metadata"');
			Expect(tmpHTML).to.contain('src="/1.0/Media/42/Blob"');
			// preload="metadata" is what paints a real first frame without fetching the whole file.
			Expect(tmpHTML).to.contain('preload="metadata"');
			Expect(tmpHTML).to.contain('The deploy, start to finish');
			Expect(tmpHTML, 'nothing to consent to: it is served from here').to.not.contain('data-embed');
		});

		test('a video file written with the image form renders a player, and an image still renders an image', () =>
		{
			let tmpProvider = createProvider();
			Expect(tmpProvider.parseInline('![clip](demo.mp4)')).to.contain('<video');
			Expect(tmpProvider.parseInline('![logo](/img/logo.png)')).to.contain('<img');
			// The trap this guards: an extensionless relative URL is how uploaded IMAGES are addressed, so
			// inferring video from "relative" would turn the whole media library into broken players.
			Expect(tmpProvider.parseInline('![shot](/1.0/Media/42/Blob)')).to.contain('<img');
		});
	});

	suite('A third-party video', () =>
	{
		test('renders a card that has requested NOTHING from the provider yet', () =>
		{
			// The property the whole design exists for. Before a click there must be no request to YouTube
			// in this markup at all -- not a player, and not a thumbnail either. An href is a link the
			// reader may follow; a src is a fetch the browser makes on its own, so there must be no src.
			let tmpProvider = createProvider();
			let tmpHTML = tmpProvider.videoEmbedHTML('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
			Expect(tmpHTML).to.contain('pict-content-video-embed');
			Expect(tmpHTML).to.contain('data-embed=');
			Expect(tmpHTML, 'no iframe until the reader asks').to.not.contain('<iframe');
			let tmpSources = tmpHTML.match(/src="[^"]*"/g) || [];
			tmpSources.forEach((pSource) =>
			{
				Expect(pSource, 'no request to the provider before a click').to.not.contain('youtube');
				Expect(pSource).to.not.contain('ytimg');
			});
		});

		test('says its title once, not twice', () =>
		{
			// A caption belongs under a player, which has nowhere else to name itself. The card already
			// carries the title inside it, so a figcaption there prints the same sentence twice.
			let tmpProvider = createProvider();
			let tmpCard = tmpProvider.videoEmbedHTML('https://youtu.be/dQw4w9WgXcQ\ntitle: A walkthrough');
			Expect(tmpCard.split('A walkthrough').length - 1, 'once on the card').to.equal(1);
			Expect(tmpCard).to.not.contain('<figcaption>');
			let tmpPlayer = tmpProvider.videoEmbedHTML('/1.0/Media/42/Blob\ntitle: A walkthrough');
			Expect(tmpPlayer, 'a player keeps its caption').to.contain('<figcaption>A walkthrough</figcaption>');
		});

		test('shows a poster only when the AUTHOR supplied one', () =>
		{
			let tmpProvider = createProvider();
			Expect(tmpProvider.videoEmbedHTML('https://vimeo.com/123456789')).to.not.contain('pict-content-video-poster');
			let tmpWithPoster = tmpProvider.videoEmbedHTML('https://vimeo.com/123456789\nposter: /1.0/Media/9/Blob');
			Expect(tmpWithPoster).to.contain('pict-content-video-poster');
			Expect(tmpWithPoster).to.contain('/1.0/Media/9/Blob');
		});

		test('stays a working link when nothing hydrates it', () =>
		{
			// A server-rendered or printed copy of a document runs no JavaScript. The card is an anchor, so
			// it degrades to what it always was: a way to get to the video.
			let tmpProvider = createProvider();
			let tmpHTML = tmpProvider.videoEmbedHTML('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
			Expect(tmpHTML).to.contain('href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"');
			Expect(tmpHTML).to.contain('rel="noopener noreferrer"');
		});

		test('an unknown site is offered as a link rather than promised as an embed', () =>
		{
			let tmpProvider = createProvider();
			let tmpHTML = tmpProvider.videoEmbedHTML('https://videos.example.com/watch/9');
			Expect(tmpHTML).to.contain('href="https://videos.example.com/watch/9"');
			Expect(tmpHTML, 'nothing to swap in, so the click stays a link').to.not.contain('data-embed=');
		});
	});

	suite('A malformed fence', () =>
	{
		test('says so instead of emitting a broken player', () =>
		{
			let tmpProvider = createProvider();
			Expect(tmpProvider.videoEmbedHTML('')).to.contain('No video URL was given');
			Expect(tmpProvider.videoEmbedHTML('javascript:alert(1)')).to.contain('not a http(s) or relative URL');
			Expect(tmpProvider.videoEmbedHTML('javascript:alert(1)')).to.not.contain('javascript:alert');
		});
	});

	suite('The fence in a document', () =>
	{
		test('parseMarkdown turns a video fence into an embed, and leaves other fences alone', () =>
		{
			let tmpProvider = createProvider();
			let tmpMarkdown = '# Notes\n\n```video\nhttps://youtu.be/dQw4w9WgXcQ\ntitle: A walkthrough\n```\n\n```js\nlet x = 1;\n```\n';
			let tmpHTML = tmpProvider.parseMarkdown(tmpMarkdown);
			Expect(tmpHTML).to.contain('pict-content-video-embed');
			Expect(tmpHTML).to.contain('A walkthrough');
			Expect(tmpHTML, 'a code fence is still a code fence').to.contain('language-js');
		});
	});
});
