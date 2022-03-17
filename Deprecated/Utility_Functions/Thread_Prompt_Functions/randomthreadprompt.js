const rw = require('../rwFunctions.js');

module.exports = {
  name: 'random',
  description: 'Get a random thread prompt from my records',
  aliases: ['r', 'get'],
  execute(event) {
    // Read into the thread prompt name list
    const allThreadPrompts = rw.ReadCSV('threadprompts.txt');

    // Double check for whether or not an empty line exists, and removes it if so
    if(allThreadPrompts[allThreadPrompts.length - 1] === '') {
      allThreadPrompts.pop();
    }

    // Find a random thread prompt name
    const foundThreadPrompt = allThreadPrompts[Math.floor(Math.random() * allThreadPrompts.length)];

    // Read in the correct prompt
    const threadPromptText = rw.ReadPrompt('Thread_Prompts/' + foundThreadPrompt.name);

    // Returns name of and text from thread prompt
    event.channel.send(
    'I found you a random thread prompt from my records.' + '\n' +
    '**Name:** ' + '\n' +
    foundThreadPrompt.name + '\n' +
    '**Description:** ' + '\n' +
    threadPromptText
    );
  },
};
