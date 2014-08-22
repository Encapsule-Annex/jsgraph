

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder() {

        this.results = [];
        this.step = 0;
        this.time = 1;

        var self = this;

        this.visitorInterface = {

            initializeVertex: function(u, g) {
                self.results.push(self.step++ + " initializeVertex " + u);
            },
            startVertex: function (s, g) {
                self.results.push(self.step++ + " startVertex " + s);
            },
            discoverVertex: function(u, g) {
                self.results.push(self.step++ + " discoverVertex " + u + " at time " + self.time);
                self.time++;
            },
            examineEdge: function(u, v, g) {
                self.results.push(self.step++ + " examineEdge [" + u + "," + v + "]");
            },
            treeEdge: function(u, v, g) {
                self.results.push(self.step++ + " treeEdge [" + u + "," + v + "]");
            },
            backEdge: function(u, v, g) {
                self.results.push(self.step++ + " backEdge [" + u + "," + v + "]");
            },
            forwardOrCrossEdge: function(u, v, g) {
                self.results.push(self.step++ + " forwardOrCrossEdge [" + u + "," + v + "]");
            },
            finishVertex: function(u, g) {
                self.results.push(self.step++ + " finishVertex " + u + " at time " + self.time);
                self.time++;
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };

    }

    return SearchPathRecorder;

})();

