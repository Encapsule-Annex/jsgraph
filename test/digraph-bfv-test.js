// digraph-bfv-test.js

// external
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;

// internal
var DirectedGraph = require('../src/digraph');
var bfs = require('../src/digraph-bfs');
var createBreadthFirstSearchContext = require('../src/digraph-bfs-context');
var breadthFirstSearch = bfs.breadthFirstSearch;
var SearchPathRecorder = require('./fixture/bfv-results-recorder');


describe("BFV: manual search context create (bad) missing request object.", function() {
    var response = null;

    before(function() {
        response = createBreadthFirstSearchContext();
    });
    it("createBreadthFirstSearchContext call should have returned a response object", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });
    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":"jsgraph.directed.createBreadthFirstSearchContext failed: Expected request to be of type \'[object Object]\' but found \'[object Undefined]\'.","result":null}';
        assert.equal(JSON.stringify(response), expectedResult);
    });
});

describe("BFV: manual search context create (bad) missing digraph object.", function() {
    var response = null;

    before(function() {
        response = createBreadthFirstSearchContext({});
    });
    it("createBreadthFirstSearchContext call should have returned a response object", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });
    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":"jsgraph.directed.createBreadthFirstSearchContext failed: Expected request.digraph to be of type \'[object Object]\' but found \'[object Undefined]\'.","result":null}';
        assert.equal(JSON.stringify(response), expectedResult);
    });
});


describe("BFV: manual search context create (okay).", function() {

    var digraph = null;
    var response = null;
    var searchResults = null;
    var bfvContext = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addVertex('island');
        searchResults = new SearchPathRecorder();
        response = createBreadthFirstSearchContext({ digraph: digraph });
    });

    it("the call to createBreadthFirstSearchContext should have returned a response.", function() {
        assert.isDefined(response);
        assert.isNotNull(response);
        assert.isObject(response);
    });

    it("response JSON should match expected result", function() {
        var expectedResult = '{"error":null,"result":{"searchStatus":"pending","colorMap":{"island":0},"undiscoveredMap":{"island":true}}}';
        assert.equal(JSON.stringify(response), expectedResult);
    });

});

describe("BFV: single vertex", function() {

    var digraph = null;
    var searchPathRecorder = null;
    var bfsContextResponse = null;
    var bfsSearchResponse = null;

    var expectedSearchPath = '["0 initializeVertex island","1 discoverVertex island","2 startVertex island","3 examineVertex island","4 finishVertex island"]';
    var expectedSearchResult = '';
    var actualSearchPath = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addVertex("island");
        searchPathRecorder = new SearchPathRecorder();
        bfsContextResponse = createBreadthFirstSearchContext({ digraph: digraph });
        assert.isNull(bfsContextResponse.error, "response.error should be null");
        
        bfsSearchResponse = breadthFirstSearch(
            {
                digraph: digraph,
                visitor: searchPathRecorder.visitorInterface,
                options: {
                    startVector: "island",
                    signalStart: true,
                    searchContext: bfsContextResponse.result
                }
            }
        );

        // console.log(results.toJSON());
        actualSearchPath = searchPathRecorder.toJSON();
        actualSearchResult = JSON.stringify(bfsSearchResponse);
    });

    it("search path result string should match expected JSON.", function() {
        assert.equal(expectedSearchPath, actualSearchPath);
    });

    it("seach result string should match expected JSON.", function() {
        assert.equal(actualSearchResult, expectedSearchResult);
    });

});

describe("BFV: two disconnected vertices", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex islandA","1 initializeVertex islandB","2 discoverVertex islandA","3 startVertex islandA","4 examineVertex islandA","5 finishVertex islandA"]';
    var actualResults = null;


    before(function() {
        digraph = new DirectedGraph();
        digraph.addVertex("islandA");
        digraph.addVertex("islandB");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "islandA", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});

describe("BFV: two connected vertices", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex islandA","1 initializeVertex islandB","2 discoverVertex islandA","3 startVertex islandA","4 examineVertex islandA","5 examineEdge [islandA,islandB]","6 discoverVertex islandB","7 treeEdge [islandA,islandB]","8 finishVertex islandA","9 examineVertex islandB","10 finishVertex islandB"]';
    var actualResults = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addEdge("islandA", "islandB", { type: "bridge" });
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "islandA", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});


describe("BFV: two connected vertices, plus another diconnected vertex", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex islandA","1 initializeVertex islandB","2 initializeVertex islandC","3 discoverVertex islandA","4 startVertex islandA","5 examineVertex islandA","6 examineEdge [islandA,islandB]","7 discoverVertex islandB","8 treeEdge [islandA,islandB]","9 finishVertex islandA","10 examineVertex islandB","11 finishVertex islandB"]';
    var actualResults = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addEdge("islandA", "islandB", { type: "bridge" });
        digraph.addVertex("islandC");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "islandA", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});


describe("BFV: simple hierarchical topology", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex A","1 initializeVertex AA","2 initializeVertex AAA","3 initializeVertex AAB","4 initializeVertex AAC","5 initializeVertex AB","6 initializeVertex ABA","7 initializeVertex ABB","8 initializeVertex ABC","9 initializeVertex AC","10 initializeVertex ACA","11 initializeVertex ACB","12 initializeVertex ACC","13 discoverVertex A","14 startVertex A","15 examineVertex A","16 examineEdge [A,AA]","17 discoverVertex AA","18 treeEdge [A,AA]","19 examineEdge [A,AB]","20 discoverVertex AB","21 treeEdge [A,AB]","22 examineEdge [A,AC]","23 discoverVertex AC","24 treeEdge [A,AC]","25 finishVertex A","26 examineVertex AA","27 examineEdge [AA,AAA]","28 discoverVertex AAA","29 treeEdge [AA,AAA]","30 examineEdge [AA,AAB]","31 discoverVertex AAB","32 treeEdge [AA,AAB]","33 examineEdge [AA,AAC]","34 discoverVertex AAC","35 treeEdge [AA,AAC]","36 finishVertex AA","37 examineVertex AB","38 examineEdge [AB,ABA]","39 discoverVertex ABA","40 treeEdge [AB,ABA]","41 examineEdge [AB,ABB]","42 discoverVertex ABB","43 treeEdge [AB,ABB]","44 examineEdge [AB,ABC]","45 discoverVertex ABC","46 treeEdge [AB,ABC]","47 finishVertex AB","48 examineVertex AC","49 examineEdge [AC,ACA]","50 discoverVertex ACA","51 treeEdge [AC,ACA]","52 examineEdge [AC,ACB]","53 discoverVertex ACB","54 treeEdge [AC,ACB]","55 examineEdge [AC,ACC]","56 discoverVertex ACC","57 treeEdge [AC,ACC]","58 finishVertex AC","59 examineVertex AAA","60 finishVertex AAA","61 examineVertex AAB","62 finishVertex AAB","63 examineVertex AAC","64 finishVertex AAC","65 examineVertex ABA","66 finishVertex ABA","67 examineVertex ABB","68 finishVertex ABB","69 examineVertex ABC","70 finishVertex ABC","71 examineVertex ACA","72 finishVertex ACA","73 examineVertex ACB","74 finishVertex ACB","75 examineVertex ACC","76 finishVertex ACC"]';
    var actualResults = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addVertex("A");
        digraph.addEdge("A", "AA");
        digraph.addEdge("AA", "AAA");
        digraph.addEdge("AA", "AAB");
        digraph.addEdge("AA", "AAC");
        digraph.addEdge("A", "AB");
        digraph.addEdge("AB", "ABA");
        digraph.addEdge("AB", "ABB");
        digraph.addEdge("AB", "ABC");
        digraph.addEdge("A", "AC");
        digraph.addEdge("AC", "ACA");
        digraph.addEdge("AC", "ACB");
        digraph.addEdge("AC", "ACC");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "A", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});


describe("BFV: simple hierarchy with a back cycle", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex A","1 initializeVertex B","2 discoverVertex A","3 startVertex A","4 examineVertex A","5 examineEdge [A,B]","6 discoverVertex B","7 treeEdge [A,B]","8 finishVertex A","9 examineVertex B","10 examineEdge [B,A]","11 nonTreeEdge [B,A]","12 blackTarget [B,A]","13 finishVertex B"]';
    var actualResults = null;


    before(function() {
        digraph = new DirectedGraph();
        digraph.addEdge("A", "B");
        digraph.addEdge("B", "A");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "A", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});

describe("BFV: branch and then converge gray target tests", function() {

    var digraph = null;
    var results = null;
    var bfvContext = null;

    var expectedResults = '["0 initializeVertex root","1 initializeVertex A","2 initializeVertex B","3 initializeVertex C","4 initializeVertex D","5 initializeVertex E","6 initializeVertex F","7 discoverVertex root","8 startVertex root","9 examineVertex root","10 examineEdge [root,A]","11 discoverVertex A","12 treeEdge [root,A]","13 examineEdge [root,B]","14 discoverVertex B","15 treeEdge [root,B]","16 finishVertex root","17 examineVertex A","18 examineEdge [A,C]","19 discoverVertex C","20 treeEdge [A,C]","21 finishVertex A","22 examineVertex B","23 examineEdge [B,C]","24 nonTreeEdge [B,C]","25 grayTarget [B,C]","26 finishVertex B","27 examineVertex C","28 examineEdge [C,D]","29 discoverVertex D","30 treeEdge [C,D]","31 examineEdge [C,E]","32 discoverVertex E","33 treeEdge [C,E]","34 finishVertex C","35 examineVertex D","36 examineEdge [D,F]","37 discoverVertex F","38 treeEdge [D,F]","39 finishVertex D","40 examineVertex E","41 examineEdge [E,F]","42 nonTreeEdge [E,F]","43 grayTarget [E,F]","44 finishVertex E","45 examineVertex F","46 finishVertex F"]';
    var actualResults = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addEdge("root", "A");
        digraph.addEdge("root", "B");
        digraph.addEdge("A", "C");
        digraph.addEdge("B", "C");
        digraph.addEdge("C", "D");
        digraph.addEdge("C", "E");
        digraph.addEdge("D", "F");
        digraph.addEdge("E", "F");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "root", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});


describe("BFV: branch and then converge black target tests", function() {

    var digraph = null;
    var bfvContext = null;
    var results = null;

    var expectedResults = '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 discoverVertex A","5 startVertex A","6 examineVertex A","7 examineEdge [A,B]","8 discoverVertex B","9 treeEdge [A,B]","10 examineEdge [A,D]","11 discoverVertex D","12 treeEdge [A,D]","13 finishVertex A","14 examineVertex B","15 examineEdge [B,C]","16 discoverVertex C","17 treeEdge [B,C]","18 finishVertex B","19 examineVertex D","20 examineEdge [D,A]","21 nonTreeEdge [D,A]","22 blackTarget [D,A]","23 finishVertex D","24 examineVertex C","25 examineEdge [C,D]","26 nonTreeEdge [C,D]","27 blackTarget [C,D]","28 finishVertex C"]';
    var actualResults = null;

    before(function() {
        digraph = new DirectedGraph();
        digraph.addEdge("A", "B");
        digraph.addEdge("B", "C");
        digraph.addEdge("C", "D");
        digraph.addEdge("A", "D");
        digraph.addEdge("D", "A");
        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "A", results.visitorInterface, true);
        // console.log(results.toJSON());
        actualResults = results.toJSON();
    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});


describe("BFV: hierarchical graph test", function() {

    var digraph = null;
    var bfvContext = null;
    var results = null;

    var expectedResults = '["0 initializeVertex transportation","1 initializeVertex planes","2 initializeVertex trains","3 initializeVertex automobiles","4 initializeVertex Audi","5 initializeVertex TT RS","6 initializeVertex RS 5","7 initializeVertex R8","8 initializeVertex BMW","9 initializeVertex Z4","10 initializeVertex M3","11 initializeVertex Porsche","12 initializeVertex 911 Turbo S","13 initializeVertex 918 Spyder","14 discoverVertex transportation","15 startVertex transportation","16 examineVertex transportation","17 examineEdge [transportation,planes]","18 discoverVertex planes","19 treeEdge [transportation,planes]","20 examineEdge [transportation,trains]","21 discoverVertex trains","22 treeEdge [transportation,trains]","23 examineEdge [transportation,automobiles]","24 discoverVertex automobiles","25 treeEdge [transportation,automobiles]","26 finishVertex transportation","27 examineVertex planes","28 finishVertex planes","29 examineVertex trains","30 finishVertex trains","31 examineVertex automobiles","32 examineEdge [automobiles,Audi]","33 discoverVertex Audi","34 treeEdge [automobiles,Audi]","35 examineEdge [automobiles,BMW]","36 discoverVertex BMW","37 treeEdge [automobiles,BMW]","38 examineEdge [automobiles,Porsche]","39 discoverVertex Porsche","40 treeEdge [automobiles,Porsche]","41 finishVertex automobiles","42 examineVertex Audi","43 examineEdge [Audi,TT RS]","44 discoverVertex TT RS","45 treeEdge [Audi,TT RS]","46 examineEdge [Audi,RS 5]","47 discoverVertex RS 5","48 treeEdge [Audi,RS 5]","49 examineEdge [Audi,R8]","50 discoverVertex R8","51 treeEdge [Audi,R8]","52 finishVertex Audi","53 examineVertex BMW","54 examineEdge [BMW,Z4]","55 discoverVertex Z4","56 treeEdge [BMW,Z4]","57 examineEdge [BMW,M3]","58 discoverVertex M3","59 treeEdge [BMW,M3]","60 finishVertex BMW","61 examineVertex Porsche","62 examineEdge [Porsche,911 Turbo S]","63 discoverVertex 911 Turbo S","64 treeEdge [Porsche,911 Turbo S]","65 examineEdge [Porsche,918 Spyder]","66 discoverVertex 918 Spyder","67 treeEdge [Porsche,918 Spyder]","68 finishVertex Porsche","69 examineVertex TT RS","70 finishVertex TT RS","71 examineVertex RS 5","72 finishVertex RS 5","73 examineVertex R8","74 finishVertex R8","75 examineVertex Z4","76 finishVertex Z4","77 examineVertex M3","78 finishVertex M3","79 examineVertex 911 Turbo S","80 finishVertex 911 Turbo S","81 examineVertex 918 Spyder","82 finishVertex 918 Spyder"]';

    var actualResults = null;

    before(function() {

        digraph = new DirectedGraph();

        digraph.addEdge("transportation", "planes");
        digraph.addEdge("transportation", "trains");
        digraph.addEdge("transportation", "automobiles");

        digraph.addEdge("automobiles", "Audi");
        digraph.addEdge("Audi", "TT RS");
        digraph.addEdge("Audi", "RS 5");
        digraph.addEdge("Audi", "R8");

        digraph.addEdge("automobiles", "BMW");
        digraph.addEdge("BMW", "Z4");
        digraph.addEdge("BMW", "M3");

        digraph.addEdge("automobiles", "Porsche");
        digraph.addEdge("Porsche", "911 Turbo S");
        digraph.addEdge("Porsche", "918 Spyder");

        results = new SearchPathRecorder();
        bfvContext = createBreadthFirstSearchContext(digraph, results.visitorInterface);
        breadthFirstSearch(digraph, bfvContext, "transportation", results.visitorInterface, true);

        // console.log(results.toJSON());
        actualResults = results.toJSON();

    });

    it("search result path string should match expected traversal pattern", function() {
        assert.equal(expectedResults, actualResults);
    });

});
