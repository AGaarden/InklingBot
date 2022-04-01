const rw = require('../rwFunctions.js');

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

    if(highlight.match(/[\\/:*?"<>|]/g)) {
      message.channel.send('Please change your highlight. I cannot handle these characters: \\ / : * ? " < > |');
      return;
    }

    // Add the user that highlighted the word to the given file
    rw.WriteLineToList(`./Highlights/${message.guild.id}/${highlight.toLowerCase()}`, message.author.id);

    // Add to the wordlist in lower case
    wordList.get(message.guild.id).push(highlight.toLowerCase());

    message.channel.send(`I have added ${highlight} to your highlighted words.`);
  },
};
