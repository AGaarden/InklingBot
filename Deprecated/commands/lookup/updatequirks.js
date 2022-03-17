module.exports = {
  name: 'updatequirks',
  description: 'Updates the quirk list',
  security: 3,
  execute(event) {
    // Reads in banned quirk list and turns it into an array. Currently commented out due to not needing quirk roller
    // var banList = fs.readFileSync('bannedQuirks.txt', 'utf8');
    // banList = banList.split('\n');

    const indexOf = require('nth-indexof');
    const fs = require('fs');

    // Reads in raw data. Currently still have to manually update rawquirk.txt with the source code
    const rawData = fs.readFileSync('rawquirk.txt', 'utf8');
    // Slices code into segments, starting at where a new table is started. Removes the first segment which is the part before a table
    let segments = rawData.split('<table');
    segments = segments.slice(1);

    // var quirks = []; Commented out due to not needing quirk roller
    const allQuirks = [];

    // Do the following function once for each element in the array
    for (let s = 0; s < segments.length; s++) {
        let segment = segments[s];

        // The first three tables have to be handled differently from the last table
        if (s != 3) {
            const lines = segment.split('<tr').splice(2);

            for (let l = 0; l < lines.length; l++) {
                const line = lines[l];
                const quirk = { 'name':'', href:'' };

                const quirkLine = line.substring(0, line.indexOf('</th>'));

                // This entire part is basically magic.... Or finding specific characters and cutting up the text in just the right way to get the results
                if (quirkLine.indexOf('(page does not exist)') != -1) {
                    quirk.name = line.substring(indexOf(line, '>', 2) + 1);
                    quirk.name = quirk.name.substring(0, quirk.name.indexOf('<'));

                    quirk.href = line.substring(indexOf(line, '<a href="', 1) + 9);
                    quirk.href = quirk.href.substring(0, quirk.href.indexOf('"'));
                }
                else if (quirkLine.indexOf('<a href="') == -1) {
                    quirk.name = line.substring(indexOf(line, '>', 1) + 1);
                    quirk.name = quirk.name.substring(0, quirk.name.indexOf('<') - 1);

                    quirk.href = line.substring(indexOf(line, '<a href="', 1) + 9);
                    quirk.href = quirk.href.substring(0, quirk.href.indexOf('"'));
                }
                else {
                    quirk.name = line.substring(indexOf(line, '>', 2) + 1);
                    quirk.name = quirk.name.substring(0, quirk.name.indexOf('<'));

                    quirk.href = line.substring(line.indexOf('<a href="') + 9);
                    quirk.href = quirk.href.substring(0, quirk.href.indexOf('"'));
                }

                // Check if the quirk name ends with "'s quirk", if so, discard that as it will be picked up in the next section with the proper name
                if (quirk.name.indexOf('\'s Quirk') != -1) {
                    continue;
                }

                // Add quirk to the complete quirk list
                allQuirks.push(quirk);

                // Checks if the quirk is banned, if so, discard it. Commented out due to no need for quirk roller
                // if (banList.includes(quirk.name)) {
                //    continue;
                // }

                // Add quirk to the filtered quirk list for rolling. Commented out due to no need for quirk roller
                // quirks.push(quirk);
            }
        }
        else {
            segment = segment.substring(0, segment.indexOf('Related Articles'));
            let lines = segment.split('<a href="');
            lines = lines.splice(2);

            for (let l = 0; l < lines.length; l++) {
                const line = lines[l];
                const quirk = { 'name':'', 'href':'' };

                quirk.name = line.substring(line.indexOf('>') + 1);
                quirk.name = quirk.name.substring(0, quirk.name.indexOf('<'));

                quirk.href = line.substring(0, line.indexOf('"'));

                // Checks if the quirk was already imported with the previous segment, if so, discard it.
                let duplicate = false;
                for(let x = 0; x < allQuirks.length; x++) {
                    if (allQuirks[x].name == quirk.name) {
                      duplicate = true;
                    }
                }

                if(duplicate) {
                  continue;
                }

                allQuirks.push(quirk);

                // Checks if the quirk is banned, if so, discard it. Commented out due to no need for quirk roller
                // if (banList.includes(quirk.name)) {
                //    continue;
                // }

                // Add quirk to the filtered quirk list for rolling. Commented out due to no need for quirk roller
                // quirks.push(quirk);
            }
        }
    }

    // Turn the previous arrays into text lists and save them to a text file
    let fullQuirkListText = '';
    // var rollerQuirkListText = ''; Currently commented out due to not needing quirk roller
    const wikiUrl = 'https://myheroacademia.fandom.com';

    // Puts each quirk on a line with this format: "name link+href"
    for (let q = 0; q < allQuirks.length; q++) {
        fullQuirkListText += allQuirks[q].name + ' ' + '<' + wikiUrl + allQuirks[q].href + '>' + '\n';
    }
    fullQuirkListText = fullQuirkListText.slice(0, -1);

    // Currently commented out due to not needing quirk roller
    // for (var q = 0; q < quirks.length; q++) {
    //    rollerQuirkListText += quirks[q].name + ' ' + wikiUrl + quirks[q].href + '\n';
    // }
    // rollerQuirkListText = rollerQuirkListText.slice(0, -1);

    fs.writeFile('fullQuirkList.txt', fullQuirkListText, function(err) {
        if (err) event.channel.send('Could not save full quirk list.');
    });

    // Currently commented out due to not needing quirk roller
    // fs.writeFile('rollerQuirkList.txt', rollerQuirkListText, function (err){
    //    if (err) return 'Could not save roller quirk list.';
    // });

    event.channel.send('Quirk list updated.');
  },

};
