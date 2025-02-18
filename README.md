![Secret Network Banner](banner.png)

# Secret Dashboard

Secret Dashboard is an entry point for new users into Secret Network. Features include a Dashboard UI for Secret Network data, IBC Transfer to and from Secret, a Wrap/Unwrap interface, a list of all active Secret dApps, a link collection to useful secret tools and more.

## System Requirements

- [Node.js 18 LTS](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## Setup

After verifying the system requirements you should be able to run a few commands to get everything set up:

```
git clone https://github.com/scrtlabs/dash.scrt.network.git
cd dash.scrt.network
yarn install
```

## Running the app

### The good ol' classic way

To get the app up and running, run:

```
yarn start
```

The App runs on port 3000.

### Docker

To get the app up and running inside Docker, run:

```
docker compose up
```

The App runs on port 3000. For further information check the `Dockerfile` and the `docker-compose.yml`.

## License

Developed by [Secret Jupiter](https://secretjupiter.com) and [Secret Saturn](https://secretsaturn.net)

Licensed under the [MIT license](https://github.com/scrtlabs/dash.scrt.network/blob/master/LICENSE.md)
