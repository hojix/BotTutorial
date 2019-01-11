const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Webhook server is listening, post 3000'));

//Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {
	
	let body = req.body;

	//Checks this is an event from a page subscription
	if (body.object === 'page') {

		//Iterates over each entry - there may be multiple if batched
		body.entry.forEach(function(entry) {

			//Gets the meesage. entry.messaging is an array but
			//will only ever contain one message, so we get index 0
			let webhook_event = entry.messaging[0];
			console.log(webhook_event);
		});

		//Returns a '200 OK' response to all requests
		res.status(200).send('EVENT_RECEVIED');
	} else {
		//Returns a '404 Not Found' if event is not from a page subscription
		res.sendStatus(404);
	}
});

app.get('/webhook', (req, res) => {

	//Your verify token should be a random string
	let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>";

	//Parse the query params
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];

	//Checks if a token and mode is in the query string of the request
	if (mode && token) {

		//Checks the mode and token is sent correct
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {

			//Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);

		} else {
			//Responds with '403 Forbidden' if verify tokens do not match
			res.sendStatus(403);
		}
	}
});