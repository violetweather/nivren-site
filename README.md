# Nivren website

The official documentation and download site for Nivren 1.0.0 stable, the Edition 6 runtime edition.

Live site: <https://violetweather.github.io/nivren-site/>

## Site sections

- Landing page with language overview and verified implementation evidence
- Searchable Edition 6 documentation
- The twelve-workload Edition 6 benchmark suite, wins and losses published
- Package guides for all 25 official 1.0.0 packages and the live signed registry
- Platform-specific installation instructions
- Release downloads, checksums, and provenance guidance
- Complete language examples

## Development

Requires Node.js 22.13 or newer.

```sh
npm install
npm run dev
```

Quality checks:

```sh
npm run lint
npm test
npm audit --audit-level=high
```

Pushes to `main` are validated, statically exported, and deployed to GitHub Pages by `.github/workflows/pages.yml`. The project can also be previewed through Cloudflare Workers using vinext; that hosting configuration lives in `.openai/hosting.json`.

## Release assets

`public/downloads` contains only binaries that have been built and verified. Platform cards without a completed hosted build remain visibly marked as pending rather than linking to nonexistent artifacts.

The project is licensed under Apache-2.0 as part of the Nivren source distribution.
