module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Friends', [
    {
      frienderid: 1,
      befriendedid: 2,
      status: 'FRENS',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      frienderid: 1,
      befriendedid: 3,
      status: 'FRENS',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      frienderid: 1,
      befriendedid: 4,
      status: 'FRENS',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('Friends', null, {})
};