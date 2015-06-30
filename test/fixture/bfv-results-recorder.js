// bfv-results-recorder.js

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder(chainedVisitor_) {
        var self = this;
        this.results = [];
        this.step = 0;
        this.chainedVisitor = (chainedVisitor_ !== null) && chainedVisitor_ || {};
        
        this.visitorInterface = {
            // request = { u: vertexId, g: DirectedGraph }
            initializeVertex: function(request) {
                self.results.push(self.step++ + " initializeVertex " + request.u);
                if (self.chainedVisitor.initializeVertex) {
                    return self.chainedVisitor.initializeVertex(request);
                }
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            startVertex: function(request) {
                self.results.push(self.step++ + " startVertex " + request.u);
                if (self.chainedVisitor.startVertex) {
                    return self.chainedVisitor.startVertex(request);
                }
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            discoverVertex: function(request) {
                self.results.push(self.step++ + " discoverVertex " + request.u);
                if (self.chainedVisitor.discoverVertex) {
                    return self.chainedVisitor.discoverVertex(request);
                }
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            examineVertex: function(request) {
                self.results.push(self.step++ + " examineVertex " + request.u);
                if (self.chainedVisitor.examineVertex) {
                    return self.chainedVisitor.examineVertex(request);
                }
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            examineEdge: function(request) {
                self.results.push(self.step++ + " examineEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.examineEdge) {
                    return self.chainedVisitor.examineEdge(request);
                }
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            treeEdge: function(request) {
                self.results.push(self.step++ + " treeEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.treeEdge) {
                    return self.chainedVisitor.treeEdge(request);
                }
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            nonTreeEdge: function(request) {
                self.results.push(self.step++ + " nonTreeEdge [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.nonTreeEdge) {
                    return self.chainedVisitor.nonTreeEdge(request);
                }
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            grayTarget: function(request) {
                self.results.push(self.step++ + " grayTarget [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.grayTarget) {
                    return self.chainedVisitor.grayTarget(request);
                }
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            blackTarget: function(request) {
                self.results.push(self.step++ + " blackTarget [" + request.e.u + "," + request.e.v + "]");
                if (self.chainedVisitor.blackTarget) {
                    return self.chainedVisitor.blackTarget(request);
                }
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            finishVertex: function(request) {
                self.results.push(self.step++ + " finishVertex " + request.u);
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
