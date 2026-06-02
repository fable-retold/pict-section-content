# Basic Content - Markdown, KaTeX, and Mermaid in One Page

<!-- docuserve:example-launch:start -->
> **[Launch the live app](examples/basic%5Fcontent/index.html)** - runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

The Basic Content example is the **shortest possible end-to-end demonstration**
of `pict-section-content`. A single Pict application registers the content
provider and content view, hands the provider a markdown string with everything
in it - headings, lists, blockquotes, GFM tables, fenced code blocks, inline and
display LaTeX equations, two Mermaid diagrams - and renders the resulting HTML
into a styled container. No views to subclass, no manifest to write, no router,
no host frame: the whole app is one file you can read top-to-bottom in a minute.

It is the reference example for the **two-step content pipeline** - provider
parses markdown to HTML, view assigns that HTML to a container and triggers the
post-render hooks. The same pattern scales unchanged from this 130-line demo to
the documentation server that powers every Retold module's docs site.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Provider + view registration in `addProvider` / `addView` | `Pict-Application-BasicContent.js` constructor |
| The two-step parse-then-display pipeline | `onAfterInitializeAsync` - `parseMarkdown(md)` -> `displayContent(html)` |
| Inline LaTeX math (`$...$`) | "The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$" |
| Display LaTeX math (`$$...$$`) | Euler's identity, the Gaussian integral |
| Mermaid `graph TD` flowchart | "A Simple Flowchart" section |
| Mermaid `sequenceDiagram` | "Sequence Diagram" section at the bottom |
| Fenced code blocks with language tags | The `mermaid` and `javascript` fences |
| GFM pipe-syntax tables | "A Table" - Feature / Supported / Notes |
| Blockquotes, headings, ordered/unordered lists | Sprinkled throughout the markdown |
| Manual `injectCSS()` after lazy registration | Final `this.pict.CSSMap.injectCSS()` call in `onAfterInitializeAsync` |
| CDN-loaded Mermaid and KaTeX runtimes | `<script>` tags in `html/index.html` |

## Key files

- `Pict-Application-BasicContent.js` - the entire application. Constructor
  registers the provider and the view; `onAfterInitializeAsync` parses the
  markdown, displays the HTML, and explicitly flushes the CSS registry into
  the page's `<style id="PICT-CSS">` element.
- `html/index.html` - the HTML shell. Loads `pict.js`, the bundled application,
  KaTeX (CSS + script), and Mermaid (script). Renders the "Red Rock Mesa"
  Pict-Example chrome around an empty `#Pict-Content-Container` div which the
  content view fills.
- `package.json` - names the bundle (`basic_content_application`), and tells
  Quack to copy `./html/*` and `pict.min.js`/`pict.js` into `./dist/`.

## Feature 1 - Provider + view registration in two lines

The content pipeline has two pieces - a **provider** that converts markdown to
HTML, and a **view** that displays the HTML. The application's constructor
registers both:

```js
class BasicContentApplication extends libPictApplication
{
	constructor(pFable, pOptions, pServiceHash)
	{
		super(pFable, pOptions, pServiceHash);

		this.pict.addProvider('Content-Provider', libPictSectionContent.PictContentProvider.default_configuration, libPictSectionContent.PictContentProvider);

		this.pict.addView('BasicContent', libPictSectionContent.default_configuration, libPictSectionContent);
	}
```

`libPictSectionContent` (the package default export) is the view class.
`libPictSectionContent.PictContentProvider` is the parser provider, exposed as
a named property on the same module. This split is deliberate: many consumers
want only the parser (e.g. server-side rendering, custom views), and many want
only the view (e.g. they already have HTML from a different source). Adding
both via `addProvider` and `addView` is the common case shown here.

The hashes (`'Content-Provider'`, `'BasicContent'`) are how the rest of the
application reaches each service: `this.pict.providers['Content-Provider']` and
`this.pict.views.BasicContent`. The provider's `default_configuration` carries
`AutoInitialize: true, AutoInitializeOrdinal: 0` so it's ready before any view
that needs it.

---

## Feature 2 - The parse-then-display pipeline

`onAfterInitializeAsync` runs once the application is wired up. The body is the
canonical two-step content render:

```js
onAfterInitializeAsync(fCallback)
{
	let tmpContentProvider = this.pict.providers['Content-Provider'];

	let tmpMarkdown = this.getExampleMarkdown();
	let tmpHTML = tmpContentProvider.parseMarkdown(tmpMarkdown);

	this.pict.views.BasicContent.render();
	this.pict.views.BasicContent.displayContent(tmpHTML);
```

The two steps are independent: `parseMarkdown` is a pure string-in / string-out
function on the provider; `displayContent` is the view-side DOM call that
assigns the HTML to its container and triggers the post-render hooks.

`render()` must be called before `displayContent()` the first time - that's
what creates the `<div class="pict-content" id="Pict-Content-Body">` element
that `displayContent` writes into. On subsequent calls (e.g. swapping content),
you can skip `render()` because the container already exists. The Content
Showcase example demonstrates that pattern; this one keeps it linear for
clarity.

---

## Feature 3 - Inline and display LaTeX math

The provider recognizes two LaTeX delimiters:

- `$...$` for inline math - emitted as `<span class="pict-content-katex-inline">`
- `$$...$$` for display math (its own block) - emitted as `<div class="pict-content-katex-display">`

The view's `renderKaTeXEquations()` hook walks those elements after content is
assigned and calls `katex.render()` on each one. The KaTeX library has to be
loaded in the page (this example loads it from jsDelivr); without it, the hook
silently no-ops and the LaTeX source remains as text.

The example's `getExampleMarkdown()` shows both forms. Inline:

```
The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ and it solves any equation of the form $ax^2 + bx + c = 0$.
```

Display, on its own paragraph:

```
$$
e^{i\\pi} + 1 = 0
$$
```

```
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}
$$
```

The double backslashes are JavaScript string escapes - by the time the markdown
reaches the parser they're single backslashes, which is what KaTeX expects.
Authors writing markdown files directly would write single backslashes; the
escape doubling here is purely a JS-string-literal artifact of building the
markdown by `[...].join('\n')`.

---

## Feature 4 - Mermaid diagram blocks

A fenced code block with the language tag `mermaid` becomes a diagram. The
provider routes those blocks differently from ordinary code: instead of
emitting a syntax-highlighted `<pre><code class="language-mermaid">`, it emits
a `<pre class="mermaid">` element whose `textContent` is the raw Mermaid source.

The view's `renderMermaidDiagrams()` hook then calls `mermaid.run({ nodes: ... })`
which finds every `pre.mermaid` element, parses the source, and replaces the
`<pre>`'s contents with the rendered SVG. The example demonstrates two of
Mermaid's diagram types in one page.

A top-down flowchart:

<!-- bespoke diagram: edit diagrams/feature-4-mermaid-diagram-blocks.mmd or .hints.json, then: npx pict-renderer-graph build modules/pict/pict-section-content/docs/examples/basic_content -->
![Feature 4 - Mermaid diagram blocks](diagrams/feature-4-mermaid-diagram-blocks.svg)

A sequence diagram showing the actual control flow this example performs:

<!-- bespoke diagram: edit diagrams/feature-4-mermaid-diagram-blocks-2.mmd or .hints.json, then: npx pict-renderer-graph build modules/pict/pict-section-content/docs/examples/basic_content -->
![Feature 4 - Mermaid diagram blocks](diagrams/feature-4-mermaid-diagram-blocks-2.svg)

Both diagrams are themed via the view's `_initializeMermaidTheme()` - Mermaid
is initialized with its `base` theme but `themeVariables` are pulled from the
current `--theme-color-*` CSS custom properties, so the diagrams stay coherent
with whatever theme palette the host has applied. This example doesn't install
`pict-provider-theme`, so the fallback warm-beige hexes hard-coded in the view
take effect, but adding a theme provider later would re-skin the diagrams
automatically.

The view also subscribes to `pict-provider-theme`'s `onApply` event (when that
provider is installed), and re-renders diagrams from cached source on every
theme change - see `_refreshMermaidDiagrams()` in the view source.

---

## Feature 5 - Syntax-highlighted fenced code blocks

A fenced code block with any other language tag - `javascript`, `html`, `json`,
`sql`, etc. - gets the full pict-section-code highlighter treatment. The
provider's `highlightCode(text, lang)` runs the same `createHighlighter` that
the live code editor in `pict-section-code` uses, tags each token with a
`.keyword`, `.string`, `.number`, etc. class, and wraps the result in:

```
<div class="pict-content-code-wrap">
  <div class="pict-content-code-line-numbers"><span>1</span><span>2</span>...</div>
  <pre><code class="language-javascript">...highlighted HTML...</code></pre>
</div>
```

The line-number gutter on the left comes from `generateLineNumbers(text)`, also
on the provider. The token classes are themed by the view's CSS (`.keyword`,
`.string`, etc. inside `.pict-content-code-wrap`) - every color binds to a
`--theme-color-syntax-*` token, so rendered-preview code blocks look identical
to the live editor and re-skin together when the theme switches.

The example's code block:

```
```javascript
const libPictSectionContent = require("pict-section-content");

// Add the content provider to your pict application
this.pict.addProvider("Content-Provider",
    libPictSectionContent.PictContentProvider.default_configuration,
    libPictSectionContent.PictContentProvider);

// Parse markdown into HTML
let tmpHTML = tmpContentProvider.parseMarkdown(markdownString);

// Display in a content view
this.pict.views.BasicContent.displayContent(tmpHTML);
```
```

After display, hovering over the rendered block reveals two floating action
buttons on the right - a fullscreen viewer and a copy-to-clipboard. Both are
wired by the view's `_wireCodeActions()` lifecycle on first display, so any
code block in any rendered markdown gets them automatically.

---

## Feature 6 - GFM tables, blockquotes, and lists

Everything else in the example exercises stock markdown that the provider
handles without special hooks. A GFM pipe-syntax table:

```
| Feature | Supported | Notes |
| --- | --- | --- |
| Headings | Yes | h1 through h6 |
| Bold/Italic | Yes | `**bold**` and `*italic*` |
| Code Blocks | Yes | Syntax highlighted |
| Tables | Yes | GFM pipe syntax |
| KaTeX | Yes | Inline and display math |
| Mermaid | Yes | Flowcharts, sequences, etc. |
| Blockquotes | Yes | Nested supported |
```

Detection requires both a header row and a separator row with at least one
hyphen - that's how the parser distinguishes a table from a series of
paragraphs that happen to contain pipes. The output is a proper
`<table><thead>...<tbody>...</table>` with `:nth-child(even)` row striping
courtesy of the view's CSS.

A blockquote:

```
> **Note:** The content provider supports all standard markdown features plus KaTeX math and Mermaid diagrams.
```

Blockquotes are parsed **recursively** - the parser strips the leading `> ` and
re-parses the remaining text through `parseMarkdown`, threading the same
link/image/vocabulary resolvers through the nested call. That's how a
blockquote can itself contain bold/italic text, lists, code, even nested
blockquotes.

Ordered and unordered lists are straightforward, and crucially, an indented
continuation line of a wrapped list item gets folded into the preceding `<li>`
instead of closing and restarting the list. That fold-in logic - added in a
recent toolchain pass - is what prevents a soft-wrapped ordered list from
restarting numbering at 1 on every continuation line.

---

## Feature 7 - Manually flushing the CSS registry

Pict views register their CSS into a central `CSSMap` registry rather than
emitting `<style>` tags themselves - that's how the framework deduplicates
shared styles and orders them by priority. The actual `<style id="PICT-CSS">`
element in the HTML shell is empty until something explicitly writes the
generated CSS into it.

In a typical Pict application, the topmost layout view's `onAfterRender` calls
`this.pict.CSSMap.injectCSS()` so every registered fragment makes it into the
DOM. This example has no separate layout - the content view *is* the top of
the tree - so the application flushes the registry itself, right after the
view has rendered:

```js
this.pict.views.BasicContent.render();
this.pict.views.BasicContent.displayContent(tmpHTML);

// Flush all registered view CSS into the PICT-CSS style element.
// pict-view's addCSS only registers the CSS strings; they have to be
// explicitly injected into the DOM.
this.pict.CSSMap.injectCSS();
```

Without that call, the page would render structurally correct HTML but would
look unstyled - the `.pict-content` cascade wouldn't apply, code blocks
wouldn't have line-number gutters, and Mermaid diagrams wouldn't pick up
container styling. Any app that doesn't compose a layout view of its own needs
to make this call once after the first render.

---

## Running the example

```bash
cd example_applications/basic_content
npm install
npm run build
# Then open dist/index.html in a browser
# (or `cd dist && python3 -m http.server 8000` and visit localhost:8000)
```

`npm run build` invokes `npx quack build && npx quack copy` - Quack browserifies
`Pict-Application-BasicContent.js` into `dist/basic_content_application.min.js`
and the `copyFiles` block in `package.json` copies the HTML shell and pict's
own bundle (`pict.min.js`, `pict.js`) alongside it.

## Things to try in the running app

- **Inspect a Mermaid diagram** - hover and click; the fullscreen overlay opens
  with zoom and pan. Press `+`, `-`, and `0` to zoom in, zoom out, and reset.
- **Copy a code block** - hover over the JavaScript code; two action buttons
  appear on the right. The clipboard icon copies the raw source; the corner
  icon opens the same fullscreen overlay (code blocks scroll natively rather
  than zooming).
- **Render math** - KaTeX renders inline `$E = mc^2$` style equations and
  display `$$...$$` blocks. Try selecting a rendered equation; KaTeX emits a
  `<math>` element with MathML so screen readers and copy-paste both work.
- **Resize the window** - `.pict-content` is `max-width: 900px` and centered,
  so on wide displays it sits in the middle; below 900px it flows naturally.

## Takeaways

1. **One markdown string in, one rendered page out.** The provider + view pair
   is the entire content pipeline - no other wiring is required. The example
   demonstrates this in the shortest possible form so the pattern is obvious.
2. **The two halves compose independently.** `PictContentProvider.parseMarkdown`
   is pure (string in, string out) and works server-side, in tests, in build
   pipelines. The view is purely a DOM concern. You can use one without the
   other when that suits your application.
3. **Post-render hooks are best-effort.** If KaTeX or Mermaid aren't loaded in
   the page, the hooks no-op silently. The HTML still renders; just the math
   and diagrams remain as text. That's why the CDN script tags can be omitted
   in tests or server-rendering contexts without breaking anything.
4. **CSS lives in the registry, not in `<style>` tags.** Every Pict view ships
   its CSS through `CSSMap`; the central `<style id="PICT-CSS">` element is
   filled when something calls `injectCSS()`. A standalone content app has to
   make that call itself.
5. **Themed by tokens, fallback by hex.** Every color in the view's CSS uses
   `var(--theme-color-*, #fallback)`. Installing `pict-provider-theme` re-skins
   everything live; without it, the fallback warm-beige palette keeps the page
   readable.

## Related documentation

- [Overview](../../README.md) - `pict-section-content` quick start
- [API Reference](../../api.md) - `PictContentProvider` and `PictContentView` reference
- [Link Resolver](../../link-resolver.md) - customizing how `[text](href)` links resolve to URLs
- [Extending the View](../../extending.md) - subclassing `PictContentView` for application-specific containers and behavior
