import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Legal pages (privacy, terms, cookies) authored as markdown.
// Add a new .md file under src/content/legal/ to publish another legal page.
const legal = defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/legal" }),
    schema: z.object({
        title: z.string(),
        lastUpdated: z.string().optional(),
    }),
});

// Services. Each .md file under src/content/services/ becomes both a card in the
// Services section and its own detail page at /services/<filename>. The frontmatter
// feeds the card; the markdown body is the detail page content.
const services = defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/services" }),
    schema: z.object({
        title: z.string(),
        // Short blurb shown on the card and used as the page summary.
        description: z.string(),
        // Controls card/listing order (lower comes first). Defaults to 0.
        order: z.number().default(0),
    }),
});

export const collections = { legal, services };
