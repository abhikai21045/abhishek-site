# abhishekgore.com

A hand-coded static site,no framework just Plain HTML/CSS/JS

## Structure

```
index.html         Homepage / portfolio
writeups.html       Full list of writeups (with tag filters)
writeup.html         Reader page - loads one writeup by ?slug=
css/style.css        All styling
js/site.js           Mobile nav toggle
js/writeups.js       Loads manifest.json, renders lists, renders markdown
writeups/manifest.json   The index of every writeup (title, date, tags, difficulty)
writeups/*.md        The actual writeup content, one file per writeup
CNAME                Tells GitHub Pages to serve this at abhishekgore.com
.nojekyll             Tells GitHub Pages not to run Jekyll processing
```

## Publishing a new writeup (the whole workflow)

1. Add a Markdown file to `writeups/`, e.g. `writeups/sqli-lab-1.md`, and write
   your notes in it — headings, code blocks, images, whatever.
2. Add one entry to `writeups/manifest.json`:

   ```json
   {
     "slug": "sqli-lab-1",
     "title": "SQLi lab — union-based extraction",
     "date": "2026-09-12",
     "tags": ["web", "sqli"],
     "difficulty": "Medium",
     "summary": "One-line summary (not shown yet, but handy for later use)"
   }
   ```

   `slug` must match the markdown filename (without `.md`). `difficulty` is
   `Easy`, `Medium`, or `Hard` — it controls the little colour swatch.

3. Commit and push. That's it, no build, no generated files.

The two files already in `writeups/` (`example-*.md`) are placeholders so you
can see the format. Delete them once you've published your first real one
(and remove their entries from `manifest.json`).

## Hosting it on GitHub Pages with your domain

1. Push this whole folder to a GitHub repo (any name is fine, e.g. `site` or
   `abhishekgore.com`).
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch**, branch `main`, folder `/ (root)`.
3. `CNAME` in this repo already contains `abhishekgore.com`, so GitHub Pages
   will pick it up automatically once Pages is enabled — no need to type it
   into the Pages settings again unless you change domains.
4. At your domain registrar, point DNS at GitHub Pages:
   - Four `A` records for the apex domain (`abhishekgore.com`) pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing to `<your-github-username>.github.io`
     (only if you also want `www.abhishekgore.com` to work)
5. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate
   has provisioned (can take up to a few hours after DNS propagates).

## Things to personalise before you publish

- `index.html` — the contact section (`email`, `github`, `linkedin`) is
  still placeholder text, search for `TODO` comments.
- Swap the "Selected work" section for anything you're comfortable making
  public — it's currently generic on purpose since client engagement
  specifics usually shouldn't be named.
- `assets/favicon.svg` is a minimal placeholder mark — replace if you want
  something else.

## Why plain HTML/CSS/JS instead of Astro/Hugo

This gets you to "push and it's live" today, with zero local tooling to
install or maintain. If you later want templated layouts, RSS, tag pages
generated automatically, etc., moving your `writeups/*.md` files into a
proper static site generator is a fairly mechanical migration — the content
doesn't need to change, just how it's assembled into pages.
