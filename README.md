# Payload CMS Website

This is the repository for Payload's official website. We're building it completely in public.

<img src="https://payloadcms.com/images/og-image.jpg" alt="Payload headless CMS website" />

This site showcases lots of cool stuff like how to use Payload's GraphQL API to its fullest extent, how to build a super dynamic light / dark mode into a Next site without any first-load flickering, how to render remotely stored docs from MDX to NextJS pages, and much more.  

## Tech stack:

- Payload (obviously)
- TypeScript
- Next 13 and its new `/app` folder
- SCSS Modules
- GraphQL
- MDX for docs

#### The CMS

Payload is leveraged for everything that the site does, outside of its documentation which is all stored as Markdown in the Payload repo itself. It's also completely open-source and [can be found here](https://github.com/payloadcms/website-cms). 

Both this repo and the CMS repo can be used as great examples to learn how to build Payload projects at scale.

#### Payload Cloud

Soon, we'll be launching Payload Cloud, which will be a one-click GitHub integration that handles production deployment for your Payload apps. The entire frontend of Payload Cloud will also be built in public and included within this repo, which is going to be awesome.

## Running the project locally

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