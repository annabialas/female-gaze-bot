var Twit = require('twit');
var http = require('https');
var fs = require('fs');
var Bing = require('node-bing-api')({ accKey: "60c2a5e5f3974109b7d7e727749c427e" });

// load .env
require('dotenv').config();

var config = {
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token: process.env.access_token,
	access_token_secret: process.env.access_token_secret
};

var T = new Twit(config);

function tweet(){

	Bing.images("white man body", {
		top: 150
	}, 
	function(error, res, body){

		var url = body.value[ Math.floor(Math.random()*150) ].thumbnailUrl;
		console.log(url);

		var file = fs.createWriteStream("file.jpg");
		var request = http.get(url, function(response) {
			  response.pipe(file);
		});
	});

	var b64content = fs.readFileSync('file.jpg', { encoding: 'base64' })

	// first we must post the media to Twitter
	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
	  // now we can assign alt text to the media, for use by screen readers and
	  // other text-based presentations and interpreters
	  var mediaIdStr = data.media_id_string
	  var altText = "dem boiz thru the female gaze"
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (!err) {
	      // now we can reference the media and post a tweet (media will attach to the tweet)
	      var params = { status: 'dem boiz come 2 me', media_ids: [mediaIdStr] }

	      T.post('statuses/update', params, function (err, data, response) {
	        console.log(data)
	      })
	    }
	  })
	})
};

setTimeout(tweet, 60*1000*10);
tweet();