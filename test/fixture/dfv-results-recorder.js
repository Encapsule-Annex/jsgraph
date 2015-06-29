

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder() {

        this.results = [];
        this.step = 0;
        this.time = 1;

        var self = this;

        this.visitorInterface = {

            initializeVertex: function(u, g) {
                self.results.push(self.step++ + " initializeVertex " + u);
                return true;
            },
            startVertex: function (s, g) {
                self.results.push(self.step++ + " startVertex " + s);
                return true;
            },
            discoverVertex: function(u, g) {
                self.results.push(self.step++ + " discoverVertex " + u + " at time " + self.time);
                self.time++;
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
            backEdge: function(u, v, g) {
                self.results.push(self.step++ + " backEdge [" + u + "," + v + "]");
                return true;
            },
            forwardOrCrossEdge: function(u, v, g) {
                self.results.push(self.step++ + " forwardOrCrossEdge [" + u + "," + v + "]");
                return true;
            },
            finishVertex: function(u, g) {
                self.results.push(self.step++ + " finishVertex " + u + " at time " + self.time);
                self.time++;
                return true;
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };

    }

    return SearchPathRecorder;

})();

