// test-runner-digraph-algorithm-bft-request.js
//

var assert = require('chai').assert;
var normalizeBFTRequest = require('../../src/bft/digraph-algorithm-bft-request');

/*
  request = {
      testName: string,
      validConfig: boolean,
      request: object,
      expectedResults: {
          error: string,
          json: string
      }
  }
*/

module.exports = function (testVector_) {

    var testName = "BFT request normalizer unit test: " + testVector_.testName + ":";

    describe(testName, function() {
        var parseResponse = null;
        before(function() {
            var testNormalizeBFTRequest = function() {
                parseResponse = normalizeBFTRequest(testVector_.request);
            };
            assert.doesNotThrow(testNormalizeBFTRequest, "BFT REQUEST NORMALIZER SHOULD NEVER THROW!");
        });
        it("The BFT request normalizer should have returned a response object.", function() {
            assert.isDefined(parseResponse);
            assert.isNotNull(parseResponse);
            assert.isObject(parseResponse);
        });
        if (testVector_.validConfig) {
            describe("The test asserts the request to be valid. Verify the response contains the expected result.", function() {
                it("The request normalizer should not have returned an error.", function() {
                    assert.isNull(parseResponse.error);
                });
                it("The request normalizer should have returned a result.", function() {
                    assert.isNotNull(parseResponse.result);
                    assert.isObject(parseResponse.result);
                });
                it("The result JSON should match the expected control value.", function() {
                    assert.equal(JSON.stringify(parseResponse.result), testVector_.expectedResults.json);
                });
            });
        } else {
            describe("The test asserts the request to be invalid. Verify the response contains the expected error.", function() {
                it("The request normalizer should not have returned a result.", function() {
                    assert.isNull(parseResponse.result);
                });
                it("The request normalizer should have returned an error string.", function() {
                    assert.isNotNull(parseResponse.error);
                    assert.isString(parseResponse.error);
                });
                it("The error string should match the expected control value.", function() {
                    assert.equal(parseResponse.error, testVector_.expectedResults.error);
                });
            });
        }

    });
    
};




