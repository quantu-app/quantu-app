# QuantU

This is the main application repository for QuantU.

## Installation

```bash
npm install
```

Setup environment

```bash
cp .env.example .env

# set GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET in .env
# generate a value for JWT_SECRET_KEY, and set it in .env
npm run secret
```

## Setup database

### Seeding the DB
```
npx prisma db seed
```

**Option 1** : docker-compose mongo backend

```bash
npm run mongo

# now sign-in with your user in the frontend
# then login to mongo and make your user a creator
mongo -u root -p password admin
> use quantu-app
> db.User.updateOne({username: "nathanfaucett"}, {$set: {creator: true}})

# set DATABASE_URL in .env
```

**Option 2** : set `DATABASE_URL`

If you have a local mongo db or online instance, just set `DATABASE_URL` in the .env to have the app connect to the db.

### Connect to remote

```bash
kubectl port-forward --namespace ui svc/quantu-app-postgresql 5432:5432
kubectl port-forward --namespace ui svc/quantu-app-mongodb-headless 27017:27017
```

## Development

### Prisma

After any updates to the database schema in `prisma/schema.prisma` you should run `npm run prisma generate` to update the type defs.

## Deployment

```bash
export KUBECONFIG=~/my/path/to/appname-kubeconfig.yaml
NODE_ENV=production npm run helm
```
