# Payload Website

This is the repository for [Payload's official website](https://payloadcms.com/). It was built completely in public using Payload itself, [more on that here](#⭐-the-cms).

<img src="https://payloadcms.com/images/og-image.jpg" alt="Payload headless CMS website" />

This site showcases lots of cool stuff like how to use Payload's GraphQL API to its fullest extent, how to build a super dynamic light / dark mode into a Next site without any first-load flickering, how to render remotely stored docs from MDX to Next.js pages, how to use Stripe to build a custom SaaS integration, and much more.

## ✨ Tech stack

- [Payload](https://github.com/payloadcms/payload) (obviously)
- TypeScript
- Next.js 13 and its new App Router
- SCSS Modules
- GraphQL
- MDX for docs
- Stripe for Payload Cloud

## ⭐ The CMS

[Payload](https://github.com/payloadcms/payload) is leveraged for everything that this site does, outside of its documentation which is all stored as Markdown in the Payload repo on GitHub. The CMS powering this site is completely open-source and [can be found here](https://github.com/payloadcms/website-cms).

Both this repo and the CMS repo can be used as great examples to learn how to build Payload projects at scale.

## ☁️ Payload Cloud

[Payload Cloud](https://payloadcms.com/cloud-pricing) is out! This is a one-click integration to deploy production-ready instances of your Payload apps directly from your GitHub repo, [read the blog post](https://payloadcms.com/blog/launch-week-day-1-payload-cloud-is-here) to get all the details. The entire frontend of Payload Cloud has been built in public and is included within this repo 😱.

## 🚀 Running the project locally

To get started with this repo locally, follow the steps below:

- Clone the repo
- `yarn`
- Run `cp .env.example .env` to create an `.env`
- Fill out the values within your new `.env`, corresponding to your own environment
- Run `yarn dev`
- Bam

### Hosts file

The locally running app must run on `local.payloadcms.com:3000` because of http-only cookie policies and how the GitHub App redirects the user back to the site after authenticating. To do this, you'll need to add the following to your hosts file:

```
127.0.0.1 local.payloadcms.com
```

> On Mac you can find the hosts file at `/etc/hosts`. On Windows, it's at `C:\Windows\System32\drivers\etc\hosts`:

### Documentation

The documentation for this site is stored in the [Payload repo](https://github.com/payloadcms/payload) as Markdown files. These are fetched at build time and rendered as pages on the site.

You can also specify a `beta` version and `legacy` version to render different versions of the docs:

- Set the environment variable `NEXT_PUBLIC_ENABLE_BETA_DOCS` to `true` to enable the beta docs.
- Specify a branch, commit, or tag with `NEXT_PUBLIC_BETA_DOCS_REF`. The default for the beta docs is `beta`.
- Set the environment variable `NEXT_PUBLIC_ENABLE_LEGACY_DOCS` to `true` to enable the legacy docs.
- Specify a branch, commit, or tag with `NEXT_PUBLIC_LEGACY_DOCS_REF`. The default for the legacy docs is `null`, and will fallback to the `main` branch.

Working on docs locally:

To work on the docs locally you will need to have the payload repo cloned down (it is easier if you have 2 versions, one per payload version):

```
// .env
DOCS_DIR_V2=path-to-local-payload-v2-repo
DOCS_DIR_V3=path-to-local-payload-v3-repo
```

To generate the docs locally you can run `pnpm fetchDocs:local`, then you can boot up the website repo and view them at http://localhost:3000/docs. Any time you make changes to the v2/v3 docs then you will need to re-run the `pnpm fetchDocs:local` command.

### License

The Payload website is available as open source under the terms of the [MIT license](https://github.com/payloadcms/website/blob/main/LICENSE).
