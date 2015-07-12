# Encapsule/jsgraph object reference

## DirectedGraph container



# DirectedGraph Generic Container

jsgraph is inspired by the design and implementation of the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_56_0/libs/graph/doc/index.html) (BGL) that applies the C++ Standard Template Library concepts of generic containers and algorithms to mathematical graph datasets. 

        var jsgraph = require('jsgraph');
        var digraph = new jsgraph.DirectedGraph(JSON); // JSON is optional

## DirectedGraph.addVertex

        var vertex = digraph.addVertex(vertexId_, properties_);

**Parameters:**

- vertexId_ (required): a unique string identifying the vertex to add to the graph.
- properties_ (optional): reference to a property object to attach to the new vertex.

**Return:**

Returns a copy of the `vertexId_` in-parameter. If the vertex already exists, its properties are replaced if specified.

**Remarks:**

If a vertex with identifier `vertexId_` already exists in the graph, the call to `addVertex` is ignored.

## jsgraph.DirectedGraph.removeVertex

        digraph.removeVertex(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifier of the vertex to remove from the graph

**Return:**

Returns true to indicate that the specified vertex is not part of the graph.

**Remarks:**

Removing a vertex automatically removes all the the vertex's edges (both in and out-edges are removed). 

## jsgraph.DirectedGraph.isVertex

        digraph.isVertex('foo');

**Return:**

Returns boolean true iff the specified vertex ID is part of the graph. Otherwise, false.

## jsgraph.DirectedGraph.verticesCount

        var count = digraph.verticesCount();

**Return:**

Integer indicating the number of vertices in this graph.

## jsgraph.DirectedGraph.getVertices

        vertices = digraph.getVertices();

**Return:**

Returns an array of string vertex identifiers.    

## jsgraph.DirectedGraph.getRootVertices

        var vertices = digraph.getRootVertices();

**Return:**

Returns an array of identifier strings indicating the set of root vertices in the graph (i.e. the set of vertices with in-degree zero).

## jsgraph.Directedgraph.getLeafVertices

        var vertices = digraph.getLeafVertices();

**Return:**

Returns an array of identifier strings indicating the set of leaf vertices in the graph (i.e. the set of vertices with out-degree zero).


## jsgraph.DirectedGraph.getVertexPropertyObject

        var properties = digraph.getVertexPropertyObject(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns a reference to the property object attached to the specified vertex when it was added to the graph.

## jsgraph.DirectedGraph.setVertexPropertyObject

        var properties = digraph.getVertexPropertyObject(vertexId_, ref_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.
- ref_: whatever you want as long as it's serializable to JSON

**Return:**

Returns true if set. Otherwise false if the specified vertex is not part of the graph.

## jsgraph.DirectedGraph.inEdges

        var edgeArray = digraph.inEdges(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

## jsgraph.DirectedGraph.outEdges

        var edgeArray = digraph.outEdges(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifiy the source and sink vertex ID's of each of the specified vertex's out-edges.

## jsgraph.DirectedGraph.inDegree

        var degree = digraph.inDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the in-degree of the specific vertex.

## jsgraph.DirectedGraph.outDegree

        var degree = digraph.outDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the out-degree of the specific vertex.








## jsgraph.DirectedGraph.addEdge

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

## jsgraph.DirectedGraph.removeEdge

        digraph.removeEdge(uid, vid);

**Parameters:**

- uid (required): the unqiue string identifying the directed edge's source vertex, U.
- vid (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns true to indicate that the specified edge is not part of the graph.

## jsgraph.DirectedGraph.isEdge

        digraph.isEdge(uid,vid);

**Parameters:**

- uid (required): the unique string identifying the directed edge's source vertex, U.
- vid (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Return true if the edge is part of the graph. Otherwise, false.

## jsgraph.DirectedGraph.edgesCount

        var count = digraph.edgesCount();

**Return:**

Integer indicating the number of edges in this graph.

## jsgraph.DirectedGraph.getEdges

        var edges = digraph.getEdges()

**Returns:**

Returns an array of edge descriptor objects with `u` and `v` properties set to tail and head vertex identifier strings respectively.


## jsgraph.DirectedGraph.getEdgeProperty

        var properties = digraph.getEdgePropertyObject(vertexIdU_, vertexIdV);

**Parameters:**

- vertexIdU_ (required): the unqiue string identifying the directed edge's source vertex, U.
- vertexIdV_  (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns a reference to the property object attached to the specified edge when it was added to the graph.

## jsgraph.DirectedGraph.setEdgeProperty

        var properties = digraph.getEdgePropertyObject(vertexIdU_, vertexIdV, ref_);

**Parameters:**

- vertexIdU_ (required): the unqiue string identifying the directed edge's source vertex, U.
- vertexIdV_  (required): the unique string identifying the directed edge's sink vertex, V.
- ref_: whatever you want as long as it's serializable to JSON

**Return:**

Returns the edge descriptor object.

## jsgraph.DirectedGraph.toJSON

        var digraph = new DirectedGraph();
        digraph.toJSON(undefined,4);

**Returns:**

JSON-encoded serialization of the contents of the DirectedGraph container. 

**Remarks:**

Pass the JSON string returned by DirectedGraph.toJSON to method DirectedGraph.importJSON or the DirectedGraph constructor to import.

## jsgraph.DirectedGraph.importJSON

        digraph.DirectedGraph.importJSON(JSON);

** Remarks:**

JSON import adds vertices and edges to the current DirectedGraph container from an external JSON source. Duplicates are ignored.

# Generic Transforms

## jsgraph.directed.transpose

        var transposedDigraph = jsgraph.transpose(digraphIn_);

**Parameters:**

- digraphIn_ (required): a reference to a previously-constructed and initialized DirectedGraph object.

**Return:**

Returns a new instance of DirectedGraph that reverses the direction of all the edges in the source graph.
