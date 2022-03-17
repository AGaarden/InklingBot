const rw = require('../rwFunctions.js');

module.exports = {
  name: 'search',
  description: 'Search for a specific thread prompt in my records',
  aliases: ['s'],
  usage: '<thread prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a thread prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read into the list of thread prompts, put them in a list without ID
    const allThreadPrompts = rw.ReadCSV('threadprompts');
    const threadPromptsToSearch = [];

    for(let i = 0; i < allThreadPrompts.length; i++) {
      threadPromptsToSearch.push(allThreadPrompts[i].name);
    }

    // Search through the array for closest match
    const fuzzysort = require('fuzzysort');
    const results = fuzzysort.go(userInput, threadPromptsToSearch);

    // In case nothing is found, error
    if(typeof results[0] === 'undefined') return event.channel.send('No results with that name, please try again.');

    const threadPromptToSend = rw.ReadPrompt('Thread_Prompts/' + results[0].target);

    event.channel.send(
    'This is the closest thread prompt I could find:' + '\n' +
    '**Name:** ' + '\n' +
    results[0].target + '\n' +
    '**Description:** ' + '\n' +
    threadPromptToSend
    );
  },
};
