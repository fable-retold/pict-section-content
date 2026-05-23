# Pict Section Content

> **[&#9654; Read the Pict-Section-Content Documentation](https://stevenvelozo.github.io/pict-section-content/)** &mdash; interactive docs with the full API reference.

A reusable content rendering section for the Pict ecosystem. Parses markdown to HTML with support for fenced code blocks, Mermaid diagrams, KaTeX math equations, GFM tables, and more. Provides a styled content view with post-render hooks for Mermaid and KaTeX integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Markdown Parsing** -- Headings, paragraphs, lists, blockquotes, horizontal rules, fenced code blocks (with nested fence support), GFM tables, and inline formatting
- **Mermaid Diagrams** -- Code blocks tagged `mermaid` render as diagrams when the Mermaid library is present
- **KaTeX Math** -- Inline (`$...$`) and display (`$$...$$`) math equations render when KaTeX is loaded
- **Link Resolver** -- Pluggable callback for custom link resolution, enabling consumers to map links to application-specific routes
- **Content View** -- Styled view with CSS for all rendered elements, post-render hooks for Mermaid and KaTeX, and a loading indicator
- **Extensible** -- Extend the view class to use custom container IDs, override styling, or add post-render behavior
- **Service Provider Pattern** -- Both the provider and view register with a Pict instance via dependency injection

## Installation

```bash
npm install pict-section-content
```

## Quick Start

### Parsing Markdown (Provider)

```javascript
const libPict = require('pict');
const libPictSectionContent = require('pict-section-content');
const PictContentProvider = libPictSectionContent.PictContentProvider;

let tmpPict = new libPict();
let tmpProvider = tmpPict.addProvider('Content',
	PictContentProvider.default_configuration, PictContentProvider);

let tmpHTML = tmpProvider.parseMarkdown('# Hello World\n\nThis is **bold** text.');
// <h1 id="hello-world">Hello World</h1>
// <p>This is <strong>bold</strong> text.</p>
```

### Displaying Content (View)

```javascript
const libPictSectionContent = require('pict-section-content');

// Register the view with your Pict application
let tmpView = tmpPict.addView('Content',
	libPictSectionContent.default_configuration, libPictSectionContent);

// Render the container, then display parsed HTML
tmpView.render();
tmpView.displayContent(tmpHTML);
```

### Custom Link Resolution

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	if (pHref.match(/\.md$/))
	{
		return { href: '#/page/' + pHref.replace(/\.md$/, '') };
	}
	return null; // fall back to default behavior
};

let tmpHTML = tmpProvider.parseMarkdown(markdown, tmpResolver);
```

## Supported Markdown

| Feature | Syntax |
|---------|--------|
| Headings | `# H1` through `###### H6` |
| Bold | `**text**` or `__text__` |
| Italic | `*text*` or `_text_` |
| Inline code | `` `code` `` |
| Links | `[text](url)` |
| Images | `![alt](src)` |
| Code blocks | ```` ``` ```` with optional language tag |
| Mermaid | ```` ```mermaid ```` |
| Tables | GFM pipe syntax |
| Lists | `- item` or `1. item` |
| Blockquotes | `> text` |
| Horizontal rules | `---`, `***`, or `___` |
| Inline math | `$equation$` |
| Display math | `$$...$$` |

## Module Exports

```javascript
const libPictSectionContent = require('pict-section-content');

// Primary export: the content view class
libPictSectionContent                  // PictContentView (extends pict-view)
libPictSectionContent.default_configuration  // View configuration with CSS and templates

// Named export: the content provider class
libPictSectionContent.PictContentProvider                  // PictContentProvider (extends pict-provider)
libPictSectionContent.PictContentProvider.default_configuration  // Provider configuration
```

## External Dependencies

For full rendering, load these libraries in the browser:

- **Mermaid** -- Renders diagram blocks (optional, detected at runtime)
- **KaTeX** -- Renders math equations (optional, detected at runtime)

Content renders without them; diagrams and equations appear as raw text.

## Part of the Retold Framework

- [pict](https://github.com/stevenvelozo/pict) -- UI framework
- [pict-view](https://github.com/stevenvelozo/pict-view) -- View base class
- [pict-provider](https://github.com/stevenvelozo/pict-provider) -- Provider base class
- [pict-docuserve](https://github.com/stevenvelozo/pict-docuserve) -- Documentation server (uses this module)
- [fable](https://github.com/stevenvelozo/fable) -- Application services framework

## Testing

```bash
npm test
```

```bash
npm run coverage
```

## Related Packages

- [pict](https://github.com/stevenvelozo/pict) - MVC application framework
- [pict-view](https://github.com/stevenvelozo/pict-view) - View base class
- [pict-provider](https://github.com/stevenvelozo/pict-provider) - Data provider base class

## License

MIT

## Contributing

Pull requests are welcome. For details on our code of conduct, contribution process, and testing requirements, see the [Retold Contributing Guide](https://github.com/stevenvelozo/retold/blob/main/docs/contributing.md).
