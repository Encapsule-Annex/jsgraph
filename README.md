jsgraph
=======

jsgraph is an API port of the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html)'s generic directed graph container object, and several standard directed graph traversal algorithms.

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

All tests should pass.

# Example

        var jsgraph = require('jsgraph');
        var digraph = new jsgraph.directed.DirectedGraph();

        // This example is taken from chapter 22 of "Introduction to Algorithms".
        digraph.addEdge("u", "v");
        digraph.addEdge("v", "y");
        digraph.addEdge("y", "x");
        digraph.addEdge("x", "v");
        digraph.addEdge("u", "x");
        digraph.addEdge("w", "y");
        digraph.addEdge("w", "z");
        digraph.addEdge("z", "z");

        var dfsResults = [];
        var step = 0;
        var time = 0;

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

        var dfsContext = jsgraph.directed.createDepthFirstSearchContext(digraph, dfsVisitorInterface);

        // Traverse the graph...
        jsgraph.directed.depthFirstSearch(digraph, dfsVisitorInterface, dfsContext);

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

# jsgraph.directed.DirectedGraph object

jsgraph is inspired by the design and implementation of the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html) (BGL) that applies the C++ Standard Template Library concepts of generic containers and algorithms to mathematical graph datasets. 

        var jsgraph = require('jsgraph');
        var digraph = new jsgraph.directed.DirectedGraph();

## DirectedGraph.addVertex

        var vertex = digraph.addVertex(vertexId_, properties_);

**Parameters:**

vertexId_ - (required) a unique string identifying the vertex to add to the graph.
properties_ - (optional) reference to a property object to attach to the new vertex.

**Return:**

Returns a copy of the `vertexId_` in-parameter.

**Remarks:**

If a vertex with identifier `vertexId_` already exists in the graph, the call to `addVertex` is ignored.

### jsgraph.directed.DirectedGraph.removeVertex

        digraph.removeVertex(vertexId_);

**Parameters:**

vertexId_ - (required) the unique string identifier of the vertex to remove from the graph

**Return:**

Returns true to indicate that the specified vertex is not part of the graph.

**Remarks:**

Removing a vertex automatically removes all the the vertex's in-edges (i.e. directed edges pointing at the vertex being removed are also removed).

## jsgraph.directed.DirectedGraph.addEdge

        var edge = digraph.addEdge(vertexIdU_, vertexIdV_, properties_);

**Parameters:**

vertexIdU_ - (required) a unqique string identifying the directed edge's source vertex, U.
vertexIdV_ - (required) a unqique string identifying the directed edge's sink vertex, V.
properties_ - (optional) reference to a property object to attach to the new edge.

**Return:**

Returns an edge descriptor object containing the identifiers of the U and V vertices:

        { u: 'vertex U ID string', v: 'vertex V ID string' }

**Remarks:**

If a vertex or vertices specified in a call to `addEdge` do not exist, they are added automatically and then the edge is added.

## jsgraph.directed.DirectedGraph.removeEdge

        digraph.removeEdge(vertexIdU_, vertexIdV_);

**Parameters:**

vertexIdU_ - (required) the unqiue string identifying the directed edge's source vertex, U.
vertexIdV_ - (required) the unique string identifying the directed edge's sink vertex, V.

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

## jsgraph.directed.DirectedGraph.inEdges

        var edgeArray = digraph.inEdges(vertexId_);

**Parameters:**

vertexId_ - (required) the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

## jsgraph.directed.DirectedGraph.outEdges

        var edgeArray = digraph.outEdges(vertexId_);

**Parameters:**

vertexId_ - (requierd) the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifiy the source and sink vertex ID's of each of the specified vertex's out-edges.

## jsgraph.directed.DirectedGraph.inDegree

        var degree = digraph.inDegree(vertexId_);

**Parameters:**

vertexId_ - (requierd) the unique string identifying the vertex to query.

**Return:**

Integer indicating the in-degree of the specific vertex.

## jsgraph.directed.DirectedGraph.outDegree

        var degree = digraph.outDegree(vertexId_);

**Parameters:**

vertexId_ - (requierd) the unique string identifying the vertex to query.

**Return:**

Integer indicating the out-degree of the specific vertex.

## jsgraph.directed.DirectedGraph.vertexPropertyObject

        var properties = digraph.vertexPropertyObject(vertexId_);

**Parameters:**

vertexId_ - (requierd) the unique string identifying the vertex to query.

**Return:**

Returns a reference to the property object attached to the specified vertex when it was added to the graph.

## jsgraph.directed.DirectedGraph.edgePropertyObject

        var properties = digraph.vertexPropertyObject(vertexIdU_, vertexIdV);

**Parameters:**

vertexIdU_ - (required) the unqiue string identifying the directed edge's source vertex, U.
vertexIdV_ - (required) the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns a reference to the property object attached to the specified edge when it was added to the graph.

# Transforms

## jsgraph.directed.transpose

        var transposedDigraph = jsgraph.directed.transpose(digraphIn_);

**Parameters:**

digraphIn_ - (required) a reference to a previously-constructed and initialized DirectedGraph object.

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

Please see the [Boost C++ Graph Library: BFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/BFSVisitor.html) documentation for a complete discussion of API semantics.

### createBreadFirstSearchContext

Prior to calling either `breadthFirstVisit` or `breadthFirstSearch` you must initialize a context object for the algorithm's internal state.

      var bfsContext = jsgraph.directed.createBreadthFirstSearchContext(digraph_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object

**Remarks:**

You need to initialize a new context object every time you affect a new graph traversal.

### breadthFirstVisit

        jsgraph.directed.breadthFirstVisit(digraph_, context_, startVertexId_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
context_ - (required) a reference to your breadth-first search context object.
startVertexId_ - (required) the string identifier of vertex at which to start the visit traversal.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object.

**Return:**

None.

### breadthFirstSearch

        jsgraph.directed.breadthFirstSearch(digraph_, context_, startVertexArray_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
context_ - (required) a reference to your breadth-first search context object.
startVertexArray_ - (required) as array of string identifiers of the vertices to visit breadth-first.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object.

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
Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.

### jsgraph.directed.createDepthFirstSearchContext

Prior to calling either `depthFirstVisit` you must initialize a context object for the algorithm's internal state.

        var dfsContext = jsgraph.directed.createDepthFirstSearchContext(digraph_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object

**Remarks:**

You need to initialize a new context object every time you affect a new graph traversal.

This step is taken care of automatically by `depthFirstSearch` but not the lower-level `depthFirstVisit` algorithm implementation.

### jsgraph.directed.depthFirstVisit

        jsgraph.directed.depthFirstVisit(digraph_, context_, startVertexId_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
context_ - (required) a reference to your depth-first search context object.
startVertexArray_ - (required) as array of string identifiers of the vertices to visit depth-first search.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object.

**Return:**

None.

**Remarks:**

Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.

### jsgraph.directed.depthFirstSearch

        jsgraph.directed.depthFirstSearch(digraph_, visitorInterface_);

**Parameters:**

digraph_ - (required) a reference to a previously-constructed DirectedGraph object.
visitorInterface_ = (required) a reference to your application-specific BFS visitor interface object

**Return:**

None.

**Remarks:**

Please see the [Boost C++ Graph Library: DFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/DFSVisitor.html) documentation for a complete discussion of API semantics.
        
# Acknowledgements

Thanks to [Azuqua, Inc.](http://azuqua.com), Seattle for support and assistance.

Thanks to [Jeremy Seik](http://wphomes.soic.indiana.edu/jsiek/) for writing the BGL.

Copyright &copy; 2014 Encapsule Project / ChrisRus









