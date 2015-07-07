// test-digraph-algorithm-common-context.js

// external
var assert = require('chai').assert;

// internal
var DirectedGraph = require('../src/digraph').DirectedGraph;
var createTraverseContext = require('../src/digraph-algorithm-common-context');


describe("Traverse context: missing request object.", function() {
    var response = null;

    before(function() {
        response = createTraverseContext();
    });
    it("createTraverseContext call should have returned a response object", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });
    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":"jsgraph.directed.createTraverseContext failed: Expected request to be of type \'[object Object]\' but found \'[object Undefined]\'.","result":null}';
        assert.equal(JSON.stringify(response), expectedResult);
    });
});

describe("Traverse context: missing digraph object.", function() {
    var response = null;

    before(function() {
        response = createTraverseContext({});
    });
    it("createTraverseContext call should have returned a response object", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });
    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":"jsgraph.directed.createTraverseContext failed: Expected request.digraph to be of type \'[object Object]\' but found \'[object Undefined]\'.","result":null}';
        assert.equal(JSON.stringify(response), expectedResult);
    });
});


describe("Traverse context: constructed for a specific digraph", function() {

    var digraph = null;
    var response = null;
    var searchResults = null;
    var bfvContext = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addVertex('island');
        response = createTraverseContext({ digraph: digraph });
    });

    it("the call to createTraverseContext should have returned a response.", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });

    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":null,"result":{"searchStatus":"pending","colorMap":{"island":0},"undiscoveredMap":{"island":true}}}';
        assert.equal(JSON.stringify(response), expectedResult);
    });

});


