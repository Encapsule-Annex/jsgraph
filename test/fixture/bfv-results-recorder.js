// bfv-results-recorder.js

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder() {
        var self = this;
        this.results = [];
        this.step = 0;

        this.visitorInterface = {
            initializeVertex: function(u, g) {
                self.results.push(self.step++ + " initializeVertex " + u);
                return true;
            },
            startVertex: function(s, g) {
                self.results.push(self.step++ + " startVertex " + s);
                return true;
            },
            discoverVertex: function(u, g) {
                self.results.push(self.step++ + " discoverVertex " + u);
                return true;
            },
            examineVertex: function(u, g) {
                self.results.push(self.step++ + " examineVertex " + u);
                return true;
            },
            examineEdge: function(u, v, g) {
                self.results.push(self.step++ + " examineEdge [" + u + "," + v + "]");
                return true;
            },
            treeEdge: function(u, v, g) {
                self.results.push(self.step++ + " treeEdge [" + u + "," + v + "]");
                return true;
            },
            nonTreeEdge: function(u, v, g) {
                self.results.push(self.step++ + " nonTreeEdge [" + u + "," + v + "]");
                return true;
            },
            grayTarget: function(u, v, g) {
                self.results.push(self.step++ + " grayTarget [" + u + "," + v + "]");
                return true;
            },
            blackTarget: function(u, v, g) {
                self.results.push(self.step++ + " blackTarget [" + u + "," + v + "]");
                return true;
            },
            finishVertex: function(u, g) {
                self.results.push(self.step++ + " finishVertex " + u);
                return true;
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };
    }

    return SearchPathRecorder;

})();
