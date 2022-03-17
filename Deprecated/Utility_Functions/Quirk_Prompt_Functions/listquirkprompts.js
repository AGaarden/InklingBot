const rw = require('../../Utility_Functions/rwFunctions.js');
const { PAGE_LENGTH, LIST_TIME } = require('../../config.json');

const Discord = require('discord.js');

const pageLength = PAGE_LENGTH; // Variable for determining the size of a single page of prompts

module.exports = {
  name: 'list',
  description: 'List all quirk prompts in my records',
  aliases: ['l'],
  async execute(event) {
    // Read into the list of quirk prompts
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');

    /*
    // For each object, checks if user has written a prompt, writes differently if so
    allQuirkPrompts.forEach((prompt) => {
      if(prompt.author == event.member.id) {
        prompt.name += ' (Written by you)';
      }
    });
    */

    // Sort the list alphabetically
    allQuirkPrompts.sort();

    // Send a message with an embed, then continue
    event.channel.send(await generateEmbed(0, allQuirkPrompts, event)).then(async message => {
      if (allQuirkPrompts.length <= pageLength) return; // If there aren't enough prompts to make two pages, do nothing more

      // Put reactions on the list
      await message.react('⬅️');
      message.react('➡️');

      // This makes a count for what the highest allowed index is when changing page
      let currentIndex = 0;
      let highestIndex = 0;
      while (highestIndex + pageLength < allQuirkPrompts.length) highestIndex += pageLength;

      // Filter checks for whether or not either emote is used
      // const filter = (reaction, user) => user.id === event.author.id && ['⬅️', '➡️'].includes(reaction.emoji.name);
      const filter = (reaction, user) => !user.bot && ['⬅️', '➡️'].includes(reaction.emoji.name);

      // Make collector. dispose is set true to allow for remove event
      const collector = message.createReactionCollector(filter, { time: LIST_TIME, dispose: true });

      collector.on('collect', async reaction => { // When reaction is collected
        // Change currentIndex depending on what emote was used
        if(reaction.emoji.name === '⬅️') currentIndex -= pageLength;
        else currentIndex += pageLength;

        // Spill over protection
        if (currentIndex >= allQuirkPrompts.length) currentIndex = 0;
        if (currentIndex < 0) currentIndex = highestIndex;

        // Write a new embed and edit message
        message.edit(await generateEmbed(currentIndex, allQuirkPrompts, event));
      });

      collector.on('remove', async reaction => { // When reaction removal is collected. Everything else is the same
        if(reaction.emoji.name === '⬅️') currentIndex -= pageLength;
        else currentIndex += pageLength;

        if (currentIndex >= allQuirkPrompts.length) {
          currentIndex = 0;
        }

        if (currentIndex < 0) currentIndex = highestIndex;

        message.edit(await generateEmbed(currentIndex, allQuirkPrompts, event));
      });

      /* collector.on('end', () => {
        event.channel.send('List deprecated.');
      });*/
    });
  },
};

function generateEmbed(startIndex, listOfPrompts, event) {
  // Make a page depending on what the startIndex is
  const currentPage = listOfPrompts.slice(startIndex, startIndex + pageLength);

  // Make new embed and set title
  const embed = new Discord.MessageEmbed()
  .setTitle(`Quirk prompts ${startIndex + 1}-${startIndex + currentPage.length} out of ${listOfPrompts.length}`);

  currentPage.forEach(async prompt => {
    // const author = await event.guild.members.fetch(`${prompt.author}`);
    // embed.addField(prompt.name, `Written by ${author}`);

    if (prompt.author == event.member.id) embed.addField(prompt.name, 'Written by you');
    else embed.addField(prompt.name, '\u200B');
  });

  return embed;
}

/*
function generateEmbed(startIndex, listOfPrompts) {
  const currentPage = listOfPrompts.slice(startIndex, startIndex + pageLength);

  const title = `**Quirk prompts ${startIndex + 1}-${startIndex + currentPage.length} out of ${listOfPrompts.length}**`;

  let text = title + '\n';

  currentPage.forEach(prompt => {
    text += prompt.name + '\n';
  });

  return text;
}
*/
