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

export const collections = { legal };
