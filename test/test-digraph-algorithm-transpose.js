
var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should;
var uuid = require('node-uuid');

var DirectedGraph = require('../src/digraph').DirectedGraph;
var transposeDigraph = require('../src/digraph-algorithm-transpose');

describe("Directed graph tranposition test", function() {

    var digraphInput = null;
    var digraphOutput = null;

    before(function() {
        digraphInput = new DirectedGraph();
        digraphInput.addVertex("process", { testProperties: { description: "this vertex represents a program proces" }});
        digraphInput.addVertex("inputA", { testProperties: { description: "this vertex represents data input A" }});
        digraphInput.addVertex("inputB", { testProperties: { description: "this vertex representa data input B" }});
        digraphInput.addVertex("outputA", { testProperties: { description: "this vertex represents data output A" }});
        digraphInput.addVertex("outputB", { testProperties: { description: "this vertex represents data output B" }});
        digraphInput.addVertex("outputC", { testProperties: { description: "this vertex represents data output C" }});
        digraphInput.addEdge("inputA", "process", { testProperties: { description: "this edge represents the flow of data from input A to process" }});
        digraphInput.addEdge("inputB", "process", { testProperties: { description: "this edge represents the flow of data from input B to process" }});
        digraphInput.addEdge("process", "outputA", { testProperties: { description: "this edge represents the flow of data from process to output A" }});
        digraphInput.addEdge("process", "outputB", { testProperties: { description: "this edge represents the flow of data from process to output B" }});
        digraphInput.addEdge("process", "outputC", { testProperties: { description: "this edge represents the flow of data from process to output C" }});
        // The transposed digraph is a copy of the original with the edge directions reversed.
        digraphOutput = transposeDigraph(digraphInput);
    });

    describe("macro-level tests", function() {
        it("input digraph should contain six vertices", function() {
            assert.equal(digraphInput.verticesCount(), 6);
        });

        it("input digraph should contain five edges", function() {
            assert.equal(digraphInput.edgesCount(), 5);
        });

        it("input digraph should have two root vertices", function() {
            assert.lengthOf(Object.keys(digraphInput.rootMap), 2);
        });

        it("input digraph should have three leaf vertices", function() {
            assert.lengthOf(Object.keys(digraphInput.leafMap), 3);
        });

        it("output digraph should contain six vertices", function() {
            assert.equal(digraphOutput.verticesCount(), 6);
        });

        it("output digraph should contain five edges", function() {
            assert.equal(digraphOutput.edgesCount(), 5);
        });

        it("output digraph should have three root vertices", function() {
            assert.lengthOf(Object.keys(digraphOutput.rootMap), 3);
        });

        it("output digraph should have two leaf vertices", function() {
            assert.lengthOf(Object.keys(digraphOutput.leafMap), 2);
        });
    });

    describe("check out-degree of roots and leaves before/after transposition", function() {
        it("inputA should have out-degree one in the input graph", function() {
            assert.equal(digraphInput.outDegree("inputA"), 1);
        });

        it("inputA should have out-degree zero in the output graph", function() {
            assert.equal(digraphOutput.outDegree("inputA"), 0);
        });

        it("outputC should have out-degree zero in the input graph", function() {
            assert.equal(digraphInput.outDegree("outputC"), 0);
        });

        it("outputC should have out-degree one in the output graph", function() {
            assert.equal(digraphOutput.outDegree("outputC"), 1);
        });
    });

    describe("vertex 'process' vertex before/after transposition", function() {
        it("process should have in-degree two in the input graph", function() {
            assert.equal(digraphInput.inDegree("process"), 2);
        });

        it("process should have in-degree three in the output graph", function() {
            assert.equal(digraphOutput.inDegree("process"), 3);
        });

        it("process should have out-degree three in the input graph", function() {
            assert.equal(digraphInput.outDegree("process"), 3);
        });

        it("process should have out-degree two in the output graph", function() {
            assert.equal(digraphOutput.outDegree("process"), 2);
        });
    });


});
