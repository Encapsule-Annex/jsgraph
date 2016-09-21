// test-runner-digraph-in-params.js
//

var assert = require('chai').assert;

var testModule = require('../module-under-test');
var digraphInParams = testModule('arc_core_digraph_in_params');

/*
  request = {
      testName: string,
      validatorFunction: string, // method name in digraphInParams export object
      validConfig: boolean,
      request: object,
      expectedResults: {
          error: string,
          result: string
      }
  }
*/

module.exports = function (testVector_) {

    var testName = "DirectedGraph in-parameter validator `" + testVector_.validatorFunction + "' test: " + testVector_.testName + ":";

    describe(testName, function() {
        var response = null;
        before(function() {
            var testValidator = function() {
                response = digraphInParams[testVector_.validatorFunction](testVector_.request);
            };
            assert.doesNotThrow(testValidator, "DirectedGraph in-parameter validator '" + testVector_.validatorFunction + "' SHOULD NEVER THROW!");
        });
        it("The '" + testVector_.validatorFunction + "' function should have returned a response object.", function() {
            assert.isDefined(response);
            assert.isNotNull(response);
            assert.isObject(response);
        });
        if (testVector_.validConfig) {
            describe("The test asserts the request to be valid. Verify the response contains the expected result.", function() {
                it("The request normalizer should not have returned an error.", function() {
                    assert.isNull(response.error);
                });
                it("The request normalizer should have returned a result.", function() {
                    assert.isNotNull(response.result);
                    assert.isBoolean(response.result);
                });
                it("The result JSON should match the expected control value.", function() {
                    assert.equal(response.result, testVector_.expectedResults.result);
                });
            });
        } else {
            describe("The test asserts the request to be invalid. Verify the response contains the expected error.", function() {
                it("The request normalizer should not have returned a result.", function() {
                    assert.isFalse(response.result);
                });
                it("The request normalizer should have returned an error string.", function() {
                    assert.isNotNull(response.error);
                    assert.isString(response.error);
                });
                it("The error string should match the expected control value.", function() {
                    assert.equal(response.error, testVector_.expectedResults.error);
                });
            });
        }

    });
    
};




