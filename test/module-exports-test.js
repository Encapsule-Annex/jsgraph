
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should;

var jsgraph = require('../library');

describe("Module export tests", function() {

    describe("Directed graph container API", function() {

        it("module export 'jsgraph.DirectedGraph' should be a constructor function", function() {
            expect(jsgraph.DirectedGraph).to.be.a('function');
        });

        it("module export 'jsgraph.transpose' should be a function", function() {
            expect(jsgraph.transpose).to.be.a('function');
        });

        it("module export 'jsgraph.breadthFirstVisit' should be a function", function() {
            expect(jsgraph.breadthFirstVisit).to.be.a('function');
        });

        it("module export 'jsgraph.breadthFirstSearch' should be a function", function() {
            expect(jsgraph.breadthFirstSearch).to.be.a('function');
        });

        it("module export 'jsgraph.depthFirstVisit' should be a function", function() {
            expect(jsgraph.depthFirstVisit).to.be.a('function');
        });

        it("module export 'jsgraph.depthFirstSearch' should be a function", function() {
            expect(jsgraph.depthFirstSearch).to.be.a('function');
        });

    });
});
