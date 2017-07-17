'use strict';

module.change_code = 1;

let _ = require('lodash');
let Alexa = require('alexa-app');

let app = new Alexa.app('ride-times');
let API = require('./APIDataHelper');

app.launch(function(req, res) {

    //Alexa's first prompt
    let prompt = 'Welcome to Ride Times, you can ask me things like what are the wait times at Universal, or Whats the line like for The Incredible Hulk....How can I help you today';

    res.say(prompt).reprompt(prompt).shouldEndSession(false);

});


module.exports = app;