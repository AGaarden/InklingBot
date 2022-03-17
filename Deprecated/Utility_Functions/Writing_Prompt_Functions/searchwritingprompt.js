const rw = require('../rwFunctions.js');

module.exports = {
  name: 'search',
  description: 'Search for a specific writing prompt in my records',
  aliases: ['s'],
  usage: '<writing prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a writing prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read into the list of writing prompts, put them in a list without ID
    const allWritingPrompts = rw.ReadCSV('writingprompts');
    const writingPromptsToSearch = [];

    for(let i = 0; i < allWritingPrompts.length; i++) {
      writingPromptsToSearch.push(allWritingPrompts[i].name);
    }

    // Search through the array for closest match
    const fuzzysort = require('fuzzysort');
    const results = fuzzysort.go(userInput, writingPromptsToSearch);

    // In case nothing is found, error
    if(typeof results[0] === 'undefined') return event.channel.send('No results with that name, please try again.');

    const writingPromptToSend = rw.ReadPrompt('Writing_Prompts/' + results[0].target);

    event.channel.send(
    'This is the closest writing prompt I could find:' + '\n' +
    '**Name:** ' + '\n' +
    results[0].target + '\n' +
    '**Description:** ' + '\n' +
    writingPromptToSend
    );
  },
};
