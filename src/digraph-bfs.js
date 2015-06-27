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
var createBreadthFirstSearchContext = module.exports.createBreadthFirstSearchContext = require('./digraph-bfs-context');
var callBFSVisitor = require('./digraph-bfs-visitor');

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

    var nrequest = null; // normalized request object
    var response = { error: null, result: null };
    var errors = [];
    var continueSearch = true;
    var inBreakScope = false;
    var searchQueue = [];


    while (!inBreakScope) {
        inBreakScope = true;

        var innerResponse = normalizeRequest(request_);
        if (innerResponse.error) {
            errors.unshift(innerResponse.error);
            break;
        }
        nrequest = innerResponse.result;
        var index, vertexId; 

        // initializeVertex visitor callback.
        if (nrequest.options.searchContext.searchStatus === 'pending') {
            for (vertexId in nrequest.options.searchContext.colorMap) {
                innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'initializeVertex', request: { u: vertexId, g: nrequest.digraph }});
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                continueSearch = innerResponse.result;
                if (!continueSearch) {
                    break;
                }
            }
        }

        nrequest.options.searchContext.searchStatus = 'active';

        if (errors.length || !continueSearch) {
            break;
        }
        
        // Initialize the BF visit or search.
        // Note that all that distinguishes visit from search is the number of starting vertices. One -> visit, N -> search.

        for (index in nrequest.options.startVector) {
            var startingVertexId = nrequest.options.startVector[index];
            // Ensure the starting vertex is in the graph container.
            if (!nrequest.digraph.isVertex(startingVertexId)) {
                errors.unshift("BF* request failed. Vertex '" + startingVertexId + "' not found in specfied directed graph container.");
                break;
            }
            // Ensure the vertex is white in the color map.
            if (nrequest.options.searchContext.colorMap[startingVertexId] !== colors.white) {
                errors.unshift("BF* request failed. Vertex '" + startingVertexId + "' color map not initialized to white.");
                break;
            }
            // discoverVertex visitor callback.
            innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'discoverVertex', request: { u: startingVertexId, g: nrequest.digraph }});
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }
            continueSearch = innerResponse.result;

            // Remove the vertex from the undiscovered vertex map.
            delete nrequest.options.searchContext.undiscoveredMap[startingVertexId];

            // Conditionally exit the loop if discoverVertex returned false.
            if (!continueSearch) {
                break;
            }

            // startVertex visitor callback.
            innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'startVertex', request: { u: startingVertexId, g: nrequest.digraph }});
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }
            continueSearch = innerResponse.result;
            // Add the vertex to the search
            searchQueue.push(startingVertexId);

            // Color the vertex discovered (gray)
            nrequest.options.searchContext.colorMap[startingVertexId] = colors.gray;

            // Conditionally exit the loop if discoverVertex returned false.
            if (!continueSearch) {
                break;
            }

        } // for initialize search

        // Execute the main breadth-first algorithm using the starting vertex set as the initial contents of the searchQueue.
        while (searchQueue.length && continueSearch && !errors.length) {

            vertexId = searchQueue.shift();

            // By convention
            nrequest.options.searchContext.colorMap[vertexId] = colors.black;

            // examineVertex visitor callback.
            innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'examineVertex', request: { u: vertexId, g: nrequest.digraph }});
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }
            continueSearch = innerResponse.result;
            if (!continueSearch) {
                break;
            }

            var outEdges = nrequest.digraph.outEdges(vertexId);

            for (index in outEdges) {

                var outEdge = outEdges[index];

                // examineEdge visitor callback.
                innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'examineEdge', request: { e: outEdge, g: nrequest.digraph }});
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                continueSearch = innerResponse.result;
                if (!continueSearch) {
                    break;
                }

                var colorV = nrequest.options.searchContext.colorMap[outEdge.v];
                switch (colorV) {

                case colors.white:
                    // discoverVertex visitor callback.
                    innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'dicoverVertex', request: { u: outEdge.v, g: nrequest.digraph }});
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    delete nrequest.options.searchContext.undiscoveredMap[outEdge.v];
                    if (!continueSearch) {
                        break;
                    }
                    // treeEdge visitor callback.
                    innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'treeEdge', request: { e: outEdge, g: nrequest.digraph }});
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    searchQueue.push(outEdge.v);
                    nrequest.options.searchContext.colorMap[outEdge.v] = colors.gray;
                    break;

                case colors.gray:
                    // nonTreeEdge visitor callback.
                    innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'nonTreeEdge', request: { e: outEdge, g: nrequest.digraph }});
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    if (continueSearch) {
                        // grayTarget visitor callback.
                        innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'grayTarget', request: { e: outEdge, g: nrequest.digraph }});
                        if (innerResponse.error) {
                            errors.unshift(innerResponse.error);
                            break;
                        }
                        continueSearch = innerResponse.result;
                    }
                    break;

                case colors.black:
                    // nonTreeEdge visitor callback.
                    innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'nonTreeEdge', request: { e: outEdge, g: nrequest.digraph }});
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    if (continueSearch) {
                        // blackTarget visitor callback.
                        innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'blackTarget', request: { e: outEdge, g: nrequest.digraph }});
                        if (innerResponse.error) {
                            errors.unshift(innerResponse.error);
                            break;
                        }
                        continueSearch = innerResponse.result;
                    }
                    break;

                default:
                    throw new Error("BF* failure: An invalid color value was found in the color map for vertex '" + outEdge.v + "'. Please file an issue!");

                } // switch (colorV)

            } // for (outEdge in outEdges)

            if (errors.length || !continueSearch) {
                break;
            }

            // finishVertex visitor callback.
            innerResponse = callBFSVisitor({ visitor: nrequest.visitor, method: 'finishVertex', request: { u: vertexId, g: nrequest.digraph }});
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }
            continueSearch = innerResponse.result;
            if (!continueSearch) {
                break;
            }

        } // while (searchQueue.length)

    } // end while (!inBreakScope)

    if (errors.length) {
        if (nrequest) {
            nrequest.options.searchContext.searchStatus = 'error';
        }
        errors.unshift("jsgraph.directed.breadthFirst* failure:");
        response.error = errors.join(' ');
    } else {
        nrequest.options.searchContext.searchStatus = continueSearch?'completed':'terminated';
        response.result = {
            searchCompleted: continueSearch,
            searchContext: nrequest.options.searchContext
        };
    }
    return response;
};
