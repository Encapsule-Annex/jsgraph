// Encapsule/jsgraph/test/test-digraph-algorithm-dft.js


var assert = require('chai').assert;
var DirectedGraph = require('../src/digraph').DirectedGraph;
var testDFT = require('./fixture/test-runner-digraph-algorithm-dft');



testDFT({ testName: "Missing request", validConfig: false,
           expectedResults: {
               error: 'jsgraph.directed.depthFirstTraverse algorithm failure: Missing request object ~. Found type \'[object Undefined]\'.',
               result: null,
               path: null
           }});

testDFT({ testName: "Bad request type", validConfig: false,
           request: "No good",
           expectedResults: {
               error: 'jsgraph.directed.depthFirstTraverse algorithm failure: Missing request object ~. Found type \'[object String]\'.',
               result: null,
               path: null
           }});

testDFT({ testName: "Empty request", validConfig: false,
           request: {}, // also no good
           expectedResults: {
               error: 'jsgraph.directed.depthFirstTraverse algorithm failure: Missing required DirectedGraph reference ~.digraph. Found type \'[object Undefined]\'.',
               result: null,
               path: null
           }});

(function() {
    var digraph = new DirectedGraph();
    testDFT({ testName: "Empty digraph", validConfig: true,
              request: { digraph: digraph, options: { allowEmptyStartVector: true }},
              expectedResults: {
                  error: '',
                  result: '{"searchStatus":"completed","colorMap":{},"undiscoveredMap":{}}',
                  path: '[]'
              }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex({ u: "lone-wolf-vertex" });
    testDFT({ testName: "Single vertex, default starting vertex set (initializeVertex, startVertex, discoverVertex, finishVertex test)", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"lone-wolf-vertex":2},"undiscoveredMap":{}}',
                   path: '["0 initializeVertex lone-wolf-vertex","1 startVertex lone-wolf-vertex","2 discoverVertex lone-wolf-vertex at time 1","3 finishVertex lone-wolf-vertex at time 2"]'
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex({ u: "lone-wolf-vertex" });
    testDFT({ testName: "Single vertex, starting vertex not in the graph", validConfig: false,
               request: { digraph: digraph, options: { startVector: 'orange'}},
               expectedResults: {
                   error: 'jsgraph.directed.depthFirstTraverse algorithm failure: DFT request failed. Vertex \'orange\' not found in specified directed graph container.',
                   result: '',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex({ u: "lone-wolf-vertex" });
    testDFT({ testName: "Single vertex, starting vertex specified explicity in request", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'lone-wolf-vertex'}},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"lone-wolf-vertex":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addEdge({ e: { u: "lone-wolf-vertex", v: "lone-wolf-vertex" }});
    testDFT({ testName: "Single vertex, with an out-edge to itself", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'lone-wolf-vertex'}},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"lone-wolf-vertex":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();




(function() {
    var digraph = new DirectedGraph({
        elist: [ { e: { u: 'parent', v: 'child' } } ]
    });

    testDFT({ testName: "Two connected vertices, (treeEdge test)", validConfig: true,
              request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"parent":2,"child":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph({
        elist: [
            { e: { u: "A", v: "B" }},
            { e: { u: "B", v: "A" }}
        ]
    });
    testDFT({ testName: "Two inter-connected vertices, (no starting vertex set)", validConfig: true,
              request: { digraph: digraph, options: { allowEmptyStartVector: true }},
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"A":0,"B":0},"undiscoveredMap":{"A":true,"B":true}}',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph({
        elist: [
            { e: { u: "A", v: "B" }},
            { e: { u: "B", v: "A" }}
        ]
    });
    testDFT({ testName: "Two inter-connected vertices, (backEdge test)", validConfig: true,
              request: { digraph: digraph, options: { startVector: "A" } },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph({
        elist: [
            { e: { u: "A", v: "B" }},
            { e: { u: "B", v: "C" }},
            { e: { u: "A", v: "C" }}
        ]
    });
    testDFT({ testName: "Three vertices, (forwardEdge test)", validConfig: true,
              request: { digraph: digraph, options: { startVector: "A" } },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2,"C":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph({
        elist: [
            { e: { u: "A", v: "B" }},
            { e: { u: "C", v: "B" }}
        ]
    });
    testDFT({ testName: "Three vertices (crossEdge test)", validConfig: true,
              request: { digraph: digraph, options: { startVector: [ "A", "C"] } },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"A":2,"B":2,"C":2},"undiscoveredMap":{}}',
                   path: ''
               }});
})();

(function() {
    // This example is taken from section 22.3 (p. 605) of "Introduction to Algorithms"
    var digraph = new DirectedGraph({
        elist: [
            { e: { u: 'u', v: 'v' } },
            { e: { u: 'v', v: 'y' } },
            { e: { u: 'y', v: 'x' } },
            { e: { u: 'x', v: 'v' } },
            { e: { u: 'u', v: 'x' } },
            { e: { u: 'w', v: 'y' } },
            { e: { u: 'w', v: 'z' } },
            { e: { u: 'z', v: 'z' } }
        ]
    });
    testDFT({ testName: "Intro to Algorithms Figure 23.4 path classification test", validConfig: true,
              request: { digraph: digraph, options: { startVector: [ "w", "u"] } },
               expectedResults: {
                   error: '',
                   result: '{"searchStatus":"completed","colorMap":{"u":2,"v":2,"y":2,"x":2,"w":2,"z":2},"undiscoveredMap":{}}',
                   path: ''
               }});


    describe("Depth-first traverse termination tests.", function() {

        testDFT({
            testName: "Depth-first terminate on 'initializeVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    initializeVertex: function (request_) {
                        return (request_.u !== 'w');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":0,"v":0,"y":0,"x":0,"w":0,"z":0},"undiscoveredMap":{"u":true,"v":true,"y":true,"x":true,"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'startVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    startVertex: function (request_) {
                        return (request_.u !== 'w');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":2,"v":2,"y":2,"x":2,"w":0,"z":0},"undiscoveredMap":{"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'discoverVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    discoverVertex: function (request_) {
                        return (request_.u !== 'y');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":1,"y":1,"x":0,"w":0,"z":0},"undiscoveredMap":{"x":true,"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'examineEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    examineEdge: function (request_) {
                        return (request_.e.v !== 'v');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":0,"y":0,"x":0,"w":0,"z":0},"undiscoveredMap":{"v":true,"y":true,"x":true,"w":true,"z":true}}',
                path: ''
            }
        });

        
        testDFT({
            testName: "Depth-first terminate on 'treeEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    examineEdge: function (request_) {
                        return (request_.e.v !== 'v');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":0,"y":0,"x":0,"w":0,"z":0},"undiscoveredMap":{"v":true,"y":true,"x":true,"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'treeEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    examineEdge: function (request_) {
                        return (request_.e.v !== 'v');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":0,"y":0,"x":0,"w":0,"z":0},"undiscoveredMap":{"v":true,"y":true,"x":true,"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'backEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    backEdge: function (request_) {
                        return (request_.e.v !== 'v');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":1,"y":1,"x":1,"w":0,"z":0},"undiscoveredMap":{"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'forwardOrCrossEdge'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    forwardOrCrossEdge: function (request_) {
                        return (request_.e.v !== 'x');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":2,"y":2,"x":2,"w":0,"z":0},"undiscoveredMap":{"w":true,"z":true}}',
                path: ''
            }
        });

        testDFT({
            testName: "Depth-first terminate on 'finishVertex'", validConfig: true,
            request: {
                digraph: digraph,
                visitor: {
                    finishVertex: function (request_) {
                        return (request_.u !== 'y');
                    }
                }
            },
            expectedResults: {
                error: '',
                result: '{"searchStatus":"terminated","colorMap":{"u":1,"v":1,"y":2,"x":2,"w":0,"z":0},"undiscoveredMap":{"w":true,"z":true}}',
                path: ''
            }
        });
        

        
    });


})();

