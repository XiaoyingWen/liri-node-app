//grab the data from keys.js. 
//Then store the keys in a variable.
//TODO
//var twitterkeys = require('./keys');
//console.log(twitterkeys.consumer_key);

var command = process.argv[2];
var param;
if(command === "movie-this" || command === "spotify-this-song"){
	param = process.argv[3];
}
//console.log("do this: " + command + " " + param + ":");

//take in one of the following commands:
switch (command) {
  case "my-tweets":
  	getMyTweets();
    break;
  case "spotify-this-song":
  	console.log(param);
  	getSong(param);
  	break;
  case "movie-this":
    getMovie(param);
    break;
  case "do-what-it-says":
  	doWhatItSays();
    break;
}

// my-tweets
// show your last 20 tweets and when they 
// were created at in your terminal/bash window
function getMyTweets(){
	var Twitter = require('twitter');
	 
	var client = new Twitter({
	  consumer_key: 'GKnV1PJLsPzQlmTrd9mrL0Ucc',
	  consumer_secret: '2wpLfgaA8QLmwdBqHrfUXOPtopAmZBpnSrdFJHojEoEbYF5mDP',
	  access_token_key: '872768044371763204-NiO31WsnIMZOlTRQTWBf28zasm1dYM8',
	  access_token_secret: 'djsyUF11IHDsWUHrmRa1MShhLCRHUo6KBMAFRcYDjQFf4',
	});
	 
	var params = {count: '20'};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	  	console.log("My tweets:");
	  	tweets.forEach(function(tweet){
	  		console.log(tweet.created_at + ": " + tweet.text);
	  	});
	  }
	});
}


// spotify-this-song '<song name here>'
// This will show the following information about 
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// if no song is provided then your program will default to "The Sign" by Ace of Base
//Note the song name needs to be given with double quotes if it contains space
//e.g. Twinkle, Twinkle, Little Star
function getSong(name){
	var Spotify = require('node-spotify-api');
	var lookupSongName = name || "The Sign";
	var spotify = new Spotify({
	  id: 'ee61dd3494ad4f71b00bed802a988cba',
	  secret: 'f4451a1cb55a4550a836a6ea0b798a97'
	});
	 
	spotify.search({ type: 'track', query: lookupSongName }, function(err, data) {
	  if (err) {
	    return console.log('Error occurred: ' + err);
	  } else {
		var songs = data.tracks.items;
		songs.forEach(function (item){
			if(item.name.toLowerCase() === lookupSongName.toLowerCase()) {
				var artistsStr = '';
				item.artists.forEach(function(artist){
					artistsStr+= artist.name + ' ';
				});
				console.log("Artist(s): " + artistsStr);
				console.log("Song name: " + item.name);
				console.log("Preview link: " + item.preview_url);
				console.log("Album: " + item.album.name);
				console.log("---------------------------------");
			}
		});
	  }
	});
}

// movie-this '<movie name here>'
// output the following information to your terminal/bash window:
//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
//   * Rotten Tomatoes URL.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody'
function getMovie(name){
	var request = require("request");
	var lookupMovieName = name || "Mr. Nobody";
	request('http://www.omdbapi.com/?t='
		+ lookupMovieName + '"&type=movie&plot=short&r=json&i=tt3896198&apikey=40e9cece', function(error, response, body) {

	  // If the request was successful...
	  if (!error && response.statusCode === 200) {
	    // Then log the information from the site
		var movie = JSON.parse(body);
		console.log("Title: " + movie.Title + '\n'
			+ "Year: " + movie.Year + '\n'
			+ "IMDB Rating: " + movie.imdbRating + '\n'
			+ "Country: " + movie.Country + '\n'
			+ "Language: " + movie.Language + '\n'
			+ "Plot: " + movie.Plot + '\n'
			+ "Actors: " + movie.Actors + '\n'
			+ "Website: " + movie.Website + '\n'
		);
	  } else {
	  	console.log(error);
	  }
	});
}

// do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt 
// and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
//TODO fix the issue that the command does not work
/*var fs  = require("fs");
var array = fs.readFileSync('./random.txt').toString().split('\n');
var n = array[0].indexOf(",");
var command = "";
var param;
if (n === -1) {
	command = array[0];
} else {
	command = array[0].substring(0, n);
	param = array[0].substring(n+1);
}
getSong(param);
console.log(command + " " + param + ":");
switch (command) {
  case "movie-this":
    getMovie(param);
    break;
  case "spotify-this-song":
  	console.log(param);
  	getSong(param);
  	break;
  case "my-tweets":
  	getMyTweets();
    break;
}
*/
function doWhatItSays(){
	fs = require("fs");
	fs.readFile('./random.txt', function (err, data) {
      if (err) {
      	console.log(err);
      	return;
      }

      // Data is a buffer that we need to convert to a string
      var lines = data.toString('utf-8').split("\n");
      if(lines.length > 0){
			var n = lines[0].indexOf(",");
			if (n === -1) {
				//there is no , in the first line
				command = lines[0];
			} else {
				command = lines[0].substring(0, n);
				param = lines[0].substring(n+1);
				console.log("Read the command: " + command + " " + param);
				switch (command) {
				  case "my-tweets":
				  	getMyTweets();
				    break;
				  case "spotify-this-song":
				  	getSong(param);
				  	break;
				  case "movie-this":
				    getMovie(param);
				    break;
				}
			}
      }
    });
}

// BONUS -TODO
// In addition to logging the data to your terminal/bash window, output the 
// data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.
// Do not overwrite your file each time you run a command.

