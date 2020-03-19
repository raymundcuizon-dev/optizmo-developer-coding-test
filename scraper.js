const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = lowdb(new FileSync('emails.json'))
db.defaults({ emails: [] }).write()

const url = 'https://www.randomlists.com/email-addresses?qty=10000';

puppeteer
  .launch()
  .then(browser => browser.newPage())
  .then(page => {
    return page.goto(url).then(function() {
      return page.content();
    });
  })
  .then(html => {
    const $ = cheerio.load(html);
    $('main > article > .Rand-stage > .rand_large > li > div').each(function() {
      db.get('emails')
      .push($(this).text())
      .write()
    });
    console.log("done")
    process.exit(1);
  })
  .catch(console.error);
