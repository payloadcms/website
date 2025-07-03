# Payload Website

This is the repository for [Payload's official website](https://payloadcms.com/). It was built completely in public using Payload itself, [more on that here](#⭐-the-cms).

<img src="https://payloadcms.com/images/og-image.jpg" alt="Payload headless CMS website" />

This site showcases lots of cool stuff like how to use Next.js 15 + Payload's local API to its fullest extent, how to build a super dynamic light / dark mode into a Next site without any first-load flickering, how to render remotely stored docs from MDX to Next.js pages using just Payload (no external libraries), how to use Stripe to build a custom SaaS integration, and much more.

## ✨ Tech stack

- [Payload](https://github.com/payloadcms/payload) (obviously)
- TypeScript
- Next.js 15 and its new App Router
- SCSS Modules
- MDX for docs, using the [Lexical MDX Converter](https://payloadcms.com/docs/rich-text/converting-markdown#converting-mdx)
- GraphQL for Payload Cloud
- Stripe for Payload Cloud

## ⭐ The CMS

[Payload](https://github.com/payloadcms/payload) is leveraged for everything that this site does, outside of its documentation which is all stored as Markdown in the Payload repo on GitHub. Both the CMS and the website frontend are found within the same app folder.

## ☁️ Payload Cloud

This repo contains the source code for [Payload Cloud](https://payloadcms.com/cloud-pricing). This is a one-click integration to deploy production-ready instances of your Payload apps directly from your GitHub repo, [read the blog post](https://payloadcms.com/blog/launch-week-day-1-payload-cloud-is-here) to get all the details. The entire frontend of Payload Cloud has been built in public and is included within this repo 😱.

## 🚀 Running the project locally

To get started with this repo locally, follow the steps below:

- Clone the repo
- `pnpm i`
- Run `cp .env.example .env` to create an `.env` file
- Fill out the values within your new `.env`, corresponding to your own environment
- Run `pnpm dev`
- Bam

### Hosts file

The locally running app must run on `local.payloadcms.com:3000` because of http-only cookie policies and how the GitHub App redirects the user back to the site after authenticating. To do this, you'll need to add the following to your hosts file:

```env
127.0.0.1 local.payloadcms.com
```

> On Mac you can find the hosts file at `/etc/hosts`. On Windows, it's at `C:\Windows\System32\drivers\etc\hosts`:

### Documentation

The documentation for this site is stored in the [Payload repo](https://github.com/payloadcms/payload) as Markdown files. These are fetched when you press the "Sync Docs" button in the CMS. Pressing that button does the following:

1. Docs are pulled from the Payload repo on GitHub.
2. The docs are converted from MDX to Lexical and stored in the CMS.
3. The frontend docs pages are revalidated.
4. Visiting the docs pages will pull the latest docs from the CMS, and render those lexical nodes to JSX.

#### Working on the docs locally - GitHub

By default, the docs are pulled from the `main` branch of the Payload repo on GitHub. You can **load the docs** for a different branch by opening the /docs/dynamic/ route on the website. This will dynamically load them every time you visit the page, without needing to sync them in the CMS.

Example:

- This pulls from the main branch: https://payloadcms.com/docs/getting-started/concepts
- This pulls from the feat/myfeature branch: https://payloadcms.com/docs/dynamic/getting-started/concepts?branch=feat/myfeature

In order to edit docs for that branch without touching markdown files, you can use the branch selector in the CMS to select the branch you want to work on. After making changes and saving the document, the lexical docs will be converted to MDX and pushed to the selected branch on GitHub.

You will need to set the following environment variables to work with the GitHub sync:

```env
// .env
# For reading from GitHub
GITHUB_ACCESS_TOKEN=ghp_
GITHUB_CLIENT_SECRET=
# For writing to GitHub - you can run the https://github.com/payloadcms/gh-commit repo locally
COMMIT_DOCS_API_URL=
COMMIT_DOCS_API_KEY=
```

#### Working on docs locally - local markdown files

If you have the docs stored locally as markdown files and would like to preview them in the website, you can use the /docs/local/ route in the website. First, you need to set the `DOCS_DIR_V3` environment variable to point to your local `docs` directory.

```env
// .env
DOCS_DIR_V3=/documents/github/payload/docs
```

Then, just open the `/docs/local/` route: http://localhost:3000/docs/local/getting-started/concepts.

Every time you make a change to the markdown files, just reload the page to see the changes reflected. The local MDX files are read, automatically converted to lexical on-the-fly, and rendered in the website. This process will not make any changes to the database.

#### Beta and Legacy environment flags

You can also specify a `beta` version and `legacy` version to render different versions of the docs:

- Set the environment variable `NEXT_PUBLIC_ENABLE_BETA_DOCS` to `true` to enable the beta docs.
- Specify a branch, commit, or tag with `NEXT_PUBLIC_BETA_DOCS_REF`. The default for the beta docs is `beta`.
- Set the environment variable `NEXT_PUBLIC_ENABLE_LEGACY_DOCS` to `true` to enable the legacy docs.
- Specify a branch, commit, or tag with `NEXT_PUBLIC_LEGACY_DOCS_REF`. The default for the legacy docs is `null`, and will fallback to the `main` branch.

### License

The Payload website is available as open source under the terms of the [MIT license](https://github.com/payloadcms/website/blob/main/LICENSE).
