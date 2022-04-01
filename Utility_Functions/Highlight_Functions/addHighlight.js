const rw = require('../rwFunctions.js');
const fs = require('fs');

module.exports = {
  name: 'add',
  description: 'Add a highlight to the user',
  aliases: ['a'],
  usage: '<word to highlight>',
  args: true,
  // security: ,
  execute(message, commandArgs, wordList) {
    // Join all arguments in a string by spaces, replace potential newlines
    const highlight = commandArgs.join(' ').replace(/\r\n|\r|\n/g, ' ');
    const highlightFilePath = `./Highlights/${message.guild.id}/${highlight.toLowerCase()}.txt`;

    // If the highlight has any of the characters in the regex, don't allow it
    if(highlight.match(/[\\/:*?"<>|]/g)) {
      message.channel.send('Please change your highlight. I cannot handle these characters: \\ / : * ? " < > |');
      return;
    }

    // Check whether the person already has this highlighted, return if so
    if(fs.existsSync(highlightFilePath)) {
      if(rw.ReadList(highlightFilePath).includes(message.author.id)) {
        message.channel.send('You already have this as a highlight.');
        return;
      }
    }

    // Add the user that highlighted the word to the given file
    rw.WriteLineToList(highlightFilePath, message.author.id);

    // Add to the wordlist in lower case
    wordList.get(message.guild.id).push(highlight.toLowerCase());

    message.channel.send(`I have added ${highlight} to your highlighted words.`);
  },
};
