
// Inspired by the design of the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html

(function() {

    /*
      All visitor callback functions are optional.
      See also DFS Visitor Concept documentation from the BGL:
      http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html

      var depthFirstVisitorInterface = {
          initializeVertex: function(vertexId_, digraph_),
          startVertex: function(vertexId_, digraph_),
          discoverVertex: function(vertexId_, digraph_),
          examineEdge: function(vertexIdU_, vertexIdV_, digraph_),
          treeEdge: function(vertexIdU_, vertexIdV_, digraph_),
          backEdge: function(vertexIdU_, vertexIdV_, digraph_),
          forwardOrCrossEdge: function(vertexIdU_, vertexIdV_, digraph_),
          finishVertex(vertexId_, digraph_)
      };
    */

    var colors = module.exports.colors = { white: 0, gray: 1, black: 2 };

    module.exports.createDepthFirstSearchContext = function (digraph_, visitorInterface_) {
        if ((digraph_ === null) || !digraph_) {
            throw new Error("Missing required graph input parameter.");
        }
        var dfsContext = {
            signalStartVertex: true,
            colorMap: {},
            undiscoveredMap: {},
        };
        for (var vertexId in digraph_.vertexMap) {
            dfsContext.colorMap[vertexId] = colors.white;
            dfsContext.undiscoveredMap[vertexId] = true;
            if ((visitorInterface_ !== null) && visitorInterface_ &&
                (visitorInterface_.initializeVertex !== null) && visitorInterface_.initializeVertex) {
                visitorInterface_.initializeVertex(vertexId, digraph_);
            }
        }
        return dfsContext;
    };

    module.exports.depthFirstVisit = function (digraph_, searchContext_, startVertexId_, visitorInterface_) {

        if ((digraph_ === null) || !digraph_ ||
            (searchContext_ === null) || !searchContext_ ||
            (startVertexId_ === null) || !startVertexId_ ||
            (visitorInterface_ === null) || !visitorInterface_) {
            throw new Error("Missing required input parameter(s).");
        }

        var vertex = digraph_.vertexMap[startVertexId_];
        if ((vertex === null) || !vertex) {
            throw new Error("DFV request failed. Vertex '" + startVertexId_ + "' not found in specfied directed graph container.");
        }

        if (searchContext_.colorMap[startVertexId_] !== colors.white) {
            throw new Error("DFV request failed. Vertex '" + startVertexId_ + "' color map not initialized to white.");
        }

        var continueSearch = true;

        var verifyVisitorResponse = function (visitorResponse_) {
            var type = Object.prototype.toString.call(visitorResponse_);
            if (type !== '[object Boolean]') {
                throw new Error("All jsgraph visitor functions are required to return a boolean flag indicating if the search algorithm should proceed or not. Visitor returned type '" + type + "'.");
            }
            return visitorResponse_;
        };

        // startVertex visitor callback
        if (searchContext_.signalStartVertex) {
            if ((visitorInterface_.startVertex !== null) && visitorInterface_.startVertex) {
                continueSearch = verifyVisitorResponse(visitorInterface_.startVertex(startVertexId_, digraph_));
            }
            searchContext_.signalStartVertex = false;
        }

        // searchStack is a FILO of FIFO's (or stack of queues if you prefer)
        // initialized with the starting vertex identifier.
        //
        var searchStack = [ [ startVertexId_ ] ]; 

        // Iterate until search tree completion dispatching visitor call backs.
        //
        while (searchStack.length && continueSearch) {

            // Peek at the identifier of the vertex at the front of the queue atop the search stack.

            var vertexIdV = (searchStack[searchStack.length - 1])[0];

            switch (searchContext_.colorMap[vertexIdV]) {

            case colors.white:

                // Remove the vertex from the undiscovered map.
                delete searchContext_.undiscoveredMap[vertexIdV];

                // Callback: treeEdge
                if (searchStack.length > 1) {
                    if ((visitorInterface_.treeEdge !== null) && visitorInterface_.treeEdge) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.treeEdge((searchStack[searchStack.length - 2])[0], vertexIdV, digraph_));
                    }
                }

                // Callback: discoverVertex
                if ((visitorInterface_.discoverVertex !== null) && visitorInterface_.discoverVertex && continueSearch) {
                    continueSearch = verifyVisitorResponse(visitorInterface_.discoverVertex(vertexIdV, digraph_));
                }

                // Change the vertex's state to GRAY to record its discovery.
                searchContext_.colorMap[vertexIdV] = colors.gray;

                // Examine adjacent vertices
                var vertexOutEdges = digraph_.outEdges(vertexIdV);
                var adjacentVertices = [];
                while (vertexOutEdges.length && continueSearch) {

                    var adjacentVertex = vertexOutEdges.shift().v;

                    // Callback: examineEdge
                    if ((visitorInterface_.examineEdge !== null) && visitorInterface_.examineEdge) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.examineEdge(vertexIdV, adjacentVertex, digraph_));
                    }

                    if (!continueSearch) {
                        break;
                    }

                    var adjacentColor = searchContext_.colorMap[adjacentVertex];

                    switch (adjacentColor) {

                    case colors.white:
                        adjacentVertices.push(adjacentVertex);
                        break;
                    case colors.gray:
                        if ((visitorInterface_.backEdge !== null) && visitorInterface_.backEdge) {
                            continueSearch = verifyVisitorResponse(visitorInterface_.backEdge(vertexIdV, adjacentVertex, digraph_));
                        }
                        break;
                    case colors.black:
                        if ((visitorInterface_.forwardOrCrossEdge !== null) && visitorInterface_.forwardOrCrossEdge) {
                            continueSearch = verifyVisitorResponse(visitorInterface_.forwardOrCrossEdge(vertexIdV, adjacentVertex, digraph_));
                        }
                        break;
                    }
                }
                if (adjacentVertices.length) {
                    searchStack.push(adjacentVertices);
                }
                break;

            case colors.gray:

                // change the vertex's state to black to indicate search completion
                searchContext_.colorMap[vertexIdV] = colors.black;

                if ((visitorInterface_.finishVertex !== null) && visitorInterface_.finishVertex) {
                    continueSearch = verifyVisitorResponse(visitorInterface_.finishVertex(vertexIdV, digraph_));
                }

                var finishedVertexId = searchStack[searchStack.length - 1].shift();
                if (!(searchStack[searchStack.length - 1].length)) {
                    searchStack.pop();
                }
                break;

            case colors.black:

                // The black sheep. The only way for a vertex to end up in this state
                // is for it to be queued after another adjacent vertex that reaches
                // it first in the depth-first search tree. By definition it's already
                // been 'finished'. 

                if (searchStack.length > 1) {
                    if ((visitorInterface_.forwardOrCrossEdge !== null) && visitorInterface_.forwardOrCrossEdge) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.forwardOrCrossEdge((searchStack[searchStack.length - 2])[0], vertexIdV, digraph_));
                    }
                }

                searchStack[searchStack.length - 1].shift();
                if (!searchStack[searchStack.length - 1].length) {
                    searchStack.pop();
                }
                break;

            default:
                throw new Error("DFV failure: An invalid color value was found in the color map for vertex '" + vertexIdV + "'. Please file an issue!");
            }
        }
        return continueSearch;
    };

})();

