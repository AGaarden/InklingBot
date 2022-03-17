module.exports = {
  name: 'testquote',
  description: 'Test',
  args: true,
  execute(event, commandArgs) {
    const sentence = commandArgs.join('');

    // return event.channel.send(`The first character in your sentence (${sentence.charAt(0)}) is unicode ${sentence.charCodeAt(0)}`);
    return event.channel.send(`The unicode you have sent (${sentence}) is the character ${String.fromCharCode(sentence)}`);
  },
};
