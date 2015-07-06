// test-digraph-algorithm-bft.js

var assert = require('chai').assert;
var DirectedGraph = require('../src/digraph');
var testBFT = require('./fixture/test-runner-digraph-algorithm-bft');


testBFT({ testName: "Missing request", validConfig: false,
           expectedResults: {
               error: 'jsgraph.directed.breadthFirstTraverse algorithm failure: Missing request object ~. Found type \'[object Undefined]\'.',
               result: null,
               path: null
           }});

testBFT({ testName: "Bad request type", validConfig: false,
           request: "No good",
           expectedResults: {
               error: 'jsgraph.directed.breadthFirstTraverse algorithm failure: Missing request object ~. Found type \'[object String]\'.',
               result: null,
               path: null
           }});

testBFT({ testName: "Empty request", validConfig: false,
           request: {}, // also no good
           expectedResults: {
               error: 'jsgraph.directed.breadthFirstTraverse algorithm failure: Missing required DirectedGraph reference ~.digraph. Found type \'[object Undefined]\'.',
               result: null,
               path: null
           }});

(function() {
    var digraph = new DirectedGraph();
    testBFT({ testName: "Empty digraph", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{},"undiscoveredMap":{}}',
                   path: '[]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("lone-wolf-vertex");
    testBFT({ testName: "Single vertex, default starting vertex set", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"lone-wolf-vertex":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex lone-wolf-vertex","1 startVertex lone-wolf-vertex","2 discoverVertex lone-wolf-vertex","3 examineVertex lone-wolf-vertex","4 finishVertex lone-wolf-vertex"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("lone-wolf-vertex");
    testBFT({ testName: "Single vertex, starting vertex not in the graph", validConfig: false,
               request: { digraph: digraph, options: { startVector: 'orange'}},
               expectedResults: {
                   error: 'jsgraph.directed.breadthFirstTraverse algorithm failure: BFT request failed. Vertex \'orange\' not found in specfied directed graph container.',
                   result: '',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("lone-wolf-vertex");
    testBFT({ testName: "Single vertex, starting vertex specified explicity in request", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'lone-wolf-vertex'}},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"lone-wolf-vertex":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex lone-wolf-vertex","1 startVertex lone-wolf-vertex","2 discoverVertex lone-wolf-vertex","3 examineVertex lone-wolf-vertex","4 finishVertex lone-wolf-vertex"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex('islandA');
    digraph.addVertex('islandB');
    testBFT({ testName: "Two disconnected vertices, default starting vertex set", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":2,"islandB":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandA","3 discoverVertex islandA","4 startVertex islandB","5 discoverVertex islandB","6 examineVertex islandA","7 finishVertex islandA","8 examineVertex islandB","9 finishVertex islandB"]'
               }});
})();


(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex('islandA');
    digraph.addVertex('islandB');
    testBFT({ testName: "Two disconnected vertices, starting vertex set set to 'islandA'", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'islandA' }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":2,"islandB":0},"undiscoveredMap":{"islandB":true}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandA","3 discoverVertex islandA","4 examineVertex islandA","5 finishVertex islandA"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex('islandA');
    digraph.addVertex('islandB');
    testBFT({ testName: "Two disconnected vertices, starting vertex set set to 'islandB'", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'islandB' }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":0,"islandB":2},"undiscoveredMap":{"islandA":true}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandB","3 discoverVertex islandB","4 examineVertex islandB","5 finishVertex islandB"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge('islandA', 'islandB', 'bridge');
    testBFT({ testName: "Two connected vertices, default starting vertex set'", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":2,"islandB":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandA","3 discoverVertex islandA","4 examineVertex islandA","5 examineEdge [islandA,islandB]","6 discoverVertex islandB","7 treeEdge [islandA,islandB]","8 finishVertex islandA","9 examineVertex islandB","10 finishVertex islandB"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge('islandA', 'islandB', 'bridge');
    testBFT({ testName: "Two connected vertices, starting vertex set set to 'islandA'", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'islandA' }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":2,"islandB":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandA","3 discoverVertex islandA","4 examineVertex islandA","5 examineEdge [islandA,islandB]","6 discoverVertex islandB","7 treeEdge [islandA,islandB]","8 finishVertex islandA","9 examineVertex islandB","10 finishVertex islandB"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge('islandA', 'islandB', 'bridge');
    testBFT({ testName: "Two connected vertices, starting vertex set set to 'islandB'", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'islandB' }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":0,"islandB":2},"undiscoveredMap":{"islandA":true}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 startVertex islandB","3 discoverVertex islandB","4 examineVertex islandB","5 finishVertex islandB"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge('islandA', 'islandB', 'bridge');
    digraph.addVertex('islandC');
    testBFT({ testName: "Two connected vertices + a disconnected vertex w/default starting vertex set", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"islandA":2,"islandB":2,"islandC":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex islandA","1 initializeVertex islandB","2 initializeVertex islandC","3 startVertex islandA","4 discoverVertex islandA","5 startVertex islandC","6 discoverVertex islandC","7 examineVertex islandA","8 examineEdge [islandA,islandB]","9 discoverVertex islandB","10 treeEdge [islandA,islandB]","11 finishVertex islandA","12 examineVertex islandC","13 finishVertex islandC","14 examineVertex islandB","15 finishVertex islandB"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
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
    testBFT({ testName: "Two connected vertices + a disconnected vertex w/default starting vertex set", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'A' }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"A":2,"AA":2,"AAA":2,"AAB":2,"AAC":2,"AB":2,"ABA":2,"ABB":2,"ABC":2,"AC":2,"ACA":2,"ACB":2,"ACC":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex A","1 initializeVertex AA","2 initializeVertex AAA","3 initializeVertex AAB","4 initializeVertex AAC","5 initializeVertex AB","6 initializeVertex ABA","7 initializeVertex ABB","8 initializeVertex ABC","9 initializeVertex AC","10 initializeVertex ACA","11 initializeVertex ACB","12 initializeVertex ACC","13 startVertex A","14 discoverVertex A","15 examineVertex A","16 examineEdge [A,AA]","17 discoverVertex AA","18 treeEdge [A,AA]","19 examineEdge [A,AB]","20 discoverVertex AB","21 treeEdge [A,AB]","22 examineEdge [A,AC]","23 discoverVertex AC","24 treeEdge [A,AC]","25 finishVertex A","26 examineVertex AA","27 examineEdge [AA,AAA]","28 discoverVertex AAA","29 treeEdge [AA,AAA]","30 examineEdge [AA,AAB]","31 discoverVertex AAB","32 treeEdge [AA,AAB]","33 examineEdge [AA,AAC]","34 discoverVertex AAC","35 treeEdge [AA,AAC]","36 finishVertex AA","37 examineVertex AB","38 examineEdge [AB,ABA]","39 discoverVertex ABA","40 treeEdge [AB,ABA]","41 examineEdge [AB,ABB]","42 discoverVertex ABB","43 treeEdge [AB,ABB]","44 examineEdge [AB,ABC]","45 discoverVertex ABC","46 treeEdge [AB,ABC]","47 finishVertex AB","48 examineVertex AC","49 examineEdge [AC,ACA]","50 discoverVertex ACA","51 treeEdge [AC,ACA]","52 examineEdge [AC,ACB]","53 discoverVertex ACB","54 treeEdge [AC,ACB]","55 examineEdge [AC,ACC]","56 discoverVertex ACC","57 treeEdge [AC,ACC]","58 finishVertex AC","59 examineVertex AAA","60 finishVertex AAA","61 examineVertex AAB","62 finishVertex AAB","63 examineVertex AAC","64 finishVertex AAC","65 examineVertex ABA","66 finishVertex ABA","67 examineVertex ABB","68 finishVertex ABB","69 examineVertex ABC","70 finishVertex ABC","71 examineVertex ACA","72 finishVertex ACA","73 examineVertex ACB","74 finishVertex ACB","75 examineVertex ACC","76 finishVertex ACC"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge("A", "B");
    digraph.addEdge("B", "A");
    testBFT({
        testName: 'Two vertices with a cycle w/default starting vertex set (which is the root vertex set of the digraph)', validConfig: true,
        request: { digraph: digraph },
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"A":0,"B":0},"undiscoveredMap":{"A":true,"B":true}}',
            path: '["0 initializeVertex A","1 initializeVertex B"]'
        }
    });

})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge("A", "B");
    digraph.addEdge("B", "A");
    testBFT({
        testName: "Two vertices with a cycle w/default starting vertex set to 'A'", validConfig: true,
        request: { digraph: digraph, options: { startVector: 'A' }},
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex A","1 initializeVertex B","2 startVertex A","3 discoverVertex A","4 examineVertex A","5 examineEdge [A,B]","6 discoverVertex B","7 treeEdge [A,B]","8 finishVertex A","9 examineVertex B","10 examineEdge [B,A]","11 nonTreeEdge [B,A]","12 blackTarget [B,A]","13 finishVertex B"]'
        }
    });

})();


(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge("root", "A");
    digraph.addEdge("root", "B");
    digraph.addEdge("A", "C");
    digraph.addEdge("B", "C");
    digraph.addEdge("C", "D");
    digraph.addEdge("C", "E");
    digraph.addEdge("D", "F");
    digraph.addEdge("E", "F");
    testBFT({
        testName: "Branch and then converge gray target tests", validConfig: true,
        request: { digraph: digraph },
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"root":2,"A":2,"B":2,"C":2,"D":2,"E":2,"F":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex root","1 initializeVertex A","2 initializeVertex B","3 initializeVertex C","4 initializeVertex D","5 initializeVertex E","6 initializeVertex F","7 startVertex root","8 discoverVertex root","9 examineVertex root","10 examineEdge [root,A]","11 discoverVertex A","12 treeEdge [root,A]","13 examineEdge [root,B]","14 discoverVertex B","15 treeEdge [root,B]","16 finishVertex root","17 examineVertex A","18 examineEdge [A,C]","19 discoverVertex C","20 treeEdge [A,C]","21 finishVertex A","22 examineVertex B","23 examineEdge [B,C]","24 nonTreeEdge [B,C]","25 grayTarget [B,C]","26 finishVertex B","27 examineVertex C","28 examineEdge [C,D]","29 discoverVertex D","30 treeEdge [C,D]","31 examineEdge [C,E]","32 discoverVertex E","33 treeEdge [C,E]","34 finishVertex C","35 examineVertex D","36 examineEdge [D,F]","37 discoverVertex F","38 treeEdge [D,F]","39 finishVertex D","40 examineVertex E","41 examineEdge [E,F]","42 nonTreeEdge [E,F]","43 grayTarget [E,F]","44 finishVertex E","45 examineVertex F","46 finishVertex F"]'
        }
    });
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge("A", "B");
    digraph.addEdge("B", "C");
    digraph.addEdge("C", "D");
    digraph.addEdge("A", "D");
    digraph.addEdge("D", "A");
    testBFT({
        testName: "Branch and then converge black target tests", validConfig: true,
        request: { digraph: digraph, options: { startVector: 'A' }},
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2,"C":2,"D":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 startVertex A","5 discoverVertex A","6 examineVertex A","7 examineEdge [A,B]","8 discoverVertex B","9 treeEdge [A,B]","10 examineEdge [A,D]","11 discoverVertex D","12 treeEdge [A,D]","13 finishVertex A","14 examineVertex B","15 examineEdge [B,C]","16 discoverVertex C","17 treeEdge [B,C]","18 finishVertex B","19 examineVertex D","20 examineEdge [D,A]","21 nonTreeEdge [D,A]","22 blackTarget [D,A]","23 finishVertex D","24 examineVertex C","25 examineEdge [C,D]","26 nonTreeEdge [C,D]","27 blackTarget [C,D]","28 finishVertex C"]'
        }
    });
})();


(function() {
    var digraph = new DirectedGraph();
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
    testBFT({
        testName: "Hierarchy graph test A", validConfig: true,
        request: { digraph: digraph },
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"transportation":2,"planes":2,"trains":2,"automobiles":2,"Audi":2,"TT RS":2,"RS 5":2,"R8":2,"BMW":2,"Z4":2,"M3":2,"Porsche":2,"911 Turbo S":2,"918 Spyder":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex transportation","1 initializeVertex planes","2 initializeVertex trains","3 initializeVertex automobiles","4 initializeVertex Audi","5 initializeVertex TT RS","6 initializeVertex RS 5","7 initializeVertex R8","8 initializeVertex BMW","9 initializeVertex Z4","10 initializeVertex M3","11 initializeVertex Porsche","12 initializeVertex 911 Turbo S","13 initializeVertex 918 Spyder","14 startVertex transportation","15 discoverVertex transportation","16 examineVertex transportation","17 examineEdge [transportation,planes]","18 discoverVertex planes","19 treeEdge [transportation,planes]","20 examineEdge [transportation,trains]","21 discoverVertex trains","22 treeEdge [transportation,trains]","23 examineEdge [transportation,automobiles]","24 discoverVertex automobiles","25 treeEdge [transportation,automobiles]","26 finishVertex transportation","27 examineVertex planes","28 finishVertex planes","29 examineVertex trains","30 finishVertex trains","31 examineVertex automobiles","32 examineEdge [automobiles,Audi]","33 discoverVertex Audi","34 treeEdge [automobiles,Audi]","35 examineEdge [automobiles,BMW]","36 discoverVertex BMW","37 treeEdge [automobiles,BMW]","38 examineEdge [automobiles,Porsche]","39 discoverVertex Porsche","40 treeEdge [automobiles,Porsche]","41 finishVertex automobiles","42 examineVertex Audi","43 examineEdge [Audi,TT RS]","44 discoverVertex TT RS","45 treeEdge [Audi,TT RS]","46 examineEdge [Audi,RS 5]","47 discoverVertex RS 5","48 treeEdge [Audi,RS 5]","49 examineEdge [Audi,R8]","50 discoverVertex R8","51 treeEdge [Audi,R8]","52 finishVertex Audi","53 examineVertex BMW","54 examineEdge [BMW,Z4]","55 discoverVertex Z4","56 treeEdge [BMW,Z4]","57 examineEdge [BMW,M3]","58 discoverVertex M3","59 treeEdge [BMW,M3]","60 finishVertex BMW","61 examineVertex Porsche","62 examineEdge [Porsche,911 Turbo S]","63 discoverVertex 911 Turbo S","64 treeEdge [Porsche,911 Turbo S]","65 examineEdge [Porsche,918 Spyder]","66 discoverVertex 918 Spyder","67 treeEdge [Porsche,918 Spyder]","68 finishVertex Porsche","69 examineVertex TT RS","70 finishVertex TT RS","71 examineVertex RS 5","72 finishVertex RS 5","73 examineVertex R8","74 finishVertex R8","75 examineVertex Z4","76 finishVertex Z4","77 examineVertex M3","78 finishVertex M3","79 examineVertex 911 Turbo S","80 finishVertex 911 Turbo S","81 examineVertex 918 Spyder","82 finishVertex 918 Spyder"]'
        }
    });

    testBFT({
        testName: "Hiearchical graph test B (no start signal)", validConfig: true,
        request: { digraph: digraph, options: { signalStart: false }},
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"transportation":2,"planes":2,"trains":2,"automobiles":2,"Audi":2,"TT RS":2,"RS 5":2,"R8":2,"BMW":2,"Z4":2,"M3":2,"Porsche":2,"911 Turbo S":2,"918 Spyder":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex transportation","1 initializeVertex planes","2 initializeVertex trains","3 initializeVertex automobiles","4 initializeVertex Audi","5 initializeVertex TT RS","6 initializeVertex RS 5","7 initializeVertex R8","8 initializeVertex BMW","9 initializeVertex Z4","10 initializeVertex M3","11 initializeVertex Porsche","12 initializeVertex 911 Turbo S","13 initializeVertex 918 Spyder","14 discoverVertex transportation","15 examineVertex transportation","16 examineEdge [transportation,planes]","17 discoverVertex planes","18 treeEdge [transportation,planes]","19 examineEdge [transportation,trains]","20 discoverVertex trains","21 treeEdge [transportation,trains]","22 examineEdge [transportation,automobiles]","23 discoverVertex automobiles","24 treeEdge [transportation,automobiles]","25 finishVertex transportation","26 examineVertex planes","27 finishVertex planes","28 examineVertex trains","29 finishVertex trains","30 examineVertex automobiles","31 examineEdge [automobiles,Audi]","32 discoverVertex Audi","33 treeEdge [automobiles,Audi]","34 examineEdge [automobiles,BMW]","35 discoverVertex BMW","36 treeEdge [automobiles,BMW]","37 examineEdge [automobiles,Porsche]","38 discoverVertex Porsche","39 treeEdge [automobiles,Porsche]","40 finishVertex automobiles","41 examineVertex Audi","42 examineEdge [Audi,TT RS]","43 discoverVertex TT RS","44 treeEdge [Audi,TT RS]","45 examineEdge [Audi,RS 5]","46 discoverVertex RS 5","47 treeEdge [Audi,RS 5]","48 examineEdge [Audi,R8]","49 discoverVertex R8","50 treeEdge [Audi,R8]","51 finishVertex Audi","52 examineVertex BMW","53 examineEdge [BMW,Z4]","54 discoverVertex Z4","55 treeEdge [BMW,Z4]","56 examineEdge [BMW,M3]","57 discoverVertex M3","58 treeEdge [BMW,M3]","59 finishVertex BMW","60 examineVertex Porsche","61 examineEdge [Porsche,911 Turbo S]","62 discoverVertex 911 Turbo S","63 treeEdge [Porsche,911 Turbo S]","64 examineEdge [Porsche,918 Spyder]","65 discoverVertex 918 Spyder","66 treeEdge [Porsche,918 Spyder]","67 finishVertex Porsche","68 examineVertex TT RS","69 finishVertex TT RS","70 examineVertex RS 5","71 finishVertex RS 5","72 examineVertex R8","73 finishVertex R8","74 examineVertex Z4","75 finishVertex Z4","76 examineVertex M3","77 finishVertex M3","78 examineVertex 911 Turbo S","79 finishVertex 911 Turbo S","80 examineVertex 918 Spyder","81 finishVertex 918 Spyder"]'
        }
    });
    
})();



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
    testBFT({
        testName: "Simple breadth-first search test w/default starting vertex set", validConfig: true,
        request: { digraph: digraph },
        expectedResults: {
            error: '',
            result: '{"searchStatus":"completed","colorMap":{"root1":2,"root2":2,"1A":2,"1B":2,"1C":2,"1D":2,"2A":2,"2B":2,"2C":2,"2D":2,"2E":2},"undiscoveredMap":{}}',
            path: '["0 initializeVertex root1","1 initializeVertex root2","2 initializeVertex 1A","3 initializeVertex 1B","4 initializeVertex 1C","5 initializeVertex 1D","6 initializeVertex 2A","7 initializeVertex 2B","8 initializeVertex 2C","9 initializeVertex 2D","10 initializeVertex 2E","11 startVertex root1","12 discoverVertex root1","13 startVertex root2","14 discoverVertex root2","15 examineVertex root1","16 examineEdge [root1,1A]","17 discoverVertex 1A","18 treeEdge [root1,1A]","19 examineEdge [root1,1B]","20 discoverVertex 1B","21 treeEdge [root1,1B]","22 finishVertex root1","23 examineVertex root2","24 examineEdge [root2,2A]","25 discoverVertex 2A","26 treeEdge [root2,2A]","27 finishVertex root2","28 examineVertex 1A","29 finishVertex 1A","30 examineVertex 1B","31 examineEdge [1B,1C]","32 discoverVertex 1C","33 treeEdge [1B,1C]","34 finishVertex 1B","35 examineVertex 2A","36 examineEdge [2A,2B]","37 discoverVertex 2B","38 treeEdge [2A,2B]","39 finishVertex 2A","40 examineVertex 1C","41 examineEdge [1C,1D]","42 discoverVertex 1D","43 treeEdge [1C,1D]","44 finishVertex 1C","45 examineVertex 2B","46 examineEdge [2B,2C]","47 discoverVertex 2C","48 treeEdge [2B,2C]","49 examineEdge [2B,2D]","50 discoverVertex 2D","51 treeEdge [2B,2D]","52 examineEdge [2B,2E]","53 discoverVertex 2E","54 treeEdge [2B,2E]","55 finishVertex 2B","56 examineVertex 1D","57 finishVertex 1D","58 examineVertex 2C","59 finishVertex 2C","60 examineVertex 2D","61 finishVertex 2D","62 examineVertex 2E","63 examineEdge [2E,1B]","64 nonTreeEdge [2E,1B]","65 blackTarget [2E,1B]","66 finishVertex 2E"]'
        }
    });
})();

(function() {
    describe("Breadth-first traverse termination tests.", function() {

        var digraph = new DirectedGraph({
            vlist: [
                { u: 'A' },
                { u: 'B' },
                { u: 'C' },
                { u: 'D' },
                { u: 'E' }
            ],
            elist: [
                { e: { u: 'A', v: 'B' }},
                { e: { u: 'B', v: 'C' }},
                { e: { u: 'B', v: 'D' }},
                { e: { u: 'D', v: 'A' }},
                { e: { u: 'A', v: 'E' }}
            ]
        });

        testBFT({
            testName: "Breadth-first visit terminate baseline (search not terminated)", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {},
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2,"C":2,"D":2,"E":2},"undiscoveredMap":{}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A","17 examineVertex B","18 examineEdge [B,C]","19 discoverVertex C","20 treeEdge [B,C]","21 examineEdge [B,D]","22 discoverVertex D","23 treeEdge [B,D]","24 finishVertex B","25 examineVertex E","26 finishVertex E","27 examineVertex C","28 finishVertex C","29 examineVertex D","30 examineEdge [D,A]","31 nonTreeEdge [D,A]","32 blackTarget [D,A]","33 finishVertex D"]'
            }
        });


        testBFT({
            testName: "Breadth-first traverse terminate on 'initializeVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    initializeVertex: function(request_) {
                        return (request_.u !== 'D');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":0,"B":0,"C":0,"D":0,"E":0},"undiscoveredMap":{"A":true,"B":true,"C":true,"D":true,"E":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D"]'
            }
        });


        testBFT({
            testName: "Breadth-first traverse terminate on 'startVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    startVertex: function(request_) {
                        return (request_.u !== 'B');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":1,"B":0,"C":0,"D":0,"E":0},"undiscoveredMap":{"B":true,"C":true,"D":true,"E":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B"]'
            }
        });


        testBFT({
            testName: "Breadth-first traverse terminate on 'discoverVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    discoverVertex: function(request_) {
                        return (request_.u !== 'D');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":2,"C":1,"D":0,"E":1},"undiscoveredMap":{}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A","17 examineVertex B","18 examineEdge [B,C]","19 discoverVertex C","20 treeEdge [B,C]","21 examineEdge [B,D]","22 discoverVertex D"]'
            }
        });


        testBFT({
            testName: "Breadth-first traverse terminate on 'examineVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    examineVertex: function(request_) {
                        return (request_.u !== 'D');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":2,"C":2,"D":2,"E":2},"undiscoveredMap":{}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A","17 examineVertex B","18 examineEdge [B,C]","19 discoverVertex C","20 treeEdge [B,C]","21 examineEdge [B,D]","22 discoverVertex D","23 treeEdge [B,D]","24 finishVertex B","25 examineVertex E","26 finishVertex E","27 examineVertex C","28 finishVertex C","29 examineVertex D"]'
            }
        });

        testBFT({
            testName: "Breadth-first traverse terminate on 'examineEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    examineEdge: function(request_) {
                        return (request_.e.v !== 'C');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":2,"C":0,"D":0,"E":1},"undiscoveredMap":{"C":true,"D":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A","17 examineVertex B","18 examineEdge [B,C]"]'
            }
        });

        testBFT({
            testName: "Breadth-first traverse terminate on 'treeEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    treeEdge: function(request_) {
                        return (request_.e.v !== 'E');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":1,"C":0,"D":0,"E":1},"undiscoveredMap":{"C":true,"D":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]"]'
            }
        });

        testBFT({
            testName: "Breadth-first traverse terminate on 'nonTreeEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    nonTreeEdge: function(request_) {
                        return (request_.e.v !== 'B');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":1,"C":0,"D":0,"E":0},"undiscoveredMap":{"C":true,"D":true,"E":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]"]'
            }
        });
        

        testBFT({
            testName: "Breadth-first traverse terminate on 'grayTarget'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    grayTarget: function(request_) {
                        return (request_.e.v !== 'B');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":1,"C":0,"D":0,"E":0},"undiscoveredMap":{"C":true,"D":true,"E":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]"]'
            }
        });
        
        testBFT({
            testName: "Breadth-first traverse terminate on 'blackTarget'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    blackTarget: function(request_) {
                        return (request_.e.v !== 'A');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":2,"C":2,"D":2,"E":2},"undiscoveredMap":{}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A","17 examineVertex B","18 examineEdge [B,C]","19 discoverVertex C","20 treeEdge [B,C]","21 examineEdge [B,D]","22 discoverVertex D","23 treeEdge [B,D]","24 finishVertex B","25 examineVertex E","26 finishVertex E","27 examineVertex C","28 finishVertex C","29 examineVertex D","30 examineEdge [D,A]","31 nonTreeEdge [D,A]","32 blackTarget [D,A]"]'
            }
        });
        
        testBFT({
            testName: "Breadth-first traverse terminate on 'finishVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    finishVertex: function(request_) {
                        return (request_.u !== 'A');
                    }
                },
                options: {
                    startVector: [ 'A', 'B' ]
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"A":2,"B":1,"C":0,"D":0,"E":1},"undiscoveredMap":{"C":true,"D":true}}',
                path: '["0 initializeVertex A","1 initializeVertex B","2 initializeVertex C","3 initializeVertex D","4 initializeVertex E","5 startVertex A","6 discoverVertex A","7 startVertex B","8 discoverVertex B","9 examineVertex A","10 examineEdge [A,B]","11 nonTreeEdge [A,B]","12 grayTarget [A,B]","13 examineEdge [A,E]","14 discoverVertex E","15 treeEdge [A,E]","16 finishVertex A"]'
            }
        });
        


    });
})();
