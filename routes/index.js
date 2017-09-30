var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	const fractal = require('sc-components');
	fractal.load().then(() => {
		let blocks = '';

		// Block text
	  fractal.components.render('@block-text', {
	    text: 'Hello there'
	  }).then(html => {
	  	blocks = blocks + html;
	  });
		// Block image
	  fractal.components.render('@block-image', {
	    alt: 'Hello there',
	    src: 'https://images.contentful.com/fo9twyrwpveg/5nCI6r6Z68yoq2WocomYoS/99f9985edfd1073b3936435835d6e5a1/_DSC0082.jpg'
	  }).then(html => {
	  	blocks = blocks + html;
	  });
		// Block quote
	  fractal.components.render('@block-quote', {
	    quote: 'A quote',
	    cite: 'Someone'
	  }).then(html => {
	  	blocks = blocks + html;
	  });
		// Block video
	  fractal.components.render('@block-video', {
	    src: 'https://www.youtube.com/embed/JrcH-4wHK9w'
	  }).then(html => {
	  	blocks = blocks + html;
	  });
		// Block link
	  fractal.components.render('@block-link', {
	    id: '21345'
	  }).then(html => {
	  	blocks = blocks + html;
	  });

	  // I know, I know...
	  setTimeout(() => {
	  	res.render('index', { title: 'Structured Content app', html: blocks });
	  }, 500);
	});

});


module.exports = router;
