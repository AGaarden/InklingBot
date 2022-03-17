const fs = require('fs');

module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	security: 4,
	execute(event, commandArgs) {
		const commandName = commandArgs[0].toLowerCase();
		const command = event.client.commands.get(commandName)
			|| event.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) {
			return event.channel.send(`There is no command with name or alias \`${commandName}\`.`);
		}

		const commandFolders = fs.readdirSync('./commands');
		const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${commandName}.js`));

		delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

		try {
			const newCommand = require(`../${folderName}/${command.name}.js`);
			event.client.commands.set(newCommand.name, newCommand);
			event.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
		}
    catch (error) {
			console.error(error);
			event.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};
