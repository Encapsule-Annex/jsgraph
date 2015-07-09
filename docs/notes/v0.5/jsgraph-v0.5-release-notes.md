# Encapsule/jsgraph v0.5 Release Notes

## Summary

v0.5 release is the first major investment made in jsgraph in many months and combines several overlapping initiatives intended to fix small bugs (e.g. global JavaScript variable leak), reduce client code size/complexity (e.g. algorithm API refactoring), improve performace (e.g. algorithms now support termination), improve stability for production Node.js deployments (i.e. eliminate the use of JavaScript exceptions to report errors).

jsgraph conti


## Highlights

- **v0.5 API is incompatible with v0.4 client code.** In order to leverage v0.5, existing client code must be refactored and retested.
- **v0.5 JSON data import/export format has changed.** If you have persisted v0.4 data, it will need to be trivially converted to the updated v0.5 JSON format.
- 


  - API changes are largely stylistic, not structural. If you know v0.4 jsgraph concepts, moving to v0.5 should be easy.
  - 

- jsgraph no longer uses JavaScript exceptions to report errors. Instead, each libray function and method was examined and converted to benign failure (e.g. returning false in response to a request to remove a non-existent vertex from a digraph), or to a response object with explicit error/result semantics.
- jsgraph library functions and methods that previously accepted positional in-parameter lists now require request objects.
- 

## v0.4 to v0.5 Change Summary

### Systemic

_Things to be generally aware of if you're moving from v0.4:_

- jsgraph no longer throws JavaScript Error objects. Instead, error/result response objects are returned from functions and methods expected to fail in non-trivial ways across typical use cases.
- With the exception of toJSON, all functions and methods that previously accepted ordered, anonymous in-parameters have been refactored to accept request objects w/named properties instead.

### Graph Containers

_A 'graph container' is an in-memory object with bound methods for storing, manipulating, searching, and transforming mathematical graph data sets._

- jsgraph v0.5 provides a single 'graph container', DirectedGraph, with augmented functionality over v0.4 and a refactored API.
- DirectedGraph constructor function is no longer exported publicly. Instead, clients should call `jsgraph.directed.create` factory function.

        > var jsgraph = require('jsgraph');
        undefined
        > jsgraph
        { directed: 
            { colors: { white: 0, gray: 1, black: 2 },
            create: [Function],
            transpose: [Function],
            breadthFirstTraverse: [Function],
            depthFirstTraverse: [Function],
            createTraversalContext: [Function] } }
        > var response = jsgraph.directed.create();
        undefined
        > response
        { error: null,
            result: {
                getVertices: [Function],
                getRootVertices: [Function],
                getLeafVertices: [Function],
                addVertex: [Function],
                isVertex: [Function],
                removeVertex: [Function],
                addEdge: [Function],
                removeEdge: [Function],
                isEdge: [Function],
                verticesCount: [Function],
                edgesCount: [Function],
                getEdges: [Function],
                inEdges: [Function],
                outEdges: [Function],
                inDegree: [Function],
                outDegree: [Function],
                getVertexProperty: [Function],
                getEdgeProperty: [Function],
                setVertexProperty: [Function],
                setEdgeProperty: [Function],
                toObject: [Function],
                toJSON: [Function],
                fromObject: [Function],
                fromJSON: [Function],
                vertexMap: {},
                rootMap: {},
                leafMap: {},
                edgeCount: 0,
                constructionError: null } }
        > var digraph = response.result;
        undefined
        > digraph.toJSON();
        '{"vlist":[],"elist":[]}'

### Algorithms

_A 'graph algorithm' is function that operates on a graph container to produce a new graph based on data in another graph container. Or, to 'traverse' or walk over the topology of the data in a graph container in order to parse it (e.g. to perform a topological sort)._

- jsgraph v0.5 provides the same algorithms as v0.4 with a re-worked API.
    - Breadth-first visit and search algorithms have been coalesced into `jsgraph.directed.breadthFirstTraverse` function export.
    - Depth-first visit and search algorithms have been coalesced into `jsgraph.directed.depthFirstTraverse` function export.
    - Both methods require request objects and return error/result response objects.
    - A 'traversal' is a 'visit' if the starting vertex set contains a single vertex.
    - A 'traversal' is a 'search' if the starting vertex set is equivalent to the root vertex set of the source DirectedGraph.
    - Traveral algorithms implement a new, simplified default call syntax that requires only the source DirectedGraph and visitor object references. Clients are no longer required to manage an external state cache on behalf of the algorithm; it is allocated internally and returned to the client for use in call diagnostics, or for use in advanced use cases.
    - A number of advanced use cases are supported via request.options object.




- v0.5 contains breaking changes to jsgraph DirectedGraph container data object and JSON import/export format.
- v0.5 API has been reworked to use request/response synchronous functions. jsgraph no longer throws Error objects.
- v0.5 directed graph algorithm updates:
    - visitor callback functions must now return a Boolean flag: true to indicate search continuation, false to terminate the current search.
    - visitor callback function signatures are now request/response style (i.e. you'll need to update your code to access parameters from the request object in-parameter).
    - all breadth-first and depth-first algorithm variants now return the search context object instead of a meaningless result. This contains useful information and is essential in advanced scenarios involving multiple searches performed using a common search context.
    - all breadth-first and depth-first algorithm API's have been reworked to hide the the search context and starting vertex signal concepts used in advanced scenarios involving multiple searches performed using a common search context. Most BF* and DF* searches may now be performed by simply specifying the DirectedGraph container and visitor object: initialization of the search context is performed automatically and starting vertices are signaled by default.

