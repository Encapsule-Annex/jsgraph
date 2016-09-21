// test-runner-create-digraph.js

/*
  request = {
      testName: string
      validConfig: boolean,
      request: object
      expectedResults: {
          error:
          result:
      }
*/

var assert = require('chai').assert;
var testModule = require('../module-under-test');
var DirectedGraphContainer = testModule('arc_core_digraph');
var createDirectedGraph = DirectedGraphContainer.createDirectedGraph;
var DirectedGraph = DirectedGraphContainer.DirectedGraph;
assert.isDefined(createDirectedGraph);
assert.isNotNull(createDirectedGraph);
assert.isFunction(createDirectedGraph);

module.exports = function (testVector_) {

    var testName = "jsgraph.createDirectedGraph test: " + testVector_.testName;

    describe(testName, function() {

        var response = null;

        before(function() {
            var testCreateDirectedGraph = function() {
                response = createDirectedGraph(testVector_.request);
            };
            assert.doesNotThrow(testCreateDirectedGraph, "jsgraph.createDirectedGraph SHOULD NEVER THROW!");
        });

        it("the call should have returned a response object.", function() {
            assert.isNotNull(response);
            assert.isObject(response);
            assert.property(response, 'error');
            assert.property(response, 'result');
        });

        if (testVector_.validConfig) {

            it("the call response should not indicate an error.", function() {
                assert.isNull(response.error);
            });

            it("the call response should have returned a DirectedGraph container object.", function() {
                assert.isNotNull(response.result);
                assert.instanceOf(response.result, DirectedGraph);
            });

            it("the returned graph JSON should match expected control value.", function() {
                assert.instanceOf(response.result, DirectedGraph);
                assert.equal(response.result.stringify(), testVector_.expectedResults.result);
            });

        } else {

            it("the call response should not have returned a result.", function() {
                assert.isNull(response.result);
            });

            it("the call response error should match the expected error string.", function() {
                assert.equal(response.error, testVector_.expectedResults.error);
            });

        }

    });
};
