# Encapsule/jsgraph object reference

## DirectedGraph container

jsgraph's `DirectedGraph` container object provides a normalized API for managing in-memory directed graph data structures regardless of the application-specific semantics you ascribe to the data.

Many very important and common data structures are simply specific cases of directed graph structures that may be trivially stored in a `DirectedGraph` container. Consider storing your application-specifc data structures as directed graphs and passing around `DirectedGraph` container references instead of JavaScript object references.

- Elevate the level of abstraction of your design.
- Write less code that's more concise and simpler to read.
- Spend less time in the debugger thanks to helpful error messages.
- Make your codebase uniform, simple to read, refactor, and re-use.
- Have more productive dicussions with your co-workers.
- Accommodate changing requirements by design, not reaction.

### Construction

**See also: [Object reference: JSON I/O](./object-JSON.md)**

jsgraph's directed graph container, `DirectedGraph`, is constructed by calling the `jsgraph.directed.create` factory function export. 

        var jsgraph = require('jsgraph');
        var response = jsgraph.directed.create(/*optional init data*/);
        if (!response.error) {
            // container is ready for use
            var digraph = response.result;
            console.log("digraph JSON = '" + digraph.toJSON() + "'");
        } else {
            // container constructor failed
            console.error(response.error);
        }         

If the `DirectedGraph` container is successfully constructed, `jsgraph.directed.create` returns a response object that looks like this:

        `{ error: null, result: DirectedGraph }`

However, if you call `jsgraph.directed.create` and pass a parameter the constructor cannot parse, the response object will contain an error string as follows and the response.result property will be null.

        '{ error: "Some error string explaining what went wrong.", result: null }`
        
**Note:** Not all jsgraph functions and methods return error/result response objects. Many are implemented instead to return reasonable default values when bad input is received. However, in cases where an error/result response is indicated in the documentation, it is essential that you check and handle all errors reported by jsgraph as all are significant.

## DirectedGraph methods

For convenience we abbreviate functions defined on the `DirectedGraph` prototype object, e.g. `isVertex`, using the notation `DirectedGraph.isVertex`.

You can't actually call `DirectedGraph.isVertex` using this syntax however. The `DirectedGraph` symbol isn't exported by jsgraph and is a constructor function.

What is implied and the correct use of methods is as follows:

        var jsgraph = require('jsgraph');
        var digraph = jsgraph.directed.create().result;
        var foundStartVertex = digraph.isVertex("startVertex"); // methods apply to container instances





### DirectedGraph.isVertex

        digraph.isVertex('foo');

**Return:**

Returns boolean true iff the specified vertex ID is part of the graph. Otherwise, false.





### DirectedGraph.addVertex

        var response = digraph.addVertex(request);                

**Request**

Request is a JavaScript object with the following properties:

- **u** (required): unique string identifier of the vertex
- **p** (optional): undefined or any value serializable to JSON

**Response**

Call returns a JavaScript response object with the following properties:

- **error**: null or a string explaining what went wrong
- **result**: the unique string identifier of the vertex added to the container or null if an error occurred

**Remarks:**

If the vertex already exists in the container and property data was specified, then `addVertex` updates the vertex's property data in the container. If the vertex already exists and no property data is specified, `addVertex` does nothing. If your intention is to clear the property data associated with a vertex in the container, use `setVertexProperty` 




### DirectedGraph.removeVertex

        digraph.removeVertex(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifier of the vertex to remove from the graph

**Return:**

Returns true to indicate that the specified vertex is not part of the graph.

**Remarks:**

Removing a vertex automatically removes all the the vertex's edges (both in and out-edges are removed). 

## jsgraph.DirectedGraph.verticesCount

        var count = digraph.verticesCount();

**Return:**

Integer indicating the number of vertices in this graph.





### DirectedGraph.getVertexProperty

        var properties = digraph.getVertexProperty(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns a reference to the property data attached to the specified vertex.




### DirectedGraph.setVertexProperty

        var properties = digraph.getVertexProperty(vertexId_, ref_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.
- ref_: whatever you want as long as it's serializable to JSON

**Return:**

Returns true if set. Otherwise false if the specified vertex is not part of the graph.

**Notes:**






### DirectedGraph.hasVertexProperty

        var response = digraph.hasVertexProperty("vertexID");

**Parameters:**

- vertexId_ (required): the unique string identifying the vertex to query.

**Return:**

Returns true if the vertex has associated property data. Otherwise, false.

**Notes:**

`hasVertexProperty` will return false if the request is invalid, the vertex does not exist in the graph, or the vertex exists and does not have associated property data.




### DirectedGraph.clearVertexProperty


        var response = digraph.clearVertexProperty("vertexID");

**Parameters:**

- vertexId_ (required): the unique string identifying the vertex that you wish to disassociate from attached property data

**Return:**

Returns true to indicate that regardless of initial conditions, the vertex now has no property data associated with it. Otherwise, false.

**Notes:**

`clearVertexProperty` will return false if the request is invalid, or if the vertex does not exist in the graph.





### DirectedGraph.inDegree

        var degree = digraph.inDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the in-degree of the specific vertex.




### DirectedGraph.inEdges

        var edgeArray = digraph.inEdges(vertexId_);

**Parameters:**

- vertexId_ (required): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.






### DirectedGraph.outDegree

        var degree = digraph.outDegree(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Integer indicating the out-degree of the specific vertex.





### DirectedGraph.outEdges

        var edgeArray = digraph.outEdges(vertexId_);

**Parameters:**

- vertexId_ (requierd): the unique string identifying the vertex to query.

**Return:**

Returns an array of edge descriptor objects specifiy the source and sink vertex ID's of each of the specified vertex's out-edges.



^ vertex methods in correct order
v chaos











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
