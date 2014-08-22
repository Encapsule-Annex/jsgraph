// digraph-dfs.js

// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html

(function() {

    var dfv = require('./digraph-dfv');
    var createDepthFirstSearchContext = dfv.createDepthFirstSearchContext;
    var depthFirstVisit = dfv.depthFirstVisit;

    var depthFirstSearch = function(digraph_, visitorInterface_, externalContext_) {

        if ((digraph_ === null) || !digraph_ ||
            (visitorInterface_ === null) || !visitorInterface_) {
            throw new Error("Missing required input parameter(s).");
        }

        var searchContext = createDepthFirstSearchContext(digraph_, visitorInterface_, externalContext_);

        var signalStart = true;
        for (var vertexId in digraph_.rootMap) {
            depthFirstVisit(digraph_, searchContext, vertexId, visitorInterface_, signalStart);
            signalStart = false;
        }

        while (Object.keys(searchContext.undiscoveredMap).length) {
            for (vertexId in searchContext.undiscoveredMap) {
                depthFirstVisit(digraph_, searchContext, vertexId, visitorInterface_, signalStart);
                signalStart = false;
                break;
            }
        }

        return true;
    };

    module.exports = {
        createDepthFirstSearchContext: createDepthFirstSearchContext,
        depthFirstVisit: depthFirstVisit,
        depthFirstSearch: depthFirstSearch
    };

})();




