const rw = require('../rwFunctions.js');
const sec = require('../securityFunctions.js');

module.exports = {
  name: 'edit',
  description: 'Edit the description of one of your thread prompts',
  aliases: ['e'],
  usage: '<thread prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If the user has used quotation marks, handle those
    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read in the list of thread prompts
    const allThreadPrompts = rw.ReadCSV('threadprompts');

    let foundThreadPrompt = '';
    // Find the thread prompt in question
    for(let i = 0; i < allThreadPrompts.length; i++) {
      if(allThreadPrompts[i].name == userInput) {
        if(event.member.id == allThreadPrompts[i].author || sec.CheckAuthorizedAccess(event, 3)) {
          foundThreadPrompt = allThreadPrompts[i].name;
        }
        else {
          return event.channel.send('You are not allowed to edit this prompt.');
        }
      }
    }

    // If foundThreadPrompt was never defined, return nil
    if(!foundThreadPrompt) {
      return event.channel.send('I do not have a thread prompt with that name in my records.');
    }

    // This filter method takes an event, and returns true if the new event's author's id is the same as the original author
    const filter = e => e.author.id === event.author.id;

    event.channel.send('Please write what you want the thread prompt to be edited to. Type "cancel" to cancel the edit.').then(() => {
      event.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then(collected => {
        if(collected.first().content === 'cancel') return event.channel.send('Edit cancelled.');
        const filePath = './Thread_Prompts/' + foundThreadPrompt;
        const threadPromptEditedText = collected.first().content.replace(/\r\n|\r|\n/g, '$');
        rw.OverWriteFile(filePath, threadPromptEditedText);
        return event.channel.send('I have successfully edited the thread prompt.');
      })
      .catch(() => {
        event.channel.send('I did not receive an edit in time.');
      });
    });
  },
};
