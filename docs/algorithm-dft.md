# Encapsule/jsgraph algorithm reference

[^--- TOP](../README.md)

## jsgraph.directed.depthFirstTraverse

Please refer to Chapter 23 "Elementary Graph Algorithms" of [Introduction To Algorithms](https://mitpress.mit.edu/books/introduction-algorithms) (MIT Press) for a complete discussion of the classic depth-first search and visit algorithms encapsulated by jsgraph's `depthFirstTraverse` algorithm.

### DFT request and response

`depthFirstTraverse` is called with a normalized traversal algorithm request object and returns a normalized traversal algorithm response object.

        var response = digraph.directed.depthFirstTraverse({
            digraph: myDigraph,
            visitor: myDFTVisitor
        });

**See: [Algorithm Reference: Traversal algorithms overview](./algorithms-traversal.md) for details.**

### DFT visitor interface object





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

- **initializeVertex** - This is invoked on every vertex of the graph before the start of the search.
- **startVertex** - This is invoked on the source vertex once before the start of the search.
- **discoverVertex** - This is invoked when a vertex is encountered for the first time.
- **examineEdge** - This is invoked on every out-edge of each vertex after it is discovered.
- **treeEdge** - This is invoked on each edge as it becomes a member of the edges that form the search tree.
- **backEdge** - This is invoked on the back edges in the graph. For an undirected graph there is some ambiguity between tree edges and back edges since the edge (u,v) and (v,u) are the same edge, but both the tree_edge() and back_edge() functions will be invoked. One way to resolve this ambiguity is to record the tree edges, and then disregard the back-edges that are already marked as tree edges. An easy way to record tree edges is to record predecessors at the tree_edge event point.
- **forwardOrCrossEdge** - This is invoked on forward or cross edges in the graph. In an undirected graph this method is never called.
- **finishEdge** - This is invoked on each non-tree edge as well as on each tree edge after finish_vertex has been called on its target vertex.
- **finishVertex** - This is invoked on vertex u after finish_vertex has been called for all the vertices in the DFS-tree rooted at vertex u. If vertex u is a leaf in the DFS-tree, then the finish_vertex function is called on u after all the out-edges of u have been examined.

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
