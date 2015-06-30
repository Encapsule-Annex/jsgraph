// Encapsule/jsgraph/test/test-runner-bfsv.js
//

var assert = require('chai').assert;
var bfs = require('../src/digraph-bfs');
var breadthFirstSearch = bfs.breadthFirstSearch;
var SearchPathRecorder = require('./fixture/bfv-results-recorder');

/*
  request = {
      testName: string
      validConfig: boolean
      request: breadthFirstSearch request object
      expectedResults: {
          error: null or string
          result: null or JSON
          path: null or JSON
      }
*/

module.exports = function (testVector_) {

    var testName = "BF* test case: " + testVector_.testName + ":";

    describe(testName, function() {

        var searchResponse = null;
        var searchPathRecorder = null;

        before(function() {
            searchPathRecorder = new SearchPathRecorder(testVector_.visitor);
            var bfsRequest = testVector_.request;
            if (bfsRequest) {
                bfsRequest.visitor = searchPathRecorder.visitorInterface;
            }
            var executeRequestedBFS = function() {
                searchResponse = breadthFirstSearch(bfsRequest);
            };
            assert.doesNotThrow(executeRequestedBFS);
        });

        it("The call to BFS should have returned a response object.", function() {
            assert.isDefined(searchResponse);
            assert.isNotNull(searchResponse);
            assert.isObject(searchResponse);
            assert.property(searchResponse, 'error');
            assert.property(searchResponse, 'result');
        });

        if (testVector_.validConfig) {

            describe("Test case is expected to pass. analyze the search results and recorded traversal path.", function() {
                it("searchResponse.error should be null.", function() {
                    assert.isNull(searchResponse.error);
                });

                it("searchResponse.result should match expected search response JSON.", function() {
                    assert.equal(JSON.stringify(searchResponse.result), testVector_.expectedResults.result);
                });

                it("actualSearchPath should match the expected search path JSON.", function() {
                    assert.equal(searchPathRecorder.toJSON(), testVector_.expectedResults.path);
                });
            });

        } else {

            describe("Test case is expected to fail. ensure the response error string is as expected.", function() {

                it("searchResponse.result should be null.", function() {
                    assert.isNull(searchResponse.result);
                });

                it("searchResponse.error should be a non-null string.", function() {
                    assert.isDefined(searchResponse.error);
                    assert.isNotNull(searchResponse.error);
                    assert.isString(searchResponse.error);
                });

                it("searchResponse.error string should match expected error string.", function() {
                    assert.equal(searchResponse.error, testVector_.expectedResults.error);
                });
                
            });

        }

    });
    
};
