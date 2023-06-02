module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    {
      username: 'ghosttoast',
      password: 'ghosttoast.123',
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
      password: 'lilianbernot.123',
      mail: 'lilianbernot@uc.cl',
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
