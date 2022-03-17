const rw = require('../rwFunctions.js');

module.exports = {
  name: 'random',
  description: 'Get a random quirk prompt from my records',
  aliases: ['r', 'get'],
  execute(event) {
    // Read into the quirk prompt list
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');

    // Double check for whether or not an empty line exists, and removes it if so
    if(allQuirkPrompts[allQuirkPrompts.length - 1] === '') allQuirkPrompts.pop();

    // Find a random quirk prompt
    const foundQuirkPrompt = allQuirkPrompts[Math.floor(Math.random() * allQuirkPrompts.length)];

    // Read in the correct prompt
    const quirkPromptText = rw.ReadQuirkPrompt('Quirk_Prompts/' + foundQuirkPrompt.name);

    // Returns name of, and text from, quirk prompt
    event.channel.send(
      'I found you a random quirk prompt from my records.' + '\n' +
      '**Name:** ' + '\n' +
      foundQuirkPrompt.name + '\n' +
      '**Type:** ' + '\n' +
      quirkPromptText[0] + '\n' +
      '**Description:** ' + '\n' +
      quirkPromptText[1]
    );
  },
};
