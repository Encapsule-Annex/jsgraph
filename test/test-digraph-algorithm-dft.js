// Encapsule/jsgraph/test/test-digraph-algorithm-dft.js


var assert = require('chai').assert;
var DirectedGraph = require('../src/digraph');
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
    testDFT({ testName: "Single vertex, default starting vertex set", validConfig: true,
               request: { digraph: digraph },
               expectedResults: {
                   error: '',
                   result: '',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("lone-wolf-vertex");
    testDFT({ testName: "Single vertex, starting vertex not in the graph", validConfig: false,
               request: { digraph: digraph, options: { startVector: 'orange'}},
               expectedResults: {
                   error: '',
                   result: '',
                   path: ''
               }});
})();

(function() {
    var digraph = new DirectedGraph();
    digraph.addVertex("lone-wolf-vertex");
    testDFT({ testName: "Single vertex, starting vertex specified explicity in request", validConfig: true,
               request: { digraph: digraph, options: { startVector: 'lone-wolf-vertex'}},
               expectedResults: {
                   error: '',
                   result: '',
                   path: ''
               }});
})();

