var express = require('express');
var router = express.Router();
const contentful = require('contentful');
const fractal = require('sc-components');

// Contentful
const client = contentful.createClient({
  space: 'x4377yw9ls2u',
  accessToken: '008415fdeac8b6c476c4d8bfa4240ebab99c0ee027b52edcc068dc1279529ddb'
})

/* GET home page. */
router.get('/', function(req, res, next) {
	fractal.load().then(() => {
		client.getEntries({ 'content_type': 'pages' }).then((response) => {
			response.items.forEach((page) => {
				renderPage(page.fields.contentBlocks, res, page);
			});
		})
	});
});

const renderPage = (blocksEndpoint, res, page) => {
	const pageTitle = page.fields.title;
	const coverImage = page.fields.coverImage.fields.file.url;
	let promises = [];

	blocksEndpoint.forEach((block) => {
		switch(block.sys.contentType.sys.id) {
			case "blockText":
				promises.push(fractal.components.render('@block-text', {
			    text: block.fields.text
			  }));
				break;
			case "blockImage":
				promises.push(fractal.components.render('@block-image', {
			    alt: block.fields.image.fields.file.fileName,
			    src: block.fields.image.fields.file.url
			  }));
				break;
			case "blockQuote":
				promises.push(fractal.components.render('@block-quote', {
			    quote: block.fields.quote,
			    cite: block.fields.cite
			  }));
				break;
			case "blockVideo":
				promises.push(fractal.components.render('@block-video', {
			    src: block.fields.source
			  }));
				break;
			case "blockLink":
				promises.push(fractal.components.render('@block-link', {
			    id: block.fields.page.fields.title
			  }));
				break;
		};
	});

	Promise.all(promises).then((contentBlocks) => {
		res.render('index', { 
			title: pageTitle, 
			coverImage: coverImage,
			contentBlocks: contentBlocks.join('') 
		});
	});
};


module.exports = router;
