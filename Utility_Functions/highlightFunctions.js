const rw = require('./rwFunctions.js');
const fs = require('fs');

module.exports = {
  InitializeWordLists,
  CheckForHighlights,
  IdForWords,
};

function InitializeWordLists() {
  const output = new Map();

  const serverIds = fs.readdirSync('./Highlights');

  serverIds.forEach(server => {
    const serverWords = fs.readdirSync(`./Highlights/${server}`);
    for(let i = 0; i < serverWords.length; i++) {
      serverWords[i] = serverWords[i].slice(0, -4);
    }

    output.set(server, serverWords);
  });

  return output;
}

// This checks whether a server has someone with a given word highlighted
// This returns an array of words that should be highlighted
function CheckForHighlights(message, listBuffer) {
  // Sanitise input for only letters + whitespace and split into separate array
  const messageSent = message.content.replace(/[^a-z\s]/gi, '');
  const wordArray = messageSent.toLowerCase().split(/ +/);

  // Make array of words from all file names in server folder
  const savedWordList = listBuffer.get(message.guild.id);

  // For loop checking wordArray against wordFiles
  const foundWords = [];
  for(let i = 0; i < wordArray.length; i++) {
    for(let j = 0; j < savedWordList.length; j++) {
      // If it is a txt file, make the word not a txt file
      console.log(wordArray[i]);
      console.log(savedWordList[j]);

      console.log(savedWordList[j]);

      // If a word from message fits a word from file, do thing
      if(wordArray[i] == savedWordList[j]) {
        foundWords.push(savedWordList[j]); // Push the found word to output list
        savedWordList.splice(j, 1); // Remove the possible word to find from the list
        break; // Break out of loop so it does not check through the whole list for the same word
      }
    }
  }

  return foundWords;
}

function IdForWords(message, highlightedWords) {
  const output = []; // This is an array that will house objects

  console.log(highlightedWords);

  highlightedWords.forEach(word => {
    const idObject = {}; // This is an object
    idObject['word'] = word;

    idObject['ids'] = rw.ReadList(`./Highlights/${message.guild.id}/${word}`);

    output.push(idObject);
  });

  return output;
}
