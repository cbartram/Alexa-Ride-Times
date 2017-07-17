/**
 * Created by Christian Bartram on 7/17/17.
 */
const _ = require('lodash');

const rp = require('request-promise');

const BASE_URL = 'http://wait-smart.herokuapp.com/api/v1';

/**
 * Finds the Ride Wait time given the rides name
 * @param rideName
 * @param callback
 */
export function getRideWaitTime(rideName, callback) {
    getIDforName(rideName, (data) => {
        //Data is the ID being returned from the ID -> name callback
        let options = {
            method: 'GET',
            uri: `${BASE_URL}/fetch/${data}`,
            resolveWithFullResponse: true,
            json: true
        };

        rp(options).then((res) => {
            callback(res.body.id, res.body.name, res.body.wait_time);
        });
    });
}

/**
 * Finds the Average Wait time for a park given the parks name
 * @param park
 * @param callback
 */
export function getAverageParkWaitTime (park, callback) {
    let options = {
        method: 'GET',
        uri: `${BASE_URL}/park/${park}`,
        resolveWithFullResponse: true,
        json: true
    };
    rp(options).then((res) => {
        callback(res.body.park, res.body.wait);
    });
}

/**
 * Maps a Ride Name to its ID
 * @param name
 * @param callback
 */
export function getIDforName(name, callback) {
    let options = {
        method: 'GET',
        uri: `${BASE_URL}/map/name/${name}`,
        resolveWithFullResponse: true,
        json: true
    };
    rp(options).then((res) => {
         callback(res.body[0].id);
    });
}