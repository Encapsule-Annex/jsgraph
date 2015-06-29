// digraph-bfs-test.js

// external
var assert = require('chai').assert;


// internal
var DirectedGraph = require('../src/digraph');
var testBFSV = require('./test-runner-bfsv');

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("root1");
    digraph.addVertex("root2");
    digraph.addEdge("root1", "1A");
    digraph.addEdge("root1", "1B");
    digraph.addEdge("1B", "1C");
    digraph.addEdge("1C", "1D");
    digraph.addEdge("1C", "1D");
    digraph.addEdge("root2", "2A");
    digraph.addEdge("2A", "2B");
    digraph.addEdge("2B", "2C");
    digraph.addEdge("2B", "2D");
    digraph.addEdge("2B", "2E");
    digraph.addEdge("2E", "1B");
    testBFSV({
        testName: "Simple breadth-first search test w/default starting vertex set", validConfig: true,
        request: { digraph: digraph },
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"root1":2,"root2":2,"1A":2,"1B":2,"1C":2,"1D":2,"2A":2,"2B":2,"2C":2,"2D":2,"2E":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex root1","1 initializeVertex root2","2 initializeVertex 1A","3 initializeVertex 1B","4 initializeVertex 1C","5 initializeVertex 1D","6 initializeVertex 2A","7 initializeVertex 2B","8 initializeVertex 2C","9 initializeVertex 2D","10 initializeVertex 2E","11 discoverVertex root1","12 startVertex root1","13 discoverVertex root2","14 startVertex root2","15 examineVertex root1","16 examineEdge [root1,1A]","17 discoverVertex 1A","18 treeEdge [root1,1A]","19 examineEdge [root1,1B]","20 discoverVertex 1B","21 treeEdge [root1,1B]","22 finishVertex root1","23 examineVertex root2","24 examineEdge [root2,2A]","25 discoverVertex 2A","26 treeEdge [root2,2A]","27 finishVertex root2","28 examineVertex 1A","29 finishVertex 1A","30 examineVertex 1B","31 examineEdge [1B,1C]","32 discoverVertex 1C","33 treeEdge [1B,1C]","34 finishVertex 1B","35 examineVertex 2A","36 examineEdge [2A,2B]","37 discoverVertex 2B","38 treeEdge [2A,2B]","39 finishVertex 2A","40 examineVertex 1C","41 examineEdge [1C,1D]","42 discoverVertex 1D","43 treeEdge [1C,1D]","44 finishVertex 1C","45 examineVertex 2B","46 examineEdge [2B,2C]","47 discoverVertex 2C","48 treeEdge [2B,2C]","49 examineEdge [2B,2D]","50 discoverVertex 2D","51 treeEdge [2B,2D]","52 examineEdge [2B,2E]","53 discoverVertex 2E","54 treeEdge [2B,2E]","55 finishVertex 2B","56 examineVertex 1D","57 finishVertex 1D","58 examineVertex 2C","59 finishVertex 2C","60 examineVertex 2D","61 finishVertex 2D","62 examineVertex 2E","63 examineEdge [2E,1B]","64 nonTreeEdge [2E,1B]","65 blackTarget [2E,1B]","66 finishVertex 2E"]'
        }
    });
})();


