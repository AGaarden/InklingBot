module.exports = {
  name: 'testcollect',
  description: 'Ping!',
  /* eslint-disable no-unused-vars */
  execute(event, commandArgs) {
  /* eslint-enable no-unused-vars */

    const filter = e => e.author.id === event.author.id;

    event.channel.send('Testing await. Please write a message within 30 seconds.').then(() => {
      event.channel.awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then(() => {
        event.channel.send('I got something.');
      })
      .catch(() => {
        event.channel.send('You took too long. Don\'t keep me waiting.');
      });
    });

  },
};
