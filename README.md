## Discord Bot for Bigpoint Servers

User Administration, RSS Feeds, Web UI (Seperate Repo)

## Setup

Create a .env at the root

Get discord token from Discord Developer Portal and set `BOT_TOKEN`  in the .env file.

Copy packages/ui/src/config.ini.default to packages/ui/src/config.ini and configure environment details

Start non-essential services with docker compose `docker compose up mariadb nginx php -d`

Import the sql from `sql/tables.sql` into a new database on the mariadb container

Start the discord bot container with `docker compose up bot`

To rebuild the bot image and not restart other services, run `docker compose up --build bot` or `docker compose up --build bot -d` for detached mode