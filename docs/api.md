# API Reference

## PictContentProvider

Extends `pict-provider`. Service type: `'PictProvider'`.

The content provider parses markdown into HTML. It handles block-level elements (headings, code blocks, lists, tables, blockquotes, math blocks) and inline elements (bold, italic, code, links, images, inline math).

### Constructor

```javascript
new PictContentProvider(pFable, pOptions, pServiceHash)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pFable` | object | A Fable or Pict instance |
| `pOptions` | object | Configuration options (merged with defaults) |
| `pServiceHash` | string | Service identifier for the provider registry |

### Default Configuration

```javascript
{
	ProviderIdentifier: "Pict-Content",
	AutoInitialize: true,
	AutoInitializeOrdinal: 0
}
```

---

### parseMarkdown(pMarkdown, pLinkResolver)

Parse a markdown string into HTML. Processes block-level elements line by line, delegating inline formatting to `parseInline`. The optional `pLinkResolver` callback is threaded through to inline parsing and into recursive calls (for blockquotes).

| Parameter | Type | Description |
|-----------|------|-------------|
| `pMarkdown` | string | The raw markdown text |
| `pLinkResolver` | function | Optional link resolver callback (see [Link Resolver](link-resolver.md)) |

**Returns:** `string` -- The parsed HTML

**Block elements handled:**

| Element | Detection | Output |
|---------|-----------|--------|
| Headings | `# ` through `###### ` | `<h1 id="...">` through `<h6 id="...">` |
| Code blocks | ```` ``` ```` with optional language | `<pre><code class="language-...">` |
| Mermaid blocks | ```` ```mermaid ```` | `<pre class="mermaid">` |
| Unordered lists | `- `, `* `, `+ ` | `<ul><li>` |
| Ordered lists | `1. ` | `<ol><li>` |
| Blockquotes | `> ` | `<blockquote>` (recursive markdown parsing) |
| Tables | `| ... |` with separator row | `<table>` with `<thead>` and `<tbody>` |
| Horizontal rules | `---`, `***`, `___` | `<hr>` |
| Display math | `$$` delimiters | `<div class="pict-content-katex-display">` |
| Paragraphs | Any other non-empty line | `<p>` |

**Code block nesting:** The parser tracks fence length (number of backticks). A closing fence must have at least as many backticks as the opening fence. This allows ```` ```` ```` to contain ```` ``` ```` blocks as content.

**Example:**

```javascript
let tmpProvider = tmpPict.addProvider('Content',
	PictContentProvider.default_configuration, PictContentProvider);

let tmpHTML = tmpProvider.parseMarkdown(
	'# Heading\n\n'
	+ 'A paragraph with **bold** text.\n\n'
	+ '- Item one\n'
	+ '- Item two\n\n'
	+ '```javascript\nlet x = 1;\n```'
);
```

---

### parseInline(pText, pLinkResolver)

Parse inline markdown elements within a single line of text. Called by `parseMarkdown` for each line that contains inline content (headings, paragraphs, list items, table cells).

Processing order:
1. Inline code (backticks)
2. Inline LaTeX (`$...$`)
3. Images (`![alt](src)`)
4. Links (`[text](url)`) -- with optional resolver
5. Bold (`**text**` and `__text__`)
6. Italic (`*text*` and `_text_`)

| Parameter | Type | Description |
|-----------|------|-------------|
| `pText` | string | The text to parse |
| `pLinkResolver` | function | Optional link resolver callback |

**Returns:** `string` -- HTML with inline elements

**Link behavior without resolver:**
- External links (`https://...` or `http://...`) get `target="_blank" rel="noopener"`
- All other links render as plain `<a href="...">` tags

**Example:**

```javascript
tmpProvider.parseInline('**bold** and *italic* and `code`');
// '<strong>bold</strong> and <em>italic</em> and <code>code</code>'

tmpProvider.parseInline('[GitHub](https://github.com)');
// '<a href="https://github.com" target="_blank" rel="noopener">GitHub</a>'

tmpProvider.parseInline('[Guide](guide.md)');
// '<a href="guide.md">Guide</a>'
```

---

### escapeHTML(pText)

Escape HTML special characters to prevent XSS and ensure safe rendering inside HTML contexts. Used internally for code block content.

| Parameter | Type | Description |
|-----------|------|-------------|
| `pText` | string | The text to escape |

**Returns:** `string` -- The escaped text

**Characters escaped:**

| Character | Replacement |
|-----------|-------------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

**Example:**

```javascript
tmpProvider.escapeHTML('<script>alert("xss")</script>');
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
```

---

## PictContentView

Extends `pict-view`. Provides a styled content container with post-render hooks for Mermaid diagrams and KaTeX math equations.

### Constructor

```javascript
new PictContentView(pFable, pOptions, pServiceHash)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pFable` | object | A Fable or Pict instance |
| `pOptions` | object | Configuration options (merged with defaults) |
| `pServiceHash` | string | Service identifier for the view registry |

### Default Configuration

```javascript
{
	ViewIdentifier: "Pict-Content",
	DefaultRenderable: "Pict-Content-Display",
	DefaultDestinationAddress: "#Pict-Content-Container",
	AutoRender: false,

	CSS: /* content styles */,

	Templates:
	[
		{
			Hash: "Pict-Content-Template",
			Template: '<div class="pict-content" id="Pict-Content-Body">...</div>'
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
}
```

The view's `AutoRender` is `false` by default. Call `render()` explicitly to insert the content container into the DOM.

---

### displayContent(pHTMLContent, pContainerID)

Assign HTML content to the container element, scroll to the top, and trigger post-render hooks for Mermaid and KaTeX.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pHTMLContent` | string | | The HTML to display |
| `pContainerID` | string | `'Pict-Content-Body'` | The container element ID |

**Sequence:**
1. Assigns content via `pict.ContentAssignment.assignContent`
2. Scrolls the container's parent to the top
3. Calls `renderMermaidDiagrams(pContainerID)`
4. Calls `renderKaTeXEquations(pContainerID)`

---

### renderMermaidDiagrams(pContainerID)

Find all `<pre class="mermaid">` elements in the container and render them using the Mermaid library. If `mermaid` is not defined globally, this method returns immediately.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pContainerID` | string | `'Pict-Content-Body'` | The container element ID |

---

### renderKaTeXEquations(pContainerID)

Find all `.pict-content-katex-inline` and `.pict-content-katex-display` elements in the container and render them using the KaTeX library. If `katex` is not defined globally, this method returns immediately.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pContainerID` | string | `'Pict-Content-Body'` | The container element ID |

**Element types:**
- `.pict-content-katex-inline` -- Rendered with `displayMode: false`
- `.pict-content-katex-display` -- Rendered with `displayMode: true`

Both use `throwOnError: false` to prevent rendering failures from propagating.

---

### showLoading(pMessage, pContainerID)

Display a loading indicator inside the content container.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pMessage` | string | `'Loading content...'` | The loading message |
| `pContainerID` | string | `'Pict-Content-Body'` | The container element ID |

---

## CSS Classes

The view registers CSS styles for the `.pict-content` container and all rendered elements within it.

### Layout

| Class | Description |
|-------|-------------|
| `.pict-content` | Main content wrapper. Max width 900px, centered, padded. |
| `.pict-content-loading` | Loading indicator. Centered, minimum height 200px. |

### Typography

| Selector | Description |
|----------|-------------|
| `.pict-content h1` | Primary heading. Bottom border, no top margin. |
| `.pict-content h2` | Section heading. Light bottom border. |
| `.pict-content h3` | Subsection heading. |
| `.pict-content h4, h5, h6` | Minor headings. |
| `.pict-content p` | Paragraph. Line height 1.7. |
| `.pict-content a` | Links. Teal color, underline on hover. |

### Code

| Selector | Description |
|----------|-------------|
| `.pict-content pre` | Code block. Dark background, rounded corners. |
| `.pict-content code` | Inline code. Light background, warm accent color. |
| `.pict-content pre code` | Code inside pre block. Inherits pre styling. |

### Lists and Quotes

| Selector | Description |
|----------|-------------|
| `.pict-content ul, ol` | List containers. Left padding, line height 1.8. |
| `.pict-content li` | List items. |
| `.pict-content blockquote` | Block quote. Left border, light background. |

### Tables

| Selector | Description |
|----------|-------------|
| `.pict-content table` | Full width, collapsed borders. |
| `.pict-content table th` | Header cells. Warm background, bold. |
| `.pict-content table td` | Body cells. |
| `.pict-content table tr:nth-child(even)` | Alternating row background. |

### Special Elements

| Selector | Description |
|----------|-------------|
| `.pict-content img` | Images. Max width 100%, auto height. |
| `.pict-content hr` | Horizontal rule. Light border. |
| `.pict-content pre.mermaid` | Mermaid diagram container. White background, centered. |
| `.pict-content .pict-content-katex-display` | Display math. Centered, padded. |
| `.pict-content .pict-content-katex-inline` | Inline math. |

---

## Inherited from pict-view

PictContentView inherits the full view interface. Key inherited members:

| Member | Description |
|--------|-------------|
| `render()` | Render the view's template to the DOM |
| `pict` | The Pict instance |
| `AppData` | Shared application state |
| `log` | Logger instance |
| `options` | Merged configuration |
| `UUID` | Unique service identifier |
| `Hash` | Service registry hash |

See [Pict View](https://stevenvelozo.github.io/pict-view/) for the complete view API.
