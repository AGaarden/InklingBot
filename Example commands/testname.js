module.exports = {
  name: 'testname',
  description: 'Test the properties of names',
  // aliases: [''],
  // usage: ,
  // args: ,
  // security: ,
  execute(event) {
    const memberID = event.member.id;
    console.log(memberID);

    const userObject = event.client.users.cache.find(user => user.id === memberID);

    console.log(userObject);
  },
};
