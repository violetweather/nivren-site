# Nivren website

The official documentation and download site for the Nivren programming language compatibility beta.

## Site sections

- Landing page with language overview and verified implementation evidence
- Searchable Edition 1 documentation
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

The deployment build targets Cloudflare Workers through vinext and the Sites Vite plugin. Hosting configuration lives in `.openai/hosting.json`.

## Release assets

`public/downloads` contains only binaries that have been built and verified. Platform cards without a completed hosted build remain visibly marked as pending rather than linking to nonexistent artifacts.

The project is licensed under Apache-2.0 as part of the Nivren source distribution.
