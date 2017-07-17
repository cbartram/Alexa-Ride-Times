'use strict';

let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
let expect = chai.expect;
chai.config.includeStack = true;
let APIDataHelper = require('../src/APIDataHelper');


describe('APIDataHelper', function() {

    let rideName;

    describe('#getRideWaitTime', function() {

        context('with a valid ride name', function() {

            it('returns matching ride wait time', function() {

                rideName= 'Despicable Me Minion Mayhem';

                let value = APIDataHelper.getRideWaitTime(rideName);


                return expect(value).to.eq({id: 10135, name: rideName, wait: 110});

            });

        });

    });
});