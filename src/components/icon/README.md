# Icons

There are two ways to get a vector into the UI. Which one you pick depends on what the graphic _is_, not on what it looks like.

## `<Icon />` — the design system's icon set

`icon.tsx` wraps [lucide](https://lucide.dev/icons), which is where our UI glyphs come from: chevrons, close, plus, the nav icons, and so on.

```tsx
import Icon from "components/icon/icon";

<Icon name="chevron-right" />
<Icon name="trash" size="s" />
```

The `icons` registry in that file is the whole vocabulary. To add one, import it and add it to the object — `IconName` is derived from those keys, so there is nothing else to update.

Icons inherit `currentColor`. Don't give them a fixed pixel size or a literal colour.

## A local `.svg` — everything else

Anything outside that vocabulary lives in `assets/icons/` and is imported with vite's `?react` suffix, which turns it into a component:

```tsx
import Logo from "assets/icons/logo.svg?react";

<Logo width="1rem" />;
```

Reach for this when the graphic is:

- **brand or identity** — the logo, a wordmark
- **carrying its own colours** — anything that isn't a single-colour glyph
- **animated** — `spinner.svg` has its own keyframes
- **a one-off illustration** — empty states, error art

Rule of thumb: if it belongs to the icon set a designer picks from, it's an `<Icon />`. If it's artwork, it's a file.

When authoring one, keep the `viewBox` and drop `width`/`height` so it can be sized from CSS, and use `currentColor` unless the graphic is deliberately multi-colour. SVGO runs over these during the build; the config lives in `vite.config.ts`.

Unlike `<Icon />`, a `?react` import gives you the raw svg with no accessibility handling: add `aria-hidden="true"` yourself when it sits next to text that already says the same thing.
