
var chai = require('chai');
var assert = chai.assert;

var testModule = require('./module-under-test');
var jsgraph = testModule('arc_core_graph');
var DirectedGraph = testModule('arc_core_digraph');

describe("Module export tests", function() {

    describe("Directed graph container API", function() {

        it("module export 'jsgraph.directed' should be an object", function() {
            assert.isObject(jsgraph.directed);
        });

        it("module export 'jsgraph.directed.colors' should be an object", function() {
            assert.isObject(jsgraph.directed.colors);
        });

        it("module export 'jsgraph.directed.create' should be a function", function() {
            assert.isFunction(jsgraph.directed.create);
        });

        it("module export 'jsgraph.directed.transpose' should be a function", function() {
            assert.isFunction(jsgraph.directed.transpose);
        });

        it("module export 'jsgraph.directed.breadthFirstTraverse' should be a function", function() {
            assert.isFunction(jsgraph.directed.breadthFirstTraverse);
        });

        it("module export 'jsgraph.directed.depthFirstTraverse' should be a function", function() {
            assert.isFunction(jsgraph.directed.depthFirstTraverse);
        });

        it("module export 'jsgraph.directed.createTraveralContext' should be a function", function() {
            assert.isFunction(jsgraph.directed.createTraversalContext);
        });

    });
});
