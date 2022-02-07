# QuantU

This is the main application repository for QuantU.

## Installation

1. Run `npm install`
2. Run `cp .env.example .env` and then change the contents to point to your localhost:3000 url.

## Deployment

```bash
export KUBECONFIG=~/my/path/to/appname-kubeconfig.yaml
NODE_ENV=production npm run helm 
```
