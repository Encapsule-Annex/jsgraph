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
                vertex.properties = properties_;
                this.rootMap[vertexId_] = {};
                this.leafMap[vertexId_] = {};
            }
            return vertexId_;
        };

        DirectedGraph.prototype.removeVertex = function (vertexId_) {
            if ((vertexId_ === null) || !vertexId_) {
                throw new Error("Missing required input parameter.");
            }
            var vertexU = this.vertexMap[vertexId_];
            if ((vertexU === null) || !vertexU) {
                return true;
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
            var vertexU = this.addVertex(vertexIdU_);
            var vertexV = this.addVertex(vertexIdV_);
            var outEdge = this.vertexMap[vertexU].edges.out[vertexIdV_];
            if ((outEdge === null) || !outEdge) {
                outEdge = this.vertexMap[vertexU].edges.out[vertexIdV_] = {};
                outEdge.properties = properties_;
                delete this.leafMap[vertexIdU_];
            }
            var inEdge = this.vertexMap[vertexV].edges.in[vertexIdU_];
            if ((inEdge === null) || !inEdge) {
                inEdge = this.vertexMap[vertexV].edges.in[vertexIdU_] = {};
                this.edgeCount++;
                delete this.rootMap[vertexIdV_];
            }
            return { u: vertexU, v: vertexV };
        };

        DirectedGraph.prototype.removeEdge = function(vertexIdU_, vertexIdV_) {
            var outEdgeMap = this.vertexMap[vertexIdU_].edges.out;
            delete outEdgeMap[vertexIdV_];
            if (!Object.keys(outEdgeMap).length) {
                this.leafMap[vertexIdU_] = {};
            }
            var inEdgeMap = this.vertexMap[vertexIdV_].edges.in;
            delete inEdgeMap[vertexIdU_];
            if (!Object.keys(inEdgeMap).length) {
                this.rootMap[vertexIdV_] = {};
            }
            if (this.edgeCount) {
                this.edgeCount--;
            }
            return true;
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
            return Object.keys(this.vertexMap[vertexId_].edges.in).length;
        };

        DirectedGraph.prototype.outDegree = function (vertexId_) {
            return Object.keys(this.vertexMap[vertexId_].edges.out).length;
        };

        DirectedGraph.prototype.getVertexPropertyObject = function(vertexId_) {
            return this.vertexMap[vertexId_].properties;
        };

        DirectedGraph.prototype.vertexPropertyObject = function(vertexId_) {
            console.log("DirectedGraph.vertexPropertyObject method is deprecated. Please use DirectedGraph.getVertexPropertyObject method instead.");
            return this.getVertexPropertyObject(vertexId_);
        };

        DirectedGraph.prototype.setVertexPropertyObject = function(vertexId_, ref_) {
            this.vertexMap[vertexId_].properties = ref_;
            return vertexId_;
        };

        DirectedGraph.prototype.getEdgePropertyObject = function(vertexIdU_, vertexIdV_) {
            return this.vertexMap[vertexIdU_].edges.out[vertexIdV_].properties;
        };

        DirectedGraph.prototype.setEdgePropertyObject = function(vertexIdU_, vertexIdV_, ref_) {
            this.vertexMap[vertexIdU_].edges.out[vertexIdV_].properties = ref_;
            return { u: vertexIdU_, v: vertexIdV_ };
        };

        DirectedGraph.prototype.edgePropertyObject = function(vertexIdU_, vertexIdV_) {
            console.log("DirectedGraph.edgePropertyObject method is deprecated. Please us DirectedGraph.getEdgePropertyObject method instead.");
            return this.getEdgePropertyObject(vertexIdU_, vertexIdV_);
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