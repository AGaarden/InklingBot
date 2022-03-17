module.exports = {
  name: 'get',
  description: 'Some fun grabs that Saiko can make',
  aliases: ['fun'],
  usage: '<case>',
  execute(event, commandArgs) {

    const userInput = commandArgs.join(' ').toLowerCase();
    let text = 'Hm. I don\'t think I know that one. Try something else.';

    switch(userInput) {
      case 'bap':
        text = 'https://cdn.discordapp.com/attachments/553036539215478798/580064625190633493/lolcatsdotcomg0s6w2fptayxo42g.jpg';
        break;
      case 'ruinin it':
        text = 'https://www.youtube.com/watch?v=Q2BMLLSpTHM';
        break;
      case 'kuku':
        text = 'https://cdn.discordapp.com/attachments/711939978703274006/832026059502518343/verykuku.png';
        break;
      case 'loveandhugs':
        text = 'https://cdn.discordapp.com/attachments/567717620867006486/570574440128053251/Selection_001.png';
        break;
      case 'banhammer':
        text = 'https://pbs.twimg.com/media/EMpqlemWoAA9d4D.jpg';
        break;
      case 'cornertime':
        text = 'Go to cornertime \nhttps://i2.wp.com/66.media.tumblr.com/b2a2247751272391a7924e299594f16c/tumblr_pftllzU1d31qh1kk3_1280.png';
        break;
    }

    event.channel.send(text);
  },
};
