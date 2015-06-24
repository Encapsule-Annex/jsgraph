// digraph-dfs.js

// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html

(function() {

    var dfv = require('./digraph-dfv');
    var createDepthFirstSearchContext = dfv.createDepthFirstSearchContext;
    var depthFirstVisit = dfv.depthFirstVisit;

    var depthFirstSearch = function(digraph_, visitorInterface_) {

        var continueSearch = true;

        if ((digraph_ === null) || !digraph_ ||
            (visitorInterface_ === null) || !visitorInterface_) {
            throw new Error("Missing required input parameter(s).");
        }

        var searchContext = createDepthFirstSearchContext(digraph_, visitorInterface_);

        for (var vertexId in digraph_.rootMap) {
            continueSearch = depthFirstVisit(digraph_, searchContext, vertexId, visitorInterface_);
            if (!continueSearch) {
                break;
            }
        }

        while (Object.keys(searchContext.undiscoveredMap).length && continueSearch) {
            throw new Error("Internal error: Undiscovered vertices after DFS completion '" + JSON.searchContext.undiscoveredMap + "'.");
        }

        return continueSearch;
    };

    module.exports = {
        createDepthFirstSearchContext: createDepthFirstSearchContext,
        depthFirstVisit: depthFirstVisit,
        depthFirstSearch: depthFirstSearch
    };

})();




