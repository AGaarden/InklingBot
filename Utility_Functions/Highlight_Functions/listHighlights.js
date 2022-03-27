const rw = require('../rwFunctions.js');
const fs = require('fs');

const Discord = require('discord.js');

module.exports = {
  name: 'list',
  description: 'List all your highlights',
  aliases: ['l'],
  // usage: ,
  // args: ,
  // security: ,
  execute(message) {
    const wordFiles = fs.readdirSync(`././Highlights/${message.guild.id}`);

    // Iterate through all word files, find the words the user is tracking
    const highlightList = [];
    wordFiles.forEach(file => {
      const ids = rw.ReadList(`././Highlights/${message.guild.id}/${file}`);

      ids.forEach(id => {
        if(message.author.id === id) {
          highlightList.push(file);
        }
      });
    });

    if(highlightList.length === 0) {
      message.channel.send('You have no highlights set.');
      return;
    }

    // Sort the list alphabetically
    highlightList.sort();

    // Make the list a string to send in embed
    let highlightEmbed = '';
    highlightList.forEach(highlight => {
      highlightEmbed += highlight.slice(0, -4) + '\n';
    });

    // Generate an embed
    const embed = new Discord.MessageEmbed()
    .setTitle('**Your highlighted words**').setDescription(highlightEmbed);

    // Send a message with an embed
    message.channel.send(embed);
  },
};
