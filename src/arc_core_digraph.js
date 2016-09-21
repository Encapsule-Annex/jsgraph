/*
  Encapsule/jsgraph/src/digraph.js

  Copyright (C) 2014-2015 Christopher D. Russell

  This library is published under the MIT License and is part of the
  Encapsule Project System in Cloud (SiC) open service architecture.
  Please follow https://twitter.com/Encapsule for news and updates
  about jsgraph and other time saving libraries that do amazing things
  with in-memory data on Node.js and HTML.
*/

// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html
// http://en.wikipedia.org/wiki/Directed_graph

var helperFunctions = require('./helper-functions');
var digraphParams = require('./digraph-in-parameters');
var digraphImport = require('./digraph-json-import');
var digraphExport = require('./digraph-json-export');

(function() {
    var __bind = function(method, scope){ return function(){ return method.apply(scope, arguments); }; };

    var DirectedGraph = (function() {
        function DirectedGraph(jsonOrObject_) {

            // Meta methods
            this.getGraphName = __bind(this.getGraphName, this);
            this.setGraphName = __bind(this.setGraphName, this);
            this.getGraphDescription = __bind(this.getGraphDescription, this);
            this.setGraphDescription = __bind(this.setGraphDescription, this);

            // Vertex-scope methods
            this.isVertex = __bind(this.isVertex, this);
            this.addVertex = __bind(this.addVertex, this);
            this.removeVertex = __bind(this.removeVertex, this);
            this.getVertexProperty = __bind(this.getVertexProperty, this);
            this.setVertexProperty = __bind(this.setVertexProperty, this);
            this.hasVertexProperty = __bind(this.hasVertexProperty, this);
            this.clearVertexProperty = __bind(this.clearVertexProperty, this);
            this.inDegree = __bind(this.inDegree, this);
            this.inEdges = __bind(this.inEdges, this);
            this.outDegree = __bind(this.outDegree, this);
            this.outEdges = __bind(this.outEdges, this);
            
            // Edge-scope methods
            this.isEdge = __bind(this.isEdge, this);
            this.addEdge = __bind(this.addEdge, this);
            this.removeEdge = __bind(this.removeEdge, this);
            this.getEdgeProperty = __bind(this.getEdgeProperty, this);
            this.setEdgeProperty = __bind(this.setEdgeProperty, this);
            this.hasEdgeProperty = __bind(this.hasEdgeProperty, this);
            this.clearEdgeProperty = __bind(this.clearEdgeProperty, this);
            
            // Digraph-scope methods
            this.verticesCount = __bind(this.verticesCount, this);
            this.getVertices = __bind(this.getVertices, this);
            this.edgesCount = __bind(this.edgesCount, this);
            this.getEdges = __bind(this.getEdges, this);
            this.rootVerticesCount = __bind(this.rootVerticesCount, this);
            this.getRootVertices = __bind(this.getRootVertices, this);
            this.leafVerticesCount = __bind(this.leafVerticesCount, this);
            this.getLeafVertices = __bind(this.getLeafVertices, this);
            this.toObject = __bind(this.toObject, this);
            this.toJSON = __bind(this.toJSON, this);
            this.fromObject = __bind(this.fromObject, this);
            this.fromJSON = __bind(this.fromJSON, this);

            // DirectedGraph container private runtime state.
            this._private = {
                name: "",
                description: "",
                vertexMap: {},
                rootMap: {},
                leafMap: {},
                edgeCount: 0,
                constructionError: null
            };
            if ((jsonOrObject_ !== null) && jsonOrObject_) {
                var innerResponse = digraphImport(this, jsonOrObject_);
                if (innerResponse.error) {
                    this._private.constructionError = "DirectedGraph constructor failed: " + innerResponse.error;
                }
            }
        }

        // META METHODS

        DirectedGraph.prototype.getGraphName = function() {
            return this._private.name;
        };

        DirectedGraph.prototype.setGraphName = function(string_) {
            var response = { error: null, result: null };
            if (helperFunctions.JSType(string_) === '[object String]') {
                this._private.name = string_;
                response.result = true;
            } else {                
                response.error = "Invalid graph name specified. Expected '[object String]'.";
            }
            return response;
        };

        DirectedGraph.prototype.getGraphDescription = function() {
            return this._private.description;
        };

        DirectedGraph.prototype.setGraphDescription = function(string_) {
            var response = { error: null, result: null };
            if (helperFunctions.JSType(string_) === '[object String]') {
                this._private.description = string_;
                response.result = true;
            } else {                
                response.error = "Invalid graph name specified. Expected '[object String]'.";
            }
            return response;
        };

        // VERTEX-SCOPE METHODS

        DirectedGraph.prototype.isVertex = function (vertexId_) {
            var innerResponse = digraphParams.verifyVertexReadRequest(vertexId_);
            if (innerResponse.error) {
                return false;
            }
            var vertex = this._private.vertexMap[vertexId_];
            return (vertex !== null) && vertex && true || false;
        };
            
        /*
          request = {
              u: vertex ID string
              p: optional property (must be serializable to JSON)
          }
          response = {
              error: null or error string
              result: vertex ID string or null if error
          }
         */
        DirectedGraph.prototype.addVertex = function (request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                var innerResponse = digraphParams.verifyVertexWriteRequest(request_);
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                var vertex = this._private.vertexMap[request_.u];
                if ((vertex === null) || !vertex) {
                    vertex = this._private.vertexMap[request_.u] = {};
                    vertex.edges = {};
                    vertex.edges.in = {};
                    vertex.edges.out = {};
                    this._private.rootMap[request_.u] = {};
                    this._private.leafMap[request_.u] = {};
                }
                if (helperFunctions.JSType(request_.p) !== '[object Undefined]') {
                    vertex.properties = request_.p;
                }
                response.result = request_.u;
            } // end while !inBreakScope
            if (errors.length) {
                errors.unshift("DirectedGraph.addVertex failed:");
                response.error = errors.join(' ');
            }
            return response;
        };

        DirectedGraph.prototype.removeVertex = function (vertexId_) {
            var innerResponse = digraphParams.verifyVertexReadRequest(vertexId_);
            if (innerResponse.error) {
                return false;
            }
            var vertexU = this._private.vertexMap[vertexId_];
            if ((vertexU === null) || !vertexU) {
                return false;
            }
            var vertexIdX;
            for (vertexIdX in vertexU.edges.out) {
                this.removeEdge({ u: vertexId_, v: vertexIdX});
            }
            for (vertexIdX in vertexU.edges.in) {
                this.removeEdge({ u: vertexIdX, v: vertexId_});
            }
            delete this._private.vertexMap[vertexId_];
            delete this._private.rootMap[vertexId_];
            delete this._private.leafMap[vertexId_];
            return true;
        };

        DirectedGraph.prototype.getVertexProperty = function(vertexId_) {
            if (!this.isVertex(vertexId_)) {
                return void 0;
            }
            return this._private.vertexMap[vertexId_].properties;
        };

        /*
          request = {
              u: vertex ID string
              p: optional property (must be serializable to JSON)
          }
          response = {
              error: null or error string
              result: vertex ID string or null if error
          }
         */
        DirectedGraph.prototype.setVertexProperty = function(request_) {
            return this.addVertex(request_);
        };

        DirectedGraph.prototype.hasVertexProperty = function(vertexId_) {
            if (!this.isVertex(vertexId_)) {
                return false;
            }
            if (helperFunctions.JSType(this._private.vertexMap[vertexId_].properties) === '[object Undefined]') {
                return false;
            }
            return true;
        };

        DirectedGraph.prototype.clearVertexProperty = function(vertexId_) {
            if (!this.isVertex(vertexId_)) {
                return false;
            }
            delete this._private.vertexMap[vertexId_].properties;
            return true;
        };

        DirectedGraph.prototype.inDegree = function (vertexId_) {
            return this.isVertex(vertexId_)?Object.keys(this._private.vertexMap[vertexId_].edges.in).length:-1;
        };

        DirectedGraph.prototype.inEdges = function(vertexId_) {
            var result = [];
            if (this.isVertex(vertexId_)) {
                for (var vertexIdV in this._private.vertexMap[vertexId_].edges.in) {
                    result.push({ u: vertexIdV, v: vertexId_});
                }
            }
            return result;
        };

        DirectedGraph.prototype.outDegree = function (vertexId_) {
            return this.isVertex(vertexId_)?Object.keys(this._private.vertexMap[vertexId_].edges.out).length:-1;
        };

        DirectedGraph.prototype.outEdges = function(vertexId_) {
            var result = [];
            if (this.isVertex(vertexId_)) {
                for (var vertexIdV in this._private.vertexMap[vertexId_].edges.out) {
                    result.push({ u: vertexId_, v: vertexIdV});
                }
            }
            return result;
        };

        // EDGE-SCOPE METHODS

        /*
          request = {
              u: string,
              v: string,
          }
          response = Boolean true if edge exists. Otherwise, false.
          Note that invalid requests are coalesced as negative responses.
        */
        DirectedGraph.prototype.isEdge = function(request_) {
            var response = false;
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (digraphParams.verifyEdgeReadRequest(request_).error) {
                    break;
                }
                var vertexU = this._private.vertexMap[request_.u];
                var vertexV = this._private.vertexMap[request_.v];
                if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                    break;
                }
                var edge = vertexU.edges.out[request_.v];
                response = (edge !== null) && edge && true || false;
            }
            return response;
        };

        /*
          request = {
              e: { u: string, v: string },
              p: (optional) property serializable to JSON
          }
          response = {
              error: error string or null
              result: edge descriptor object or null iff error
          }
         */
        DirectedGraph.prototype.addEdge = function (request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                var innerResponse = digraphParams.verifyEdgeWriteRequest(request_);
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                innerResponse = this.addVertex({ u: request_.e.u });
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                innerResponse = this.addVertex({ u: request_.e.v });
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                var outEdge = this._private.vertexMap[request_.e.u].edges.out[request_.e.v];
                if ((outEdge === null) || !outEdge) {
                    outEdge = this._private.vertexMap[request_.e.u].edges.out[request_.e.v] = {};
                    delete this._private.leafMap[request_.e.u];
                }
                var inEdge = this._private.vertexMap[request_.e.v].edges.in[request_.e.u];
                if ((inEdge === null) || !inEdge) {
                    inEdge = this._private.vertexMap[request_.e.v].edges.in[request_.e.u] = {};
                    this._private.edgeCount++;
                    delete this._private.rootMap[request_.e.v];
                }
                if (helperFunctions.JSType(request_.p) !== '[object Undefined]') {
                    outEdge.properties = request_.p;
                }
                response.result = request_.e;
            } // end while !inBreakScope
            if (errors.length) {
                errors.unshift("DirectedGraph.addEdge failed:");
                response.error = errors.join(' ');
            }
            return response;
        };

        /*
          request = {
              u: string,
              v: string,
          }
          response = {
              error: null or error string explaining why result is null
              result: Boolean true if successful. False if edge doesn't exist.
          }
        */
        DirectedGraph.prototype.removeEdge = function(request_) {
            var response = { error: null, result: null };
            var errors = [];
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                var innerResponse = digraphParams.verifyEdgeReadRequest(request_);
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                var vertexU = this._private.vertexMap[request_.u];
                var vertexV = this._private.vertexMap[request_.v];
                if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                    response.result = false;
                    break;
                }
                var outEdgeMap = vertexU.edges.out;
                var edge = outEdgeMap[request_.v];
                if (!((edge !== null) && edge)) {
                    response.result = false;
                    break;
                }
                delete outEdgeMap[request_.v];
                if (!Object.keys(outEdgeMap).length) {
                    this._private.leafMap[request_.u] = {};
                }
                var inEdgeMap = vertexV.edges.in;
                delete inEdgeMap[request_.u];
                if (!Object.keys(inEdgeMap).length) {
                    this._private.rootMap[request_.v] = {};
                }
                if (this._private.edgeCount) {
                    this._private.edgeCount--;
                }
                response.result = true;
            } // while !inBreakScope
            if (errors.length) {
                errors.unshift("DirectedGraph.removeEdge failed:");
                response.error = errors.join(' ');
            }
            return response;
        };

        /*
          request = {
              u: string,
              v: string
          }
          response = void 0 or whatever property is assigned to the edge
          Note that build requests are coalesced to void 0 responses.
         */

        DirectedGraph.prototype.getEdgeProperty = function(request_) {
            var response = void 0;
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (digraphParams.verifyEdgeReadRequest(request_).error) {
                    break;
                }
                var vertexU = this._private.vertexMap[request_.u];
                var vertexV = this._private.vertexMap[request_.v];
                if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                    break;
                }
                response = vertexU.edges.out[request_.v].properties;
            }
            return response;
        };

        /*
          request = {
              e: { u: string, v: string },
              p: (optional) property serializable to JSON
          }
          response = {
              error: error string or null
              result: edge descriptor object or null iff error
          }
         */
        DirectedGraph.prototype.setEdgeProperty = function(request_) {
            return this.addEdge(request_);
        };

        DirectedGraph.prototype.hasEdgeProperty = function(request_) {
            if (!this.isEdge(request_)) {
                return false;
            }
            if (helperFunctions.JSType(this._private.vertexMap[request_.u].edges.out[request_.v].properties) === '[object Undefined]') {
                return false;
            }
            return true;
        };

        DirectedGraph.prototype.clearEdgeProperty = function(request_) {
            if (!this.isEdge(request_)) {
                return false;
            }
            delete this._private.vertexMap[request_.u].edges.out[request_.v].properties;
            return true;
        };

        // DIGRAPH-SCOPE METHODS

        DirectedGraph.prototype.verticesCount = function() {
            return Object.keys(this._private.vertexMap).length;
        };

        DirectedGraph.prototype.getVertices = function() {
            var vertices = [];
            for (var vertexId in this._private.vertexMap) {
                vertices.push(vertexId);
            }
            return vertices;
        };

        DirectedGraph.prototype.edgesCount = function() {
            return this._private.edgeCount;
        };

        DirectedGraph.prototype.getEdges = function() {
            var edges = [];
            var vertices = this.getVertices();
            var processVertexOutEdges = function(outEdges_) {
                outEdges_.forEach(function(outEdge_) {
                    edges.push(outEdge_);
                });
            };
            var self = this;
            vertices.forEach(function(vertexId_) {
                processVertexOutEdges(self.outEdges(vertexId_));
            });
            return edges;
        };

        DirectedGraph.prototype.rootVerticesCount = function() {
            return Object.keys(this._private.rootMap).length;
        };

        DirectedGraph.prototype.getRootVertices = function() {
            var rootVertices = [];
            for (var vertexId in this._private.rootMap) {
                rootVertices.push(vertexId);
            }
            return rootVertices;
        };

        DirectedGraph.prototype.leafVerticesCount = function() {
            return Object.keys(this._private.leafMap).length;
        };

        DirectedGraph.prototype.getLeafVertices = function() {
            var leafVertices = [];
            for (var vertexId in this._private.leafMap) {
                leafVertices.push(vertexId);
            }
            return leafVertices;
        };

        DirectedGraph.prototype.toObject = function () {
            return digraphExport.exportObject(this);
        };

        DirectedGraph.prototype.toJSON = function(replacer_, space_) {
            return digraphExport.exportJSON(this, replacer_, space_);
        };

        DirectedGraph.prototype.fromObject = function (object_) {
            return digraphImport(this, object_);
        };
        
        DirectedGraph.prototype.fromJSON = function(json_) {
            return digraphImport(this, json_);
        };

        return DirectedGraph;

    })();

    var createDirectedGraph = function (jsonOrObject_) {
        var response = { error: null, result: null };
        var digraph = new DirectedGraph(jsonOrObject_);
        if (digraph._private.constructionError) {
            response.error = digraph._private.constructionError;
        } else {
            response.result = digraph;
        }
        return response;
    };

    module.exports = {
        /*
          createDirectedGraph is a wrapper around JavaScript operator new jsgraph.DirectedGraph(...)
          that returns an error/result response object. This is the preferred mechanism by which
          jsgraph-derived client code should construct DirectedGraph container object instance(s).
        */
        createDirectedGraph: createDirectedGraph,

        /*
          DirectedGraph is constructed with JavaScript operator new but may fail during construction
          if an error is encountered parsing the constructor's optional JSON/data object in-paramter.
          After contruction, clients should check DirectedGraph.constructionError === null to ensure
          that construction was successful. If a construction error occurred, constructionError is the
          response.error string returned by DirectedGraph's data import subroutine.
        */
        DirectedGraph: DirectedGraph

    };

}).call(this);
