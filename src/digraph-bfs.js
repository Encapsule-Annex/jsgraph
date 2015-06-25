// Encapsule/jsgraph/src/digraph-bfs.js
//
// Inspired by the design of the Boost Graph Library (BGL)
// http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/index.html

/*
  All visitor callback functions are optional.
  See also BFS Visitor Concept documentation from the BGL:
  http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/BFSVisitor.html

  var breadthFirstVisitorInterface = {
  initializeVertex: function(vertexId_, digraph_),
  discoverVertex: function(vertexId_, digraph_),
  startVertex: function(vertexId_, digraph_),
  examineVertex: function(vertexId_, digraph_),
  examineEdge: function(vertexIdU_, vertexIdV_, digraph_),
  treeEdge: function(vertexIdU_, vertexIdV_, digraph_),
  nonTreeEdge: function(vertexIdU_, vertexIdV_, digraph_),
  grayTarget: function(vertexIdU_, vertexIdV_, digraph_),
  blackTarget: function(vertexIdU_, vertexIdV_, digraph_),
  finishVertex: function(vertexId_, digraph_)
  };
*/

var helperFunctions = require('./helper-functions');
var colors = require('./digraph-bfs-colors');
var createBreadthFirstSearchContext = require('./digraph-bfs-context');

var normalizeRequest = require('./digraph-bfs-request');

/*

  request = {
  digraph: reference to jsgraph.DirectedGraph container object (required)
  visitor: reference to jsgraph BFV visitor object (required)
  options: {
      startVector: reference to a vertex ID string, or an array of vertex ID strings (optional)
          Note: if ommitted, BFS uses the digraph's root vertex set as the start vertex set
      signalStart: Boolean flag (optional - default is true if ommitted)
          Note: By default, BFS will call startVertex on each search root vertex.
          In advanced scenarios you may wish to override this behavior.
      searchContext: reference to BFS search context object (optional)
          Note: By default, BFS allocates the search context internally and returns it to
          the caller. In advanced scenarios you may wish to provide a pre-initialized
          (or potentially pre-colored) search context object.
      }
  }

  response = {
      error: null indicating success or a string containing an explanation of the failure
      result: {
      searchCompleted: Boolean flag
      searchContext: reference to the BFS search context object
  } // or null to indicate a failure

*/


module.exports.breadthFirstSearch = function (request_) {

    var response = { error: null, result: null };
    var errors = [];
    var continueSearch = true;
    var inBreakScope = false;

    while (!inBreakScope) {
        inBreakScope = true;

        var innerResponse = normalizeRequest(request_);
        if (innerResponse.error) {
            errors.unshift(innerResponse.error);
            break;
        }
        if (!innerResponse.guidance) {
            errors.unshift(innerResponse.guidance);
            break;
        }
        var nrequest = innerResponse.result;
        var searchQueue = [];
        
        for (var startingVertexId in nrequest.options.startVector) {
            // Ensure the starting vertex is in the graph container.
            if (!nrequest.digraph.isVertex(startingVertexId)) {
                throw new Error("BFV request failed. Vertex '" + startingVertexId + "' not found in specfied directed graph container.");
            }
            // Ensure the vertex is white in the color map.
            if (nrequest.options.searchContext_.colorMap[startingVertexId] !== colors.white) {
                throw new Error("BFV request failed. Vertex '" + startingVertexId + "' color map not initialized to white.");
            }
            // discoverVertex visitor callback.
            if ((nrequest.visitor.dicoverVertex !== null) && nrequest.visitor.discoverVertex) {
                continueSearch = verifyVisitorResponse(nrequest.visitor.discoverVertex(startingVertexId, digraph_));
            }
            // Remove the vertex from the undiscovered vertex map.
            delete nrequest.options.searchContext.undiscoveredMap[startingVertexId];
            // Conditionally exit the loop if discoverVertex returned false.
            if (!continueSearch) {
                break;
            }
            // startVertex visitor callback.
            if (nrequest.options.signalStart && (nrequest.visitor.startVertex !== null) && nrequest.visitor.startVertex) {
                continueSearch = continueSearch && verifyVisitorResponse(visitorInterface_.startVertex(rootVertexId_, digraph_));
            }
            searchQueue.push(rootVertexId_);
            searchContext_.colorMap[rootVertexId_] = colors.gray;
            // Conditionally exit the loop if discoverVertex returned false.
            if (!continueSearch) {
                break;
            }
        }


        while (searchQueue.length && continueSearch) {

            var vertexId = searchQueue.shift();
            searchContext_.colorMap[vertexId] = colors.black;

            // examineVertex visitor callback.
            if ((visitorInterface_.examineVertex !== null) && visitorInterface_.examineVertex) {
                continueSearch = verifyVisitorResponse(visitorInterface_.examineVertex(vertexId, digraph_));
            }

            if (!continueSearch) {
                continue;
            }

            var outEdges = digraph_.outEdges(vertexId);

            for (var index in outEdges) {

                var outEdge = outEdges[index];

                // examineEdge visitor callback.
                if ((visitorInterface_.examineEdge !== null) && visitorInterface_.examineEdge) {
                    continueSearch = verifyVisitorResponse(visitorInterface_.examineEdge(outEdge.u, outEdge.v, digraph_));
                }

                if (!continueSearch) {
                    break;
                }

                var colorV = searchContext_.colorMap[outEdge.v];
                switch (colorV) {

                case colors.white:
                    // discoverVertex visitor callback.
                    if ((visitorInterface_.discoverVertex !== null) && visitorInterface_.discoverVertex) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.discoverVertex(outEdge.v, digraph_));
                    }
                    delete searchContext_.undiscoveredMap[outEdge.v];

                    if (continueSearch) {
                        // treeEdge visitor callback.
                        if ((visitorInterface_.treeEdge !== null) && visitorInterface_.treeEdge) {
                            continueSearch = verifyVisitorResponse(visitorInterface_.treeEdge(outEdge.u, outEdge.v, digraph_));
                        }
                        searchQueue.push(outEdge.v);
                        searchContext_.colorMap[outEdge.v] = colors.gray;
                    }
                    break;

                case colors.gray:
                    // nonTreeEdge visitor callback.
                    if ((visitorInterface_.nonTreeEdge !== null) && visitorInterface_.nonTreeEdge) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.nonTreeEdge(outEdge.u, outEdge.v, digraph_));
                    }
                    if (continueSearch) {
                        // grayTarget visitor callback.
                        if ((visitorInterface_.grayTarget !== null) && visitorInterface_.grayTarget) {
                            continueSearch = verifyVisitorResponse(visitorInterface_.grayTarget(outEdge.u, outEdge.v, digraph_));
                        }
                    }
                    break;

                case colors.black:
                    // nonTreeEdge visitor callback.
                    if ((visitorInterface_.nonTreeEdge !== null) && visitorInterface_.nonTreeEdge) {
                        continueSearch = verifyVisitorResponse(visitorInterface_.nonTreeEdge(outEdge.u, outEdge.v, digraph_));
                    }
                    if (continueSearch) {
                        // blackTarget visitor callback.
                        if ((visitorInterface_.blackTarget !== null) && visitorInterface_.blackTarget) {
                            continueSearch = verifyVisitorResponse(visitorInterface_.blackTarget(outEdge.u, outEdge.v, digraph_));
                        }
                    }
                    break;

                default:
                    throw new Error("BFV failure: An invalid color value was found in the color map for vertex '" + outEdge.v + "'. Please file an issue!");

                } // switch (colorV)

            } // for (outEdge in outEdges)

            // finishVertex visitor callback.
            if ((visitorInterface_.finishVertex !== null) && visitorInterface_.finishVertex && continueSearch) {
                continueSearch = verifyVisitorResponse(visitorInterface_.finishVertex(vertexId, digraph_));
            }

        } // while (searchQueue.length)

    } // end while (!inBreakScope)

    if (errors.length) {
        response.error = errors.unshift(' ');
    } else {
        response.result = {
            searchCompleted: continueSearch,
            searchContext: searchContext
        };
    }
    return response;
};
