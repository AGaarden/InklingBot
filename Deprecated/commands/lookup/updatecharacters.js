module.exports = {
  name: 'updatecharacters',
  description: 'Update the character list',
  security: 3,
  execute(event) {
  // const indexOf = require('nth-indexof');
  const fs = require('fs');

  // Reads in raw data. Currently still have to manually update rawcharacters.txt with the source code
  const rawData = fs.readFileSync('rawcharacters.txt', 'utf8');

  // Slice code into segments going off of each image on the page. Removes the first segment, which is unnecessary
  let segments = rawData.split('<div class="thumb"');
  segments = segments.slice(1);

  // Initialize an array to put the lines in
  const allCharacters = [];

  // Do the following on every segment
  for (let s = 0; s < segments.length; s++) {
    // Name this something easier
    let segment = segments[s];

    // Make a container for all info
    const character = { 'name':'', 'alias':'', href:'' };

    // Manipulate segment such that href is the first thing in the segment
    segment = segment.substring(segment.indexOf('<a href="') + 9, segment.indexOf('/a', segment.indexOf('<a href="') + 9));

    // declare href based on the last quotation mark
    character.href = segment.substring(0, segment.indexOf('"'));

    // Manipulate segment such that name is the first thing in the segment
    segment = segment.substring(character.href.length + 9);

    // declare name based on the last quotation mark
    character.name = segment.substring(0, segment.indexOf('"'));

    // Manipulate segment such that alias is the first thing in the segment
    segment = segment.substring(character.name.length + 2);

    // declare alias based on the last quotation mark
    character.alias = segment.substring(0, segment.indexOf('<'));

    // Exceptions! Some characters are unnamed or have ? as their name. These are filtered out
    if(character.alias.indexOf('?') != -1) {
      continue;
    }
    if(character.name.indexOf('High School') != -1) {
      continue;
    }
    if(character.alias.indexOf('Unnamed') != -1) {
      continue;
    }
    if(character.alias.indexOf('Member') != -1) {
      continue;
    }

    // Check for duplicates in the whole array so far
    let duplicate = false;
    for(let i = 0; i < allCharacters.length; i++) {
      if(allCharacters[i].name == character.name) {
        duplicate = true;
      }
    }

    if(duplicate) {
      continue;
    }

    // Add character to the complete character list
    allCharacters.push(character);
  }

  // Turn the previous array into a text list and save it to a text file
  let fullCharacterListText = '';

  const wikiUrl = 'https://myheroacademia.fandom.com';

  // Puts each character on a line in this format: "name, alias link+href"
  // Note: If a person has the same name as their alias, only one is written
  for(let c = 0; c < allCharacters.length; c++) {
    if(allCharacters[c].name == allCharacters[c].alias) {
      fullCharacterListText += allCharacters[c].name + ' ' + '<' + wikiUrl + allCharacters[c].href + '>' + '\n';
    }
    else{
      fullCharacterListText += allCharacters[c].name + ', ' + allCharacters[c].alias + ' ' + '<' + wikiUrl + allCharacters[c].href + '>' + '\n';
    }
  }
  // Remove the last newline
  fullCharacterListText = fullCharacterListText.slice(0, -1);

  fs.writeFile('fullCharacterList.txt', fullCharacterListText, function(err) {
      if (err) event.channel.send('Could not save full quirk list.');
      return;
  });

  event.channel.send('Character list updated.');
  },

};
