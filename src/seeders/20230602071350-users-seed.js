const bcrypt = require('bcrypt');
const saltRounds = 10;

/* eslint-disable-next-line */
const pwd_ghosttoast = await bcrypt.hash('ghosttoast.123', saltRounds);
const pwd_lilianbernot = await bcrypt.hash('lilianbernot.123', saltRounds);
const pwd_user1 = await bcrypt.hash('user1.123', saltRounds);
const pwd_user2 = await bcrypt.hash('user2.123', saltRounds);

module.exports = {
  up: (queryInterface) => 
  queryInterface.bulkInsert('Users', [
    {
      username: 'ghosttoast',
      password: pwd_ghosttoast,
      mail: 'ghosttoast@uc.cl',
      played_matches: 0,
      won_matches: 0,
      max_score: 0,
      total_score: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'lilianbernot',
      password: pwd_lilianbernot,
      mail: 'lilianbernot@uc.cl',
      played_matches: 0,
      won_matches: 0,
      max_score: 0,
      total_score: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'user1',
      password: pwd_user1,
      mail: 'user1@uc.cl',
      played_matches: 0,
      won_matches: 0,
      max_score: 0,
      total_score: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'user2',
      password: pwd_user2,
      mail: 'user2@uc.cl',
      played_matches: 0,
      won_matches: 0,
      max_score: 0,
      total_score: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
