const { prefix } = require('../../config.json');

module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command',
  aliases: ['commands'],
  usage: '<command name>',
  execute(event, commandArgs) {
      const data = [];
      const { commands } = event.client;

      if(!commandArgs.length) {
        data.push('Here is a list of all of my commands: ');
        data.push(commands.map(command => command.name).join(', '));
        data.push(`\nYou can send "${prefix}help <command name>" to get info on a specific command.`);

        return event.channel.send(data);
      }

      const commandName = commandArgs[0].toLowerCase();
      const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));

      if(!command) return event.channel.send('I do not know that command.');

      data.push(`**Command name:** ${command.name}`);

      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
      if (command.description) data.push(`**Description:** ${command.description}`);
      if (command.security) data.push(`**Security level:** ${command.security}`);
      if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

      event.channel.send(data);
    },

  };
