const Mailgun = require('mailgun-js');
const puppeteer = require('puppeteer');
const conf = require('./conf.json');

const LOGIN_PAGE = 'https://stackoverflow.com/users/login';
const PROFILE_PAGE = 'https://stackoverflow.com/users/current';

mailgun = Mailgun({
    apiKey: conf.mailgun_api_key,
    domain: conf.mailgun_domain
});

function notify(body) {
    mailgun
        .messages()
        .send({
            from: conf.from,
            to: conf.to,
            subject: conf.subject,
            text: body
        }, (error, body) => {
            if (error) {
                throw error;
            }
        });
}

async function crawl() {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ]
    });
    const page = await browser.newPage();

    console.log(`Loading ${LOGIN_PAGE}`);
    await page.goto(LOGIN_PAGE);

    console.log('Filling login form with credentials');
    await page.type('#email', conf.login);
    await page.type('#password', conf.password);
    await page.click('#submit-button');

    console.log('Loading profile page');
    await page.goto(PROFILE_PAGE);

    console.log('Grabbing stats');
    await page.waitForSelector(statsSelector = '#top-cards span.fs-caption');
    const stats = await page.evaluate(
        statsSelector => document.querySelector(statsSelector).textContent,
        statsSelector
    );

    console.log(`Sending stats: ${stats}`);
    notify(`Logged in for ${text} consecutive days`)

    console.log('Closing browser');
    await browser.close();
}

function job() {
    try {
        crawl();
    }
    catch (error) {
        console.error(error);
        notify(`Something went wrong: ${error.toString()}`)
    }
}

setInterval(job, 1000 * 60 * 60 * 22);
job();
