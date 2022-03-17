const rw = require('../rwFunctions.js');
const sec = require('../securityFunctions.js');

module.exports = {
  name: 'delete',
  description: 'Removes one of your writing prompts from my records',
  aliases: ['d', 'remove'],
  usage: '<writing prompt name>',
  args: true,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces
    let userInput = commandArgs.join(' ');

    // If no arguments were given, throw error
    if (userInput === '') return event.channel.send('This command requires a writing prompt name to find one.');

    if(userInput.indexOf('"') === 0) userInput = userInput.substring(1, userInput.indexOf('"', 1));

    // Read in the list of writing prompts
    const allWritingPrompts = rw.ReadCSV('writingprompts');

    // Remove the writing prompt when it is found, if the person is either author or staff
    let writingPromptRemoved = false;
    for(let i = 0; i < allWritingPrompts.length; i++) {
      if(allWritingPrompts[i].name == userInput) {
        if(event.member.id == allWritingPrompts[i].author) {
          allWritingPrompts.splice(i, 1);
          writingPromptRemoved = true;
          break;
        }
        else if(sec.CheckAuthorizedAccess(event, 3)) {
          allWritingPrompts.splice(i, 1);
          writingPromptRemoved = true;
          break;
        }
        else{
          event.channel.send('You are not allowed to remove this prompt.');
          return;
        }
      }
    }

    // Make a return depending on what happened
    if(writingPromptRemoved == false) {
      event.channel.send('I did not find a writing prompt of that name.');
      return;
    }
    else if(writingPromptRemoved) {
      const writeStatus = rw.WriteArrayToCSV('writingprompts', allWritingPrompts);

      if(writeStatus == true) {
        const fs = require('fs');
        fs.rmSync('Writing_Prompts/' + userInput + '.txt');
        event.channel.send('I have successfully removed the writing prompt.');
        return;
      }
      else if(writeStatus == false) {
        event.channel.send('I could not remove the writing prompt. Please tell <@174616332430475264> to do so manually.');
        return;
      }
    }
  },
};
