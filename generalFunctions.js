/* eslint-disable */
const sec = require('./securityFunctions.js')

module.exports = {
    functionSwitch,
};

function functionSwitch(event, command, commandArgs) {
  switch(command) {
    case 'ping':
      return 'Pong!';
      break;
    case 'get':
      return SavedQuotes(event, commandArgs);
      break;
    case 'version':
      return 'I am currently version 0.9.0.';
      break;
    case 'help':
      return Help(commandArgs);
      break;
    }
}

function SavedQuotes(event, commandArgs){
  var userInput = commandArgs.join(' ').toLowerCase();
  var text = 'Hm. I don\'t think I know that one. Try something else.';

  switch(userInput){
    case 'who are you?':
      text = 'I am Saiko Intelli! Or at least a bot version. I was created for roleplaying assistance in MHA servers by TheGaardenator#2000.'
      break;
    case 'bap':
      text = 'https://cdn.discordapp.com/attachments/553036539215478798/580064625190633493/lolcatsdotcomg0s6w2fptayxo42g.jpg';
      break;
    case 'ruinin it':
      text = 'https://www.youtube.com/watch?v=Q2BMLLSpTHM';
      break;
  }

  return text;
}

function Help(commandArgs){
  userInput = commandArgs.join(' ').toLowerCase();

  switch(userInput){
    case 'q':
    case 'quirk':
      return 'Syntax: <quirk|q> <quirk to look up>' + '\n' +
      'Search for a canon quirk.';
      break;
    case 'c':
    case 'char':
    case 'character':
      return 'Syntax: <character|char|c> <character to look up>' + '\n' +
      'Search for a character. Heroes/villains can be searched for both with name and hero name.';
      break;
    case 'qp':
    case 'quirkprompt':
      return
      'Syntax: <quirkprompt|qp> <command modifier> <additional info for command modifier>' + '\n' +
      '**Modifiers:**' + '\n' +
      'a|add: Add a quirk prompt to my database. Security level 2 or above only. Syntax for additional info: <quirk name, in quotation marks ("")> <quirk type> <description>' + '\n' +
      'l|list: List all quirk prompts in my database.' + '\n' +
      's|search: Search for a specific quirk prompt in my database.' + '\n' +
      'r|remove: Remove a quirk prompt from the database. Author of the quirk prompt or security level 3 only. Syntax for additional info: <quirk name in quotation marks ("")>'
      'g|get: Get a random quirk prompt from the database.'
      ;
      break;
    case 'wp':
    case 'writingprompt':
      return
      'Syntax: <writingprompt|wp> <command modifier> <additional info for command modifier>' + '\n' +
      '**Modifiers:**' + '\n' +
      'a|add: Add a writing prompt to my database. Security level 2 or above only. Syntax for additional info: <prompt name, in quotation marks ("")> <description>' + '\n' +
      'l|list: List all writing prompts in my database.' + '\n' +
      's|search: Search for a specific writing prompt in my database.' + '\n' +
      'r|remove: Remove a writing prompt from the database. Author of the writing prompt or security level 3 only. Syntax for additional info: <prompt name in quotation marks ("")>'
      'g|get: Get a random writing prompt from the database.'
      ;
      break;
    case 'tp':
    case 'threadprompt':
      return
      'Syntax: <threadprompt|tp> <command modifier> <additional info for command modifier>' + '\n' +
      '**Modifiers:**' + '\n' +
      'a: Add a thread prompt to my database. Security level 2 or above only. Syntax for additional info: <prompt name, in quotation marks ("")> <description>' + '\n' +
      'l: List all thread prompts in my database.' + '\n' +
      's: Search for a specific thread prompt in my database.' + '\n' +
      'r: Remove a thread prompt from the database. Author of the thread prompt or security level 3 only. Syntax for additional info: <prompt name in quotation marks ("")>'
      'g|get: Get a random thread prompt from the database.'
      ;
      break;
    case 'all':
    default:
      return 'I have the following commands:' + '\n' +
      'quirk/q: Search for a canon quirk' + '\n' +
      'character/char/c: Search for a canon character' + '\n' +
      'quirkprompt/qp: Find, add, and remove quirk prompts in various ways' + '\n' +
      'writingprompt/wp: Find, add, and remove writing prompts in various ways' + '\n' +
      'threadprompt/tp: Find, add, and remove thread prompts in various ways';
      break;
  }
}
