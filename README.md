# Pell to Planet

A Wayne State student's guide to funding short-term study abroad. Gilman Follow-on Service Project by Gotibeh Alhady.

Live site: https://alhady101.github.io/pell-to-planet/

## The one rule

Every dollar figure, deadline, and award amount lives in `src/data/facts.ts` and must carry a `source` and a `verifiedOn` date. The schema in `src/data/schema.ts` is validated at build time, so an unsourced number fails the build. Anything not yet known is a `todo` and renders as a visible TODO, never as a guess.

## Develop

```
npm install
npm run dev      # http://localhost:4321/pell-to-planet/
npm run build    # static output in dist/
npm run preview
```

## Deploy

Pushes to `main` build and publish to GitHub Pages through `.github/workflows/deploy.yml`. In the repository settings, set Pages → Source to "GitHub Actions" once.
