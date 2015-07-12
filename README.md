# Encapsule/jsgraph

[![Build Status](https://travis-ci.org/Encapsule/jsgraph.svg?branch=master)](https://travis-ci.org/Encapsule/jsgraph)

Updates: [@Encapsule](https://twitter.com/Encapsule) // Sources: [https://github.com/encapsule/jsgraph](https://github.com/encapsule/jsgraph)

_Graphs are mathematical abstractions that are useful for solving many types of problems in computer science. Consequently, these abstractions must also be represented in computer programs. - [Jeremy G. Siek](http://ecee.colorado.edu/~siek/resume.pdf)_

Encapsule/jsgraph is a functional port of directed graph container and algorithm suport from the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html) (BGL) to JavaScript that greatly simplifies the task of working with complex in-memory graph data structures on Node.js and HTML 5.

## Features

- Generic in-memory container for directed mathematical graph data and property sets.
- Directed graph tranposition algorithm (i.e. flip the edges).
- Breadth-first visit and search algorithms (full, non-recursive implementation with edge classification).
- Depth-first visit and search algorithms (full, non-recursive implementation with edge classicication).
- Core algorithms leverage the [visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern) for easy use and extension.
- Core breadth and depth-first traversal algorithms now support termination allowing for derived code to operate efficiently on large in-memory structures.
- Request/response object style API with helpful diagnostic error messages. Implementation does not throw or use exceptions.
- Implementation backed by [470 tests and Travis CI](https://travis-ci.org/Encapsule/jsgraph).

## Release v0.5 highlights

v0.5 is a collection of breaking changes to the library intended to better align it with the evolving coding style I'm using in my other Node.js libraries (many of which derive from jsgraph). And, to integrate a number of long overdue performance enhancements and test enhancements.

- Clients of v0.4 jsgraph will need to make 
- v0.5 API is not backwards compatible. Upgrade port from v0.4 should be simple however.
- No more exceptions. Functions/methods that might reasonably fail now return an error/result response object.
- Breadth-first visit and search algorithms have been coalesced into the new function export `breadthFirstTraverse`.
- Depth-first visit and search algorithms have been coalesced into the new function export `depthFirstTraverse`.
- All visitor interface methods are now required to return a Boolean flag that indicates if the traversal should continue or terminate.
- Significant investment in error handling and reporting to improve developer experience and simplify diagnosis of production failures.
- ~300 new tests added for v0.5 release.
- Update the docs.

## API Overview

v0.5 jsgraph has the following public export object:

        var jsgraph = require('jsgraph');
        jsgraph === {
            directed: {
                create: [Function],
                transpose: [Function],
                breadthFirstTraverse: [Function],
                depthFirstTraverse: [Function],
                colors: { white: 0, gray: 1, black: 2 },
                createTraversalContext: [Function]
            }
        }

### DirectedGraph container object

**See also: [Object Reference: DirectedGraph](./docs/object-DirectedGraph.md)**

jsgraph's core directed graph container object, **DirectedGraph**, is constructed by a calling library export function `jsgraph.directed.create`:

        var jsgraph = require('jsgraph');
        var digraph = null;
        var response = jsgraph.directed.create(/*data or JSON*/);
        if (response.error) {
            console.log(response.error);
        } else {
            digraph = response.result;
            console.log(digraph.toJSON());
        }
        
        '{"vlist":[],"elist":[]}'
        
The `DirectedGraph` container object created by this process models "a graph" generically providing normalized access to its contents via the methods documented in the next sections. As indicated by the inline comment, you may also create a `DirectedGraph` from a data object or equivalent JSON string. See [Object reference: JSON I/O](./docs/object-JSON.md) for more information.
            
#### DirectedGraph vertex methods

- `addVertex({u: vertexId, p: ?})` - add a vertex and optional property data to the digraph
- `isVertex(vertexId)` - query the existence of a specific vertex in the graph
- `removeVertex(vertexId)` - remove a specific vertex and its properties from the graph
- `getVertexProperty(vertexId)` - get the properties data associated with a specific vertex
- `setVertexProperty({u: vertexId, p: ?})` - set the properties data associated with a specific vertex
- `inDegree(vertexId)` - determine how many edges are directed at a specific vertex
- `inEdges(vertexId)` - get the list of edges directed at a specific vertex
- `outDegree(vertexId)` - determine how many edges are directed away from a specific vertex
- `outEdges(vertexId)` - get the list of edges directed away from a specific vertex

#### DirectedGraph edge methods

- `addEdge({ e: { u: vertexId, v: vertexId }, p: ?})` - add edge and optional property data from vertex u to vertex v 
- `isEdge({ u: vertexId, v: vertexId })` - query the existence of a specific edge in the graph
- `removeEdge({ u: vertexId, v: vertexId })` - remove a specific edge and its properties from the graph
- `getEdgeProperty({ u: vertexId, v: vertexId })` - get the properties data associated with a specific edge
- `setEdgeProperty({ e: { u: vertexId, v: vertexId }, p: ?})` - set the properties data associated with a specific edge

#### DirectedGraph graph-scope methods

- `verticesCount()` - obtain the count of vertices in the container
- `getVertices()` - retrieve an array of ID strings for all vertices in the container
- `edgesCount()` - obtain the count of edges in the container
- `getEdges()` - retrieve an array of edge descriptor objects for all edges in the container
- `getRootVertices()` - retrieve an array of ID strings for all vertices that have in-degree zero
- `getLeafVertices()` - retrieve an array of ID strings for all vertices that have out-degree zero
- `toObject()` - serialize the DirectedGraph container to a JavaScript data object
- `toJSON(replacer, space)` - serialize the DirectedGraph container to a JSON string
- `fromObject(dataObject)` - import a jsgraph-format JavaScript data object into the container (addative)
- `fromJSON(jsonString)` - import jsgraph-format JSON string into the container (addative)

### Bundled Transforms & Algorithms

jsgraph bundles a small collection of powerful functions that operate on the data contained in a `DirectedGraph` container in useful ways.

Transform functions generate new `DirectedGraph` containers from existing container(s) applying some presribed filter, or transformation to the vertex and/or edge lists.

Algorithm functions are miniature agent processes that traverse the topology of a `DirectedGraph` container issuing callbacks to your derived client code at specified event points.

jsgraph uses names and conventions documented in Chapter 23 "Elementary Graph Algorithms" of [Introduction To Algorithms](https://mitpress.mit.edu/books/introduction-algorithms) (MIT Press).

#### jsgraph.directed.transpose Transform

**See also: [Transform Reference: jsgraph.directed.transpose](./docs/transform-transpose.md)**

jsgraph currently provides a single 'transform' function, `jsgraph.directed.transpose` that constructs a new `DirectedGraph` that that is equivalent to an existing `DirectedGraph` except that the direction of all the edges is reversed. Note that vertex and edge properties (if any) are copied by reference to the transposed digraph as a deep copy is seldom desirable. 

        var response = jsgraph.directed.transpose(digraph);
        if (response.error) {
            console.log(response.error);
        } else {
            console.log("Transposed digraph JSON: '" + response.result.toJSON() + "'.");
        }

#### jsgraph.directed.breadthFirstTraverse Algorithm

**See also: [Algorithm Reference: jsgraph.directed.breadthFirstTraverse](./docs/algorithm-bft.md)**

jsgraph function export `jsgraph.directed.breadthFirstTraverse` is a non-recursive visitor imlementation of the classic breadth-first search and visit vertex discovery and edge classification algorithms.

The algorithm starts at a vertex (visit) or set of vertices (search) and proceeds breadth-first providing your client code with a series of progress callbacks to _visitor interface_ functions you register when initiating the traversal.

A breadth-first traversal concludes when all reachable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

Supported visitor interface callbacks for breadth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineVertex`, `examineEdge`, `treeEdge`, `nonTreeEdge`, `grayTarget`, `blackTarget`, and `finishVertex`.

See documentation link above for additional discussion and examples.      

#### jsgraph.directed.depthFirstTraverse Algorithm

**See also: [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./docs/algorithm-dft.md)**

jsgraph function export `jsgraph.directed.depthFirstTraverse` is a non-recursive visitor implementation of the classic depth-first search and visit vertex discovery and edge classification algorithms.

The algorithm starts at a vertex (visit) or set of vertices (search) and proceeds depth-first providing your client code with a series of progress callbacks to _visitor interface_ functions you register when initiating the traversal.

A depth-first traversal concludes when all reacable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

Supported visitor interface callbacks for depth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineEdge`, `treeEdge`, `backEdge`, `forwardOrCrossEdge`, `finishEdge`, and `finishVertex`.

See documentation link above for additional discussion and examples.

## Acknowledgements

Thanks to [Jeremy Seik](http://wphomes.soic.indiana.edu/jsiek/) for writing the BGL and making it available as open source.

<hr>

Copyright &copy; 2014-2015 [Christopher D. Russell](https://github.com/ChrisRus)



