# Encapsule/jsgraph algorithm reference

## jsgraph.directed.breadthFirstTraverse


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

- **initializeVertex** - This invoked on every vertex of the graph before the start of the graph search.
- **discoverVertex** - This is invoked when a vertex is encountered for the first time
- **examineVertex** - This is invoked on a vertex as it is popped from the queue. This happens immediately before examine_edge() is invoked on each of the out-edges of vertex u.
- **examineEdge** - This is invoked on every out-edge of each vertex after it is discovered.
- **treeEdge** - This in invoked on edge edge as it becomes a member of the edges that form the search tree.
- **nonTreeEdge** - This is invoked on back or cross edges.
- **grayTarget** - This is invoked on the subset of non-tree edges whose target vertex is colored grat at the time of examination. The color gray indicates that the vertex is currently in the queue.
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