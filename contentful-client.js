const contentful = require('contentful');
const client = contentful.createClient({
  space: 'x4377yw9ls2u',
  accessToken: '008415fdeac8b6c476c4d8bfa4240ebab99c0ee027b52edcc068dc1279529ddb'
})

module.exports = client;
