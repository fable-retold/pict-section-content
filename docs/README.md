# Pict Section Content

A reusable content rendering section for the Pict ecosystem. Provides a markdown-to-HTML parser (the provider) and a styled content display view with post-render hooks for Mermaid diagrams and KaTeX math equations.

## Quick Start

```bash
npm install pict-section-content
```

### Parsing Markdown

The content provider parses markdown into HTML. Create a provider instance via Pict's `addProvider` method:

```javascript
const libPict = require('pict');
const libPictSectionContent = require('pict-section-content');
const PictContentProvider = libPictSectionContent.PictContentProvider;

let tmpPict = new libPict();
let tmpProvider = tmpPict.addProvider('Content',
	PictContentProvider.default_configuration, PictContentProvider);

let tmpHTML = tmpProvider.parseMarkdown('# Hello World\n\nThis is **bold** text.');
```

The parser handles headings, paragraphs, lists, blockquotes, horizontal rules, fenced code blocks (with nested fence support), GFM tables, Mermaid diagram blocks, KaTeX math (inline and display), and all standard inline formatting (bold, italic, code, links, images).

### Displaying Content

The content view renders parsed HTML into a styled container and triggers post-render hooks for Mermaid and KaTeX:

```javascript
const libPictSectionContent = require('pict-section-content');

// Register the view
let tmpView = tmpPict.addView('Content',
	libPictSectionContent.default_configuration, libPictSectionContent);

// Render the container, then display content
tmpView.render();
tmpView.displayContent(tmpHTML);
```

The view provides CSS for all rendered elements and automatically initializes Mermaid diagrams and KaTeX equations after content is assigned.

### Custom Link Resolution

By default, external links (`https://...`) open in a new tab with `rel="noopener"` and relative links render as-is. To customize link handling, pass a resolver callback:

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	// Convert .md links to hash routes
	if (pHref.match(/\.md$/))
	{
		return { href: '#/page/' + pHref.replace(/\.md$/, '') };
	}
	// Return null to use default behavior
	return null;
};

let tmpHTML = tmpProvider.parseMarkdown(markdown, tmpResolver);
```

See [Link Resolver](link-resolver.md) for the full pattern documentation.

## Module Structure

```
pict-section-content/
  source/
    Pict-Section-Content.js         # Entry point
    providers/
      Pict-Provider-Content.js      # Markdown parser (extends pict-provider)
    views/
      Pict-View-Content.js          # Content display (extends pict-view)
```

The primary export is the view class. The provider is available as a named export:

```javascript
const PictContentView = require('pict-section-content');
const PictContentProvider = require('pict-section-content').PictContentProvider;
```

## Supported Markdown

### Block Elements

| Feature | Syntax | Output |
|---------|--------|--------|
| Headings | `# H1` through `###### H6` | `<h1>` through `<h6>` with auto-generated `id` |
| Paragraphs | Plain text | `<p>` |
| Code blocks | ```` ``` ```` with optional language | `<pre><code class="language-...">` |
| Mermaid | ```` ```mermaid ```` | `<pre class="mermaid">` |
| Unordered lists | `- item` or `* item` | `<ul><li>` |
| Ordered lists | `1. item` | `<ol><li>` |
| Blockquotes | `> text` | `<blockquote>` (recursive) |
| Tables | GFM pipe syntax | `<table>` with `<thead>` and `<tbody>` |
| Horizontal rules | `---`, `***`, or `___` | `<hr>` |
| Display math | `$$...$$` | `<div class="pict-content-katex-display">` |

### Inline Elements

| Feature | Syntax | Output |
|---------|--------|--------|
| Bold | `**text**` or `__text__` | `<strong>` |
| Italic | `*text*` or `_text_` | `<em>` |
| Inline code | `` `code` `` | `<code>` |
| Links | `[text](url)` | `<a>` |
| Images | `![alt](src)` | `<img>` |
| Inline math | `$equation$` | `<span class="pict-content-katex-inline">` |

## External Dependencies

For full rendering in the browser, load these libraries:

- **Mermaid** -- Renders `<pre class="mermaid">` elements into diagrams
- **KaTeX** -- Renders `.pict-content-katex-inline` and `.pict-content-katex-display` elements

Both are detected at runtime. Without them, content renders normally but diagrams and equations appear as raw text.

## Learn More

- [API Reference](api.md) -- Complete method and property documentation
- [Link Resolver](link-resolver.md) -- Custom link resolution pattern
- [Extending the View](extending.md) -- Using pict-section-content as a base class
- [Pict View](/pict/pict-view/) -- View base class documentation
- [Pict Provider](/pict/pict-provider/) -- Provider base class documentation
