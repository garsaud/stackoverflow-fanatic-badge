# StackOverflow Fanatic Badge Achiever 🥇
An automated way to get the "fanatic" badge, by running a node bot in a docker
container that will log into your account everyday and send reports of your
progression.

## Requirements
- docker, preferably on a vps that can run it for 100 days straight
- a stackoverflow account
- a mailgun account

## Setup
There are two ways to configure it.

### With a config file
Create a `conf.json` file based on `conf.example.json` and mount it as a volume
into the container:

```bash
docker run -v path/to/conf.json:/conf.json \
    --name fanatic-bot \
    garsaud/stack-overflow-fanatic-badge
```

## Through the interactive mode
Build the config file answering questions:

```bash
docker run --rm -it -v ~/conf.json:/conf.json \
    garsaud/stack-overflow-fanatic-badge configure
```

Then launch the bot:

```bash
docker run -v ~/conf.json:/conf.json \
    --name fanatic-bot \
    garsaud/stack-overflow-fanatic-badge
```
