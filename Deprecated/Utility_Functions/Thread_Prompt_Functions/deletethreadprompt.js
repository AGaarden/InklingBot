const rw = require('../rwFunctions.js');
const sec = require('../securityFunctions.js');

module.exports = {
  name: 'delete',
  description: 'Removes one of your thread prompts from my records',
  aliases: ['d', 'remove'],
  usage: '<thread prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a thread prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read in the list of thread prompts
    const allThreadPrompts = rw.ReadCSV('threadprompts');

    // Remove the thread prompt when it is found, if the person is either author or staff
    let threadPromptRemoved = false;
    for(let i = 0; i < allThreadPrompts.length; i++) {
      if(allThreadPrompts[i].name == userInput) {
        if(event.member.id == allThreadPrompts[i].author) {
          allThreadPrompts.splice(i, 1);
          threadPromptRemoved = true;
          break;
        }
        else if(sec.CheckAuthorizedAccess(event, 3)) {
          allThreadPrompts.splice(i, 1);
          threadPromptRemoved = true;
          break;
        }
        else{
          event.channel.send('You are not allowed to remove this prompt.');
          return;
        }
      }
    }

    // Make a return depending on what happened
    if(!threadPromptRemoved) {
      event.channel.send('I did not find a thread prompt of that name.');
      return;
    }
    else if(threadPromptRemoved) {
      const writeStatus = rw.WriteArrayToCSV('threadprompts', allThreadPrompts);

      if(writeStatus) {
        const fs = require('fs');
        fs.rmSync('Thread_Prompts/' + userInput + '.txt');
        event.channel.send('I have successfully removed the thread prompt.');
        return;
      }
      else if(!writeStatus) {
        event.channel.send('I could not remove the thread prompt. Please tell <@174616332430475264> to do so manually.');
        return;
      }
    }
  },
};
