const rw = require('./rwFunctions.js');
const fs = require('fs');
const { DMWAITTIME, INSERVERWAITTIME } = require('../config.json');

module.exports = {
  InitializeWordLists,
  InitializeUserTimestamps,
  CheckForHighlights,
  IdForWords,
  CheckForPerms,
  CheckTimePassed,
  SendMessages
};

// This function builds a map of words per server
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

function InitializeUserTimestamps() {
  const output = new Map();

  const serverIds = fs.readdirSync('./Highlights');

  serverIds.forEach(async server => {
    const userList = new Map();

    // Set a kvp in output by server id and userlist map with timestamps
    output.set(server, userList);
  });

  return output;
}

// This checks whether a server has someone with a given word highlighted
// This returns an array of words that should be highlighted
function CheckForHighlights(message, listBuffer) {
  // Sanitise input for only letters + whitespace and split into separate array
  const messageSent = message.content.replace(/[^a-z\s]/gi, '').replace(/[\n\r]/, ' ');
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

function CheckTimePassed(message, allUsersToSnitch, userTimestamps) {
  for(const userId of allUsersToSnitch.keys()) {
    // If they've been in the server before time is up
    if(userTimestamps.get(message.guild.id).get(userId) < INSERVERWAITTIME) {
      allUsersToSnitch.delete(userId);
    }
    else { // If they've been off server for longer
      userTimestamps.get(message.guild.id).set(userId, Date.now());
    }
  }

  return 1;

  // for(const userId of allUsersToSnitch.keys()) {
  //   let timeSinceLastDm = 0;
  //   try { // Write difference between now and the last time a dm was sent between Inkling and user
  //     await client.users.fetch(userId).dmChannel.fetch().then(ch => {
  //       timeSinceLastDm = Date.now() - ch.lastMessage.createdAt.getTime();
  //     });
  //     // timeSinceLastDm = Date.now() - user.dmChannel.lastMessage.createdAt.getTime();
  //   }
  //   catch(error) { // If the dm can't be read, assume 5 minutes
  //     console.log(error);
  //     timeSinceLastDm = DMWAITTIME;
  //   }
  //
  //   console.log(timeSinceLastDm);
  //
  //   if(timeSinceLastDm < DMWAITTIME || userTimestamps.get(message.guild.id).get(userId) < INSERVERWAITTIME) {
  //     allUsersToSnitch.delete(userId);
  //   }
  // }
}

function SendMessages(client, usersToSnitch) {
  for(const userId of usersToSnitch.keys()) {
    client.users.fetch(userId).then(user => {
      user.createDM().then(ch => {
        ch.send('Test');
      });
    });
  }
}
