// test-runner-algorithm-common-visitor.js

var assert = require('chai').assert;
var callVisitorMethod = require('../../src/digraph-algorithm-common-visit');

/*
  request = {
      testName: string
      validConfig: Boolean
      requestObject: {
          algorithm: string
          visitor: object
          method: string
          request: object
      }
      expectedResults: {
          error: string
          result: variant
      }
  }
*/

module.exports = function (testVector_) {

    var testName = "xFT visitor interface function unit test: " + testVector_.testName + ":";
    describe(testName, function() {
        var callbackResponse = null;
        var callbackCalled = false;
        before(function() {

            var userVisitorMethod = testVector_.request.visitor?testVector_.request.visitor[testVector_.request.method]:undefined;
            var facade = {
                watcher: userVisitorMethod?function(request) {
                    callbackCalled = true;
                    return userVisitorMethod(request);
                }:(testVector_.facade?testVector_.facade.watcher:undefined)
            };
            var newRequest = testVector_.request;
            newRequest.visitor = facade;
            newRequest.method = 'watcher';

            var testVisitorInterfaceMethod = function() {
                callbackResponse = callVisitorMethod(newRequest);
            };
            assert.doesNotThrow(testVisitorInterfaceMethod, "xFT VISITOR METHOD REQUEST SHOULD NEVER THROW!");
        });
        it("xFT visitor method should have returned a response object.", function() {
            assert.isDefined(callbackResponse);
            assert.isNotNull(callbackResponse);
        });

        if (testVector_.validConfig) {

            it("The call should not have returned an error.", function() {
                assert.isNull(callbackResponse.error);
            });

            it("The call should have returned a result.", function() {
                assert.isNotNull(callbackResponse.result);
            });

            it("The result should match the expected result.", function() {
                assert.equal(callbackResponse.result, testVector_.expectedResults.result);
            });

            it("The flag indicating if a callback was executed should match expected result.", function() {
                assert.equal(callbackCalled, testVector_.expectedResults.callbackCalled);
            });

        } else {

            it("The call not have returned a result.", function() {
                assert.isNull(callbackResponse.result);
            });

            it("The call should have returned an error.", function() {
                assert.isNotNull(callbackResponse.error);
                assert.isString(callbackResponse.error);
            });

            it("The error should match the expected error string.", function() {
                assert.equal(callbackResponse.error, testVector_.expectedResults.error);
            });

        }

    });
};
