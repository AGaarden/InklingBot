const rw = require('./rwFunctions.js');
const fs = require('fs');

module.exports = {
  InitializeWordLists,
  CheckForHighlights,
  IdForWords,
  CheckForPerms,
  CheckTimePassed,
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
    // If a word from message fits a word from file, do thing
    if(savedWordList.includes(wordArray[i])) {
      foundWords.push(wordArray[i]);
    }
  }

  console.log('Output from CheckForHighlights:');
  console.log(foundWords);
  return foundWords;
}

function IdForWords(message, highlightedWords) {
  const output = new Map();

  highlightedWords.forEach(word => {
    const ids = rw.ReadList(`./Highlights/${message.guild.id}/${word}`);

    for(let i = 0; i < ids.length; i++) {
      if(!output.has(ids[i])) {
        output.set(ids[i], word);
      }
    }
  });

  console.log('Output from IdForWords:');
  console.log(output);
  return output;
}

function CheckForPerms(message, allUsersToSnitch) {
  // Iterate through allUsers, check if they can see channel
  const output = new Map();

  for(const [key, value] of allUsersToSnitch) {
    if(message.channel.members.has(key)) {
      output.set(key, value);
    }
  }

  console.log('Output from CheckForPerms:');
  console.log(output);
  return output;
}

function CheckTimePassed(message, allUsersToSnitch) {

  for(const [key, value] of allUsersToSnitch) {

    console.log(message.guild)

    let timeSinceLastDm = 0;
    try { // Write difference between now and the last time a dm was sent between Inkling and user
      timeSinceLastDm = Date.now() - key.author.dmChannel.lastMessage.createdAt.getTime();
    }
    catch(error) { // If the dm can't be read, assume 5 minutes
      console.log(error);
      timeSinceLastDm = 300000;
    }
  }


  // message.author
}
