# Watch

This is an app I made to store and manage the list of movies and tv shows I'm interested in. I used to keep this data in a big Google Sheet, but it required way too much manual work, and searching and filtering was very tedious. There are existing solutions for this, but I wanted a UX tailored exactly to my own needs.

## Main Features

- Adding movies and shows by filling a form, or just pasting an IMDb ID.
- Keeping track of the states: waiting for next season, ready to watch, in progress, etc. Transition between states with a single button press.
- Easy but powerful search, with keywords.
- Poster image search (based on Google image search).
- External links to IMDb, torrent search, subtitle search, trailers, recaps, etc.
- Keyboard shortcuts for frequently used features.
- Mobile support.
- Automatic daily backups.

## Screenshots

- Home page <br/> ![Home page](https://preview.ibb.co/kjAAUK/watched_home.png)
- Item details <br/> ![Item details](https://preview.ibb.co/cv22bz/watched_details.png)
- Item form <br/> ![Item form](https://preview.ibb.co/mmpn9K/watched_form.png)

## Architecture

- Database: MongoDB
- Server: Node.js Express API
- Client: React SPA with Material UI

## Notes and Disclaimers

- All components of the architecture are currently locally hosted. I have scripts to run them all on a single Terminal window.
- All components of the architecture are in the same repository for easy code sharing (in hindsight, this probably wasn't the right decision)
- No unit tests. Since I am the only developer and user of this app, I didn't see the point.
- Only tested on the latest Chrome, Safari and Mobile Safari.

## Usage

- Clone the repo
- Install [MongoDB](https://www.mongodb.com/) if you don't already have
- Run `npm install`
- Then `npm run start-all` for development mode.

## Scripts

- Start Mongo DB: `mongod`
- Start server: `npm run server`
- Start client: `npm start`
- Start all in one: `npm run start-all`
- Make build: `npm run build`
- Start build: `npm run start-all-prod`

## All-in-one scripts

- Dev: `node scripts/start-all.js`
- Prod: `node scripts/start-all.js --prod`
