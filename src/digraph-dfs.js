// digraph-dfs.js

// Inspired by the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html

(function() {

    var dfv = require('./digraph-dfv');
    var createDepthFirstSearchContext = dfv.createDepthFirstSearchContext;
    var depthFirstVisit = dfv.depthFirstVisit;

    /*

      request = {
          digraph: reference to jsgraph.DirectedGraph container object (required)
          visitor: reference to jsgraph DFV visitor object (required)
          options: {
              startVector: reference to a vertex ID string, or an array of vertex ID strings (optional)
                     Note: if ommitted, DFS uses the digraph's root vertex set as the start vertex set
              signalStart: Boolean flag (optional - default is true if ommitted)
                     Note: By default, DFS will call startVertex on each search root vertex.
                     In advanced scenarios you may wish to override this behavior.
              searchContext: reference to DFS search context object (optional)
                     Note: By default, DFS allocates the search context internally and returns it to
                     the caller. In advanced scenarios you may wish to provide a pre-initialized
                     (or potentially pre-colored) search context object.
          }
      }

      response = {
          error: null indicating success or a string containing an explanation of the failure
          result: {
              searchCompleted: Boolean flag
              searchContext: reference to the DFS search context object
          } // or null to indicate a failure
     */

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




