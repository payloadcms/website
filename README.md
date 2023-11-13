# Payload CMS Website 

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

### License

The Payload website is available as open source under the terms of the [MIT license](https://github.com/payloadcms/website/blob/main/LICENSE).
