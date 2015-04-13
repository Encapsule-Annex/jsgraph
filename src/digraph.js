// disgraph.js
// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html
// http://en.wikipedia.org/wiki/Directed_graph

var importJSON = require('./digraph-json-import');
var exportJSON = require('./digraph-json-export');

(function() {

    var DirectedGraph = (function() {

        function DirectedGraph(json_) {
            this.vertexMap = {};
            this.rootMap = {};
            this.leafMap = {};
            this.edgeCount = 0;
            if ((json_ !== null) && json_) {
                importJSON(this, json_);
            }
        }

        DirectedGraph.prototype.type = "directed";

        DirectedGraph.prototype.getVertices = function() {
            vertices = [];
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

        DirectedGraph.prototype.addVertex = function (vertexId_, properties_) {
            if ((vertexId_ === null) || !vertexId_) {
                throw new Error("Missing required input parameter.");
            }
            var vertex = this.vertexMap[vertexId_];
            if ((vertex === null) || !vertex) {
                vertex = this.vertexMap[vertexId_] = {};
                vertex.edges = {};
                vertex.edges.in = {};
                vertex.edges.out = {};
                this.rootMap[vertexId_] = {};
                this.leafMap[vertexId_] = {};
            }
            if ((properties_ !== null) && properties_) {
                vertex.properties = properties_;
            }
            return vertexId_;
        };

        DirectedGraph.prototype.isVertex = function (vertexId_) {
            if ((vertexId_ === null) || !vertexId_) {
                throw new Error("Missing required input parameter.");
            }
            var vertex = this.vertexMap[vertexId_];
            return (vertex !== null) && vertex && true || false;
        };
            
        DirectedGraph.prototype.removeVertex = function (vertexId_) {
            if ((vertexId_ === null) || !vertexId_) {
                throw new Error("Missing required input parameter.");
            }
            var vertexU = this.vertexMap[vertexId_];
            if ((vertexU === null) || !vertexU) {
                return false;
            }
            var vertexIdX;
            for (vertexIdX in vertexU.edges.out) {
                this.removeEdge(vertexId_, vertexIdX);
            }
            for (vertexIdX in vertexU.edges.in) {
                this.removeEdge(vertexIdX, vertexId_);
            }
            delete this.vertexMap[vertexId_];
            delete this.rootMap[vertexId_];
            delete this.leafMap[vertexId_];
            return true;
        };

        DirectedGraph.prototype.addEdge = function (vertexIdU_, vertexIdV_, properties_) {
            this.addVertex(vertexIdU_);
            this.addVertex(vertexIdV_);
            var outEdge = this.vertexMap[vertexIdU_].edges.out[vertexIdV_];
            if ((outEdge === null) || !outEdge) {
                outEdge = this.vertexMap[vertexIdU_].edges.out[vertexIdV_] = {};
                delete this.leafMap[vertexIdU_];
            }
            var inEdge = this.vertexMap[vertexIdV_].edges.in[vertexIdU_];
            if ((inEdge === null) || !inEdge) {
                inEdge = this.vertexMap[vertexIdV_].edges.in[vertexIdU_] = {};
                this.edgeCount++;
                delete this.rootMap[vertexIdV_];
            }
            if ((properties_ !== null) && properties_) {
                outEdge.properties = properties_;
            }
            return { u: vertexIdU_, v: vertexIdV_ };
        };

        DirectedGraph.prototype.removeEdge = function(vertexIdU_, vertexIdV_) {
            var vertexU = this.vertexMap[vertexIdU_];
            var vertexV = this.vertexMap[vertexIdV_];
            if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                return false;
            }
            var outEdgeMap = vertexU.edges.out;
            var edge = outEdgeMap[vertexIdV_];
            if (!((edge !== null) && edge)) {
                return false;
            }
            delete outEdgeMap[vertexIdV_];
            if (!Object.keys(outEdgeMap).length) {
                this.leafMap[vertexIdU_] = {};
            }
            var inEdgeMap = vertexV.edges.in;
            delete inEdgeMap[vertexIdU_];
            if (!Object.keys(inEdgeMap).length) {
                this.rootMap[vertexIdV_] = {};
            }
            if (this.edgeCount) {
                this.edgeCount--;
            }
            return true;
        };

        DirectedGraph.prototype.isEdge = function(vertexIdU_, vertexIdV_) {
            var vertexU = this.vertexMap[vertexIdU_];
            var vertexV = this.vertexMap[vertexIdV_];
            if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                return false;
            }
            var edge = vertexU.edges.out[vertexIdV_];
            return (edge !== null) && edge && true || false;
        };

        DirectedGraph.prototype.verticesCount = function() {
            return Object.keys(this.vertexMap).length;
        };

        DirectedGraph.prototype.edgesCount = function() {
            return this.edgeCount;
        };

        DirectedGraph.prototype.getEdges = function() {
            var self = this;
            var edges = [];
            var vertices = this.getVertices();
            var processVertexOutEdges = function(outEdges_) {
                outEdges_.forEach(function(outEdge_) {
                    edges.push(outEdge_);
                });
            };
            vertices.forEach(function(vertexId_) {
                processVertexOutEdges(self.outEdges(vertexId_));
            });
            return edges;
        };
                             
        DirectedGraph.prototype.inEdges = function(vertexId_) {
            var result = [];
            var vertexIdV;
            for (vertexIdV in this.vertexMap[vertexId_].edges.in) {
                result.push({ u: vertexIdV, v: vertexId_});
            }
            return result;
        };

        DirectedGraph.prototype.outEdges = function(vertexId_) {
            var result = [];
            var vertexIdV;
            for (vertexIdV in this.vertexMap[vertexId_].edges.out) {
                result.push({ u: vertexId_, v: vertexIdV});
            }
            return result;
        };

        DirectedGraph.prototype.inDegree = function (vertexId_) {
            var vertexV = this.vertexMap[vertexId_];
            if (!((vertexV !== null) && vertexV)) {
                return -1;
            }
            return Object.keys(vertexV.edges.in).length;
        };

        DirectedGraph.prototype.outDegree = function (vertexId_) {
            var vertexV = this.vertexMap[vertexId_];
            if (!((vertexV !== null) && vertexV)) {
                return -1;
            }
            return Object.keys(this.vertexMap[vertexId_].edges.out).length;
        };

        DirectedGraph.prototype.getVertexProperty = function(vertexId_) {
            var vertexDescriptor = this.vertexMap[vertexId_];
            if (!((vertexDescriptor !== null) && vertexDescriptor)) {
                return void 0;
            }
            return this.vertexMap[vertexId_].properties;
        };

        DirectedGraph.prototype.setVertexProperty = function(vertexId_, ref_) {
            return this.addVertex(vertexId_, ref_);
        };

        DirectedGraph.prototype.getEdgeProperty = function(vertexIdU_, vertexIdV_) {
            var vertexU = this.vertexMap[vertexIdU_];
            var vertexV = this.vertexMap[vertexIdV_];
            if (!((vertexU !== null) && vertexU && (vertexV !== null) && vertexV)) {
                return void 0;
            }
            return vertexU.edges.out[vertexIdV_].properties;
        };

        DirectedGraph.prototype.setEdgeProperty = function(vertexIdU_, vertexIdV_, ref_) {
            return this.addEdge(vertexIdU_, vertexIdV_, ref_);
        };

        DirectedGraph.prototype.toJSON = function(replacer_, space_) {
            return exportJSON(this, replacer_, space_);
        };

        DirectedGraph.prototype.importJSON = function(json_) {
            return importJSON(this, json_);
        };

        return DirectedGraph;

    })();

    module.exports = DirectedGraph;

})();