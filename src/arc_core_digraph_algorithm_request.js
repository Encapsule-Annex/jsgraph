/*
  Encapsule/jsgraph/arc/digraph-algorithm-common-request.js

  Copyright (C) 2014-2015 Christopher D. Russell

  This library is published under the MIT License and is part of the
  Encapsule Project System in Cloud (SiC) open service architecture.
  Please follow https://twitter.com/Encapsule for news and updates
  about jsgraph and other time saving libraries that do amazing things
  with in-memory data on Node.js and HTML.
*/

var helperFunctions = require('./helper-functions');
var TRAVERSE_CONTEXT = require('./digraph-algorithm-common-context');

/*
  request = {
      digraph: reference to jsgraph.DirectedGraph container object (required)
      visitor: reference to jsgraph BFV visitor object (required)
      options: {
          startVector: reference to a vertex ID string, or an array of vertex ID strings (optional)
              Note: if ommitted, BFT uses the digraph's root vertex set as the start vertex set
          allowEmptyStartVector: Boolean flag (optional - default is false is omitted)
          signalStart: Boolean flag (optional - default is true if ommitted)
              Note: By default, BFT will call startVertex on each search root vertex.
              In advanced scenarios you may wish to override this behavior.
          traverseContext: reference to BFT search context object (optional)
              Note: By default, BFT allocates the traversal context internally and returns it to
              the caller. In advanced scenarios you may wish to provide a pre-initialized
              (or potentially pre-colored) traversal context object.
          }
      }
  }

  response = {
      error: null or string explaining why result is null
      result: Traversal context object or null if error
  }
*/

module.exports = function (request_) {

    var response = { error: null, result: null };
    var errors = [];
    var nrequest = null;
    var inBreakScope = false;

    var createTraverseContext = function() {
        var response = TRAVERSE_CONTEXT({ digraph: nrequest.digraph });
        var result = null;
        if (response.error) {
            errors.unshift(response.error);
        } else {
            result = response.result;
        }
        return result;
    };

    var getRootVertices = function() {
        return nrequest.digraph.getRootVertices();
    };
        
    while (!inBreakScope) {
        inBreakScope = true;

        // Verify the outer shape of the request object.
        var innerResponse = helperFunctions.JSType(request_);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing request object ~. Found type '" + innerResponse + "'.");
            break;
        }
        nrequest = {};
        innerResponse = helperFunctions.JSType(request_.digraph);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required DirectedGraph reference ~.digraph. Found type '" + innerResponse + "'.");
            break;
        }
        nrequest.digraph = request_.digraph;
        innerResponse = helperFunctions.JSType(request_.visitor);
        if (innerResponse !== '[object Object]') {
            errors.unshift("Missing required visitor object reference ~.visitor. Found type '" + innerResponse + "'.");
            break;
        }
        
        nrequest.visitor = request_.visitor;
        innerResponse = helperFunctions.JSType(request_.options);
        if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
            errors.unshift("Options object ~.options is the wrong type. Found type '" + innerResponse + "'.");
            break;
        }
        nrequest.options = {};
        if (innerResponse === '[object Object]') {
            innerResponse = helperFunctions.JSType(request_.options.startVector);
            switch (innerResponse) {
            case '[object Undefined]':
                break;
            case '[object String]':
                nrequest.options.startVector = [ request_.options.startVector ];
                break;
            case '[object Array]':
                nrequest.options.startVector = request_.options.startVector;
                break;
            default:
                errors.unshift("Options object property ~.options.startVector is the wrong type. Expected either '[object String]', '[object Array]', or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            } // end switch

            if (errors.length) {
                break;
            }

            innerResponse = helperFunctions.JSType(request_.options.allowEmptyStartVector);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Boolean]')) {
                errors.unshift("Options object property ~.options.allowEmptyStartVector is the wrong type. Expected either '[object Boolean]' or '[object Undefined]. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse == '[object Boolean]') {
                nrequest.options.allowEmptyStartVector = request_.options.allowEmptyStartVector;
            }

            innerResponse = helperFunctions.JSType(request_.options.signalStart);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Boolean]')) {
                errors.unshift("Options object property ~.options.signalStart is the wrong type. Expected either '[object Boolean]' or '[object Undefined]'. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[object Boolean]') {
                nrequest.options.signalStart = request_.options.signalStart;
            }


            innerResponse = helperFunctions.JSType(request_.options.traverseContext);
            if ((innerResponse !== '[object Undefined]') && (innerResponse !== '[object Object]')) {
                errors.unshift("Options object property ~.options.traverseContext is the wrong type. Expected either '[object Object]' or '[object Undefined']. Found type '" + innerResponse + "'.");
                break;
            }
            if (innerResponse === '[object Object]') {
                nrequest.options.traverseContext = request_.options.traverseContext;
            }

        } // end if options object specified
        
        helperFunctions.setPropertyValueIfUndefined(nrequest.options, 'startVector', getRootVertices);
        helperFunctions.setPropertyValueIfUndefined(nrequest.options, 'allowEmptyStartVector', false);
        helperFunctions.setPropertyValueIfUndefined(nrequest.options, 'signalStart', true);
        helperFunctions.setPropertyValueIfUndefined(nrequest.options, 'traverseContext', createTraverseContext);

        // Ensure that the starting vertex set is not empty (unless allowed).
        if (!nrequest.options.startVector.length && !nrequest.options.allowEmptyStartVector) {
            errors.unshift("Traversal aborted because we don't know which vertex to start on. Specify a graph that has at least one root vertex, explicity specify the start vertex (or vertices) via `request.options.startVector` array, or suppress this error by setting `request.options.allowEmptyStartVector` to Boolean true.");
            break;
        }

        response.result = nrequest;

    }
    if (errors.length) {
        response.error = errors.join(' ');
    } else {
        response.result = nrequest;
    }
    return response;

};
