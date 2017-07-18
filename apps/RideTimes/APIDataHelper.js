/**
 * Created by Christian Bartram on 7/17/17.
 */
const rp = require('request-promise');
const BASE_URL = 'http://wait-smart.herokuapp.com/api/v1';

module.exports = {
    /**
     * Finds the Average Wait time for a park given the parks name
     * @param park
     */
    getAverageParkWaitTime(park) {
        let options = {
            method: 'GET',
            uri: `${BASE_URL}/park/${park}`,
            resolveWithFullResponse: true,
            json: true
        };

       return rp(options);
    },

    /**
     * Maps a Ride Name to its ID
     * @param name
     */
    getRideWaitTime(name) {
        let options = {
            method: 'GET',
            uri: `${BASE_URL}/map/name/${name}`,
            resolveWithFullResponse: true,
            json: true
        };
        return rp(options);
    }
};