# Link Resolver

The link resolver is a callback pattern that lets consumers customize how markdown links are converted to HTML. Without a resolver, pict-section-content uses sensible defaults: external links open in a new tab, relative links render as plain anchors.

## How It Works

Both `parseMarkdown` and `parseInline` accept an optional `pLinkResolver` parameter. When the parser encounters a `[text](href)` link, it calls the resolver before generating the `<a>` tag. The resolver can return a modified link or `null` to fall back to default behavior.

### Signature

```javascript
(pHref, pLinkText) => { href, target, rel } | null
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `pHref` | string | The original href from the markdown link |
| `pLinkText` | string | The display text from the markdown link |

### Return Value

Return an object to override the link:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `href` | string | yes | The URL for the link |
| `target` | string | no | Link target (e.g., `_blank`, `_self`) |
| `rel` | string | no | Link relationship (e.g., `noopener`, `nofollow`) |

Return `null` to use default behavior.

### Default Behavior (No Resolver)

When no resolver is provided, or when the resolver returns `null`:

- **External links** (`http://` or `https://`) get `target="_blank" rel="noopener"`
- **All other links** render as `<a href="...">` with no target or rel attributes

## Examples

### Route Mapping

Convert markdown file links to application routes:

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	if (pHref.match(/\.md$/))
	{
		return { href: '#/page/' + pHref.replace(/\.md$/, '') };
	}
	return null;
};

tmpProvider.parseMarkdown('[Architecture](architecture.md)', tmpResolver);
// <a href="#/page/architecture">Architecture</a>
```

### Catalog-Aware Resolution

Map relative links to a document catalog (as pict-docuserve does):

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	// Check if this is a relative doc link
	if (!pHref.match(/^https?:\/\//) && pHref.match(/\.md$/))
	{
		let tmpRoute = catalogLookup(pCurrentModule, pHref);
		if (tmpRoute)
		{
			return { href: tmpRoute };
		}
	}
	return null;
};
```

### Force All Links Internal

Override the default external-link behavior:

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	return { href: pHref, target: '_self' };
};
```

### Add Tracking Parameters

Append query parameters to outbound links:

```javascript
let tmpResolver = (pHref, pLinkText) =>
{
	if (pHref.match(/^https?:\/\//))
	{
		let tmpSeparator = pHref.includes('?') ? '&' : '?';
		return {
			href: pHref + tmpSeparator + 'ref=myapp',
			target: '_blank',
			rel: 'noopener'
		};
	}
	return null;
};
```

## Threading Through Block Elements

The resolver is automatically threaded through all parsing contexts:

- **Paragraphs** -- Inline links in paragraph text
- **Headings** -- Links inside heading text
- **List items** -- Links inside list item content
- **Table cells** -- Links inside table headers and body cells
- **Blockquotes** -- Links inside blockquoted content (recursive `parseMarkdown` calls pass the resolver through)

This means a single resolver handles all links in a document regardless of their block context.

## Using with parseMarkdown

Pass the resolver as the second argument:

```javascript
let tmpHTML = tmpProvider.parseMarkdown(pMarkdown, tmpResolver);
```

## Using with parseInline

For inline-only parsing, pass the resolver as the second argument:

```javascript
let tmpHTML = tmpProvider.parseInline(pText, tmpResolver);
```
