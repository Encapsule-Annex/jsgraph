// bfv-results-recorder.js

module.exports = SearchPathRecorder = (function() {

    function SearchPathRecorder() {
        var self = this;
        this.results = [];
        this.step = 0;

        this.visitorInterface = {
            initializeVertex: function(u, g) {
                self.results.push(self.step++ + " initializeVertex " + u);
            },
            startVertex: function(s, g) {
                self.results.push(self.step++ + " startVertex " + s);
            },
            discoverVertex: function(u, g) {
                self.results.push(self.step++ + " discoverVertex " + u);
            },
            examineVertex: function(u, g) {
                self.results.push(self.step++ + " examineVertex " + u);
            },
            examineEdge: function(u, v, g) {
                self.results.push(self.step++ + " examineEdge [" + u + "," + v + "]");
            },
            treeEdge: function(u, v, g) {
                self.results.push(self.step++ + " treeEdge [" + u + "," + v + "]");            },
            nonTreeEdge: function(u, v, g) {
                 self.results.push(self.step++ + " nonTreeEdge [" + u + "," + v + "]");           },
            grayTarget: function(u, v, g) {
                  self.results.push(self.step++ + " grayTarget [" + u + "," + v + "]");          },
            blackTarget: function(u, v, g) {
                   self.results.push(self.step++ + " blackTarget [" + u + "," + v + "]");         },
            finishVertex: function(u, g) {
                self.results.push(self.step++ + " finishVertex " + u);
            }
        };

        this.toJSON = function() {
            return JSON.stringify(self.results);
        };
    }

    return SearchPathRecorder;

})();
