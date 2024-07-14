# QSVDS

![GitHub License](https://img.shields.io/github/license/ESV-Sweetplum/qsvds-site) ![GitHub branch status](https://img.shields.io/github/checks-status/ESV-Sweetplum/qsvds-site/main) ![GitHub commit activity](https://img.shields.io/github/commit-activity/w/ESV-Sweetplum/qsvds-site)

The **Quaver SV Difficulty System** (or **_QSVDS_** for short) is a player-managed database of SV charts and their respective difficulties. The site is meant to provide information to both SV beginners and SV pros, as well as for players to show off their SV prowess. QSVDS is based solely on [Quaver](https://github.com/Quaver/Quaver) and its APIs.

### Note that the current design is very incomplete. The site will undergo a complete overhaul spearheaded by zeph.

# List of Administrators

-   <img src="https://github.com/ESV-Sweetplum.png" width="12"> [ESV-Sweetplum](https://github.com/ESV-Sweetplum) - Developer
-   <img src="https://github.com/asterSSH.png" width="12"> [zeph](https://github.com/asterSSH) - Graphic Designer
-   <img src="https://github.com/ESVEBE.png" width="12"> [EBE](https://github.com/ESVEBE) - Organizer

# Becoming a User

When you log into the site, you will start out as a player. If you reach a high enough level within certain charts and the SV community in general, you can apply to become a contributor.

## As a player, you can:

-   Track your best scores on SV maps
-   Compete with other players on SV leaderboards
-   Submit reports of suspected cheaters

## As a contributor, you can:

-   Do all of the above
-   Add maps to the database
-   Submit ratings to the database

### To become a contributor, submit a ticket at \<WILL BE DONE AT A LATER DATE\>.

# Tech Stack

[![Tech Stack](https://skillicons.dev/icons?i=ts,react,nextjs,vercel,supabase,prisma,sass,figma)](https://skillicons.dev)

This website is built with the [Next.js](https://nextjs.org) framework, and hosted on [Vercel](https://vercel.com).

## Backend

-   API built with [Next.js](https://nextjs.org).
-   Database hosted with [Supabase](https://supabase.com).
-   API-Database connection done with [Prisma](https://www.prisma.io).
-   Fetching/HTTP requests done with [axios](https://axios-http.com) (most likely going to migrate to xior for middleware support).
-   Cron hosting for metrics and live updates done with [val town](https://www.val.town).

## Styling Packages

-   Designs done with [Figma](https://www.figma.com).
-   CSS extension done with [Sass](https://sass-lang.com).
-   Components built with [Radix Themes](https://www.radix-ui.com).
-   Text fitting algorithm implemented with [react-textfit](https://www.npmjs.com/package/react-textfit).

# Steps for Cloning and Running

-   Clone this repository into a directory of your choice, using `git clone https://github.com/ESV-Sweetplum/qsvds-site.git`.
-   Install missing packages with `npm i`.
-   Populate the provided `.env.example` file and rename it to `.env`.
-   Generate the Prisma ORM client using `npx generate prisma`.
-   Synchronize the database schema using `npx prisma migrate dev --name init`.
-   Run `npm run dev` in the terminal to enter a development environment.
