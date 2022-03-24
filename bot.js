// Bot main function

// Fetch necessary constants from config file
const { prefix, token } = require('./config.json');

// Initialize a client for the discord bot user
const Discord = require('discord.js');
const client = new Discord.Client();

// Initialize a collection for commands and utility methods
const fs = require('fs');
client.commands = new Discord.Collection();

// Initialize command folder array, and read in all commands methods from the folder
const commandFolders = fs.readdirSync('./commands');

// Add the utility functions needed in bot.js
const securityFunctions = require('./Utility_Functions/securityFunctions.js');

// Add the utility functions for highlight needed in bot.js
const highlightFunctions = require('./Utility_Functions/highlightFunctions.js');

// Nested for loops goes through every file in every folder and adds them to the collection
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

/*
// Initialize command folder array and collections for prompt commands
const qpCommandFiles = fs.readdirSync('./Utility_Functions/Quirk_Prompt_Functions').filter(file => file.endsWith('.js'));
client.qpCommands = new Discord.Collection();

// Nested for loops goes through every file in the prompt folders and adds them to their respective collections
for (const file of qpCommandFiles) {
	const command = require(`./Utility_Functions/Quirk_Prompt_Functions/${file}`);
	client.qpCommands.set(command.name, command);
}
*/

// Initialize map with saved word lists
const wordList = highlightFunctions.InitializeWordLists();
console.log(wordList);

// Initialize map of users last message times
const userTimestamps = highlightFunctions.InitializeUserTimestamps(client);
console.log(userTimestamps);

// Variable holding error channel ID
const errChannelID = '827207044817879091';

// Log into discord
client.login(token);

// Show that the login was successful
client.on('ready', () => {
	console.log('Connected as ' + client.user.tag);
	client.user.setPresence({
		status: 'online',
		activity: {
			name: 'My Hero One\'s Justice 2',
			type: 'PLAYING',
		},
	});
});

client.on('message', message => {
	// Ignore messages sent by a bot or in a dm
	if(message.author.bot || message.channel.type == 'dm') return;

	// If the bot is on a server it is not authorized to be in, do this
	if(!securityFunctions.CheckAuthorizedServer(message)) return message.channel.send('I do not remember wanting to be here. Leave me.');





	// Note a new timestamp
	userTimestamps.get(server).set(message.author, /* message timestamp */);/*Not finished*/





	// If the message has the command prefix, go through command function
	if (message.content.startsWith(prefix)) {
		OnCommandMsg(message);
		return;
	}

	// Get array of highlighted words on server
	// This can have length 0, aka no words
	const highlightedWords = highlightFunctions.CheckForHighlights(message, wordList);

	// If there is a list, go to OnHighlightMsg
	if(highlightedWords.length !== 0) {
		console.log('ready to highlight');
		OnHighlightMsg(message, highlightedWords);
		return;
	}
});

// This function is used for messages meant to execute a command
function OnCommandMsg(event) {
	// Save everything sent after prefix. First word as command, other following words as arguments
	// Also sanitises input to change bad quotation marks to good quotation marks
	const messageSent = event.content.replace(String.fromCharCode(8221), '"').replace(String.fromCharCode(8220), '"');
	let commandArgs = messageSent.substring(prefix.length).split(/ +/);
	const commandName = commandArgs[0].toLowerCase();
	commandArgs = commandArgs.splice(1);

	// Find the right command in the collection, either by name or by alias
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// If no correct command is found, tell the user as such
	if(!command) return event.channel.send(`Unknown command. Try ${prefix}help for a command list.`);

	// If the command requires a specific security level, check that the user has that
	if(command.security) {
		if(!securityFunctions.CheckAuthorizedAccess(event, command.security)) return event.channel.send('You are not allowed to use this command.');
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
			reply += '\n' + `The command syntax is: ${prefix}${command.name}${aliases} ${command.usage}`;
		}

		return event.channel.send(reply);
	}

	// Attempt to execute a command, and catch errors if needed. Sends a message to say there was an error, then sends an error message to private error channel
	try {
		command.execute(event, commandArgs);
	}
	catch (error) {
		event.channel.send('I seem to have hit a problem. <@174616332430475264> has been given an error message.');
		client.channels
			.fetch(errChannelID)
			.then(channel => channel.send(`Sent by catch handler\n\nMessage sent\n${messageSent}\n\nError message\n${error.stack}`))
			.catch(console.error);
	}
}

// This function is used for messages meant to be checked for highlights
function OnHighlightMsg(message, highlightedWords) {
	// Find id's of users with the highlighted words
	let usersToSnitch = highlightFunctions.IdForWords(message, highlightedWords);

	// Sort users out that can't see the channel, return if none are left
	usersToSnitch = highlightFunctions.CheckForPerms(message, usersToSnitch);
	if(usersToSnitch.size == 0) return;

	// Sort users out that was pinged recently or was recently in the channel
	usersToSnitch = highlightFunctions.CheckTimePassed(message, usersToSnitch);

	// Send message
}
