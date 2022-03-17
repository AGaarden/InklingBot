const rw = require('./rwFunctions.js');

module.exports = {
  CheckAuthorizedAccess,
  CheckAuthorizedServer,
};

function CheckAuthorizedAccess(event, securityLevel) {
  // Always accept commands from bot creator
  if(event.member.id == 174616332430475264) return true;

  if(!CheckAuthorizedServer) return false;

  // Read in the server the bot is being used in
  const currentServerID = event.guild.id;

  // Read in authorized servers and the list of role id's for the server
  const authorizedServers = rw.ReadCSV('authorizedservers');
  let securityRoles = null;
  for(let i = 0; i < authorizedServers.length; i++) {
    if(authorizedServers[i].serverID == currentServerID) {
      securityRoles = rw.ReadCSV('Server_Roles/' + authorizedServers[i].serverName);
      break;
    }
  }

  // Go through each security role, and find the highest security clearance level of the user
  // In general: 1 will be new user/user without distinguishing roles, 2 will be distinguished user, 3 will be staff
  let userSecurityLevel = 1;
  for(let i = 0; i < securityRoles.length; i++) {
    if(event.member.roles.cache.has(securityRoles[i].roleID)) {
      if(securityRoles[i].roleLevel > userSecurityLevel) {
        userSecurityLevel = securityRoles[i].roleLevel;
      }
    }
  }

  // Check if the user's security level is high enough
  if(userSecurityLevel >= securityLevel) {
    return true;
  }
  else {
    return false;
  }
}

function CheckAuthorizedServer(event) {
  // Always accept commands from bot creator
  if(event.member.id == 174616332430475264) return true;

  // Read in the server the bot is being used in
  const currentServerID = event.guild.id;

  // Read authorized servers and return true if a correct one is found
  const authorizedServers = rw.ReadCSV('authorizedservers');
  for(let i = 0; i < authorizedServers.length; i++) {
    if(authorizedServers[i].serverID == currentServerID) {
      return true;
    }
  }

  // If the for loop completes without triggering if statement, return false
  return false;
}
