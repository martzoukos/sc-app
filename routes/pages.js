var express = require('express');
var router = express.Router();
const fractal = require('sc-components');
const client = require('../contentful-client.js');
import { documentToHtmlString } from '@contentful/structured-text-html-serializer';


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
		if (typeof response.items[0] != 'undefined') {
			const page = response.items[0];
			fractal.load().then(() => {
				renderPage(page.fields.contentBlocks, res, page);
			});
		} else {
			res.status(404).send('This page doesn’t exist');
		}
	});
});

const renderPage = (blocksEndpoint, res, page) => {
	const pageTitle = (typeof page.fields.title != 'undefined') ? page.fields.title : 'Untitled';
	const coverImage = setCoverImage(page);
	let promises = [];

	if (typeof blocksEndpoint != 'undefined') {
		blocksEndpoint.forEach((block) => {
			if (typeof block.sys.contentType != 'undefined') {
				switch(block.sys.contentType.sys.id) {
					case "blockText":
						if (typeof block.fields.text != 'undefined') {
							promises.push(fractal.components.render('@block-text', {
						    text: block.fields.text
						  }));
						}
						break;
					case "blockImage":
						if (typeof block.fields.image != 'undefined') {
							promises.push(fractal.components.render('@block-image', {
						    alt: block.fields.image.fields.file.fileName,
						    src: block.fields.image.fields.file.url
						  }));	
						}
						break;
					case "blockQuote":
						if (typeof block.fields.quote != 'undefined') {
							promises.push(fractal.components.render('@block-quote', {
						    quote: block.fields.quote,
						    cite: block.fields.cite
						  }));
						}
						break;
					case "blockVideo":
						if (typeof block.fields.source != 'undefined') {
							promises.push(fractal.components.render('@block-video', {
						    src: block.fields.source
						  }));
						}
						break;
					case "blockLink":
						if (typeof block.fields.page != 'undefined') {
							promises.push(fractal.components.render('@block-link', {
						    id: block.fields.page.sys.id
						  }));
						}
						break;
				};
			}
		});
	}

	const options = {
	  renderNode: {
	    [PARAGRAPH]: (node, next) => `<p class="custom">${next(node.content)}</p>`
	  }
	}

	Promise.all(promises).then((contentBlocks) => {
		res.render('page', { 
			title: pageTitle, 
			coverImage: coverImage,
			// contentBlocks: contentBlocks.join('') 
			contentBlocks: documentToHtmlString(page.fields.structuredText)
		});
	});
};

const setCoverImage = (page) => {
	if (typeof page.fields.coverImage != 'undefined') {
		if (typeof page.fields.coverImage.fields.file != 'undefined')
			return page.fields.coverImage.fields.file.url;
	} else {
		return '//images.contentful.com/fo9twyrwpveg/1lijLvZpUMk8wSi60w6Wg8/82e1815d6c12b16b67f45c0167ba51e6/DeveloperPortal.png';
	};
};

module.exports = router;
