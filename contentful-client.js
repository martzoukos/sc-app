const contentful = require('contentful');
const client = contentful.createClient({
  space: 'x4377yw9ls2u',
  accessToken: 'fdf8209c2f92c82b9fdd220c17535fa8f52267b5244f60c6039b86b22d10f997',
  host: 'preview.contentful.com'
})

module.exports = client;
