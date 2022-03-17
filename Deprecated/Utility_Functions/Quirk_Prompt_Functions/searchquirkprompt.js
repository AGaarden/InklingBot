const rw = require('../rwFunctions.js');

module.exports = {
  name: 'search',
  description: 'Search for a specific quirk prompt in my records',
  aliases: ['s'],
  usage: '<quirk prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a quirk prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read into the list of writing prompts, put them in a list without ID
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');
    const quirkPromptsToSearch = [];

    for(let i = 0; i < allQuirkPrompts.length; i++) {
      quirkPromptsToSearch.push(allQuirkPrompts[i].name);
    }

    // Search through the array for closest match
    const fuzzysort = require('fuzzysort');
    const results = fuzzysort.go(userInput, quirkPromptsToSearch);

    // In case nothing is found, error
    if(typeof results[0] === 'undefined') return event.channel.send('No results with that name, please try again.');

    const quirkPromptToSend = rw.ReadQuirkPrompt('Quirk_Prompts/' + results[0].target);

    event.channel.send(
    'This is the closest quirk prompt I could find:' + '\n' +
    '**Name:** ' + '\n' +
    results[0].target + '\n' +
    '**Type:** ' + '\n' +
    quirkPromptToSend[0] + '\n' +
    '**Description:** ' + '\n' +
    quirkPromptToSend[1]
    );
  },

};
