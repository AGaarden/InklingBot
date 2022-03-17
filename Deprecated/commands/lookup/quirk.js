module.exports = {
  name: 'quirk',
  description: 'Lets the user search for a quirk',
  usage: '<quirk name>',
  args: true,
  execute(event, commandArgs) {

  // Attach multiple arguments together, in case of a quirk name with multiple words (ex: zero gravity)
  const userInput = commandArgs.join(' ');

  // Read in the list of quirks as made from UpdateQuirks
  const rw = require('../../Utility_Functions/rwFunctions.js');
  const quirkList = rw.ReadList('fullQuirkList');

  // Actual search function
  const fuzzysort = require('fuzzysort');
  const results = fuzzysort.go(userInput, quirkList);

  // In case nothing was found, error
  if (typeof results[0] === 'undefined') {
      return 'No results with that name, please try again.';
  }

  event.channel.send(results[0].target);
  },

};
