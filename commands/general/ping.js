module.exports = {
  name: 'ping',
  description: 'Ping!',
  execute(event) {
    event.channel.send('Pingidy pong!');
  },
};
