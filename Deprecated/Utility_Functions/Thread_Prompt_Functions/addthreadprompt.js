const rw = require('../rwFunctions.js');

module.exports = {
  name: 'add',
  description: 'Add a thread prompt to my records',
  aliases: ['a'],
  usage: '"<thread title in quotation marks>" <thread description>',
  args: true,
  security: 2,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces, remove eventual newlines
    const allArgs = commandArgs.join(' ').replace(/\r\n|\r|\n/g, '$');

    // Define some variables to make the compiler happy
    let fileName = '';
    let textToAdd = '';

    // If the first character is a quotation mark, check for the next and make that file name. Then splits the rest of the text
    if(allArgs.indexOf('"') === 0) {
      fileName = allArgs.substring(1, allArgs.indexOf('"', 1));
      textToAdd = allArgs.substring(allArgs.indexOf('"', 1) + 2);
    }
    else{
      event.channel.send('Please put the title of your thread prompt in quotation marks.');
      return;
    }

    if(textToAdd.charAt(0) == '$') textToAdd = textToAdd.slice(1);

    // Check if the name would crash Saiko
    if(
    fileName.includes('\\') || fileName.includes('/') ||
    fileName.includes(':') || fileName.includes('*') ||
    fileName.includes('?') || fileName.includes('"') ||
    fileName.includes('<') || fileName.includes('>') ||
    fileName.includes('|')) {
      event.channel.send('Please change your title name. I cannot handle these characters:\\ / : * ? " < > |');
      return;
    }

    // Duplicate check
    const allThreadPrompts = rw.ReadCSV('threadprompts');
    let duplicate = false;
    allThreadPrompts.forEach((prompt) => {
      if(prompt.name == fileName) {
        duplicate = true;
      }
    });
    if(duplicate == true) {
      event.channel.send('A thread prompt with this name already exists. Please pick another name.');
      return;
    }

    // Add the file name to the list of available thread prompts, along with the user ID
    rw.WriteLineToList('threadprompts', fileName + ',' + event.member.id);

    // Add the text to a file of its own
    rw.WriteLineToList('Thread_Prompts/' + fileName, textToAdd);

    event.channel.send('Your thread prompt has been successfully added to my records.');
  },
};
