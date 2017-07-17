'use strict';

module.change_code = 1;

//https://developer.amazon.com/blogs/post/Tx1BIPOTYRL82PV/Big-Nerd-Ranch-Series-Developing-Alexa-Skills-Locally-with-Node-js-Implementing

let _ = require('lodash');
let Alexa = require('alexa-app');

let app = new Alexa.app('ride-times');
let API = require('./APIDataHelper');

let intentSchema = {
    'slots': {
        'rideName': 'List_of_Rides',
        'parkName': 'List_of_Parks'
    },

    'utterances':  [
        "Ride Times whats the average wait time in {parkName}",
        "Rides Times whats the wait time for {rideName}",
        "Ride Times what are the lines like for {rideName}",
        "Ride Times how are the wait times at {parkName}",
        "Ride Times what are the lines like at {parkName}",
        "Ride Times what are the ride wait times for {parkName}",
        "Ride Times how are the lines at {parkName}",
        "Ride Times what are the {parkName} wait times like"
    ]
};

app.intent('rideTimes', intentSchema, (req, res) =>
    {
        //Get the slot
        let rideName = req.slot('rideName');
        let parkName = req.slot('parkName');

        let rePrompt = 'Say a Ride name to get its current wait time.';

        if (_.isEmpty(rideName)) {

            let prompt = 'I didnt catch the rides name...Try saying the ride name again';

            res.say(prompt).reprompt(rePrompt).shouldEndSession(false);

            return true;

        } else {
            //We have the information
            API.getRideWaitTime(rideName, (id, name, wait) => {
                res.say(`The wait time for ${name} is currently ${wait} minutes`).send();
            });

            return false;

        }
    }
);

app.launch(function(req, res) {

    //Alexa's first prompt
    let prompt = 'Welcome to Ride Times, you can ask me things like what are the wait times at Universal, or Whats the line like for The Incredible Hulk....How can I help you today';

    res.say(prompt).reprompt(prompt).shouldEndSession(false);

});


module.exports = app;