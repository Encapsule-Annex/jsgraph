// bfv-results-recorder.js

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder() {
        var self = this;
        this.results = [];
        this.step = 0;

        this.visitorInterface = {
            // request = { u: vertexId, g: DirectedGraph }
            initializeVertex: function(request) {
                self.results.push(self.step++ + " initializeVertex " + request.u);
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            startVertex: function(request) {
                self.results.push(self.step++ + " startVertex " + request.u);
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            discoverVertex: function(request) {
                self.results.push(self.step++ + " discoverVertex " + request.u);
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            examineVertex: function(request) {
                self.results.push(self.step++ + " examineVertex " + request.u);
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            examineEdge: function(request) {
                self.results.push(self.step++ + " examineEdge [" + request.e.u + "," + request.e.v + "]");
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            treeEdge: function(request) {
                self.results.push(self.step++ + " treeEdge [" + request.e.u + "," + request.e.v + "]");
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            nonTreeEdge: function(request) {
                self.results.push(self.step++ + " nonTreeEdge [" + request.e.u + "," + request.e.v + "]");
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            grayTarget: function(request) {
                self.results.push(self.step++ + " grayTarget [" + request.e.u + "," + request.e.v + "]");
                return true;
            },
            // request = { e: { u: vertexId, v: vertexId }, g: DirectedGraph }
            blackTarget: function(request) {
                self.results.push(self.step++ + " blackTarget [" + request.e.u + "," + request.e.v + "]");
                return true;
            },
            // request = { u: vertexId, g: DirectedGraph }
            finishVertex: function(request) {
                self.results.push(self.step++ + " finishVertex " + request.u);
                return true;
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };
    }

    return SearchPathRecorder;

})();
