# QuantU

This is the main application repository for QuantU.

## Installation

1. Run `npm install`
2. Run `cp .env.example .env` and then change the contents to point to your localhost:3000 url.
3. Run `npm run mongo`
4. [Optional] after signing in with a user, make them a creator
    ```bash
    $ mongo -u root -p password admin 
    > use quantu-app
    > db.User.updateOne({username: "nathanfaucett"}, {$set: {creator: true}})
    ```

## Prisma

after updates to schema `prisma/schema.prisma` you should run `npm run prisma generate` to update the type defs

## Deployment

```bash
export KUBECONFIG=~/my/path/to/appname-kubeconfig.yaml
NODE_ENV=production npm run helm 
```
