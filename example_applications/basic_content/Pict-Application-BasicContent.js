const libPictApplication = require('pict-application');

const libPictSectionContent = require('../../source/Pict-Section-Content.js');

class BasicContentApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addProvider('Content-Provider', libPictSectionContent.PictContentProvider.default_configuration, libPictSectionContent.PictContentProvider);

		this.pict.addView('BasicContent', libPictSectionContent.default_configuration, libPictSectionContent);
	}

	onAfterInitializeAsync(fCallback)
	{
		let tmpContentProvider = this.pict.providers['Content-Provider'];

		let tmpMarkdown = this.getExampleMarkdown();
		let tmpHTML = tmpContentProvider.parseMarkdown(tmpMarkdown);

		this.pict.views.BasicContent.render();
		this.pict.views.BasicContent.displayContent(tmpHTML);

		return super.onAfterInitializeAsync(fCallback);
	}

	getExampleMarkdown()
	{
		return [
			'# Basic Content Example',
			'',
			'This example demonstrates the **pict-section-content** module rendering markdown with KaTeX equations and Mermaid diagrams.',
			'',
			'## Inline Math',
			'',
			'The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and it solves any equation of the form $ax^2 + bx + c = 0$.',
			'',
			'## Display Math',
			'',
			'Euler\'s identity is one of the most beautiful equations in mathematics:',
			'',
			'$$',
			'e^{i\\pi} + 1 = 0',
			'$$',
			'',
			'The integral of a Gaussian function:',
			'',
			'$$',
			'\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}',
			'$$',
			'',
			'## A Simple Flowchart',
			'',
			'```mermaid',
			'graph TD',
			'    A[Markdown Input] --> B[Parse Markdown]',
			'    B --> C{Contains Math?}',
			'    C -->|Yes| D[Render KaTeX]',
			'    C -->|No| E[Skip KaTeX]',
			'    D --> F[Display Content]',
			'    E --> F',
			'    B --> G{Contains Diagrams?}',
			'    G -->|Yes| H[Render Mermaid]',
			'    G -->|No| I[Skip Mermaid]',
			'    H --> F',
			'    I --> F',
			'```',
			'',
			'## Code Example',
			'',
			'Here is some JavaScript code demonstrating how to use the content provider:',
			'',
			'```javascript',
			'const libPictSectionContent = require("pict-section-content");',
			'',
			'// Add the content provider to your pict application',
			'this.pict.addProvider("Content-Provider",',
			'    libPictSectionContent.PictContentProvider.default_configuration,',
			'    libPictSectionContent.PictContentProvider);',
			'',
			'// Parse markdown into HTML',
			'let tmpHTML = tmpContentProvider.parseMarkdown(markdownString);',
			'',
			'// Display in a content view',
			'this.pict.views.BasicContent.displayContent(tmpHTML);',
			'```',
			'',
			'## A Table',
			'',
			'| Feature | Supported | Notes |',
			'| --- | --- | --- |',
			'| Headings | Yes | h1 through h6 |',
			'| Bold/Italic | Yes | `**bold**` and `*italic*` |',
			'| Code Blocks | Yes | Syntax highlighted |',
			'| Tables | Yes | GFM pipe syntax |',
			'| KaTeX | Yes | Inline and display math |',
			'| Mermaid | Yes | Flowcharts, sequences, etc. |',
			'| Blockquotes | Yes | Nested supported |',
			'',
			'> **Note:** The content provider supports all standard markdown features plus KaTeX math and Mermaid diagrams.',
			'',
			'## Sequence Diagram',
			'',
			'```mermaid',
			'sequenceDiagram',
			'    participant User',
			'    participant App',
			'    participant Provider',
			'    participant View',
			'    User->>App: Load Page',
			'    App->>Provider: parseMarkdown(md)',
			'    Provider-->>App: HTML string',
			'    App->>View: displayContent(html)',
			'    View->>View: renderMermaidDiagrams()',
			'    View->>View: renderKaTeXEquations()',
			'    View-->>User: Rendered Content',
			'```',
		].join('\n');
	}
}

module.exports = BasicContentApplication;

module.exports.default_configuration =
{
	"Name": "Basic Content Example",
	"Hash": "BasicContentApplication",
	"pict_configuration":
	{
		"Product": "BasicContent"
	}
};
