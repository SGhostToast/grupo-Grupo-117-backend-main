module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Users', [
    // {
    //   username: 'ghosttoast',
    //   password: 'ghosttoast.123',
    //   mail: 'ghosttoast@uc.cl',
    //   played_matches: 0,
    //   won_matches: 0,
    //   max_score: 0,
    //   total_score: 0,
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    // {
    //   username: 'lilianbernot',
    //   password: 'lilianbernot.123',
    //   mail: 'lilianbernot@uc.cl',
    //   played_matches: 0,
    //   won_matches: 0,
    //   max_score: 0,
    //   total_score: 0,
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    {
      username: 'user1',
      password: 'user1.123',
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
      password: 'user2.123',
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
