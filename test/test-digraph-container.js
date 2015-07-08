// digraph-test.js

var assert = require('chai').assert;
var uuid = require('node-uuid');
var DirectedGraphContainer = require('../src/digraph');
var DirectedGraph = DirectedGraphContainer.DirectedGraph;

describe("DirectedGraph container object tests", function() {

    describe("Object construction tests", function() {
        var digraph = new DirectedGraph();

        it("graph should be an object", function() {
            assert.typeOf(digraph, 'object');
        });

        it ("graph should have zero vertices", function() {
            assert.lengthOf(Object.keys(digraph.vertexMap), 0);
            assert.equal(digraph.verticesCount(), 0);
        });

        it("graph should have zero edges", function() {
            assert.equal(digraph.edgesCount(), 0);
        });

        it ("graph should have zero root vertices", function() {
            assert.equal(digraph.getRootVertices().length, 0);
        });

        it ("graph should have zero leaf vertices", function() {
            assert.equal(digraph.getLeafVertices().length, 0);
        });
    });

    describe("Import/Export tests", function(){

        var digraph = new DirectedGraph();
        var copy = new DirectedGraph();
        var vertices = ["foo", "bar", "baz"];
        var json = null;
        
        before(function(){
            vertices.forEach(function(u){
                digraph.addVertex({ u: u, p: { k: u }});
            });
            vertices.forEach(function(u){
                vertices.forEach(function(v){
                    if(u !== v) digraph.addEdge({ e: { u: u, v: v}});
                });
            });
        });

        it("graph export JSON should match expected control string", function() {
            var expectedJSON = '{"vlist":[{"u":"foo","p":{"k":"foo"}},{"u":"bar","p":{"k":"bar"}},{"u":"baz","p":{"k":"baz"}}],"elist":[{"e":{"u":"foo","v":"bar"}},{"e":{"u":"foo","v":"baz"}},{"e":{"u":"bar","v":"foo"}},{"e":{"u":"bar","v":"baz"}},{"e":{"u":"baz","v":"foo"}},{"e":{"u":"baz","v":"bar"}}]}';
            assert.equal(digraph.toJSON(), expectedJSON);
        });

        it("graph should export properly structured JSON string", function(){
            json = digraph.toJSON();
            assert.isString(json);
            var parsed = JSON.parse(json);
            assert.isObject(parsed);
            assert.isArray(parsed.vlist);
            assert.isArray(parsed.elist);
        });

        it("graph export to object and JSON should be identical", function() {
            var testObjectJSON = JSON.stringify(digraph.toObject());
            var testJSON = digraph.toJSON();
            assert.equal(testObjectJSON, testJSON);
        });

        it("graph constructed from export object should be identical to original", function() {
            var testGraph = new DirectedGraph(digraph.toObject());
            assert.equal(testGraph.toJSON(), digraph.toJSON());
        });

        it("empty graph filled using fromObject should be identical to original", function() {
            var testGraph = new DirectedGraph();
            testGraph.fromObject(digraph.toObject());
            assert.equal(testGraph.toJSON(), digraph.toJSON());
        });

        it("empty graph filled using fromJSON should be identical to original", function() {
            var testGraph = new DirectedGraph();
            testGraph.fromJSON(digraph.toJSON());
            assert.equal(testGraph.toJSON(), digraph.toJSON());
        });

        describe("Re-create the directed graph container from the JSON.", function() {
            var copy = null;
            before(function() {
                var constructCopy = function() {
                    copy = new DirectedGraph(json);
                };
                assert.doesNotThrow(constructCopy);
            });
            it("graph should re-create identical graph from import", function(){
                assert.equal(copy.toJSON(), json);
            });
        });

        describe("Test JSON export algorith's vertex skip facility", function() {

            var testGraph = null;
            var expectedJSON = '{"vlist":[{"u":"strawberry","p":"has a property"},{"u":"not-mentioned-no-property"}],"elist":[{"e":{"u":"apple","v":"orange"}},{"e":{"u":"bannana","v":"apple"}},{"e":{"u":"pineapple","v":"orange"}},{"e":{"u":"strawberry","v":"blueberry"},"p":"link"}]}';
            var actualJSON = null;
            
            before(function() {
                var digraph = new DirectedGraph({
                    vlist: [
                        { u: 'apple' },
                        { u: 'orange' },
                        { u: 'bannana' },
                        { u: 'pineapple' },
                        { u: 'strawberry', p: "has a property" },
                        { u: 'blueberry' },
                        { u: 'not-mentioned-no-property' }
                    ],
                    elist: [
                        { e: { u: 'strawberry', v: 'blueberry' }, p: 'link' },
                        { e: { u: 'bannana', v: 'apple' }},
                        { e: { u: 'apple', v: 'orange' }},
                        { e: { u: 'pineapple', v: 'orange' }}
                    ]
                });
                actualJSON = digraph.toJSON();
            });

            it("Exported JSON should match expected JSON value.", function() {
                assert.equal(actualJSON, expectedJSON);
            });

        });

    });

    describe("Vertex API tests", function() {

        var digraph = new DirectedGraph();

        var addVertexTest = function() {

            it("graph should have a single vertex", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 1);
                assert.equal(digraph.verticesCount(), 1);
            });

            it("graph should have zero edges", function() {
                assert.equal(digraph.edgesCount(), 0);
            });

            it ("graph should have one root vertex", function() {
                assert.equal(digraph.getRootVertices().length, 1);
            });

            it ("graph should have one leaf vertex", function() {
                assert.equal(digraph.getLeafVertices().length, 1);
            });

            it ("vertex should have zero in-degree", function() {
                assert.equal(digraph.inDegree("apple"), 0);
            });

            it ("vertex should have zero out-degree", function() {
                assert.equal(digraph.outDegree("apple"), 0);
            });

            it("vertex in-edge array should have length zero", function() {
                assert.lengthOf(digraph.inEdges("apple"), 0);
            });

            it ("vertex out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("apple"), 0);
            });
        };

        var removeVertexTest = function() {

            it("graph should have zero vertices", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 0);
                assert.equal(digraph.verticesCount(), 0);
            });

            it("graph should have zero edges", function() {
                assert.equal(digraph.edgesCount(), 0);
            });

            it("graph should have zero root vertices", function() {
                assert.equal(digraph.getRootVertices().length, 0);
            });

            it("graph should have zero leaf vertices", function() {
                assert.equal(digraph.getLeafVertices().length, 0);
            });
        };

        describe("addVertex", function() {
            before(function() { digraph.addVertex({ u: "apple"}); });
            addVertexTest();
        });
        describe("addVertex (idempotency)", function() {
            before(function() { digraph.addVertex({ u: "apple"}); });
            addVertexTest();
        });
        describe("removeVertex", function() {
            before(function() { digraph.removeVertex("apple"); });
            removeVertexTest();
        });
        describe("removeVertex (idempotency)", function() {
            before(function() { digraph.removeVertex("apple"); });
            removeVertexTest();
        });
    });

    describe("Edge API tests", function() {

        var digraph = new DirectedGraph();

        var addEdgeTest = function() {

            it("graph should have two vertices", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 2);
                assert.equal(digraph.verticesCount(), 2);
            });

            it("graph should have one edge", function() {
                assert.equal(digraph.edgesCount(), 1);
            });

            it ("graph should have one root vertex", function() {
                assert.equal(digraph.getRootVertices().length, 1);
            });

            it ("graph should have one leaf vertex", function() {
                assert.equal(digraph.getLeafVertices().length, 1);
            });

            it ("vertex 'apple' should have in-degree zero", function() {
                assert.equal(digraph.inDegree("apple"), 0);
            });

            it ("vertex 'apple' should have out-degree one", function() {
                assert.equal(digraph.outDegree("apple"), 1);
            });

            it ("vertex 'orange' should have in-degree one", function() {
                assert.equal(digraph.inDegree("orange"), 1);
            });

            it ("vertex 'orange' should have out-degree zero", function() {
                assert.equal(digraph.outDegree("orange"), 0);
            });

            it("vertex 'apple' in-edge array should have length zero", function() {
                assert.lengthOf(digraph.inEdges("apple"), 0);
            });

            it ("vertex 'apple' out-edge array should have length one", function() {
                assert.lengthOf(digraph.outEdges("apple"), 1);
            });

            it("vertex 'orange' in-edge array should have length one", function() {
                assert.lengthOf(digraph.inEdges("orange"), 1);
            });

            it ("vertex 'orange' out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("orange"), 0);
            });
        };

        var removeEdgeTest = function() {
            it("graph should have two vertices", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 2);
                assert.equal(digraph.verticesCount(), 2);
            });

            it("graph should have zero edges", function() {
                assert.equal(digraph.edgesCount(), 0);
            });

            it ("graph should have two root vertices", function() {
                assert.equal(digraph.getRootVertices().length, 2);
            });

            it ("graph should have two leaf vertices", function() {
                assert.equal(digraph.getLeafVertices().length, 2);
            });

            it ("vertex 'apple' should have in-degree zero", function() {
                assert.equal(digraph.inDegree("apple"), 0);
            });

            it ("vertex 'apple' should have out-degree zero", function() {
                assert.equal(digraph.outDegree("apple"), 0);
            });

            it ("vertex 'orange' should have out-degree zero", function() {
                assert.equal(digraph.outDegree("orange"), 0);
            });

            it ("vertex 'orange' should have in-degree zero", function() {
                assert.equal(digraph.inDegree("orange"), 0);
            });

            it("vertex 'apple' in-edge array should have length zero", function() {
                assert.lengthOf(digraph.inEdges("apple"), 0);
            });

            it ("vertex 'apple' out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("apple"), 0);
            });

            it("vertex 'orange' in-edge array should have length zero", function() {
                assert.lengthOf(digraph.inEdges("orange"), 0);
            });

            it ("vertex 'orange' out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("orange"), 0);
            });
        };

        describe("addEdge(apple,orange)", function() {
            before(function() {
                digraph.addEdge({ e: { u: "apple", v: "orange"}});
            });
            addEdgeTest();
        });

        describe("addEdge(apple,orange) (idempotency)", function() {
            before(function() {
                digraph.addEdge({ e: { u: "apple", v: "orange"}});
            });
            addEdgeTest();
        });

        describe("removeEdge(apple,orange)", function() {
            before(function() {
                digraph.removeEdge({u: "apple", v: "orange"});
            });
            removeEdgeTest();
        });

        describe("removeEdge(apple,orange) idempotency", function() {
            before(function() {
                digraph.removeEdge({u:"apple",v:"orange"});
            });
            removeEdgeTest();
        });

        describe("addEdge(apple,orange), removeVertex(orange)", function() {
            before(function() {
                digraph.addEdge({e:{u:"apple",v:"orange"}});
                digraph.removeVertex("orange");
            });

            it("graph should have one vertex", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 1);
                assert.equal(digraph.verticesCount(), 1);
            });

            it("graph should have zero edges", function() {
                assert.equal(digraph.edgesCount(), 0);
            });

            it ("graph should have one root vertex", function() {
                assert.equal(digraph.getRootVertices().length, 1);
            });

            it ("graph should have one leaf vertex", function() {
                assert.equal(digraph.getLeafVertices().length, 1);
            });

            it ("vertex 'apple' should have in-degree zero", function() {
                assert.equal(digraph.inDegree("apple"), 0);
            });

            it ("vertex 'apple' should have out-degree zero", function() {
                assert.equal(digraph.outDegree("apple"), 0);
            });

            it("vertex in-edge array should have length zero", function() {
                assert.lengthOf(digraph.inEdges("apple"), 0);
            });

            it ("vertex out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("apple"), 0);
            });
            
        });
    });

    describe("ring topology tests", function() {

        // create a triangle.
        var digraph = new DirectedGraph();
        digraph.addEdge({e: { u: "white", v: "blue"}});
        digraph.addEdge({e: { u: "blue",  v: "green"}});
        digraph.addEdge({e:{ u: "green", v: "white"}});

        it("graph should have three vertices", function() {
            assert.lengthOf(Object.keys(digraph.vertexMap), 3);
            assert.equal(digraph.verticesCount(), 3);
        });

        it("graph should have three edges", function() {
            assert.equal(digraph.edgesCount(), 3);
        });

        it ("graph should have zero root vertices", function() {
            assert.equal(digraph.getRootVertices().length, 0);
        });

        it ("graph should have zero leaf vertices", function() {
            assert.equal(digraph.getLeafVertices().length, 0);
        });

        it ("vertex 'blue' should have in-degree one", function() {
            assert.equal(digraph.inDegree("blue"), 1);
        });

        it ("vertex 'blue' should have out-degree one", function() {
            assert.equal(digraph.outDegree("blue"), 1);
        });

        it("vertex 'blue' in-edge array should have length one", function() {
            assert.lengthOf(digraph.inEdges("blue"), 1);
        });

        it ("vertex 'blue' out-edge array should have length one", function() {
            assert.lengthOf(digraph.outEdges("blue"), 1);
        });
    });

    describe("cube topology tests", function() {

        var digraph = new DirectedGraph();

        describe("create cube topology tests", function() {

            before(function() {

                digraph.addEdge({e:{ u: "north1", v: "east1"}});
                digraph.addEdge({e:{ u: "east1", v: "south1"}});
                digraph.addEdge({ e: { u: "south1", v: "west1"}});
                digraph.addEdge({ e: { u: "west1", v: "north1"}});

                digraph.addEdge({ e: { u: "north2", v: "east2"}});
                digraph.addEdge({ e: { u: "east2", v: "south2"}});
                digraph.addEdge({ e: { u: "south2", v: "west2"}});
                digraph.addEdge({ e: { u: "west2", v: "north2"}});

                digraph.addEdge({ e: { u: "north1", v: "north2"}});
                digraph.addEdge({ e: { u: "east1", v: "east2"}});
                digraph.addEdge({ e: { u: "south1", v: "south2"}});
                digraph.addEdge({ e: { u: "west1", v: "west2"}});

            });

            it("graph should have eigth vertices", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 8);
                assert.equal(digraph.verticesCount(), 8);
            });

            it("graph should have twelve edges", function() {
                assert.equal(digraph.edgesCount(), 12);
            });

            it ("graph should have zero root vertices", function() {
                assert.equal(digraph.getRootVertices().length, 0);
            });

            it ("graph should have zero leaf vertices", function() {
                assert.equal(digraph.getLeafVertices().length, 0);
            });

            it ("vertex 'north1' should have in-degree one", function() {
                assert.equal(digraph.inDegree("north1"), 1);
            });

            it ("vertex 'north1' should have out-degree two", function() {
                assert.equal(digraph.outDegree("north1"), 2);
            });

            it("vertex 'north1' in-edge array should have length one", function() {
                assert.lengthOf(digraph.inEdges("north1"), 1);
            });

            it ("vertex 'north1' out-edge array should have length two", function() {
                assert.lengthOf(digraph.outEdges("north1"), 2);
            });
        });

        describe("remove cube corner tests", function() {

            before(function() {
                digraph.removeVertex("south2");
            });

            it("graph should have seven vertices", function() {
                assert.lengthOf(Object.keys(digraph.vertexMap), 7);
                assert.equal(digraph.verticesCount(), 7);
            });

            it("graph should have nine edges", function() {
                assert.equal(digraph.edgesCount(), 9);
            });

            it ("graph should have zero root vertices", function() {
                assert.equal(digraph.getRootVertices().length, 0);
            });

            it ("graph should have one leaf vertices", function() {
                assert.equal(digraph.getLeafVertices().length, 1);
            });

            it ("vertex 'east2' should have in-degree two", function() {
                assert.equal(digraph.inDegree("east2"), 2);
            });

            it ("vertex 'east2' should have out-degree zero", function() {
                assert.equal(digraph.outDegree("east2"), 0);
            });

            it("vertex 'east2' in-edge array should have length two", function() {
                assert.lengthOf(digraph.inEdges("east2"), 2);
            });

            it ("vertex 'east2' out-edge array should have length zero", function() {
                assert.lengthOf(digraph.outEdges("east2"), 0);
            });
        });
    });

    describe("Graph stress", function() {

        var verticesToAllocate = 1000000;
        var digraph = new DirectedGraph();
        var x;
        for (x = 0; x < verticesToAllocate; x++) {
            digraph.addVertex({ u: "" + x + ""});
        }

        it("graph should have " + verticesToAllocate + " vertices", function() {
            assert.lengthOf(Object.keys(digraph.vertexMap), verticesToAllocate);
            assert.equal(digraph.verticesCount(), verticesToAllocate);
        });
    });
});



