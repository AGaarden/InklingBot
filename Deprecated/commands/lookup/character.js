module.exports = {
  name: 'character',
  description: 'Lets the user search for a character',
  aliases: ['char'],
  usage: '<character name>',
  args: true,
  execute(event, commandArgs) {

  // Attach multiple arguments together by spaces
  const userInput = commandArgs.join(' ');

  // Read in the list of characters as made from UpdateCharacters
  const rw = require('../../Utility_Functions/rwFunctions.js');
  const characterList = rw.ReadList('fullCharacterList');

  // Actual search function
  const fuzzysort = require('fuzzysort');
  const results = fuzzysort.go(userInput, characterList);

  // In case nothing was found, error
  if (typeof results[0] === 'undefined') {
      return 'No results with that name, please try again.';
  }

  event.channel.send(results[0].target);
  },

};
