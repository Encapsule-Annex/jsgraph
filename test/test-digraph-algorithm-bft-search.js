// test-digraph-algrithm-bfs.js

// external
var assert = require('chai').assert;

// internal
var DirectedGraph = require('../src/digraph');
var testBFSV = require('./fixture/test-runner-digraph-algorithm-bft');

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
            path: '["0 initializeVertex root1","1 initializeVertex root2","2 initializeVertex 1A","3 initializeVertex 1B","4 initializeVertex 1C","5 initializeVertex 1D","6 initializeVertex 2A","7 initializeVertex 2B","8 initializeVertex 2C","9 initializeVertex 2D","10 initializeVertex 2E","11 startVertex root1","12 discoverVertex root1","13 startVertex root2","14 discoverVertex root2","15 examineVertex root1","16 examineEdge [root1,1A]","17 discoverVertex 1A","18 treeEdge [root1,1A]","19 examineEdge [root1,1B]","20 discoverVertex 1B","21 treeEdge [root1,1B]","22 finishVertex root1","23 examineVertex root2","24 examineEdge [root2,2A]","25 discoverVertex 2A","26 treeEdge [root2,2A]","27 finishVertex root2","28 examineVertex 1A","29 finishVertex 1A","30 examineVertex 1B","31 examineEdge [1B,1C]","32 discoverVertex 1C","33 treeEdge [1B,1C]","34 finishVertex 1B","35 examineVertex 2A","36 examineEdge [2A,2B]","37 discoverVertex 2B","38 treeEdge [2A,2B]","39 finishVertex 2A","40 examineVertex 1C","41 examineEdge [1C,1D]","42 discoverVertex 1D","43 treeEdge [1C,1D]","44 finishVertex 1C","45 examineVertex 2B","46 examineEdge [2B,2C]","47 discoverVertex 2C","48 treeEdge [2B,2C]","49 examineEdge [2B,2D]","50 discoverVertex 2D","51 treeEdge [2B,2D]","52 examineEdge [2B,2E]","53 discoverVertex 2E","54 treeEdge [2B,2E]","55 finishVertex 2B","56 examineVertex 1D","57 finishVertex 1D","58 examineVertex 2C","59 finishVertex 2C","60 examineVertex 2D","61 finishVertex 2D","62 examineVertex 2E","63 examineEdge [2E,1B]","64 nonTreeEdge [2E,1B]","65 blackTarget [2E,1B]","66 finishVertex 2E"]'
        }
    });
})();

(function() {
    describe("Breadth-first visitor termination tests.", function() {

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

        testBFSV({
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


        testBFSV({
            testName: "Breadth-first visit terminate on 'initializeVertex'", validConfig: true,
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


        testBFSV({
            testName: "Breadth-first visit terminate on 'startVertex'", validConfig: true,
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


        testBFSV({
            testName: "Breadth-first visit terminate on 'discoverVertex'", validConfig: true,
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


        testBFSV({
            testName: "Breadth-first visit terminate on 'examineVertex'", validConfig: true,
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

        testBFSV({
            testName: "Breadth-first visit terminate on 'examineEdge'", validConfig: true,
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

        testBFSV({
            testName: "Breadth-first visit terminate on 'treeEdge'", validConfig: true,
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

        testBFSV({
            testName: "Breadth-first visit terminate on 'nonTreeEdge'", validConfig: true,
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
        

        testBFSV({
            testName: "Breadth-first visit terminate on 'grayTarget'", validConfig: true,
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
        
        testBFSV({
            testName: "Breadth-first visit terminate on 'blackTarget'", validConfig: true,
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
        
        testBFSV({
            testName: "Breadth-first visit terminate on 'finishVertex'", validConfig: true,
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
