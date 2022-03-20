const fs = require('fs');

module.exports = {
  ReadCSV,
  ReadPrompt,
  ReadQuirkPrompt,
  ReadList,
  WriteLineToList,
  WriteArrayToCSV,
  OverWriteFile,
};

function ReadCSV(fileName) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  // Reads the file into a variable
  const output = [];
  const fileContent = fs.readFileSync(fileName, 'utf8');
  const rows = fileContent.split('\n');

  // Remove possible carriage returns that occur at the end of a line
  for(let r = 0; r < rows.length; r++) {
    if(rows[r].slice(-1) == '\r') {
      rows[r] = rows[r].slice(0, -1);
    }
  }

  // Removes the first row, as it is the header line, and splits it to make the headers for output
  const headers = rows[0].split(',');
  rows.splice(0, 1);

  // Splits the rows one by one to make a multidimensional array
  for(let r = 0; r < rows.length; r++) {
    const row = {}; // This is an object
    const cells = rows[r].split(','); // Rows are split by commas

    // For each header, the necessary value is added under the given header
    for(let h = 0; h < headers.length; h++) {
      row[headers[h]] = cells[h];
    }

    // Add the row to the output array
    output.push(row);
  }

  // Remove any false entries that may occur, working in reverse
  let index = output.length - 1;

  while(index >= 0) {
    if(output[index][headers[0]] === '') {
      output.splice(index, 1);
    }

    index -= 1;
  }

  return output;
}

function ReadPrompt(fileName) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  // Read in the prompt, replace newline indicators with newlines
  const prompt = fs.readFileSync(fileName, 'utf8').replace(/\$/g, '\n');

  return prompt;
}

function ReadQuirkPrompt(fileName) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  // Read in the prompt, split up the type and the description
  const prompt = fs.readFileSync(fileName, 'utf8').split('\n');

  // Replace newline indicators in the description with newlines
  prompt[1] = prompt[1].replace(/\$/g, '\n');

  return prompt;
}

function ReadList(fileName) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  // Read in the list and split it based on newlines
  const list = fs.readFileSync(fileName, 'utf8').split('\n');

  // Remove possible carriage returns that occur at the end of a line
  for(let i = 0; i < list.length; i++) {
    if(list[i].slice(-1) == '\r') {
      list[i] = list[i].slice(0, -1);
    }
  }

  if(list[list.length - 1] == '') list.pop();

  return list;
}

function WriteArrayToCSV(fileName, rawInfoToAdd) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  // Initialize output variable to put the eventual output in
  let output = '';

  // The keys in an object in the array is appended to output as first line to act as a header
  // OBS: This will return an error if rawInfoToAdd is sent with nothing in it, i.e. if called by RemoveQuirkPrompt and the last quirk prompt is removed by the method
  Object.keys(rawInfoToAdd[0]).forEach(key => {
    output += key + ',';
  });
  output = output.slice(0, -1); // The left-over comma is removed
  output += '\n'; // A new line is added for the next line

  // For each object in the array, this runs
  for(let i = 0; i < rawInfoToAdd.length; i++) {
    // This adds each value from an object to output
    Object.values(rawInfoToAdd[i]).forEach(val => {
      output += val + ',';
    });
    output = output.slice(0, -1); // The left-over comma is removed
    output += '\n'; // A new line is added for the next line
  }

  output = output.slice(0, -1); // The last newline is removed

  // Write the output to a file
  try{
    fs.writeFileSync(fileName, output);
  }
  catch(err) {
    return false;
  }

  return true;
}

function WriteLineToList(fileName, rawInfoToAdd) {
  // Checks if filename given ends in .txt, else adds it
  if (fileName.slice(-4) != '.txt') {
    fileName += '.txt';
  }

  let infoToAdd = '';

  // If the file exists, check whether or not the last line is empty
  if(fs.existsSync(fileName)) {
    const fileContent = fs.readFileSync(fileName, 'utf8');
    const fileLines = fileContent.split('\n');

    // Check if the last line of the file is empty. If not,
    if(fileLines[(fileLines.length) - 1] !== '') {
      infoToAdd += '\n';
    }
  }

  // Put all command arguments together into one line if still as command argument array. Else, if string, does it normally
  if(Array.isArray(infoToAdd)) {
    infoToAdd += rawInfoToAdd.join(' ');
  }
  else {
    infoToAdd += rawInfoToAdd;
  }

  // Initialize a writeStream to append onto a file. Flag 'a' will open file for appending, and create file if it does not exist.
  const stream = fs.createWriteStream(fileName, { flags:'a' });

  // Write the line
  stream.write(infoToAdd);

  stream.close();
}

function OverWriteFile(filePath, rawInfo) {
  // Checks if filename given ends in .txt, else adds it
  if (filePath.slice(-4) != '.txt') {
    filePath += '.txt';
  }

  let infoToAdd = '';

  // Put all command arguments together into one line if still as command argument array. Else, if string, does it normally
  if(Array.isArray(infoToAdd)) {
    infoToAdd += rawInfo.join(' ');
  }
  else{
    infoToAdd += rawInfo;
  }

  // Initialize a writeStream to append onto a file. Flag 'w' will open file for writing, and create file if it does not exist. If it does, it is truncated(?)
  const stream = fs.createWriteStream(filePath, { flags:'w' });

  // Write the line
  stream.write(infoToAdd);

  stream.close();
}
