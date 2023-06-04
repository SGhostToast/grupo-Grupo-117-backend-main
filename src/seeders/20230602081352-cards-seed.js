// https://www.letsplayuno.com/news/guide/20181213/30092_732567.html

const colors = ['RED', 'YELLOW', 'BLUE', 'GREEN'];
const symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'drawTwo', 'reverse', 'skip'];

const cards = [];

for (const color of colors) {
  for (const symbol of symbols) {
    const card = {
      color: color,
      symbol: symbol,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    cards.push(card);
  }
}

cards.push({
  color: 'MULTI',
  symbol: 'wild',
  createdAt: new Date(),
  updatedAt: new Date()
});

cards.push({
  color: 'MULTI',
  symbol: 'wildDraw4',
  createdAt: new Date(),
  updatedAt: new Date()
});

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Cards', cards),
  down: (queryInterface) => queryInterface.bulkDelete('Cards', null, {})
};
