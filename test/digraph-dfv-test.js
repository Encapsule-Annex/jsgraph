// digraph-dfv-test.js

var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

var DirectedGraph = require('../src/digraph');
var dfs = require('../src/digraph-dfs');
var createDepthFirstSearchContext = dfs.createDepthFirstSearchContext;
var depthFirstVisit = dfs.depthFirstVisit;

var SearchPathRecorder = require('./fixture/dfv-results-recorder');

describe("Depth-first visit algorithm tests", function() {

    var digraph = null;

    describe("Set up and verify directed graph for test", function() {

        before(function() {
            digraph = new DirectedGraph();

            // This example is taken from section 22.3 (p. 605) of "Introduction to Algorithms"
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

        it ("graph should have eigth edges", function() {
            assert.equal(digraph.edgesCount(), 8);
        });

        it ("graph should have two root vertex", function() {
            assert.lengthOf(Object.keys(digraph.rootMap), 2);
        });

        it ("graph should have zero leaf vertices", function() {
            assert.lengthOf(Object.keys(digraph.leafMap), 0);
        });

    });

    describe("DFS context initialization tests", function() {

        var dfsContext = null;
        var initCallbacksReceived = 0;
        var visitorInterface = {
            initializeVertex: function(s, g) {
                initCallbacksReceived++;
            }
        };
                
        before(function() {
            dfsContext = createDepthFirstSearchContext(digraph, visitorInterface);
        });

        it("call to createDepthFirstSearchContext should return an object", function() {
            assert.isObject(dfsContext);
        });

        it("initializeVertex callback snould have been called six times", function() {
            assert.equal(initCallbacksReceived, 6);
        });

        it ("colorMap should contain six elements", function() {
            assert.equal(Object.keys(dfsContext.colorMap).length, 6);
        });

        it ("all colorMap elements should be white", function() {
            for (var vertexId in dfsContext.colorMap) {
                assert.equal(dfsContext.colorMap[vertexId], 0);
            }
        });

        it ("all vertices should be in the undiscovered map", function() {
            assert.equal(Object.keys(dfsContext.undiscoveredMap).length, 6);
        });

    });


    describe("init/discover/finishVertex test", function() {

        var searchContext = null;
        var searchResults = null;
        var digraph = null;

        var expectedResults = '["0 initializeVertex allAlone","1 startVertex allAlone","2 discoverVertex allAlone at time 1","3 finishVertex allAlone at time 2"]';

        before(function() {
            digraph = new DirectedGraph();
            digraph.addVertex("allAlone");
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "allAlone", searchResults.visitorInterface, true);
        });

        it("search should have induced initializeVertex, discoverVertex, and finishVertex callbacks", function() {
            var actualResults = searchResults.toJSON();
            // console.log(JSON.stringify(digraph.vertexMap));
            // console.log(actualResults);
            assert.equal(actualResults, expectedResults);
        });

        it ("search end time should be three", function() {
            assert.equal(searchResults.time, 3);
        });

        it ("search end step should be three", function() {
            assert.equal(searchResults.step, 4);
        });

        it ("allAlone vertex should be painted black", function() {
            assert.equal(searchContext.colorMap.allAlone, 2);
        });

    });


    describe("tree edge test", function() {

        var searchContext = null;
        var searchResults = null;
        var digraph = null;

        var expectedResults = '["0 initializeVertex parent","1 initializeVertex child","2 discoverVertex parent at time 1","3 examineEdge [parent,child]","4 treeEdge [parent,child]","5 discoverVertex child at time 2","6 finishVertex child at time 3","7 finishVertex parent at time 4"]';

        before(function() {
            digraph = new DirectedGraph();
            digraph.addEdge("parent", "child");
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "parent", searchResults.visitorInterface);
        });

        it("search results should have induced a tree edge callback", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, actualResults);
        });

        it ("search end time should be five", function() {
            assert.equal(searchResults.time, 5);
        });

        it ("search end step should be eight", function() {
            assert.equal(searchResults.step, 8);
        });
    });

    describe("back edge test", function() {

        var searchContext = null;
        var searchResults = null;
        var digraph = null;

        var expectedResults = '["0 initializeVertex A","1 initializeVertex B","2 discoverVertex A at time 1","3 examineEdge [A,B]","4 treeEdge [A,B]","5 discoverVertex B at time 2","6 examineEdge [B,A]","7 backEdge [B,A]","8 finishVertex B at time 3","9 finishVertex A at time 4"]';

        before(function() {
            digraph = new DirectedGraph();
            digraph.addEdge("A", "B");
            digraph.addEdge("B", "A");
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "A", searchResults.visitorInterface);
        });

        it("search should have induced a back edge callback", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, actualResults);
        });
    });


    describe("forward edge test", function() {

        var searchContext = null;
        var searchResults = null;
        var digraph = null;

        var expectedResults = '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 discoverVertex A at time 1","4 examineEdge [A,B]","5 examineEdge [A,C]","6 treeEdge [A,B]","7 discoverVertex B at time 2","8 examineEdge [B,C]","9 treeEdge [B,C]","10 discoverVertex C at time 3","11 finishVertex C at time 4","12 finishVertex B at time 5","13 forwardOrCrossEdge [A,C]","14 finishVertex A at time 6"]';

        before(function() {
            digraph = new DirectedGraph();
            digraph.addEdge("A", "B");
            digraph.addEdge("B", "C");
            digraph.addEdge("A", "C");
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "A", searchResults.visitorInterface);
        });

        it("search should have induced a forward edge callback", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, searchResults.toJSON());
        });
    });


    describe("cross edge test", function() {

        var searchContext = null;
        var searchResults = null;
        var digraph = null;

        var expectedResults = '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 discoverVertex A at time 1","4 examineEdge [A,B]","5 treeEdge [A,B]","6 discoverVertex B at time 2","7 finishVertex B at time 3","8 finishVertex A at time 4","9 discoverVertex C at time 5","10 examineEdge [C,B]","11 forwardOrCrossEdge [C,B]","12 finishVertex C at time 6"]';

        before(function() {
            digraph = new DirectedGraph();
            digraph.addEdge("A", "B");
            digraph.addEdge("C", "B");
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "A", searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "C", searchResults.visitorInterface);
        });

        it("search should have induced a cross edge callback", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, actualResults);
        });

    });



    describe("Intro to Algorithms Figure 23.4 path classification test (w/two DFV's)", function() {

        var searchContext = null;
        var searchResults = null;

        var expectedResults = '["0 initializeVertex u","1 initializeVertex v","2 initializeVertex y","3 initializeVertex x","4 initializeVertex w","5 initializeVertex z","6 discoverVertex w at time 1","7 examineEdge [w,y]","8 examineEdge [w,z]","9 treeEdge [w,y]","10 discoverVertex y at time 2","11 examineEdge [y,x]","12 treeEdge [y,x]","13 discoverVertex x at time 3","14 examineEdge [x,v]","15 treeEdge [x,v]","16 discoverVertex v at time 4","17 examineEdge [v,y]","18 backEdge [v,y]","19 finishVertex v at time 5","20 finishVertex x at time 6","21 finishVertex y at time 7","22 treeEdge [w,z]","23 discoverVertex z at time 8","24 examineEdge [z,z]","25 backEdge [z,z]","26 finishVertex z at time 9","27 finishVertex w at time 10","28 discoverVertex u at time 11","29 examineEdge [u,v]","30 forwardOrCrossEdge [u,v]","31 examineEdge [u,x]","32 forwardOrCrossEdge [u,x]","33 finishVertex u at time 12"]';

        before(function() {
            searchResults = new SearchPathRecorder();
            searchContext = createDepthFirstSearchContext(digraph, searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "w", searchResults.visitorInterface);
            depthFirstVisit(digraph, searchContext, "u", searchResults.visitorInterface);
        });

        it ("all edges should be classified and dicover/finish times as per figure 23.4", function() {
            var actualResults = searchResults.toJSON();
            //console.log(JSON.stringify(digraph.vertexMap));
            //console.log(actualResults);
            assert.equal(expectedResults, actualResults);
        });

    });

});

