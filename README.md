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
docker run -d -v path/to/conf.json:/conf.json \
    --name fanatic-bot \
    garsaud/stackoverflow-fanatic-badge
```

**Mailgun domain setup**: If you use an [EU domain](https://www.mailgun.com/blog/we-have-a-new-region-in-europe-yall/), please set `mailgun_eu_domain` to `y`.

## Through the interactive mode
Build the config file answering questions:

```bash
touch conf.json
docker run --rm -it -v ${PWD}/conf.json:/conf.json \
    garsaud/stackoverflow-fanatic-badge configure
```

![](https://user-images.githubusercontent.com/3667366/54071538-1785ef00-426e-11e9-8d98-37b24778df0e.png)

Then launch the bot:

```bash
docker run -d -v ${PWD}/conf.json:/conf.json \
    --name fanatic-bot \
    garsaud/stackoverflow-fanatic-badge
```

