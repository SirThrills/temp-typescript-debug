## Discord Bot for Bigpoint Servers

User Administration, RSS Feeds, Web UI (Seperate Repo)

## Setup

Copy `.env.default` to `.env`

Get discord token from Discord Developer Portal and set `BOT_TOKEN` with it

Start mariadb with docker compose `docker compose up mariadb -d`

Import the sql from `sql/tables.sql`

Start the bot with `docker compose up bot -d`

To rebuild the bot image and not restart mariadb, run `docker compose up --build bot` or `docker compose up --build bot -d` for detached mode