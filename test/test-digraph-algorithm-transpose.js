
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
        digraphInput.addVertex({ u: "process", p: { testProperties: { description: "this vertex represents a program proces" }}});
        digraphInput.addVertex({ u: "inputA", p: { testProperties: { description: "this vertex represents data input A" }}});
        digraphInput.addVertex({ u: "inputB", p: { testProperties: { description: "this vertex representa data input B" }}});
        digraphInput.addVertex({ u: "outputA", p: { testProperties: { description: "this vertex represents data output A" }}});
        digraphInput.addVertex({ u: "outputB", p: { testProperties: { description: "this vertex represents data output B" }}});
        digraphInput.addVertex({ u: "outputC", p: { testProperties: { description: "this vertex represents data output C" }}});
        digraphInput.addEdge({ e: { u: "inputA", v: "process" }, p: { testProperties: { description: "this edge represents the flow of data from input A to process" }}});
        digraphInput.addEdge({ e: { u: "inputB", v: "process" }, p: { testProperties: { description: "this edge represents the flow of data from input B to process" }}});
        digraphInput.addEdge({ e: { u: "process", v: "outputA" }, p: { testProperties: { description: "this edge represents the flow of data from process to output A" }}});
        digraphInput.addEdge({ e: { u: "process", v: "outputB" }, p: { testProperties: { description: "this edge represents the flow of data from process to output B" }}});
        digraphInput.addEdge({ e: { u: "process", v: "outputC" }, p: { testProperties: { description: "this edge represents the flow of data from process to output C" }}});
        // The transposed digraph is a copy of the original with the edge directions reversed.
        var innerResponse = transposeDigraph(digraphInput);
        assert.isNull(innerResponse.error);
        digraphOutput = innerResponse.result;
    });

    describe("macro-level tests", function() {
        it("input digraph should contain six vertices", function() {
            assert.equal(digraphInput.verticesCount(), 6);
        });

        it("input digraph should contain five edges", function() {
            assert.equal(digraphInput.edgesCount(), 5);
        });

        it("input digraph should have two root vertices", function() {
            assert.equal(digraphInput.rootVerticesCount(), 2);
        });

        it("input digraph should have three leaf vertices", function() {
            assert.equal(digraphInput.leafVerticesCount(), 3);
        });

        it("output digraph should contain six vertices", function() {
            assert.equal(digraphOutput.verticesCount(), 6);
        });

        it("output digraph should contain five edges", function() {
            assert.equal(digraphOutput.edgesCount(), 5);
        });

        it("output digraph should have three root vertices", function() {
            assert.equal(digraphOutput.rootVerticesCount(), 3);
        });

        it("output digraph should have two leaf vertices", function() {
            assert.equal(digraphOutput.leafVerticesCount(), 2);
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
