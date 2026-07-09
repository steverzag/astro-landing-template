# Astro Landing Page Template

A landing page template built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), meant as a starting point for client landing sites. It ships with the common building blocks already wired up — sections, a design-token theme, scroll-reveal animations, content collections, validated contact forms, and legal pages — so a new project starts from working conventions instead of a blank canvas.

## Stack

- **Astro 7** with `output: "server"` (SSR) and the sitemap integration
- **Tailwind CSS 4** via the Vite plugin, plus the [typography](https://github.com/tailwindlabs/tailwindcss-typography) and [tailwindcss-animated](https://github.com/new-data-services/tailwindcss-animated) plugins
- **TypeScript** (Astro strict config) with path aliases
- **libphonenumber-js** for phone validation
- **pnpm** as the package manager (Node >= 22.12)

## Getting Started

```sh
pnpm install
pnpm dev        # local dev server at localhost:4321
pnpm build      # production build to ./dist/
pnpm preview    # preview the production build
```

## Project Structure

```text
src/
├── components/          # Reusable UI pieces (Modal, Reveal, RevealStagger)
│   └── Forms/           # Form (base wrapper) + FormState + ContactUsForm
├── content/
│   ├── legal/           # Markdown legal pages (privacy, terms, cookies)
│   └── services/        # One .md per service — card + detail page
├── layouts/             # Layout.astro (main) and LegalLayout.astro
├── pages/
│   ├── api/contactus.ts # POST endpoint with server-side validation
│   ├── services/[slug].astro
│   └── index.astro, 404.astro, privacy/terms/cookies.astro
├── sections/            # Full-width landing sections (Hero, About, Services,
│                        #   Contact, Navbar, Footer) composed in index.astro
├── styles/global.css    # Theme tokens, custom utilities, scroll-reveal CSS
├── utils/               # forms.ts (client form logic), appTools.ts (validators)
└── content.config.ts    # Content collection schemas
```

Path aliases are defined in `tsconfig.json`: `@layouts/*`, `@sections/*`, `@components/*`, `@images/*`, `@icons/*`, `@utils/*`.

## Conventions

### Design tokens

All theming lives in the `@theme` block of `src/styles/global.css`. The color, shadow, blur, and radius namespaces are **reset** (`--color-*: initial;` etc.) so only the approved tokens generate utilities:

- Colors: `primary`, `secondary`, `tertiary`, `background`
- Shadows / blurs / radii: `sm`, `md`, `lg`
- Opacity utilities: `opacity-muted`, `opacity-disabled`, `opacity-overlay`
- Durations: `fast` (200ms), `medium` (300ms), `slow` (700ms) — `duration-*` utilities for transitions, `animate-duration-*` for animations (an `@utility` override lets the animate plugin resolve the same tokens), `var(--transition-duration-*)` in component CSS. Hover micro-interactions use `--default-transition-duration` (150ms). Don't hardcode times; use the tokens so motion speed can be retuned in one place.
- Fonts: `font-heading` (Roboto), `font-body` (Nunito Sans)

To rebrand a new project, change the token values in `global.css` — arbitrary colors like `text-red-500` intentionally don't exist.

### Sections vs. components

`src/sections/` holds the full-width landing page blocks composed in `index.astro`; `src/components/` holds smaller reusable pieces. Components that can render multiple times on one page (e.g. `ContactUsForm` in both the navbar modal and the contact section) generate unique IDs per render and scope their scripts per instance.

### Content collections

Defined in `src/content.config.ts`:

- **`services`** — each `.md` in `src/content/services/` becomes a card in the Services section and a detail page at `/services/<filename>`. Frontmatter (`title`, `description`, `order`) feeds the card; the markdown body is the detail page.
- **`legal`** — each `.md` in `src/content/legal/` is a legal page rendered with `LegalLayout` (frontmatter: `title`, optional `lastUpdated`).

### Scroll-reveal animations

Wrap content in `<Reveal>` or `<RevealStagger>` (or add `data-reveal` plus a `tailwindcss-animated` `animate-*` utility). Animations stay paused until an `IntersectionObserver` in `Layout.astro` marks the element `.in-view`. Without JavaScript, or with `prefers-reduced-motion`, content is simply shown with no animation.

### Forms

Every form is built from `<Form>` (`src/components/Forms/Form.astro`), the base wrapper that renders the actual `<form>` element and bakes in the project conventions: the `FormState` loading/success/error overlay (plus the `relative` positioning it needs) and `novalidate`. To create a new form, put your fields in a `<Form>` with `successMessage`/`errorMessage` props and a marker attribute, then wire it up in a script — any extra attributes are forwarded to the `<form>` element:

```astro
<Form data-my-form successMessage="…" errorMessage="…" class="space-y-6">
  <!-- fields + submit button -->
</Form>

<script>
  import { initForm } from "@utils/forms.ts";
  document
    .querySelectorAll<HTMLFormElement>("[data-my-form]")
    .forEach((form) => initForm(form, "myendpoint"));
</script>
```

`src/utils/forms.ts` provides `initForm(form, endpointPath)`, a declarative client-side validation system: mark inputs with `data-required` and/or `data-validate` and the rules in `fieldValidations` (keyed by input `name`) are applied on submit. Because forms are `novalidate`, these rules replace the browser's native validation. Submissions POST as JSON to `/api/<endpointPath>`, and `FormState` renders the loading/success/error overlay. See `ContactUsForm.astro` for the full pattern, including per-render unique input IDs.

The API route (`src/pages/api/contactus.ts`) mirrors the validation server-side and currently just logs submissions — wire it to an email provider (e.g. Resend) to go live.

## Commands

| Command            | Action                                           |
| :----------------- | :----------------------------------------------- |
| `pnpm install`     | Install dependencies                             |
| `pnpm dev`         | Start local dev server at `localhost:4321`       |
| `pnpm build`       | Build the production site to `./dist/`           |
| `pnpm preview`     | Preview the build locally before deploying       |
| `pnpm astro ...`   | Run CLI commands like `astro add`, `astro check` |
