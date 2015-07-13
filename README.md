# Encapsule/jsgraph

[![Build Status](https://travis-ci.org/Encapsule/jsgraph.svg?branch=master)](https://travis-ci.org/Encapsule/jsgraph)

**Encapsule Project: [news](https://twitter.com/Encapsule) / [info](http://blog.encapsule.org) / [source code](https://github.com/encapsule/)**

## About jsgraph

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
- jsgraph is tested. Continuously. With [automated tests](https://travis-ci.org/Encapsule/jsgraph).

## Release

v0.5 is a breaking upgrade for users of v0.4:

- Clients of v0.4 jsgraph will need to make some minor changes to their derived code to upgrade to v0.5.
- No more exceptions. Functions/methods that might reasonably fail now return an error/result response object.
- Breadth-first visit and search algorithms have been coalesced into the new function export `breadthFirstTraverse`.
- Depth-first visit and search algorithms have been coalesced into the new function export `depthFirstTraverse`.
- All visitor interface methods are now required to return a Boolean flag that indicates if the traversal should continue or terminate.
- Significant investment in error handling and reporting to improve developer experience and simplify diagnosis of production failures.
- ~300 new tests added for v0.5 release.
- Documentation brought current.

## API

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
        
The `DirectedGraph` container object created by this process models "a graph" generically providing normalized access to its contents via the methods documented in the next sections. As indicated by the inline comment, you may also create a `DirectedGraph` from a data object or equivalent JSON string. See **[Object reference: JSON I/O](./docs/object-JSON.md)** for more information.
            
#### DirectedGraph vertex methods

- `isVertex(vertexId)` - query the existence of a specific vertex in the graph
- `addVertex({u: vertexId, p: ?})` - add a vertex and optional property data to the digraph
- `removeVertex(vertexId)` - remove a specific vertex and its properties from the graph
- `getVertexProperty(vertexId)` - get the properties data associated with a specific vertex
- `setVertexProperty({u: vertexId, p: ?})` - set the properties data associated with a specific vertex
- `hasVertexProperty(vertexId)` - query if a vertex has associated property data or not
- `clearVertexProperty(vertexId)` - clear property data associated with a vertex
- `inDegree(vertexId)` - determine how many edges are directed at a specific vertex
- `inEdges(vertexId)` - get the list of edges directed at a specific vertex
- `outDegree(vertexId)` - determine how many edges are directed away from a specific vertex
- `outEdges(vertexId)` - get the list of edges directed away from a specific vertex

#### DirectedGraph edge methods

- `isEdge({ u: vertexId, v: vertexId })` - query the existence of a specific edge in the graph
- `addEdge({ e: { u: vertexId, v: vertexId }, p: ?})` - add edge and optional property data from vertex u to vertex v 
- `removeEdge({ u: vertexId, v: vertexId })` - remove a specific edge and its properties from the graph
- `getEdgeProperty({ u: vertexId, v: vertexId })` - get the properties data associated with a specific edge
- `setEdgeProperty({ e: { u: vertexId, v: vertexId }, p: ?})` - set the properties data associated with a specific edge
- `hasEdgeProperty({ u: vertexId, v: vertexId })` - query if an edge has property data associated with it or not
- `clearEdgeProperty({ u: vertexId, v: vertexId})` - clear property data associated with an edge

#### DirectedGraph graph-scope methods

- `verticesCount()` - obtain the count of vertices in the container
- `getVertices()` - retrieve an array of ID strings for all vertices in the container
- `edgesCount()` - obtain the count of edges in the container
- `getEdges()` - retrieve an array of edge descriptor objects for all edges in the container
- `rootVerticesCount()` - obtain count of vertices with in-degree zero
- `getRootVertices()` - retrieve an array of ID strings for all vertices that have in-degree zero
- `leafVerticesCount() - obtain count of vertices with out-degree zero
- `getLeafVertices()` - retrieve an array of ID strings for all vertices that have out-degree zero
- `toObject()` - serialize the DirectedGraph container to a JavaScript data object
- `toJSON(replacer, space)` - serialize the DirectedGraph container to a JSON string
- `fromObject(dataObject)` - import a jsgraph-format JavaScript data object into the container (addative)
- `fromJSON(jsonString)` - import jsgraph-format JSON string into the container (addative)

### Transforms & Algorithms

jsgraph bundles a small collection of powerful functions that operate on the data contained in a `DirectedGraph` container in useful ways.

Transform functions generate new `DirectedGraph` containers from existing container(s) applying some presribed filter, or transformation to the vertex and/or edge lists.

Algorithm functions are miniature agent processes that traverse the topology of a `DirectedGraph` container issuing callbacks to your derived client code at specified event points. Think of your graph as a maze: vertices are intersections, edges hallways. As the algorithmic agent walks through the maze it keeps track of where it's been so as to be able to dig itself out of corners and dead-ends. Each algorithm implements a different specific agent with its own goal strategies for "running the maze". 

The magic of graph algorithms is that deep insight can be derived from watching and analyzing how specific graph algorithms traverse specific graph interconnect topologies. However, graph traversal algorithms are hard to implement due to their complexity and most implementations are purpose-built, and/or have little facility for embedded re-use or extension in contexts their authors didn't anticipate.

jsgraph addresses this problem by copying the Boost Graph Library (BGL)'s fantastic use of the visitor pattern to encapsulate the specific goal strategies of graph traversal algorithms. The resulting API makes trivial use cases trivial and advanced use cases possible. Depending on your requirements, other similar libraries that provide single-call graph algorithm results may better suite your needs. But in cases where it makes sense to re-use the core algorithmic agents as the basis for your own complex data masterpiece, there's really just no substitute for the BGL visitor API style.

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

Supported visitor interface callbacks for breadth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineVertex`, `examineEdge`, `treeEdge`, `nonTreeEdge`, `grayTarget`, `blackTarget`, and `finishVertex`.

A breadth-first traversal concludes when all reachable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

#### jsgraph.directed.depthFirstTraverse Algorithm

**See also: [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./docs/algorithm-dft.md)**

jsgraph function export `jsgraph.directed.depthFirstTraverse` is a non-recursive visitor implementation of the classic depth-first search and visit vertex discovery and edge classification algorithms.

The algorithm starts at a vertex (visit) or set of vertices (search) and proceeds depth-first providing your client code with a series of progress callbacks to _visitor interface_ functions you register when initiating the traversal.

Supported visitor interface callbacks for depth-first traversal: `initializeVertex`, `startVertex`, `discoverVertex`, `examineEdge`, `treeEdge`, `backEdge`, `forwardOrCrossEdge`, `finishEdge`, and `finishVertex`.

A depth-first traversal concludes when all reacable vertices have been visited, or when the client signals termination by returning Boolean **false** back to the algorithm from one of its visitor interface callback functions.

## Examples

The best public examples of how to use jsgraph v0.5 are embedded in the module's test suite. Take a look at the ./test directory scripts. If you get stuck, or need help assessing jsgraph for use in your own data masterpiece get in touch: chrisrus@encapsule.org.

<hr>

Copyright &copy; 2014-2015 [Christopher D. Russell](https://github.com/ChrisRus)



