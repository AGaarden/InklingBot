module.exports = {
  name: 'shutdown',
  description: 'Shuts down the bot',
  aliases: ['close', 'exit'],
  security: 3,
  execute(event) {
    event.channel.send('Shutting down...');
    event.client.destroy();
  },

};
