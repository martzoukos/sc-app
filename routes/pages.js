var express = require('express');
var router = express.Router();
const fractal = require('sc-components');
const client = require('../contentful-client.js');

// Pages index
router.get('/', function(req, res, next) {
	client.getEntries({
		'content_type': 'pages'
	})
	.then((response) => {
		res.render('pages', {
			pages: response.items
		});
	});
});

// Page details
router.get('/:page', function(req, res, next) {
	client.getEntries({
		content_type: 'pages',
		'fields.slug': req.params.page
	})
	.then((response) => {
		const page = response.items[0];
		fractal.load().then(() => {
			renderPage(page.fields.contentBlocks, res, page);
		});
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
				console.log(block.fields.page.sys.id);
				promises.push(fractal.components.render('@block-link', {
			    id: block.fields.page.sys.id
			  }));
				break;
		};
	});

	Promise.all(promises).then((contentBlocks) => {
		res.render('page', { 
			title: pageTitle, 
			coverImage: coverImage,
			contentBlocks: contentBlocks.join('') 
		});
	});
};

module.exports = router;
