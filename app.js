const Mailgun = require('mailgun-js');
const puppeteer = require('puppeteer');
const conf = require('./conf.json');

const LOGIN_PAGE = 'https://stackoverflow.com/users/login';
const PROFILE_PAGE = 'https://stackoverflow.com/users/current';

mailgun = Mailgun({
    host: (conf.mailgun_eu_domain == "y") ? "api.eu.mailgun.net" : "api.mailgun.net",
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
        headless: true,
        executablePath: '/usr/bin/chromium',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ]
    });
    const page = await browser.newPage();


    console.log(`Loading ${LOGIN_PAGE}`);
    await page.goto(LOGIN_PAGE).then(() => {
        console.log(' -> success!');
    });


    console.log('Filling login form with credentials');
    await page.type('#email', conf.login);
    await page.type('#password', conf.password);
    await page.click('.grid--cell.s-btn.s-btn__primary.js-accept-cookies.js-consent-banner-hide')
        .catch(e => console.log("Could not find 'Accept Cookies' button."));
    await page.waitFor(2000);

    try {
        await Promise.all([
            page.click('#submit-button'),
            page.waitForNavigation({waitUntil: 'networkidle0'})
        ]).then(() => {
            console.log(' -> success!');
        });
    } catch (error) {
        console.error(error);
        notify(`Login error. Could not login to StackOverflow.`);
        await browser.close();
        return;
    }


    console.log('Loading profile page');
    await page.goto(PROFILE_PAGE).then(() => {
        console.log(' -> success!');
    });

    try {
        console.log('Grabbing stats');
        await page.waitForSelector(statsSelector = '#top-cards span.fs-caption', {timeout: 5000})
            .then(() => {
                console.log(' -> success!');
            });

        const stats = await page.evaluate(
            statsSelector => document.querySelector(statsSelector).textContent,
            statsSelector
        );

        console.log(`Sending stats: ${stats}`);
        notify(`Logged in for ${stats} consecutive days`)

    } catch (e) {
        console.log(' -> failed. Could not fetch the stats. Please check days left manually.');
        notify(`Login succeeded. Could not fetch stats for consecutive days.`)
    }


    console.log('Closing browser');
    await browser.close();
}

function job() {
    try {
        crawl();
    } catch (error) {
        console.error(error);
        notify(`Something went wrong: ${error.toString()}`);
    }
}

setInterval(job, 1000 * 60 * 60 * 22);
job();
