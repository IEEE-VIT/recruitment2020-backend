# Recruitments Backend 2020

## Development Run

```bash
yarn install
yarn run dev
```

## Production Run

```
yarn install
yarn run prod
```

Make Sure to have NODE_ENV=production in .env

## Docker Build

```bash
touch secrets
vim secrets
# Fill secrets with example env and configure accordingly
docker build -t "recruitments2020-backend" .
docker run -p 5000:5000 --env-file secrets recruitments2020-backend
```

## Example Env File

```env
DB_SCHEMA=postgres
DB_USERNAME=postgres
DB_PASSWORD=toor
JWT_SECRET=examplevariable
DATABASE_URL=
NODE_ENV=development
ADDSLOT_KEY=keytoaddslot
REGISTERADMIN_KEY=keyforadmin
EMAIL_TOKEN=

```

## Postman Docs

[Click Here](https://documenter.getpostman.com/view/11431136/TVmMgd2J)
