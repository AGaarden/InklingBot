const rw = require('../rwFunctions.js');

module.exports = {
  name: 'add',
  description: 'Add a quirk prompt to my records',
  aliases: ['a'],
  usage: '"<quirk name in quotation marks>" <quirk type, quotation marks optional> <quirk description>',
  args: true,
  security: 2,
  execute(event, commandArgs) {
    // Join all arguments in a string by spaces, replace eventual newlines with newline indicators
    const allArgs = commandArgs.join(' ').replace(/\r\n|\r|\n/g, '$');

    // Define some variables to make the compiler happy
    let fileName = '';
    let textWithType = '';

    // If the first character is a quotation mark, check for the next and make that the quirk name
    if(allArgs.indexOf('"') === 0) {
      fileName = allArgs.substring(1, allArgs.indexOf('"', 1));
      textWithType = allArgs.substring(allArgs.indexOf('"', 1) + 2);
    }
    else{
      event.channel.send('Please put the name of your quirk in quotation marks.');
      return;
    }

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
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');
    let duplicate = false;
    allQuirkPrompts.forEach((prompt) => {
      if(prompt.name == fileName) {
        duplicate = true;
      }
    });
    if(duplicate) {
      event.channel.send('A quirk prompt with this name already exists. Please pick another name.');
      return;
    }

    // Define more variables to make the compiler happy
    let quirkType = '';
    let quirkDescription = '';

    // If the first character is a quotation mark, check for the next and make that the quirk type
    if(textWithType.indexOf('"') === 0) {
      quirkType = textWithType.substring(1, textWithType.indexOf('"', 1));
      quirkDescription = textWithType.substring(textWithType.indexOf('"', 1) + 2);
    }
    else {
      quirkType = textWithType.substring(0, textWithType.indexOf(' ')).replace(/\$/g, '');
      quirkDescription = textWithType.substring(textWithType.indexOf(' ') + 1);
    }

    if(quirkDescription.charAt(0) == '$') quirkDescription = quirkDescription.slice(1);

    // Add the file name to the list of available quirk prompts, along with the user ID
    rw.WriteLineToList('quirkprompts', fileName + ',' + event.member.id);

    // Add the text to a file of its own
    rw.WriteLineToList('Quirk_Prompts/' + fileName, quirkType + '\n' + quirkDescription);

    event.channel.send('Your quirk has been successfully added to my records.');
  },
};
