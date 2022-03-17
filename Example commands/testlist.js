const rw = require('../../Utility_Functions/rwFunctions.js');
const { PAGE_LENGTH, LIST_TIME } = require('../../config.json');

const Discord = require('discord.js');

const pageLength = PAGE_LENGTH; // Variable for determining the size of a single page of prompts

module.exports = {
  name: 'testlist',
  description: 'List all quirk prompts in my records',
  async execute(event) {
    // Read into the list of quirk prompts
    const allQuirkPrompts = rw.ReadCSV('quirkprompts');

    // Sort the list alphabetically
    allQuirkPrompts.sort();

    event.channel.send(await generateEmbed(0, allQuirkPrompts, event)).then(async message => {
      if (allQuirkPrompts.length <= pageLength) return;

      await message.react('⬅️');
      message.react('➡️');

      let currentIndex = 0;
      let highestIndex = 0;
      while (highestIndex + pageLength < allQuirkPrompts.length) highestIndex += pageLength;

      const filter = (reaction) => ['⬅️', '➡️'].includes(reaction.emoji.name);

      const collector = message.createReactionCollector(filter, { time: LIST_TIME, dispose: true });

      collector.on('collect', async reaction => {
        if(reaction.emoji.name === '⬅️') currentIndex -= pageLength;
        else currentIndex += pageLength;

        if (currentIndex >= allQuirkPrompts.length) {
          currentIndex = 0;
        }

        if (currentIndex < 0) currentIndex = highestIndex;

        message.edit(await generateEmbed(currentIndex, allQuirkPrompts, event));
      });

      collector.on('remove', async reaction => {
        if(reaction.emoji.name === '⬅️') currentIndex -= pageLength;
        else currentIndex += pageLength;

        if (currentIndex >= allQuirkPrompts.length) {
          currentIndex = 0;
        }

        if (currentIndex < 0) currentIndex = highestIndex;

        message.edit(await generateEmbed(currentIndex, allQuirkPrompts, event));
      });
    });
  },
};

function generateEmbed(startIndex, listOfPrompts, event) {
  const currentPage = listOfPrompts.slice(startIndex, startIndex + pageLength);

  const embed = new Discord.MessageEmbed()
  .setTitle(`Quirk prompts ${startIndex + 1}-${startIndex + currentPage.length} out of ${listOfPrompts.length}`);

  currentPage.forEach(async prompt => {
    const author = await event.guild.members.fetch(`${prompt.author}`);
    embed.addField(prompt.name, `Written by ${author}`);
  });

  return embed;
}
