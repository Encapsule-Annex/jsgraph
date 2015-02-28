jsgraph
=======

[![Build Status](https://travis-ci.org/Encapsule/jsgraph.svg)](https://travis-ci.org/Encapsule/jsgraph)

jsgraph implements a hyper-dimensional, directed, in-memory, mathematical graph database for Node.js / HTML 5 that is used for building application-specific data set storage, and processing algorithms. For example: parsers, compilers, routers, protocol engines, data transformers, dispatchers, signal processors, stream engines, query processing, user interface, games...

jsgraph is inspired by the design of the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html) that leverages C++ templates to affect a complete separation of concerns between (a) the storage and access of your hyper-dimensional dataset (b) the semantics of the dataset (c) the supplied re-usable algorithmic routines that comprise the libraries outward facing query/response API.

From this perspective, jsgraph's `DirectedGraph` container object is similar in spirit to an STL container. And the algorithms packed with jsgraph like STL algorithms (i.e. can be applied to any dataset in an STL container regardless of its type). But unlike STL containers, jsgraph's `DirectedGraph` is hyper-dimensional, and inherently heterogeneous.

Let's get going and create our first jsgraph `DirectedGraph` database. It's not too difficult.

        cdr@debian:~/encapsule/jsgraph-example$ npm install jsgraph
        jsgraph@0.1.5 node_modules/jsgraph
        cdr@debian:~/encapsule/jsgraph-example$ node
        > var jsgraph = require('jsgraph');
        undefined
        > var directed = jsgraph.directed
        undefined
        > var digraph = new directed.DirectedGraph();
        undefined
        > JSON.stringify(digraph);
        '{"vertexMap":{},"rootMap":{},"leafMap":{},"edgeCount":0}'

`digraph` is an in-memory database with no ascribed semantics at this point.

To imbue `digraph` with meaning, we add data.

        > digraph.addVertex("start");
        'start'
        > digraph.addVertex("step1");
        'step1'
        > digraph.addVertex("step2");
        'step2'
        > digraph.addVertex("end");
        'end'
        > JSON.stringify(digraph);
        '{"vertexMap":{"start":{"edges":{"in":{},"out":{}}},"step1":{"edges":{"in":{},"out":{}}},"step2":{"edges":{"in":{},"out":{}}},"end":{"edges":{"in":{},"out":{}}}},"rootMap":{"start":{},"step1":{},"step2":{},"end":{}},"leafMap":{"start":{},"step1":{},"step2":{},"end":{}},"edgeCount":0}'

Vertices are unique objects, identified with an ID string (e.g. 'start'), that represent an instance of some concept. 

Let's create some associations between our concepts by adding directed edges from source to sink vertex.

        > digraph.addEdge("start", "step1", { type: "link" });
        { u: 'start', v: 'step1' }
        > digraph.addEdge("step1", "step2", { type: "link" });
        { u: 'step1', v: 'step2' }
        > digraph.addEdge("step2", "end", { type: "link" });
        { u: 'step2', v: 'end' }
        > JSON.stringify(digraph);
        '{"vertexMap":{"start":{"edges":{"in":{},"out":{"step1":{"properties":{"type":"link"}}}}},"step1":{"edges":{"in":{"start":{}},"out":{"step2":{"properties":{"type":"link"}}}}},"step2":{"edges":{"in":{"step1":{}},"out":{"end":{"properties":{"type":"link"}}}}},"end":{"edges":{"in":{"step2":{}},"out":{}}}},"rootMap":{"start":{}},"leafMap":{"end":{}},"edgeCount":3}'

You now have (a) topological information (b) labels (i.e. application-specific semantics) stored in-memory.

We can ask about relationships...

        > digraph.inEdges("step2");
        [ { u: 'step1', v: 'step2' } ]

... or query properties...

        > digraph.edgePropertyObject("start", "step1");
        { type: 'link' }

... or implement a visitor interface and call one of jsgraph's algorithms on your dataset to affect whatever you want.

        > var dfsVisitor = { finishVertex: function(vertex, digraph) { console.log(vertex); } };
        undefined
        > var dfsContext = jsgraph.directed.createDepthFirstSearchContext(digraph, dfsVisitor);
        undefined
        > jsgraph.directed.depthFirstSearch(digraph, dfsVisitor);
        end
        step2
        step1
        start
        true

# Get the code

        npm install jsgraph

_Use browserify or similar utility to leverage jsgraph in the client instead of Node.js._

# Tests

jsgraph is tested using Mocha/Chai. If you find a bug, please file an issue.

To execute the ~170 test vectors, clone the repo, npm install, and run the Grunt script:

        git clone git@github.com:Encapsule/jsgraph.git
        cd jsgraph
        npm install
        grunt

**All tests should pass.**

# API Overview

The jsgraph API is patterned after the design of the Boost C++ Graph Library (BGL) API. The method names and semantics of the `DirectedGraph` generic directed graph container object, the use of the visitor design pattern to decouple the graph data from the graph algorithms, and the callback function signatures and semantics that codify the BFS and DFS algorithm extension protocol for developers are all copied directly from the BGL.  

The current release of jsgraph contains support only for directed graph datasets. Support for undirected graph datasets and algorithms is planned in a future release.

## DirectedGraph

        var jsgraph = require('jsgraph');
        var digraph = new jsgraph.directed.DirectedGraph();

* **addVertex** - add a vertex to the digraph w/optional property object
* **removeVertex** - remove a vertex, and adjacent in-edges from the digraph
* **addEdge** - add an edge w/optional property object to the digraph
* **removeEdge** - remove an edge from the digraph
* **getRootVertices** - retrieve the set of vertices with in-degree zero
* **getLeafVertices** - retrieve the set of vertices with out-degree zero
* **verticesCount** - retrieve the count of vertices in the digraph
* **edgesCount** - retrieve the count of edges in the digraph
* **inEdges** - retrieve the set of adjacent in-edges of a specific vertex
* **outEdges** - retrieve the set of adjacent out-edges of a specific vertex
* **inDegree** - retrieve the count of adjacent in-edges of a specific vertex
* **outDegree** - retrieve the count of adjacent out-edges of a specific vertex
* **vertexPropertyObject** - get a property object reference for a specific vertex
* **edgePropertyObject** - get a property object reference for a specific edge

## Algorithms

jsgraph currently provides the following algorithms for working with DirectedGraph container object datasets:

* **transpose** - create a copy of a DirectedGraph container object with direction of all the edges reversed
* **breadth-first-visit** and **breadth-first-search**
  * non-recursive, generic visitor pattern implementations
  * callbacks: initializeVertex, discoverVertex, startVertex, examineVertex, examineEdge, treeEdge, nonTreeEdge, grayTarget, blackTarget, finishVertex
* **generic depth-first-visit** and **depth-first-search**
  * non-recursive, generic visitor pattern implementations
  * callbacks: initializeVertex, startVertex, discoverVertex, examineEdge, treeEdge, backEdge, forwardOrCrossEdge, finishVertex

# Example

A simple JavaScript/jsgraph implementation of Depth-first search (DFS) example from [Introduction to Algorithms 23.3](http://staff.ustc.edu.cn/~csli/graduate/algorithms/book6/chap23.htm).

![Introduction to Algorithms DFS Example](ITA-23.4.gif "Introduction to Algorithms DFS Example")

        // Use `require` to include the `jsgraph` module and select the `directed` graph namespace.
        var jsdigraph = require('jsgraph').directed;

        // Use JavaScript `new` operator to create a new, empty instance of DirectedGraph container object.
        var digraph = new jsdigraph.DirectedGraph();

        // Create an in-memory model of the topology of the directed graph (a) depicted above.
        digraph.addEdge("u", "v");
        digraph.addEdge("v", "y");
        digraph.addEdge("y", "x");
        digraph.addEdge("x", "v");
        digraph.addEdge("u", "x");
        digraph.addEdge("w", "y");
        digraph.addEdge("w", "z");
        digraph.addEdge("z", "z");

        // We're going to traverse the topology of the directed graph stored in `digraph` using
        // the depth-first search algorithm from jsgraph. Results will be stored in `dfsResults` array.
        var dfsResults = [];

        // Keep track of start, end times.
        var step = 0;
        var time = 0;

        // Define a DFS visitor object.
        // The properties are predefined function signatures that are called back iff defined.
        // Which callbacks we implement, and what we do in our callbacks is entirely up to us.
        // In this simple example we implement a simple logger that pushes each traversal step
        // into the `dfsResults` array for demonstration purposes.
        var dfsVisitorInterface = {
            initializeVertex: function(u, g) {
                dfsResults.push(step++ + " initializeVertex " + u);
            },
            startVertex: function (s, g) {
                dfsResults.push(step++ + " startVertex " + s);
            },
            discoverVertex: function(u, g) {
                dfsResults.push(step++ + " discoverVertex " + u + " at time " + time);
                time++;
            },
            examineEdge: function(u, v, g) {
                dfsResults.push(step++ + " examineEdge [" + u + "," + v + "]");
            },
            treeEdge: function(u, v, g) {
                dfsResults.push(step++ + " treeEdge [" + u + "," + v + "]");
            },
            backEdge: function(u, v, g) {
                dfsResults.push(step++ + " backEdge [" + u + "," + v + "]");
            },
            forwardOrCrossEdge: function(u, v, g) {
                dfsResults.push(step++ + " forwardOrCrossEdge [" + u + "," + v + "]");
            },
            finishVertex: function(u, g) {
                dfsResults.push(step++ + " finishVertex " + u + " at time " + time);
                time++;
            }
        };

        // jsgraph-provided algorithms are stateful and require a place to store their internal context.
        var dfsContext = jsgraph.directed.createDepthFirstSearchContext(digraph, dfsVisitorInterface);

        // Invoke the depth-first search algorithm from jsgraph. 
        jsgraph.directed.depthFirstSearch(digraph, dfsVisitorInterface, dfsContext);

        // Dump the `dfsResults` array to the console in JSON.
        console.log(JSON.stringify(dfsResults));

        > ["0 initializeVertex u",
           "1 initializeVertex v",
           "2 initializeVertex y",
           "3 initializeVertex x",
           "4 initializeVertex w",
           "5 initializeVertex z",
           "6 initializeVertex u",
           "7 initializeVertex v",
           "8 initializeVertex y",
           "9 initializeVertex x",
           "10 initializeVertex w",
           "11 initializeVertex z",
           "12 startVertex u",
           "13 discoverVertex u at time 1",
           "14 examineEdge [u,v]",
           "15 examineEdge [u,x]",
           "16 treeEdge [u,v]",
           "17 discoverVertex v at time 2",
           "18 examineEdge [v,y]",
           "19 treeEdge [v,y]",
           "20 discoverVertex y at time 3",
           "21 examineEdge [y,x]",
           "22 treeEdge [y,x]",
           "23 discoverVertex x at time 4",
           "24 examineEdge [x,v]",
           "25 backEdge [x,v]",
           "26 finishVertex x at time 5",
           "27 finishVertex y at time 6",
           "28 finishVertex v at time 7",
           "29 forwardOrCrossEdge [u,x]",
           "30 finishVertex u at time 8",
           "31 discoverVertex w at time 9",
           "32 examineEdge [w,y]",
           "33 forwardOrCrossEdge [w,y]",
           "34 examineEdge [w,z]",
           "35 treeEdge [w,z]",
           "36 discoverVertex z at time 10",
           "37 examineEdge [z,z]",
           "38 backEdge [z,z]",
           "39 finishVertex z at time 11",
           "40 finishVertex w at time 12"]

**<3**

# jsgraph.directed.DirectedGraph object

jsgraph is inspired by the design and implementation of the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html) (BGL) that applies the C++ Standard Template Library concepts of generic containers and algorithms to mathematical graph datasets. 

        var jsgraph = require('jsgraph');
        var digraph = new jsgraph.directed.DirectedGraph();

## DirectedGraph.addVertex

        var vertex = digraph.addVertex(vertexId_, properties_);

**Parameters:**

- vertexId_ (required): a unique string identifying the vertex to add to the graph.
- properties_ (optional): reference to a property object to attach to the new vertex.

**Return:**

Returns a copy of the `vertexId_` in-parameter.

**Remarks:**

If a vertex with identifier `vertexId_` already exists in the graph, the call to `addVertex` is ignored.

## jsgraph.directed.DirectedGraph.removeVertex

        digraph.removeVertex(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifier of the vertex to remove from the graph

**Return:**

Returns true to indicate that the specified vertex is not part of the graph.

**Remarks:**

Removing a vertex automatically removes all the the vertex's edges (both in and out-edges are removed). 


## jsgraph.directed.DirectedGraph.addEdge

        var edge = digraph.addEdge(vertexIdU_, vertexIdV_, properties_);

**Parameters:**

- vertexIdU_ (required): a unqique string identifying the directed edge's source vertex, U.
- vertexIdV_ (required): a unqique string identifying the directed edge's sink vertex, V.
- properties_ (optional): reference to a property object to attach to the new edge.

**Return:**

Returns an edge descriptor object containing the identifiers of the U and V vertices:

        { u: 'vertex U ID string', v: 'vertex V ID string' }

**Remarks:**

If a vertex or vertices specified in a call to `addEdge` do not exist, they are added automatically and then the edge is added without associated property objects (you'll need to assign these manually by vertex ID in this situation).

## jsgraph.directed.DirectedGraph.removeEdge

        digraph.removeEdge(vertexIdU_, vertexIdV_);

**Parameters:**

- vertexIdU_ (required): the unqiue string identifying the directed edge's source vertex, U.
- vertexIdV_ (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns true to indicate that the specified edge is not part of the graph.

## jsgraph.directed.DirectedGraph.verticesCount

        var count = digraph.verticesCount();

**Return:**

Integer indicating the number of vertices in this graph.

## jsgraph.directed.DirectedGraph.edgesCount

        var count = digraph.edgesCount();

**Return:**

Integer indicating the number of edges in this graph.

## jsgraph.directed.DirectedGraph.getRootVertices

        var vertices = digraph.getRootVertices();

**Return:**

Returns an array of identifier strings indicating the set of root vertices in the graph (i.e. the set of vertices with in-degree zero).

## jsgraph.directed.Directedgraph.getLeafVertices

        var vertices = digraph.getLeafVertices();

**Return:**

Returns an array of identifier strings indicating the set of leaf vertices in the graph (i.e. the set of vertices with out-degree zero).

## jsgraph.directed.DirectedGraph.inEdges

        var edgeArray = digraph.inEdges(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

## jsgraph.directed.DirectedGraph.outEdges

        var edgeArray = digraph.outEdges(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifiy the source and sink vertex ID's of each of the specified vertex's out-edges.

## jsgraph.directed.DirectedGraph.inDegree

        var degree = digraph.inDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the in-degree of the specific vertex.

## jsgraph.directed.DirectedGraph.outDegree

        var degree = digraph.outDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the out-degree of the specific vertex.

## jsgraph.directed.DirectedGraph.vertexPropertyObject

        var properties = digraph.vertexPropertyObject(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns a reference to the property object attached to the specified vertex when it was added to the graph.

## jsgraph.directed.DirectedGraph.edgePropertyObject

        var properties = digraph.vertexPropertyObject(vertexIdU_, vertexIdV);

**Parameters:**

- vertexIdU_ (required): the unqiue string identifying the directed edge's source vertex, U.
- vertexIdV_  (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns a reference to the property object attached to the specified edge when it was added to the graph.

# Transforms

## jsgraph.directed.transpose

        var transposedDigraph = jsgraph.directed.transpose(digraphIn_);

**Parameters:**

- digraphIn_ (required): a reference to a previously-constructed and initialized DirectedGraph object.

**Return:**

Returns a new instance of DirectedGraph that reverses the direction of all the edges in the source graph.

# Algorithms

jsgraph provides several useful graph algorithms implemented using the visitor pattern in a manner that seeks to emulate the [Boost C++ Graph Library: Visitor Concepts](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/visitor_concepts.html).

Unless otherwise noted, all implementations are non-recursive to conserve stack space when traversing very large in-memory graphs.

## BFV / BFS

### breadthFirstSearchVisitor object interface

To leverage the `breadthFirstVisit` and `breadthFirstSearch` algorithms, you must implement a breadth-first search visitor object and provide callback implementations(s):

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

All callback functions are optional; implement only those you require.

- initializeVertex - This invoked on every vertex of the graph before the start of the graph search.
- discoverVertex - This is invoked when a vertex is encountered for the first time
- examineVertex - This is invoked on a vertex as it is popped from the queue. This happens immediately before examine_edge() is invoked on each of the out-edges of vertex u.
- examineEdge - This is invoked on every out-edge of each vertex after it is discovered.
- treeEdge - This in invoked on edge edge as it becomes a member of the edges that form the search tree.
- nonTreeEdge - This is invoked on back or cross edges.
- grayTarget - This is invoked on the subset of non-tree edges whose target vertex is colored grat at the time of examination. The color gray indicates that the vertex is currently in the queue.
- blackTarget - This is invoked on a subset of the edges whose target vertex is colored black at the time of examination. The color black indicates that the vertex has been removed from the queue.
- finishVertex - This is invoked on a vertex after all of its out edges have been added to the search tree and all adjacent vertices have been discovered (but before the out-edges of the adjacent vertices have been examined).

Please see the [Boost C++ Graph Library: BFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/BFSVisitor.html) documentation for a complete discussion of API semantics.

### createBreadthFirstSearchContext

Prior to calling either `breadthFirstVisit` or `breadthFirstSearch` you must initialize a context object for the algorithm's internal state.

      var bfsContext = jsgraph.directed.createBreadthFirstSearchContext(digraph_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object

**Remarks:**

You need to initialize a new context object every time you affect a new graph traversal.

### breadthFirstVisit

        jsgraph.directed.breadthFirstVisit(digraph_, context_, startVertexId_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- context_ (required): a reference to your breadth-first search context object.
- startVertexId_ (required): the string identifier of vertex at which to start the visit traversal.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object.

**Return:**

None.

### breadthFirstSearch

        jsgraph.directed.breadthFirstSearch(digraph_, context_, startVertexArray_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- context_ (required): a reference to your breadth-first search context object.
- startVertexArray_ (required): as array of string identifiers of the vertices to visit breadth-first.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object.

**Return:**

None.

## DFV / DFS

### depthfirstSearchVisitor object interface

To leverage the `depthFirstVisit' and 'depthFirstSearch' algorithms, you must implement a depth-first search visitor object and provide callback implementation(s):

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

All callback functions are optional; implement only those you require.

- initializeVertex - This is invoked on every vertex of the graph before the start of the search.
- startVertex - This is invoked on the source vertex once before the start of the search.
- discoverVertex - This is invoked when a vertex is encountered for the first time.
- examineEdge - This is invoked on every out-edge of each vertex after it is discovered.
- treeEdge - This is invoked on each edge as it becomes a member of the edges that form the search tree.
- backEdge - This is invoked on the back edges in the graph. For an undirected graph there is some ambiguity between tree edges and back edges since the edge (u,v) and (v,u) are the same edge, but both the tree_edge() and back_edge() functions will be invoked. One way to resolve this ambiguity is to record the tree edges, and then disregard the back-edges that are already marked as tree edges. An easy way to record tree edges is to record predecessors at the tree_edge event point.
- forwardOrCrossEdge - This is invoked on forward or cross edges in the graph. In an undirected graph this method is never called.
- finishEdge - This is invoked on each non-tree edge as well as on each tree edge after finish_vertex has been called on its target vertex.
- finishVertex - This is invoked on vertex u after finish_vertex has been called for all the vertices in the DFS-tree rooted at vertex u. If vertex u is a leaf in the DFS-tree, then the finish_vertex function is called on u after all the out-edges of u have been examined.

Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.

### jsgraph.directed.createDepthFirstSearchContext

Prior to calling either `depthFirstVisit` you must initialize a context object for the algorithm's internal state.

        var dfsContext = jsgraph.directed.createDepthFirstSearchContext(digraph_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object

**Remarks:**

You need to initialize a new context object every time you affect a new graph traversal.

This step is taken care of automatically by `depthFirstSearch` but not the lower-level `depthFirstVisit` algorithm implementation.

### jsgraph.directed.depthFirstVisit

        jsgraph.directed.depthFirstVisit(digraph_, context_, startVertexId_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- context_ (required): a reference to your depth-first search context object.
- startVertexArray_ (required): as array of string identifiers of the vertices to visit depth-first search.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object.

**Return:**

None.

**Remarks:**

Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.

### jsgraph.directed.depthFirstSearch

        jsgraph.directed.depthFirstSearch(digraph_, visitorInterface_);

**Parameters:**

- digraph_ (required): a reference to a previously-constructed DirectedGraph object.
- visitorInterface_ (required): a reference to your application-specific BFS visitor interface object

**Return:**

None.

**Remarks:**

Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.
        
# Notes

[1] Support for undirected graph data sets, related algorithms is planned for a future jsgraph release.

# Acknowledgements

Thanks to [Jeremy Seik](http://wphomes.soic.indiana.edu/jsiek/) for writing the BGL.

Copyright &copy; 2015 [Encapsule Project](https://github.com/encapsule) / [ChrisRus](https://github.com/ChrisRus)

Thanks to [Azuqua, Inc.](http://azuqua.com), Seattle for support and assistance.

