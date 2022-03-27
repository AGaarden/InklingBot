const rw = require('../rwFunctions.js');
const fs = require('fs');

module.exports = {
  name: 'remove',
  description: 'Remove a highlight from the user',
  aliases: ['r', 'delete'],
  usage: '<word to remove>',
  args: true,
  // security: ,
  execute(message, commandArgs, wordList) {
    // Join all arguments in a string by spaces, replace potential newlines
    const highlight = commandArgs.join(' ').replace(/\r\n|\r|\n/g, ' ');
    const highlightFilePath = `././Highlights/${message.guild.id}/${highlight}.txt`;

    // Only do something if the file exists
    if(fs.existsSync(highlightFilePath)) {
      const highlightUserList = rw.ReadList(highlightFilePath);

      // If the user has it highlighted, remove from the list
      if(highlightUserList.includes(message.author.id)) {
        highlightUserList.splice(highlightUserList.indexOf(message.author.id, 0), 1);
      }
      else {
        return message.channel.send('You do not have this word highlighted.');
      }

      // If the file would be empty, delete it and remove the word from the word list
      if(highlightUserList.length === 0) {
        const wordListArray = wordList.get(message.guild.id);
        wordListArray.splice(wordListArray.indexOf(message.author.id, 0), 1);

        fs.rmSync(highlightFilePath);

        return message.channel.send(`I have removed ${highlight} from your highlighted words.`);
      }
      else { // If the file would not be empty
        // Make the file that would overwrite the file
        let newHighlightFile = '';
        highlightUserList.forEach(highlightUser => {
          newHighlightFile += highlightUser + '\n';
        });

        // Overwrite the file and remove the word from the word list
        rw.OverWriteFile(highlightFilePath, newHighlightFile);

        return message.channel.send(`I have removed ${highlight} from your highlighted words.`);
      }
    }
    else {
      message.channel.send('You do not have this word highlighted.');
    }
  },
};
