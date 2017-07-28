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

let rideTypeSchema = {
    "slots": {
        "rideName": "List_of_Parks"
    },

    "utterances": [
        "what kind of ride is {rideName}",
        "what type of ride is {rideName}",
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

/**
 * Handles Alexa Help Intent
 */
app.intent("AMAZON.HelpIntent", helpSchema, (req, res) => {
    //Alexa's Help Prompt
    let prompt = 'Just ask for the ride or park you want information about. You can ask me things like what are the wait times at Universal, or Whats the wait time like for Harry Potter';

    res.say(prompt).shouldEndSession(false);
});


/**
 * Handles Alexa Cancel Intent
 */
app.intent("AMAZON.CancelIntent", cancelSchema, (req, res) => {
    //Alexa's Cancel Prompt
    let prompt = 'No problem Request cancelled!';

    console.log('App Closed');

    res.say(prompt).shouldEndSession(true);
});

/**
 * Handles Alexa Stop Intent
 */
app.intent("AMAZON.StopIntent", stopSchema, (req, res) => {
    //Alexa's stop Prompt
    let prompt = 'Thank you for using Ride Times!';

    console.log('App Closed');

    res.say(prompt).shouldEndSession(true);
});


/**
 * Handles Alexa Ride Type Intent
 */
app.intent("RideType", rideTypeSchema, (req, res) => {

    let prompt = "";
    let rePrompt = "You can ask things like what kind of ride is Reign of Kong";
    const rideName = req.slot('rideName');

    if(_.isEmpty(rideName)) {
        prompt = "I didnt catch the rides name...Try again!";

        console.log("Could not parse ride name for RideType intent: " + rideName);

        res.say(prompt).reprompt(rePrompt).shouldEndSession(false);
    } else {
        //Parsed ride name successfully
        return API.getRideWaitTime(rideName).then(function(data) {
           if(data.body.length === 0) {
               console.log('Ride Name Parsed But could not lookup for RideType intent:  ' + rideName);
               console.log(data);

               res.say(`I couldn\'t find a ride with the name ${rideName} try asking for a unique word or phrase in the rides name`).shouldEndSession(false);
           }  else {
               res.say(`${rideName}'s is a ${data.body[0].ride_type} ride`).shouldEndSession(false);
           }
        });
    }

});

/**
 * Handles finding the Ride Wait Times
 */
app.intent("RideWaitTimes", rideSchema, (req, res) => {
        //Get the slot
        let rideName = req.slot('rideName');

        const rePrompt = "You can say the Incredible Hulk or Men in Black to get the rides current wait time.";

        if (_.isEmpty(rideName)) {

            let prompt = "I didnt catch the rides name... Try again!";
            console.log('Could Not parse rideName (slurred speech) ' + rideName);

            res.say(prompt).reprompt(rePrompt).shouldEndSession(false);

            return true;
        } else {
            //We have the information
           return API.getRideWaitTime(rideName).then(function(data) {
               if(data.body.length === 0) {

                   console.log('Ride Name Parsed But could not lookup:  ' + rideName);

                   res.say(`I couldn\'t find a ride with the name ${rideName} try asking for a unique word or phrase in the rides name`).shouldEndSession(false);
               } else {
                   //The ride is down for maintenance
                   if(data.body[0].wait_time < 0) {
                       res.say(`${data.body[0].name} is currently down for maintenance`).shouldEndSession(false);
                   } else {
                       console.log("Ride name successfully parsed and fetched");
                       res.say("The wait time for " + data.body[0].name + " s currently " + data.body[0].wait_time + " minutes").shouldEndSession(false);
                   }
               }
           });

        }
    }
);


/**
 * Handles finding the average park wait times
 */
app.intent('ParkWaitTimes', parkSchema, (req, res) => {
    let parkName = req.slot('parkName');
    const rePrompt = "You can say Universal or Islands of Adventure to get the average park wait time.";

    //Could not parse the intent
    if (_.isEmpty(parkName)) {
        let prompt = "I didnt catch the parks name...Try again";

        console.log("Could not parse the parks name (slurred speech): " + parkName);

        res.say(prompt).reprompt(rePrompt).shouldEndSession(false);

        return true;
    } else {
        //We've got the information we need
        return API.getAverageParkWaitTime(parkName).then(function(data) {
            if(data.body.length === 0) {

                console.log("Parsed park name but could not fetch data: " + parkName);

                res.say(`I couldn\'t find the park with the name ${parkName} try asking for a unique word or phrase in the park name`).shouldEndSession(false)
            } else {

                console.log('Park Name Success!');

                res.say("The average wait time for " + data.body.park + " theme park is currently " + data.body.wait + " minutes").shouldEndSession(false);
            }
        });
    }
});

app.error = function(exception, request, response) {
    console.log(request);
    console.log(response);
    console.log(exception);
    response.say("Something went Wrong  tryind to find you the wait times try again!").shouldEndSession(false);
};

app.launch(function(req, res) {

    //Alexa's first prompt
    let prompt = 'Welcome to Ride Times, you can ask me things like what are the wait times at Islands of Adventure, or Whats the line like for The Incredible Hulk....How can I help you today';

    res.say(prompt).reprompt(prompt).shouldEndSession(false);

});


module.exports = app;