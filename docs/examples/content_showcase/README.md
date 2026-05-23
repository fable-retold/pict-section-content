# Content Showcase — A Navigable Catalog of Content Capabilities

<!-- docuserve:example-launch:start -->
> **[&#9654; Launch the live app](examples/content%5Fshowcase/index.html)** — runs in your browser, opens in a new tab.
<!-- docuserve:example-launch:end -->

The Content Showcase example turns `pict-section-content` into a **navigable
catalog** — a left sidebar listing eleven topics, a content pane that re-renders
when the user clicks a topic, and one markdown document behind each entry that
exercises a focused slice of the parser. Where the [Basic Content](../basic_content/README.md)
example puts everything on a single page, the Showcase shows what the same
provider + view pair looks like when it's the **document surface** for a larger
application: stateful navigation, per-topic markdown sources, redirected
content destination, and a CSS-bound `.active` link that follows the
current page.

It is the reference for the **pattern every documentation server uses on top
of pict-section-content**, including pict-docuserve itself. Eleven markdown
documents demonstrate the full surface area of the parser — typography, fenced
code in five languages, basic and advanced KaTeX, three styles of Mermaid
diagram, GFM tables, list nesting, images in body/lists/tables, and a "Full
Page Demo" that combines every feature in one mock product page.

## What it demonstrates

| Capability | Where you see it |
|------------|------------------|
| Sidebar navigation backed by a JSON view config | `views/PictView-Showcase-Navigation.json` |
| Re-rendering a single content destination on click | `showExample(pName)` → `displayContent(html)` |
| Redirecting the view's `DefaultDestinationAddress` after registration | Constructor overrides `Renderables[0].DestinationAddress` |
| Convention-driven content lookup (`getMarkdown_<Name>`) | `showExample(pName)` builds the method name and calls it |
| Active-link state synchronized from the application | `tmpLinks[i].classList.add('active')` after content swap |
| Six markdown headings + nested lists + bold/italic/inline-code | "Headings & Text" topic |
| Syntax-highlighted code in JavaScript / HTML / JSON / SQL | "Code Blocks" topic |
| Inline + display LaTeX, Greek letters, matrices, calculus | "KaTeX Basics" + "KaTeX Advanced" |
| Mermaid `graph TD`, `graph LR`, and `sequenceDiagram` | "Mermaid Flowcharts" + "Mermaid Sequences" |
| GFM tables (8-row module overview, 5-row data-type) | "Tables & Lists" |
| Mixed content: prose + diagram + equation + code + table | "Mixed Content" + "Code + Math" |
| External images, inline SVG data URIs, images in lists / tables | "Images" |
| End-to-end mock product page | "Full Page Demo" |

## Key files

- `Pict-Application-ContentShowcase.js` — the application. Constructor registers
  the provider, the navigation view (from JSON), and the content view (from the
  package); then overrides the content view's destination so it renders into
  the showcase layout's container. `onAfterInitializeAsync` renders the
  sidebar, calls `showExample('ShowcaseHeadings')` for the initial page, and
  flushes the CSS registry. The eleven `getMarkdown_*` methods are static
  string-builders — one per topic, returning markdown.
- `views/PictView-Showcase-Navigation.json` — the sidebar as JSON. One
  template with eleven `<a class="showcase-nav-link" onclick="...">` entries;
  each onclick calls back into `PictApplication.showExample(...)`. No JS
  needed; the view is pure declarative config.
- `html/index.html` — the two-column shell. A fixed top header bar, a
  fixed-position 220px sidebar against the left edge, and a content pane to
  its right. Both Mermaid and KaTeX are loaded from jsDelivr.
- `package.json` — bundles as `content_showcase_application`; copies
  `./html/*` and pict's own bundle into `./dist/`.

## Feature 1 — Two views, one content destination, swapped on demand

The application registers two views in its constructor and immediately
overrides one of them:

```js
constructor(pFable, pOptions, pServiceHash)
{
	super(pFable, pOptions, pServiceHash);

	this.pict.addProvider('Content-Provider', libPictSectionContent.PictContentProvider.default_configuration, libPictSectionContent.PictContentProvider);

	this.pict.addView('ShowcaseNavigation', require('./views/PictView-Showcase-Navigation.json'));
	this.pict.addView('ShowcaseContent', libPictSectionContent.default_configuration, libPictSectionContent);

	// Override the content view destination to our layout container
	this.pict.views.ShowcaseContent.options.DefaultDestinationAddress = '#Showcase-Content-Container';
	this.pict.views.ShowcaseContent.options.Renderables[0].DestinationAddress = '#Showcase-Content-Container';
}
```

The content view's default destination is `#Pict-Content-Container`. The HTML
shell here uses `#Showcase-Content-Container` (so navigation and content can
sit side-by-side inside the showcase layout), so the application rewrites both
the default and the first renderable's destination immediately after `addView`
— same view class, different DOM target. This is the lightest possible way to
re-skin a section view's container without subclassing it.

The navigation view is registered from a JSON file rather than a JS class.
`pict-view`'s `addView` accepts a configuration object as its second argument
and uses the default `PictView` class when a third constructor argument isn't
provided, so a static template + renderable wired in JSON is a complete view.

---

## Feature 2 — Convention-based content lookup

`showExample(pName)` is the entire dispatcher. It builds a method name from
the argument, calls it if it exists, parses the returned markdown, and
displays the HTML:

```js
showExample(pExampleName)
{
	let tmpContentProvider = this.pict.providers['Content-Provider'];
	let tmpMarkdownMethod = 'getMarkdown_' + pExampleName;

	if (typeof this[tmpMarkdownMethod] !== 'function')
	{
		return;
	}

	let tmpMarkdown = this[tmpMarkdownMethod]();
	let tmpHTML = tmpContentProvider.parseMarkdown(tmpMarkdown);

	this.pict.views.ShowcaseContent.render();
	this.pict.views.ShowcaseContent.displayContent(tmpHTML);

	// Update active nav link
	let tmpLinks = document.querySelectorAll('.showcase-nav-link');
	for (let i = 0; i < tmpLinks.length; i++)
	{
		tmpLinks[i].classList.remove('active');
		if (tmpLinks[i].getAttribute('onclick').indexOf(pExampleName) > -1)
		{
			tmpLinks[i].classList.add('active');
		}
	}
}
```

The convention is simple: every topic the sidebar can route to has a
`getMarkdown_<TopicName>()` method that returns its markdown source. Adding a
new topic is two steps — add a `<li><a onclick="...showExample('XYZ')">` entry
in the JSON template, and add a `getMarkdown_XYZ()` method on the application.
No table of routes, no manifest, no view-per-page.

The body also calls `render()` every time before `displayContent()`. The first
call creates the `<div class="pict-content" id="Pict-Content-Body">` element
inside `#Showcase-Content-Container`. Subsequent calls re-render that template
(idempotent — same template, same destination), then `displayContent` rewrites
the inner content. The `displayContent()` method scrolls the parent to the top
on every call so a long page doesn't strand the reader mid-scroll when they
click to a different topic.

The final loop synchronizes the sidebar's `.active` class with the displayed
topic. It is intentionally simple — read every link, strip the class, set it
on the one whose onclick string contains the current topic name. There's no
event-listener registration: the onclick is in the JSON template itself, so it
survives every re-render the navigation view does. (This is the same lesson
the framework's own "don't use addEventListener" rule teaches.)

---

## Feature 3 — JSON-defined navigation view

The whole sidebar is **one template hash and one renderable** in a JSON file:

```json
{
	"ViewIdentifier": "Showcase-Navigation-View",
	"DefaultRenderable": "Showcase-Navigation",
	"DefaultDestinationAddress": "#Showcase-Navigation-Container",
	"AutoRender": true,

	"Templates": [
		{
			"Hash": "Showcase-Top-Navigation",
			"Template": "<div class=\"showcase-nav-heading\">Content Showcase</div><ul class=\"showcase-nav-list\"><li><a href=\"#\" onclick=\"{~P~}.PictApplication.showExample('ShowcaseHeadings')\" class=\"showcase-nav-link\">Headings &amp; Text</a></li>... eleven entries ...</ul>"
		}
	],
	"Renderables": [
		{
			"RenderableHash": "Showcase-Navigation",
			"TemplateHash": "Showcase-Top-Navigation",
			"DestinationAddress": "#Showcase-Navigation-Container"
		}
	]
}
```

`{~P~}` is the Pict global pict reference — the template engine substitutes it
at render time. `{~P~}.PictApplication` reaches back to the showcase
application instance so the link can call `showExample(...)` on it. The eleven
links are identical apart from the topic argument; no per-link logic, no
ordered list of routes anywhere.

This is the smallest-possible pattern for an application-driven sidebar: a
template that emits a static list of `<a onclick>` anchors and a single
renderable. The view class is the framework default. Onclick handlers are in
the template HTML (not added via `addEventListener`), so even if the
navigation re-renders the wiring survives — see the **don't use
addEventListener** rule in the [pict CLAUDE.md](https://github.com/stevenvelozo/pict-section-content)
guide for why this matters.

---

## Feature 4 — Eleven focused markdown topics

The eleven `getMarkdown_*` methods are the catalog. Each returns a markdown
string assembled with `[...].join('\n')` (the JS multiline-string trick that
keeps editors happy). They're roughly grouped:

- **Typography** — `ShowcaseHeadings` covers six heading levels, bold/italic,
  inline code, blockquotes (single + multi-paragraph), links, unordered + ordered
  lists, and horizontal rules.
- **Code** — `ShowcaseCodeBlocks` exercises four language tags: JavaScript with
  the framework's allman braces, an HTML page, a JSON configuration, and a SQL
  query with `LEFT JOIN ... GROUP BY ... HAVING ...`.
- **Math** — `ShowcaseKaTeXBasic` and `ShowcaseKaTeXAdvanced` cover everything
  from `$E = mc^2$` to the Gaussian integral, Bayes' theorem, the normal
  distribution PDF, and Maxwell's equations in differential form.
- **Diagrams** — `ShowcaseMermaidFlowcharts` covers `graph TD` (top-down with
  branches), `graph LR` (left-to-right), and a decision tree with multiple
  branches. `ShowcaseMermaidSequence` covers three sequence diagrams modeling
  Orator/Meadow/database round trips, view rendering, and service registration.
- **Composition** — `ShowcaseMixed`, `ShowcaseCodeAndMath`, and
  `ShowcaseFullPage` interleave prose, equations, diagrams, code, and tables.
  The last one is a full mock product page for `pict-section-content` itself,
  including its architecture diagram, quick-start code, and a supported-feature
  table — a self-referential demo where every feature shown is rendered by the
  feature it documents.
- **Tables and images** — `ShowcaseTables` and `ShowcaseImages` cover GFM
  tables (with cells containing inline code and inline math), nested lists, and
  image rendering from external URLs, inline SVG data URIs, alt-text-only
  images, images in lists, and images in tables.

Each topic is a static JS string. No fetch, no per-topic file, no markdown
loader — the content is bundled with the application. This is deliberate; the
example is offline-runnable from `file://` if you want.

---

## Feature 5 — Self-documenting "Full Page Demo"

The last topic is the showcase's punchline: a single markdown document that
documents `pict-section-content` itself, complete with its own architecture
diagram and quick-start snippet, rendered by the very provider + view it
describes:

```
graph TD
    MD[Markdown Source] --> Provider[Content Provider]
    Provider --> Parse[parseMarkdown]
    Parse --> Inline[parseInline]
    Parse --> CodeHL[highlightCode]
    Parse --> LineNum[generateLineNumbers]
    Parse --> HTML[HTML Output]
    HTML --> View[Content View]
    View --> Display[displayContent]
    Display --> KaTeX[renderKaTeXEquations]
    Display --> Mermaid[renderMermaidDiagrams]
    KaTeX --> Rendered[Final Rendered Page]
    Mermaid --> Rendered
```

That graph is the actual control flow of the page that contains it. The topic
also includes the quick-start JavaScript snippet that registers the provider
and view, a supported-features table mirroring the one in this README, the
Fourier transform / inverse transform pair (with display math), a sequence
diagram of the runtime API interaction, and a code example demonstrating the
link resolver pattern.

It is the most efficient way the showcase demonstrates that a single rendering
pipeline can produce documentation-quality output — every feature in the
catalog is exercised in one page, and the page itself is the documentation.

---

## Feature 6 — Theme-aware code highlighting and Mermaid

The view's CSS binds every code-block syntax token to a `--theme-color-syntax-*`
custom property, the same set the live editor in `pict-section-code` uses. The
HTML shell here doesn't install `pict-provider-theme`, so the fallback Atom One
Light hexes baked into the view CSS take effect — but installing a theme
provider later would re-skin every code block in every topic with zero changes
to the application.

Mermaid is themed the same way. The view's `_initializeMermaidTheme()`
initializes Mermaid with its `base` theme but pulls `themeVariables` from the
current `--theme-color-*` values, so node fills, cluster backgrounds, edge
colors, and label text follow the active palette. When a theme provider is
installed, `_subscribeToThemeChanges()` registers an `onApply` callback that
re-runs Mermaid on every diagram (using each one's cached source) so live
theme switching repaints diagrams without a content reload.

This is what lets a single content page sit inside applications with very
different chrome — the Showcase's warm-beige Red Rock Mesa, retold-docuserve's
cooler palette, an embedded app with a dark theme — and stay coherent
everywhere.

---

## Feature 7 — Click-to-fullscreen for images, diagrams, and code

Every rendered Mermaid diagram, image, and code block becomes interactive
after `displayContent()` runs. The view installs a single delegated click
listener on the content container; `data-fullscreen-source` attributes on the
elements opt them into the overlay.

- Click an **image** → fullscreen with zoom (wheel, `+`/`-`, pinch) and pan
  (drag when zoomed).
- Click the **fullscreen icon** that appears on hover over a code block → the
  block opens in the overlay with native scrolling for long source.
- Click the **copy icon** next to the fullscreen icon → the raw code is
  copied to the clipboard, the button flashes briefly to confirm.
- Click a **Mermaid SVG** → fullscreen with the same zoom/pan controls as
  images.
- Press `Escape` to close the overlay; click the backdrop also closes.

The overlay singleton is built lazily on first use and reused thereafter, so
opening the same diagram twice doesn't rebuild any DOM. The implementation
lives in `_buildFullscreenOverlay()` in the view source — every feature
mentioned (touch pinch zoom, drag-to-pan with click-suppression on release,
keyboard shortcuts, code-block native scrolling exception) is in one place.

---

## Running the example

```bash
cd example_applications/content_showcase
npm install
npm run build
# Then open dist/index.html in a browser
# (or `cd dist && python3 -m http.server 8000` and visit localhost:8000)
```

`npm run build` is `npx quack build && npx quack copy`. Quack browserifies the
application into `dist/content_showcase_application.min.js`; the `copyFiles`
block copies the HTML shell and pict's own bundle into `./dist/`.

## Things to try in the running app

- **Click through every topic** — the right pane swaps cleanly, the sidebar
  link gets the active treatment (orange left border, brand color), and the
  content scrolls back to the top automatically.
- **Open a Mermaid diagram fullscreen** — the SVG zooms cleanly via wheel,
  pan via drag when zoomed; pinch on a touchpad zooms toward the cursor.
- **Copy a code block** — hover over any code block, click the clipboard icon
  on the right; the button flashes briefly. Paste somewhere to confirm the
  raw source landed without HTML tags.
- **Open a code block fullscreen** — click the corner-bracket icon; the
  overlay opens with native scrolling instead of zoom-pan, because long source
  is more usefully read by scrolling.
- **Click an external link in "Headings & Text"** — opens in a new tab with
  `rel="noopener"` automatically, without needing a custom link resolver.
- **Deep-link to a topic via the URL hash** — not wired here, but a real
  documentation app builds on this same `showExample(...)` callback and adds a
  router. pict-docuserve is exactly that pattern.

## Takeaways

1. **One content view, many topics.** A single `PictContentView` instance plus
   eleven markdown sources is the whole catalog. Topics are functions on the
   application; routing is one method on the application. Adding a topic is
   adding a method and a sidebar link.
2. **Configuration overrides at the addView seam.** Section views default to
   their own destinations, but you can rewrite `DefaultDestinationAddress` and
   `Renderables[i].DestinationAddress` right after `addView` — no subclass
   needed, no manifest, just a property write.
3. **JSON views are real views.** The sidebar is a config-only view: template,
   renderable, and inline `onclick` handlers. Adding a static navigation panel
   to a Pict application doesn't require a JS class.
4. **Click-to-fullscreen is automatic.** Images, code blocks, and Mermaid
   diagrams all become interactive when `displayContent()` runs — no per-
   element wiring, no app-side opt-in. The view's lifecycle handles it.
5. **The same provider drives docs servers.** This sidebar + content swap +
   markdown topic pattern is exactly what `pict-docuserve` does for every
   Retold module's documentation site. Once it works here, it works there.

## Related documentation

- [Overview](../../README.md) — `pict-section-content` quick start
- [API Reference](../../api.md) — `PictContentProvider` and `PictContentView` reference, every CSS class the view registers
- [Link Resolver](../../link-resolver.md) — customizing how `[text](href)` links resolve to URLs (the showcase's external links use the default resolver; pict-docuserve overrides it)
- [Extending the View](../../extending.md) — subclassing `PictContentView` for application-specific containers (this example overrides the destination directly instead, but for richer customization the subclass path is cleaner)
