const rw = require('./rwFunctions.js');
const fs = require('fs');

module.exports = {
  CheckForHighlights,
};

// This checks whether a server has someone with a given word highlighted
// This returns an array of words that should be highlighted
function CheckForHighlights(event) {
  // Sanitise sentence into single words
  // Go to folder of server, make array of words from file names
  // For each word in sentence array, check against file names
  // Return array of found comparisons

  // Sanitise input for only letters + whitespace and split into separate array
  const messageSent = event.content.replace(/[^a-z\s]/gi, '');
  const wordArray = messageSent.toLowerCase().split(/ +/);

  // Make array of words from all file names in server folder
  const wordFiles = fs.readdirSync(`../Highlights/${event.guildId}`);

  // For loop checking wordArray against wordFiles
  const foundWords = null;
  for(let i = 0; i < wordArray.length; i++) {
    for(let j = 0; j < wordFiles.length; j++) {
      if(wordArray[i] == wordFiles[j]) foundWords.push(wordArray);
    }
  }

  return foundWords;
}
