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
    var inBreakScope = false;
    var createBreadthFirstSearchContext = function() {
        var contextResponse = createBreadthFirstSearchContext({ digraph: request_.digraph });
        if (contextResponse.error) {
            errors.unshift(contextResponse.error);
            return undefined;
        }
        return contextResponse.result;
    };
    while (!inBreakScope) {
        inBreakScope = true;

        var request = null;

        // Verify the outer shape of the request object.
        var innerResponse = helperFunctions.getJSType(request_);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing request object ~. Found type '" + innerResponse + "'.");
            break;
        }
        request = {};
        innerResponse = helperFunctions.getJSType(request_.digraph);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required DirectedGraph reference ~.digraph. Found type '" + innerResponse + "'.");
            break;
        }
        request.digraph = request_.digraph;
        innerResponse = helperFunctions.getJSType(request_.visitor);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required visitor object reference ~.visitor. Found type '" + innerResponse + "'.");
            break;
        }
        request.visitor = request_.visitor;
        innerResponse = helperFunctions.getJSType(request_.options);
        if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
            errors.unshift("Options object ~.options is the wrong type. Found type '" + innerResponse + "'.");
            break;
        }
        request.options = {};
        if (innerResponse === '[object Object]') {
            innerResponse = helperFunctions.getJSType(request_.options.startVector);
            switch (innerResponse) {
            case '[object Undefined]':
                break;
            case '[object String]':
                request.options.startVector = [ request_.options.startVector ];
                break;
            case '[object Array]':
                request.options.startVector = request_.options.startVector;
                break;
            default:
                errors.unshift("Options object property ~.options.startVector is the wrong type. Expected either '[object String]', '[object Array]', or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            } // end switch

            if (errors.length) {
                break;
            }

            innerResponse = helperFunctions.getJSType(request_.options.signalStart);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Boolean]')) {
                errors.unshift("Options object property ~.options.signalStart is the wrong type. Expected either '[object Boolean]' or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[objectBoolean]') {
                request.options.signalStart = request_.options.signalStart;
            }

            innerResponse = helperFunctions.getJSType(request_.options.searchContext);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
                errors.unshift("Options object property ~.options.searchContext is the wrong type. Expected either '[object Object]' or '[object Undefined']. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[object Object]') {
                request.options.searchContext = request_.options.searchContext;
            }

        } // end if options object specified
        
        helperFunctions.setValueIfUndefined(request.options.startVector, request.digraph.getRootVertices);
        helperFunctions.setValueIfUndefined(request.options.signalStart, true);
        helperFunctions.setValueIfUndefined(request.options.searchContext, createBreadthFirstSearchContext);

        if (errors.length) {
            break;
        }

        var searchQueue = [];

        var initializeAsVisit = !(startVertexId_ instanceof Array);

        var signalStart = ((signalStartVertex_ !== null) && signalStartVertex_) || false;

        var continueSearch = true;

        var enqueueRootVertex = function(rootVertexId_) {

            var continueSearch = true;

            var vertex = digraph_.vertexMap[rootVertexId_];
            if ((vertex === null) || !vertex) {
                throw new Error("BFV request failed. Vertex '" + rootVertexId_ + "' not found in specfied directed graph container.");
            }

            if (searchContext_.colorMap[rootVertexId_] !== colors.white) {
                throw new Error("BFV request failed. Vertex '" + rootVertexId_ + "' color map not initialized to white.");
            }

            // discoverVertex visitor callback (on rootVertexId_)
            if ((visitorInterface_.dicoverVertex !== null) && visitorInterface_.discoverVertex) {
                continueSearch = verifyVisitorResponse(visitorInterface_.discoverVertex(rootVertexId_, digraph_));
            }

            delete searchContext_.undiscoveredMap[rootVertexId_];

            // startVertex visitor callback (conditional)
            if (signalStart && (visitorInterface_.startVertex !== null) && visitorInterface_.startVertex) {
                continueSearch = continueSearch && verifyVisitorResponse(visitorInterface_.startVertex(rootVertexId_, digraph_));
            }

            searchQueue.push(rootVertexId_);
            searchContext_.colorMap[rootVertexId_] = colors.gray;

            return continueSearch;

        };

        if (initializeAsVisit) {
            continueSearch = enqueueRootVertex(startVertexId_);
        } else {

            // initialize as a breadth-first search (i.e. start with multiple root vertices as opposed to one).
            for (var vertexIndex in startVertexId_) {
                continueSearch = enqueueRootVertex(startVertexId_[vertexIndex]);
                if (!continueSearch) {
                    break;
                }
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
        response.error = errors.unshift ' ';
    } else {
        response.result = {
            searchCompleted: continueSearch,
            searchContext: searchContext
        };
    }
    return response;
};
