/*
  Encapsule/jsgraph/src/digraph-algorithm-dft.js

  Copyright (C) 2014-2015 Christopher D. Russell

  This library is published under the MIT License and is part of the
  Encapsule Project System in Cloud (SiC) open service architecture.
  Please follow https://twitter.com/Encapsule for news and updates
  about jsgraph and other time saving libraries that do amazing things
  with in-memory data on Node.js and HTML.
*/

var algorithmName = "DFT"; // used in error messages
var colors = require('./digraph-algorithm-common-colors');
var visitorCallback = require('./digraph-algorithm-common-visit');
var normalizeRequest = require('./digraph-algorithm-common-request');


module.exports = function (request_) {

    var nrequest = null; // normalized request
    var response = { error: null, result: null };
    var errors = [];
    var continueSearch = true;
    var inBreakScope = false;

    while (!inBreakScope) {
        inBreakScope = true;
        var index, vertexId;
        var finishedEdges = {};
        var innerRequest = null;
        var hash = null;

        var innerResponse = normalizeRequest(request_);
        if (innerResponse.error) {
            errors.unshift(innerResponse.error);
            break;
        }
        nrequest = innerResponse.result;

        // initializeVertex visitor callback.
        if (nrequest.options.traverseContext.searchStatus === 'pending') {
            for (vertexId in nrequest.options.traverseContext.colorMap) {
                innerResponse = visitorCallback({ algorithm: algorithmName, visitor: nrequest.visitor, method: 'initializeVertex', request: { u: vertexId, g: nrequest.digraph }});
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                continueSearch = innerResponse.result;
                if (!continueSearch) {
                    break;
                }
            } // end for
        } // if searchStatus 'pending'

        nrequest.options.traverseContext.searchStatus = 'active';

        if (errors.length || !continueSearch) {
            break;
        }

        // Outer depth-first search loop iterates over the start vertex set.
        for (index in nrequest.options.startVector) {

            vertexId = nrequest.options.startVector[index];
            
            // Ensure the starting vertex is actually in the graph.
            if (!nrequest.digraph.isVertex(vertexId)) {
                errors.unshift("DFT request failed. Vertex '" + vertexId + "' not found in specified directed graph container.");
                break;
            }

            // Ensure the starting vertex is undicovered (white in the color map).
            if (nrequest.options.traverseContext.colorMap[vertexId] !== colors.white) {
                errors.unshift("DFT request failed. Vertex '" + vertexId + "' color map not initialized to white.");
                break;
            }

            // startVertex visitor callback
            if (nrequest.options.signalStart) {
                innerResponse = visitorCallback({ algorithm: algorithmName, visitor: nrequest.visitor, method: 'startVertex', request: { u: vertexId, g: nrequest.digraph }});
                if (innerResponse.error) {
                    errors.unshift(innerResponse.error);
                    break;
                }
                continueSearch = innerResponse.result;
            }
            if (!continueSearch) {
                break;
            }

            // searchStack is a FILO of FIFO's (or stack of queues if you prefer)
            // initialized with starting vertex set member under-evaluation's ID.
            var searchStack = [ [ vertexId ] ]; 

            // Iterate until search stack is empty, a client visitor method returns false, or an error occurs.
            while (searchStack.length && continueSearch && !errors.length) {

                // Peek at the identifier of the vertex at the front of the queue atop the search stack.

                var currentVertexId = (searchStack[searchStack.length - 1])[0];

                switch (nrequest.options.traverseContext.colorMap[currentVertexId]) {

                case colors.white:

                    // Remove the vertex from the undiscovered map.
                    delete nrequest.options.traverseContext.undiscoveredMap[currentVertexId];

                    // Change the vertex's state to GRAY to record its discovery.
                    nrequest.options.traverseContext.colorMap[currentVertexId] = colors.gray;

                    // discoverVertex visitor callback.
                    innerResponse = visitorCallback({
                        algorithm: algorithmName,
                        visitor: nrequest.visitor,
                        method: 'discoverVertex',
                        request: { u: currentVertexId, g: nrequest.digraph }
                    });
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    if (!continueSearch) {
                        break;
                    }

                    // treeEdge visitor callback.
                    if (searchStack.length > 1) {
                        innerResponse = visitorCallback({
                            algorithm: algorithmName,
                            visitor: nrequest.visitor,
                            method: 'treeEdge',
                            request: { e: { u: searchStack[searchStack.length - 2][0], v: currentVertexId }, g: nrequest.digraph }
                        });
                        if (innerResponse.error) {
                            errors.unshift(innerResponse.error);
                            break;
                        } else {
                            continueSearch = innerResponse.result;
                            if (!continueSearch) {
                                break;
                            }
                        }
                    }

                    // Examine adjacent vertices
                    var vertexOutEdges = nrequest.digraph.outEdges(currentVertexId);
                    var adjacentVertices = [];

                    while (vertexOutEdges.length && !errors.length && continueSearch) {

                        var adjacentVertexId = vertexOutEdges.shift().v;

                        // examineEdge visitor callback.
                        innerResponse = visitorCallback({
                            algorithm: algorithmName,
                            visitor: nrequest.visitor,
                            method: 'examineEdge',
                            request: { e: { u: currentVertexId, v: adjacentVertexId }, g: nrequest.digraph }
                        });
                        if (innerResponse.error) {
                            errors.unshift(innerRepsonse.error);
                            break;
                        }
                        continueSearch = innerResponse.result;
                        if (!continueSearch) {
                            break;
                        }

                        switch (nrequest.options.traverseContext.colorMap[adjacentVertexId]) {

                        case colors.white:
                            adjacentVertices.push(adjacentVertexId);
                            break;
                        case colors.gray:
                            // backEdge visitor callback.
                            innerResponse = visitorCallback({
                                algorithm: algorithmName,
                                visitor: nrequest.visitor,
                                method: 'backEdge',
                                request: { e: { u: currentVertexId, v: adjacentVertexId }, g: nrequest.digraph }
                            });
                            if (innerResponse.error) {
                                errors.unshift(innerResponse.error);
                            } else {
                                continueSearch = innerResponse.result;
                            }
                            break;
                        case colors.black:
                            // forwardOrCrossEdge visitor callback.
                            innerResponse = visitorCallback({
                                algorithm: algorithmName,
                                visitor: nrequest.visitor,
                                method: 'forwardOrCrossEdge',
                                request: { e: { u: currentVertexId, v: adjacentVertexId }, g: nrequest.digraph }
                            });
                            if (innerResponse.error) {
                                errors.unshift(innerResponse.error);
                            } else {
                                continueSearch = innerResponse.result;
                            }
                            break;
                        }
                    }
                    if (adjacentVertices.length) {
                        searchStack.push(adjacentVertices);
                    }                                

                    break;

                case colors.gray:
                    // change the vertex's state to black to indicate search completion.
                    nrequest.options.traverseContext.colorMap[currentVertexId] = colors.black;
                    // finishVertex visitor callback.
                    innerResponse = visitorCallback({
                        algorithm: algorithmName,
                        visitor: nrequest.visitor,
                        method: 'finishVertex',
                        request: { u: currentVertexId, g: nrequest.digraph }
                    });
                    if (innerResponse.error) {
                        errors.unshift(innerResponse.error);
                        break;
                    }
                    continueSearch = innerResponse.result;
                    if (!continueSearch) {
                        break;
                    }
                    var inEdgeSet = nrequest.digraph.inEdges(currentVertexId);
                    while (inEdgeSet.length) {
                        var inEdge = inEdgeSet.pop();
                        hash = inEdge.u + inEdge.v;
                        finishedEdges[hash] = inEdge;
                    }
                    searchStack[searchStack.length - 1].shift();
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
                        innerRequest = { e: { u: (searchStack[searchStack.length - 2])[0], v: currentVertexId }, g: nrequest.digraph };
                        innerResponse = visitorCallback({
                            algorithm: algorithmName,
                            visitor: nrequest.visitor,
                            method: 'forwardOrCrossEdge',
                            request: innerRequest
                        });
                        if (innerResponse.error) {
                            errors.unshift(innerResponse.error);
                            break;
                        }
                        continueSearch = innerResponse.result;
                        if (!continueSearch) {
                            break;
                        }
                    }
                    searchStack[searchStack.length - 1].shift();
                    if (!searchStack[searchStack.length - 1].length) {
                        searchStack.pop();
                    }
                    break;

                default:
                    errors.unshift("DFT failure: An invalid color value was found in the color map for vertex '" + currentVertexId + "'.");
                    break;
                }
            } // while search stack is not empty

            if (errors.length || !continueSearch) {
                break;
            }
            
        } // end while outer depth-first search loop

        if (errors.length || !continueSearch) {
            break;
        }

        for (hash in finishedEdges) {
            innerRequest = { e: finishedEdges[hash], g: nrequest.digraph };
            innerResponse = visitorCallback({
                algorithm: algorithmName,
                visitor: nrequest.visitor,
                method: 'finishEdge',
                request: innerRequest
            });
            if (innerResponse.error) {
                errors.unshift(innerResponse.error);
                break;
            }
            continueSearch = innerResponse.result;
            if (!continueSearch) {
                break;
            }

        } // end for


    } // while !inBreakScope

    if (errors.length) {
        if (nrequest) {
            nrequest.options.traverseContext.searchStatus = 'error';
        }
        errors.unshift("jsgraph.directed.depthFirstTraverse algorithm failure:");
        response.error = errors.join(' ');
    } else {
        nrequest.options.traverseContext.searchStatus = continueSearch?'completed':'terminated';
        response.result = nrequest.options.traverseContext;
    }
    return response;
    

};

