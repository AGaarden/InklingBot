const sec = require('../../Utility_Functions/securityFunctions.js');
const { prefix } = require('../../config.json');

module.exports = {
  name: 'threadprompt',
  description: 'This command lets you use functions related to thread prompts.',
  aliases: ['tp'],
  usage: '<command modifier> <additional info for command modifier>' + '\n' + 'Command modifiers: add|a, list|l, search|s, delete|d, edit|e, random|r',
  args: 'true',
  execute(event, commandArgs) {
    // commandArgs are gained from the command call
    const commandName = commandArgs[0].toLowerCase();
    commandArgs = commandArgs.splice(1);

    // Find the right command in the collection, either by name or by alias
    const command = event.client.tpCommands.get(commandName) || event.client.tpCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // If no correct command is found, tell the user as such
    if(!command) return event.channel.send(`Unknown command. Try ${prefix}help threadprompt for a list of modifiers.`);

    // If the command requires a specific security level, check that the user has that
    if(command.security) {
      if(!sec.CheckAuthorizedAccess(event, command.security)) return event.channel.send('You are not allowed to use this command.');
    }

    if (command.args && !commandArgs.length) {
      let reply = 'I require arguments for this command.';

      if(command.usage) {
        let aliases = '';
        if(command.aliases) {
          command.aliases.forEach(alias => {
            aliases += '|' + alias;
          });
        }
        reply += '\n' + `The command syntax is: ${prefix}tp ${command.name}${aliases} ${command.usage}`;
      }

      return event.channel.send(reply);
    }

    command.execute(event, commandArgs);
  },
};
