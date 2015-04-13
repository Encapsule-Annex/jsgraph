
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should;

var jsgraph = require('../index');

describe("Module export tests", function() {

    describe("Directed graph container API", function() {

        it("module export 'jsgraph.DirectedGraph' should be a constructor function", function() {
            expect(jsgraph.DirectedGraph).to.be.a('function');
        });

        it("module export 'jsgraph.directed' should be an object", function() {
            expect(jsgraph.directed).to.be.a('object');
        });

        it("module export 'jsgraph.directed.transpose' should be a function", function() {
            expect(jsgraph.directed.transpose).to.be.a('function');
        });

        it("module export 'jsgraph.directed.createBreadthFirstSearchContext' should be a function", function() {
            expect(jsgraph.directed.createBreadthFirstSearchContext).to.be.a('function');
        });

        it("module export 'jsgraph.directed.breadthFirstVisit' should be a function", function() {
            expect(jsgraph.directed.breadthFirstVisit).to.be.a('function');
        });

        it("module export 'jsgraph.directed.breadthFirstSearch' should be a function", function() {
            expect(jsgraph.directed.breadthFirstSearch).to.be.a('function');
        });

        it("module export 'jsgraph.directed.createDepthFirstVisit' should be a function", function() {
            expect(jsgraph.directed.createDepthFirstSearchContext).to.be.a('function');
        });

        it("module export 'jsgraph.directed.depthFirstVisit' should be a function", function() {
            expect(jsgraph.directed.depthFirstVisit).to.be.a('function');
        });

        it("module export 'jsgraph.directed.depthFirstSearch' should be a function", function() {
            expect(jsgraph.directed.depthFirstSearch).to.be.a('function');
        });

    });
});
