module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Tables', [
    {
      ownerid: 1,
      clockwise: true,
      turn: 0,
      color: null,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]).then(() => queryInterface.bulkInsert('Players', [
    {
      name: 'ghosttoast',
      userid: 1,
      gameid: 1,
      score: 0,
      insideid: null,
      status: 'READY',
      uno: 'NO',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'lilianbernot',
      userid: 2,
      gameid: 1,
      score: 0,
      insideid: null,
      status: 'READY',
      uno: 'NO',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user1',
      userid: 3,
      gameid: 1,
      score: 0,
      insideid: null,
      status: 'READY',
      uno: 'NO',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'user2',
      userid: 4,
      gameid: 1,
      score: 0,
      insideid: null,
      status: 'READY',
      uno: 'NO',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])),
down: (queryInterface) => {
  queryInterface.bulkDelete('Players', null, {})
  .then(() => {
    queryInterface.bulkDelete('Tables', null, {});
  });
}
};
