'use strict';

module.change_code = 1;

let _ = require('lodash');
let Alexa = require('alexa-app');

let app = new Alexa.app('ride-times');
let API = require('./APIDataHelper');

let rideSchema = {
    "slots": {
        "rideName": "List_of_Rides",
    },

    "utterances":  [
        "whats the wait time for {rideName}",
        "what are the lines like for {rideName}",
        "what are the lines looking like for {rideName}",
        "how are the lines for {rideName}",
        "what are the ride wait times for {rideName}",
    ]
};

let parkSchema = {
    "slots": {
        "parkName": "List_of_Parks"
    },

    "utterances": [
        "how are the wait times at {parkName}",
        "what are the lines like at {parkName}",
        "what are the ride wait times for {parkName}",
        "how are the lines at {parkName}",
        "whats the average wait time in {parkName}",
        "what are the {parkName} wait times like"
    ]
};

let helpSchema = {
    "slots": {},
    "utterances": [
        "help",
        "how do I use this",
        "I need help",
    ]
};

let cancelSchema = {
    "slots": {},
    "utterances": [
        "cancel",
        "pause",
    ]
};

let stopSchema = {
    "slots": {},
    "utterances": [
        "stop",
        "finish",
        "end"
    ]
};

app.intent("AMAZON.HelpIntent", helpSchema, (req, res) => {
    //Alexa's Help Prompt
    let prompt = 'Just ask for the ride or park you want information about. You can ask me things like what are the wait times at Universal, or Whats the wait time like for Harry Potter';

    res.say(prompt).shouldEndSession(false);
});

app.intent("AMAZON.CancelIntent", cancelSchema, (req, res) => {
    //Alexa's Cancel Prompt
    let prompt = 'No problem Request cancelled!';

    res.say(prompt).shouldEndSession(false);
});

app.intent("AMAZON.StopIntent", stopSchema, (req, res) => {
    //Alexa's stop Prompt
    let prompt = 'Thank you for using Ride Times!';

    res.say(prompt).shouldEndSession(true);
});


app.intent("RideWaitTimes", rideSchema, (req, res) => {
        //Get the slot
        let rideName = req.slot('rideName');

        const rePrompt = "You can say the Incredible Hulk or Men in Black to get the rides current wait time.";

        if (_.isEmpty(rideName)) {

            let prompt = "I didnt catch the rides name";

            res.say(prompt).reprompt(rePrompt).shouldEndSession(false);

            return true;
        } else {
            //We have the information
           return API.getRideWaitTime(rideName).then(function(data) {
               res.say("The wait time for " + data.body[0].name + " s currently " + data.body[0].wait_time + " minutes");
           });

        }
    }
);

app.intent('ParkWaitTimes', parkSchema, (req, res) => {
    let parkName = req.slot('parkName');
    const rePrompt = "You can say Universal or Islands of Adventure to get the average park wait time.";

    //Could not parse the intent
    if (_.isEmpty(parkName)) {
        let prompt = "I didnt catch the parks name";

        res.say(prompt).reprompt(rePrompt).shouldEndSession(false);

        return true;
    } else {
        //We've got the information we need
        return API.getAverageParkWaitTime(parkName).then(function(data) {
            res.say("The average wait time for " + data.body.park + " theme park is currently " + data.body.wait + " minutes");
        });
    }
});

app.launch(function(req, res) {

    //Alexa's first prompt
    let prompt = 'Welcome to Ride Times, you can ask me things like what are the wait times at Universal, or Whats the line like for The Incredible Hulk....How can I help you today';

    res.say(prompt).reprompt(prompt).shouldEndSession(false);

});


module.exports = app;