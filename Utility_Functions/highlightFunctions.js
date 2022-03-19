const rw = require('./rwFunctions.js');
const fs = require('fs');

module.exports = {
  CheckForHighlights,
  IdForWords,
};

// This checks whether a server has someone with a given word highlighted
// This returns an array of words that should be highlighted
function CheckForHighlights(event) {
  // Sanitise input for only letters + whitespace and split into separate array
  const messageSent = event.content.replace(/[^a-z\s]/gi, '');
  const wordArray = messageSent.toLowerCase().split(/ +/);

  // Make array of words from all file names in server folder
  const wordFiles = fs.readdirSync(`./Highlights/${event.guild.id}`);

  // For loop checking wordArray against wordFiles
  const foundWords = [];
  for(let i = 0; i < wordArray.length; i++) {
    for(let j = 0; j < wordFiles.length; j++) {
      // If it is a txt file, make the word not a txt file
      let wordFromFile = wordFiles[j];
      if(wordFromFile.slice(-4)) wordFromFile = wordFiles[j].slice(-4);

      // If a word from message fits a word from file, do thing
      if(wordArray[i] == wordFiles[j]) foundWords.push(wordArray[i]);
    }
  }

  return foundWords;
}

function IdForWords(message, highlightedWords) {
  const output = []; // This is an array that will house objects

  highlightedWords.forEach(word => {
    const idObject = {}; // This is an object
    idObject['word'] = word;

    idObject['ids'] = rw.ReadList(`./Highlights/${message.guild.id}/${word}`);

    output.push(idObject);
  });

  return output;
}
