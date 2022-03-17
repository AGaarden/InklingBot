const rw = require('../rwFunctions.js');
const sec = require('../securityFunctions.js');

module.exports = {
  name: 'edit',
  description: 'Edit the description of one of your writing prompts',
  aliases: ['e'],
  usage: '<writing prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If the user has used quotation marks, handle those
    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read in the list of writing prompts
    const allWritingPrompts = rw.ReadCSV('writingprompts');

    let foundWritingPrompt = '';
    // Find the writing prompt in question
    for(let i = 0; i < allWritingPrompts.length; i++) {
      if(allWritingPrompts[i].name == userInput) {
        if(event.member.id == allWritingPrompts[i].author || sec.CheckAuthorizedAccess(event, 3)) {
          foundWritingPrompt = allWritingPrompts[i].name;
        }
        else {
          return event.channel.send('You are not allowed to edit this prompt.');
        }
      }
    }

    // If foundWritingPrompt was never defined, return nil
    if(!foundWritingPrompt) {
      return event.channel.send('I do not have a writing prompt with that name in my records.');
    }

    // This filter method takes an event, and returns true if the new event's author's id is the same as the original author
    const filter = e => e.author.id === event.author.id;

    event.channel.send('Please write what you want the writing prompt to be edited to. Type "cancel" to cancel the edit.').then(() => {
      event.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then(collected => {
        if(collected.first().content === 'cancel') return event.channel.send('Edit cancelled.');
        const filePath = './Writing_Prompts/' + foundWritingPrompt;
        const writingPromptEditedText = collected.first().content.replace(/\r\n|\r|\n/g, '$');
        rw.OverWriteFile(filePath, writingPromptEditedText);
        return event.channel.send('I have successfully edited the writing prompt.');
      })
      .catch(() => {
        event.channel.send('I did not receive an edit in time.');
      });
    });
  },
};
