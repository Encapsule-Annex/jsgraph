
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var DirectedGraph = require('../src/digraph');
var dfs = require('../src/digraph-dfs');
var createDepthFirstSearchContext = dfs.createDepthFirstSearchContext;
var depthFirstVisit = dfs.depthFirstVisit;
var depthFirstSearch = dfs.depthFirstSearch;

var SearchPathRecorder = require('./fixture/dfv-results-recorder');


describe("Depth-first search algorithm tests", function() {

    var digraph = null;

    before(function() {

        digraph = new DirectedGraph();
        // This example is taken from section 22.3 (p. 605)
        // of "Introduction to Algorithms"

        digraph.addEdge("u", "v");
        digraph.addEdge("v", "y");
        digraph.addEdge("y", "x");
        digraph.addEdge("x", "v");
        digraph.addEdge("u", "x");
        digraph.addEdge("w", "y");
        digraph.addEdge("w", "z");
        digraph.addEdge("z", "z");

    });

    it ("graph should have six vertices", function() {
        assert.lengthOf(Object.keys(digraph.vertexMap), 6);
        assert.equal(digraph.verticesCount(), 6);
    });

    it ("graph should have eight edges", function() {
        assert.equal(digraph.edgesCount(), 8);
    });

    it ("graph should have two root vertex", function() {
        assert.lengthOf(Object.keys(digraph.rootMap), 2);
    });

    it ("graph should have zero leaf vertices", function() {
        assert.lengthOf(Object.keys(digraph.leafMap), 0);
    });

    describe("Intro to Algorithms Figure 23.4 path classification example test", function() {

        var searchContext = null;
        var searchResults = null;

        var expectedResults = '["0 initializeVertex u","1 initializeVertex v","2 initializeVertex y","3 initializeVertex x","4 initializeVertex w","5 initializeVertex z","6 initializeVertex u","7 initializeVertex v","8 initializeVertex y","9 initializeVertex x","10 initializeVertex w","11 initializeVertex z","12 startVertex u","13 discoverVertex u at time 1","14 examineEdge [u,v]","15 examineEdge [u,x]","16 treeEdge [u,v]","17 discoverVertex v at time 2","18 examineEdge [v,y]","19 treeEdge [v,y]","20 discoverVertex y at time 3","21 examineEdge [y,x]","22 treeEdge [y,x]","23 discoverVertex x at time 4","24 examineEdge [x,v]","25 backEdge [x,v]","26 finishVertex x at time 5","27 finishVertex y at time 6","28 finishVertex v at time 7","29 forwardOrCrossEdge [u,x]","30 finishVertex u at time 8","31 discoverVertex w at time 9","32 examineEdge [w,y]","33 forwardOrCrossEdge [w,y]","34 examineEdge [w,z]","35 treeEdge [w,z]","36 discoverVertex z at time 10","37 examineEdge [z,z]","38 backEdge [z,z]","39 finishVertex z at time 11","40 finishVertex w at time 12"]';

        before(function() {
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstSearch(digraph, searchResults.visitorInterface, searchContext);

        });

        it ("all edges should be classified and dicover/finish times as per figure 23.4", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, actualResults);
        });

    });

});

