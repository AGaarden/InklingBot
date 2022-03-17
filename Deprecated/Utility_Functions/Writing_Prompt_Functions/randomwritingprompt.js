const rw = require('../rwFunctions.js');

module.exports = {
  name: 'random',
  description: 'Get a random writing prompt from my records',
  aliases: ['r', 'get'],
  execute(event) {
    // Read into the writing prompt name list
    const allWritingPrompts = rw.ReadCSV('writingprompts.txt');

    // Double check for whether or not an empty line exists, and removes it if so
    if(allWritingPrompts[allWritingPrompts.length - 1] === '') allWritingPrompts.pop();

    // Find a random writing prompt name
    const foundWritingPrompt = allWritingPrompts[Math.floor(Math.random() * allWritingPrompts.length)];

    // Read in the correct prompt
    const writingPromptText = rw.ReadPrompt('Writing_Prompts/' + foundWritingPrompt.name);

    // Returns name of and text from writing prompt
    event.channel.send(
    'I found you a random writing prompt from my records.' + '\n' +
    '**Name:** ' + '\n' +
    foundWritingPrompt.name + '\n' +
    '**Description:** ' + '\n' +
    writingPromptText
    );
  },
};
