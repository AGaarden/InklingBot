const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
const pageLength = 5;

const Discord = require('discord.js');

module.exports = {
  name: 'testreact',
  description: 'Test reactions',
  // aliases: [''],
  // usage: ,
  // args: ,
  // security: ,
  /* eslint-disable no-unused-vars */
  execute(event, commandArgs) {
  /* eslint-enable no-unused-vars */
    event.channel.send(generateEmbed(0)).then(async message => {
      if (numbers.length <= pageLength) return;

      await message.react('⬅️');
      message.react('➡️');

      const filter = (reaction, user) => user.id === event.author.id && ['⬅️', '➡️'].includes(reaction.emoji.name);

      const collector = message.createReactionCollector(filter, {
        time: 60000,
      });

      let currentIndex = 0;
      let highestIndex = 0;
      while (highestIndex + pageLength < numbers.length) highestIndex += pageLength;

      collector.on('collect', reaction => {
        if(reaction.emoji.name === '⬅️') currentIndex -= pageLength;
        else currentIndex += pageLength;

        console.log(currentIndex);
        if (currentIndex > numbers.length) {
          currentIndex = 0;
        }

        if (currentIndex < 0) currentIndex = highestIndex;
        console.log(currentIndex);

        message.edit(generateEmbed(currentIndex));
      });

      collector.on('end', () => {
        event.channel.send('List deprecated.');
      });
    });
  },
};

function generateEmbed(start) {
  const currentPage = numbers.slice(start, start + pageLength);

  const embed = new Discord.MessageEmbed()
  .setTitle(`Showing numbers ${start + 1}-${start + currentPage.length} out of ${numbers.length}`);
  currentPage.forEach(n => embed.addField(n, 'Field line 2'));
  return embed;
}
