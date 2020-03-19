const _ = require('lodash');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const emailStorage = lowdb(new FileSync('emails.json'))
const readline = require("readline");

const collectionOfEmail = emailStorage.get('emails').value();

let timer = 0;
let tempEmail = [];
let outputtingFlg = true;

const addEmail = (email) => {
  email = email.trim();
  if(email === 'quit') {
    console.log('Cya!');
    process.exit(1)
  } else if (email === 'stop') {
    console.log('stopped');
    outputtingFlg = false;

  } else if(email === 'start') {
    console.log('started');
    outputtingFlg = true;
  } else {
    if(_.includes(collectionOfEmail, email)) {
      tempEmail.push({ email, status: true});
      console.log('\nfound it!');
    } else {
      tempEmail.push({ email, status: false });
    }
  }
};

function showEmails() {
  let emailToStr = '';
  const sorted = _.orderBy(tempEmail, ['status', 'email'],['desc', 'asc']);
  _.map(sorted, (value, index, array) => {
    let comma = (array.length === (index + 1))? '' : ',';
    emailToStr += `${value.email}:${value.status}${comma}`;
  })
  if(outputtingFlg){
    console.log(`\n${emailToStr}`);
  }
  setTimeout(showEmails, timer*1000);
}

const questions = [
  `Welcome to my optizmo coding test. Please enter in seconds how often you would
  like to receive output alerts: `,
  "Please enter an email address to get started: ",
  "Please enter the next email address: ",
];

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

let flg = 1;
let activeQuestion = '';
function rl_promise(q) {
    return new Promise(resolve => {
        rl.question(activeQuestion, (answer) => {
            resolve(answer)
        })
    })
}

async function init() {
    while (true) {
      if (flg === 1 ){
        activeQuestion = questions[0];
        let answer = await rl_promise(activeQuestion);
        answer = (typeof answer == 'number')? answer : 10;
        timer = answer;
        flg = 2;
      } else if (flg === 2) {
        activeQuestion = questions[1];
        let answer = await rl_promise(activeQuestion);
        setTimeout(showEmails, timer*1000);
        addEmail(answer);
        flg = 3;
      } else {
        activeQuestion = questions[2];
        let answer = await rl_promise(activeQuestion);
        addEmail(answer);
      }
    }
    rl.close();
}

init()