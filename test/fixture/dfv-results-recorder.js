

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder(chainedVisitor_) {
        var self = this;
        this.results = [];
        this.step = 0;
        this.time = 1;
        this.chainedVisitor = (chainedVisitor_ !== null) && chainedVisitor_ || {};

        this.visitorInterface = {
            // request: { u: vertexId, g: DirectedGraph }
            initializeVertex: function(request) {
                self.results.push(self.step++ + " initializeVertex " + request.u);
                if (self.chainedVisitor.initializeVertex) {
                    return self.chainedVisitor.initializeVertex(request);
                }
                return true;
            },
            // request: { u: vertexId, g: DirectedGraph }
            startVertex: function (request) {
                self.results.push(self.step++ + " startVertex " + request.u);
                if (self.chainedVisitor.startVertex) {
                    return self.chainedVisitor.startVertex(request);
                }
                return true;
            },
            // request: { u: vertexId, g: DirectedGraph }
            discoverVertex: function(request) {
                self.results.push(self.step++ + " discoverVertex " + request.u + " at time " + self.time);
                self.time++;
                if (self.chainedVisitor.discoverVertex) {
                    return self.chainedVisitor.discoverVertex(request);
                }
                return true;
            },
            // request: { e: { u: VertexId, v: VertexId }, g: DirectedGraph }
            examineEdge: function(request) {
                self.results.push(self.step++ + " examineEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.examineEdge) {
                    return self.chainedVisitor.examineEdge(request);
                }
                return true;
            },
            // request: { e: { u: VertexId, v: VertexId }, g: DirectedGraph }
            treeEdge: function(request) {
                self.results.push(self.step++ + " treeEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.treeEdge) {
                    return self.chainedVisitor.treeEdge(request);
                }
                return true;
            },
            // request: { e: { u: VertexId, v: VertexId }, g: DirectedGraph }
            backEdge: function(request) {
                self.results.push(self.step++ + " backEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.backEdge) {
                    return self.chainedVisitor.backEdge(request);
                }
                return true;
            },
            // request: { e: { u: VertexId, v: VertexId }, g: DirectedGraph }
            forwardOrCrossEdge: function(request) {
                self.results.push(self.step++ + " forwardOrCrossEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.forwardOrCrossEdge) {
                    return self.chainedVisitor.forwardOrCrossEdge(request);
                }
                return true;
            },
            // request: { u: vertexId, g: DirectedGraph }
            finishVertex: function(request) {
                self.results.push(self.step++ + " finishVertex " + request.u + " at time " + self.time);
                self.time++;
                if (self.chainedVisitor.finishVertex) {
                    return self.chainedVisitor.finishVertex(request);
                }
                return true;
            },
            // request: { e: { u: VertexId, v: VertexId }, g: DirectedGraph }
            finishEdge: function(request) {
                self.results.push(self.step++ + " finishEdge [" + request.e.u + "," + request.e.v + "]");
                self.time++;
                if (self.chainedVisitor.finishVertex) {
                    return self.chainedVisitor.finishVertex(request);
                }
                return true;
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };

    }

    return SearchPathRecorder;

})();

