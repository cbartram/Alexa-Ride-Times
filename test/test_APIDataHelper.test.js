'use strict';

let chai = require('chai');
let expect = chai.expect;
chai.config.includeStack = true;
let APIDataHelper = require('../src/APIDataHelper');


describe('APIDataHelper', function() {

    let rideName, parkName;

    describe('#getRideWaitTime', function() {

        context('with a valid ride name', function() {

            it('returns matching ride wait time', function() {

                rideName= 'Despicable Me Minion Mayhem';
                let waitTime = 100;

                 APIDataHelper.getRideWaitTime(rideName, (id, name, wait) => {
                    expect(id).to.eq(10135);
                    expect(name).to.eq('Despicable Me Minion Mayhem');
                    expect(waitTime).to.eq(100);
                });

            });

        });

    });

    describe('#getParkWaitTimes', function() {

        context('with a valid park name', function() {

            it('returns average park wait time', function() {

                parkName = 'Universal';
                let waitTime = 100;

                APIDataHelper.getAverageParkWaitTime(parkName, (name, wait) => {
                    expect(name).to.eq('Universal Studios');
                    expect(wait).to.eq(waitTime);

                });

            });

        });

    });


    describe('#mapNameToId', function() {

        context('with a valid ride name', function() {

            it('returns ride id', function() {

                rideName = "Spider";

                APIDataHelper.getIDforName(rideName, (id) => {
                   expect(id).to.eq(10831);
                });

            });

        });

    });
});