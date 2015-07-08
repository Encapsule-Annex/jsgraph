// disgraph.js
// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html
// http://en.wikipedia.org/wiki/Directed_graph

var helperFunctions = require('./helper-functions');
var digraphImport = require('./digraph-json-import');
var digraphExport = require('./digraph-json-export');

(function() {

    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    var DirectedGraph = (function() {

        function DirectedGraph(jsonOrObject_) {
            this.getVertices = __bind(this.getVertices, this);
            this.getRootVertices = __bind(this.getRootVertices, this);
            this.getLeafVertices = __bind(this.getLeafVertices, this);
            this.addVertex = __bind(this.addVertex, this);
            this.isVertex = __bind(this.isVertex, this);
            this.removeVertex = __bind(this.removeVertex, this);
            this.addEdge = __bind(this.addEdge, this);
            this.removeEdge = __bind(this.removeEdge, this);
            this.isEdge = __bind(this.isEdge, this);
            this.verticesCount = __bind(this.verticesCount, this);
            this.edgesCount = __bind(this.edgesCount, this);
            this.getEdges = __bind(this.getEdges, this);
            this.inEdges = __bind(this.inEdges, this);
            this.outEdges = __bind(this.outEdges, this);
            this.inDegree = __bind(this.inDegree, this);
            this.outDegree = __bind(this.outDegree, this);
            this.getVertexProperty = __bind(this.getVertexProperty, this);
            this.getEdgeProperty = __bind(this.getEdgeProperty, this);
            this.setVertexProperty = __bind(this.setVertexProperty, this);
            this.setEdgeProperty = __bind(this.setEdgeProperty, this);
            this.toObject = __bind(this.toObject, this);
            this.toJSON = __bind(this.toJSON, this);
            this.fromObject = __bind(this.fromObject, this);
            this.fromJSON = __bind(this.fromJSON, this);
            this.vertexMap = {};
            this.rootMap = {};
            this.leafMap = {};
            this.edgeCount = 0;
            this.constructionError = null;
            if ((jsonOrObject_ !== null) && jsonOrObject_) {
                var innerResponse = digraphImport(this, jsonOrObject_);
                if (innerResponse.error) {
                    this.constructionError = "DirectedGraph constructor failed: " + innerResponse.error;
                }
            }
        }

        DirectedGraph.prototype.getVertices = function() {
            var vertices = [];
            for (var vertexId in this.vertexMap) {
                vertices.push(vertexId);
            }
            return vertices;
        };

        DirectedGraph.prototype.getRootVertices = function() {
            var rootVertices = [];
            for (var vertexId in this.rootMap) {
                rootVertices.push(vertexId);
            }
            return rootVertices;
        };

        DirectedGraph.prototype.getLeafVertices = function() {
            var leafVertices = [];
            for (var vertexId in this.leafMap) {
                leafVertices.push(vertexId);
            }
            return leafVertices;
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
                var jstype = helperFunctions.JSType(request_);
                if (jstype !== '[object Object]') {
                    errors.unshift("Missing request object. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.u);
                if (jstype !== '[object String]') {
                    errors.unshift("Expected request.u to be a string but found '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.p);
                if (jstype === '[object Function]') {
                    errors.unshift("Expected request.p to be serializable to JSON. Function references should be stored in an external hash table (e.g. indexed by vertex ID string).");
                    break;
                }
                var vertex = this.vertexMap[request_.u];
                if ((vertex === null) || !vertex) {
                    vertex = this.vertexMap[request_.u] = {};
                    vertex.edges = {};
                    vertex.edges.in = {};
                    vertex.edges.out = {};
                    this.rootMap[request_.u] = {};
                    this.leafMap[request_.u] = {};
                }
                if (jstype !== '[object Undefined]') {
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

        DirectedGraph.prototype.isVertex = function (vertexId_) {
            var jstype = helperFunctions.JSType(vertexId_);
            if (jstype !== '[object String]') {
                return false;
            }
            var vertex = this.vertexMap[vertexId_];
            return (vertex !== null) && vertex && true || false;
        };
            
        DirectedGraph.prototype.removeVertex = function (vertexId_) {
            var jstype = helperFunctions.JSType(vertexId_);
            if (jstype !== '[object String]') {
                return false;
            }
            var vertexU = this.vertexMap[vertexId_];
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
            delete this.vertexMap[vertexId_];
            delete this.rootMap[vertexId_];
            delete this.leafMap[vertexId_];
            return true;
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
                var jstype = helperFunctions.JSType(request_);
                if (jstype !== '[object Object]') {
                    errors.unshift("Missing request object ~. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.e);
                if (jstype !== '[object Object]') {
                    errors.unshift("Expected request.e to be an object. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.e.u);
                if (jstype !== '[object String]') {
                    errors.unshift("Expected request.e.u to be a string. Found type '" + innerResposne + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.e.v);
                if (jstype !== '[object String]') {
                    errors.unshift("Expected request.e.v to be a string. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.p);
                if (jstype === '[object Function]') {
                    errors.unshift("Expected request.p to be serializable to JSON. Function references should be stored in an external hash table (e.g. indexed by vertex ID string).");
                    break;
                }

                var innerResponse = this.addVertex({ u: request_.e.u });
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                innerResponse = this.addVertex({ u: request_.e.v });
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                var outEdge = this.vertexMap[request_.e.u].edges.out[request_.e.v];
                if ((outEdge === null) || !outEdge) {
                    outEdge = this.vertexMap[request_.e.u].edges.out[request_.e.v] = {};
                    delete this.leafMap[request_.e.u];
                }
                var inEdge = this.vertexMap[request_.e.v].edges.in[request_.e.u];
                if ((inEdge === null) || !inEdge) {
                    inEdge = this.vertexMap[request_.e.v].edges.in[request_.e.u] = {};
                    this.edgeCount++;
                    delete this.rootMap[request_.e.v];
                }
                if (jstype !== '[object Undefined]') {
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
                var jstype = helperFunctions.JSType(request_);
                if (jstype !== '[object Object]') {
                    errors.unshift("Missing request object. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.u);
                if (jstype !== '[object String]') {
                    errors.unshift("Expected request.u to be a string. Found type '" + jstype + "'.");
                    break;
                }
                jstype = helperFunctions.JSType(request_.v);
                if (jstype !== '[object String]') {
                    errors.unshift("Expected request.v to be a string. Found type '" + type + "'.");
                    break;
                }
                var vertexU = this.vertexMap[request_.u];
                var vertexV = this.vertexMap[request_.v];
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
                    this.leafMap[request_.u] = {};
                }
                var inEdgeMap = vertexV.edges.in;
                delete inEdgeMap[request_.u];
                if (!Object.keys(inEdgeMap).length) {
                    this.rootMap[request_.v] = {};
                }
                if (this.edgeCount) {
                    this.edgeCount--;
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
              v: string,
          }
          response = Boolean true if edge exists. Otherwise, false.
          Note that invalid requests are coalesced as negative responses.
        */
        DirectedGraph.prototype.isEdge = function(request_) {
            var response = false;
            var jstype = helperFunctions.JSType(request_);
            var inBreakScope = false;
            while (!inBreakScope) {
                inBreakScope = true;
                if (jstype !== '[object Object]') {
                    break;
                }
                jstype = helperFunctions.JSType(request_.u);
                if (jstype !== '[object String]') {
                    break;
                }
                jstype = helperFunctions.JSType(request_.v);
                if (jstype !== '[object String]') {
                    break;
                }
                var vertexU = this.vertexMap[request_.u];
                var vertexV = this.vertexMap[request_.v];
                if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                    break;
                }
                var edge = vertexU.edges.out[vertexIdV_];
                response = (edge !== null) && edge && true || false;
            }
            return response;
        };

        DirectedGraph.prototype.verticesCount = function() {
            return Object.keys(this.vertexMap).length;
        };

        DirectedGraph.prototype.edgesCount = function() {
            return this.edgeCount;
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
                             
        DirectedGraph.prototype.inEdges = function(vertexId_) {
            var result = [];
            if (this.isVertex(vertexId_)) {
                for (var vertexIdV in this.vertexMap[vertexId_].edges.in) {
                    result.push({ u: vertexIdV, v: vertexId_});
                }
            }
            return result;
        };

        DirectedGraph.prototype.outEdges = function(vertexId_) {
            var result = [];
            if (this.isVertex(vertexId_)) {
                for (var vertexIdV in this.vertexMap[vertexId_].edges.out) {
                    result.push({ u: vertexId_, v: vertexIdV});
                }
            }
            return result;
        };

        DirectedGraph.prototype.inDegree = function (vertexId_) {
            return this.isVertex(vertexId_)?Object.keys(this.vertexMap[vertexId_].edges.in).length:-1;
        };

        DirectedGraph.prototype.outDegree = function (vertexId_) {
            return this.isVertex(vertexId_)?Object.keys(this.vertexMap[vertexId_].edges.out).length:-1;
        };

        DirectedGraph.prototype.getVertexProperty = function(vertexId_) {
            var vertexDescriptor = this.vertexMap[vertexId_];
            if (!((vertexDescriptor !== null) && vertexDescriptor)) {
                return void 0;
            }
            return this.vertexMap[vertexId_].properties;
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
                var jstype = helperFunctions.JSType(request_);
                if (jstype !== '[object Object]') {
                    break;
                }
                jstype = helperFunctions.JSType(request_.u);
                if (jstype !== '[object String]') {
                    break;
                }
                jstype = helperFunctions.JSType(request_.v);
                if (jstype !== '[object String]') {
                    break;
                }
                var vertexU = this.vertexMap[request_.u];
                var vertexV = this.vertexMap[request_.v];
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
        if (digraph.constructionError) {
            response.error = digraph.constructionError;
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
