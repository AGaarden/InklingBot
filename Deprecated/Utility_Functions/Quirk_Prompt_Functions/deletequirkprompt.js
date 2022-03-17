const rw = require('../rwFunctions.js');
const sec = require('../securityFunctions.js');

module.exports = {
  name: 'delete',
  description: 'Removes one of your quirk prompts from my records',
  aliases: ['d', 'remove'],
  usage: '<quirk prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a quirk prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read in the list of writing prompts
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');

    // Remove the writing prompt when it is found
    let quirkPromptRemoved = false;
    for(let i = 0; i < allQuirkPrompts.length; i++) {
      if(allQuirkPrompts[i].name == userInput) {
        if(event.member.id == allQuirkPrompts[i].author || sec.CheckAuthorizedAccess(event, 3)) {
          allQuirkPrompts.splice(i, 1);
          quirkPromptRemoved = true;
          break;
        }
        else{
          event.channel.send('You are not allowed to remove this prompt.');
          return;
        }
      }
    }

    // Make a return depending on what happened
    if(!quirkPromptRemoved) {
      event.channel.send('I did not find a writing prompt of that name.');
      return;
    }
    else if(quirkPromptRemoved) {
      const writeStatus = rw.WriteArrayToCSV('quirkprompts', allQuirkPrompts);

      if(writeStatus) {
        const fs = require('fs');
        fs.rmSync('Quirk_Prompts/' + userInput + '.txt');
        event.channel.send('I have successfully removed the quirk prompt.');
        return;
      }
      else if(!writeStatus) {
        event.channel.send('I could not remove the quirk prompt. Please ask <@174616332430475264> to do so manually.');
        return;
      }
    }
  },
};
