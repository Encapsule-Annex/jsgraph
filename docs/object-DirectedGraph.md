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

### Method notation

For convenience we abbreviate functions defined on the `DirectedGraph` prototype object, e.g. `isVertex`, using the notation `DirectedGraph.isVertex`.

You can't actually call `DirectedGraph.isVertex` using this syntax however. The `DirectedGraph` symbol isn't exported by jsgraph and is a constructor function.

What is implied and the correct use of methods is as follows:

        var jsgraph = require('jsgraph');
        var digraph = jsgraph.directed.create().result;
        var foundStartVertex = digraph.isVertex("startVertex"); // methods apply to container instances

### Method request types

There are currently four (4) unique in-parameter request types leveraged by `DirectedGraph`'s methods:

**vertex read request**

A _vertex read request_ is a string that is interpretted as the unique ID of a vertex in a container.

        var vertexReadRequest = "vertexID";

**vertex write request**

A _vertex write request_ is an object with required string property 'u' and optional data property 'p'.

        var vertexWriteRequest = {
            u: "vertexID",
            p: { notes: "data to associate with the 'vertexID' vertex in the container" }
        };

**edge read request**

An _edge read request_ is an object with required string properties 'u' and 'v'.

        var edgeReadRequest = { u: "Hello", v: "World" };

**edge write request**

An _edge write request_ is an object with required sub-object 'e' and optional data property 'p' where sub-object 'e' is a _edge read request_.

        var edgeWriteRequest = {
            e: { u: "Hello", v: "World" },
            p: { notes: "some data to associate with the edge from 'Hello' to 'World'" }
        };
        





### DirectedGraph.isVertex

        digraph.isVertex(string);

**Request**

_vertex read request_

**Response**

Boolean true iff the vertex exists in the container. Otherwise false.

**Notes**

If you pass the ID of a non-existent vertex, or bad input the response will be false.






### DirectedGraph.addVertex

        var response = digraph.addVertex({ u: string, p: data});

**Request**

_vertex write request_

**Response**

JavaScript object with the following properties:

- **error**: null or a string explaining what went wrong
- **result**: the unique string identifier of the vertex added to the container or null if an error occurred

**Notes**

If specified, property data should be serializable to JSON. There are ways around this but you _should_ store non-serializable references (e.g. functions) in external hashtables indexed by vertex identifier string.

If the vertex already exists in the container and property data was specified, then `addVertex` updates the vertex's property data in the container.

If the vertex already exists and no property data is specified, `addVertex` does nothing.

If your intention is to disassociate the vertex from property data, call `clearVertexProperty` method.

The `setVertexProperty` method is a convenience alias for the `addVertex` and their behavior is identical in all respects.






### DirectedGraph.removeVertex

        digraph.removeVertex(string);

**Request**

_vertex read request_

**Response**

Returns true to indicate that regardless of initial conditions the specified vertex is not present in the container. Otherwise, false.

**Notes**

If the response is true, then all edges (both in and out-edges) directed towards and away from the removed vertex are automatically removed as well.

If you pass bad input, or the vertex doesn't exist in the container the call returns false.








### DirectedGraph.getVertexProperty

        var properties = digraph.getVertexProperty(string);

**Request**

_vertex read request_

**Response**

Returns a reference to data associated with the vertex in the container. If no association exists, the call returns undefined.




### DirectedGraph.setVertexProperty

`setVertexProperty` is an alias for method `addVertex`.





### DirectedGraph.hasVertexProperty

        var response = digraph.hasVertexProperty(string);

**Request**

_vertex read request_

**Response**

Returns true if the vertex has associated property data. Otherwise, false.

**Notes:**

`hasVertexProperty` will return false if the request is invalid, the vertex does not exist in the graph, or the vertex exists and does not have associated property data.





### DirectedGraph.clearVertexProperty


        var response = digraph.clearVertexProperty(string);

**Request**

_vertex read request_

**Return:**

Returns true to indicate that regardless of initial conditions, the vertex now has no property data associated with it. Otherwise, false.

**Notes:**

`clearVertexProperty` will return false if the request is invalid, or if the vertex does not exist in the graph.






### DirectedGraph.inDegree

        var degree = digraph.inDegree(string);

**Request**

_vertex read request_

**Response**

Integer indicating the in-degree of the specific vertex.

**Notes**

`isDegree` will return zero (0) if the request is invalid, or if the vertex has zero in-degree.





### DirectedGraph.inEdges

        var edgeArray = digraph.inEdges(string);

**Request**

_vertex read request_

**Response**

Array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

    response = [
        { u: string, p: data },
        ...
    ]

**Notes**

`inEdges` will return an empty array if the request is invalid, or if the vertex has no in-edges.






### DirectedGraph.outDegree

        var degree = digraph.outDegree(string);

**Request**

_vertex read request_

**Response**

Integer indicating the out-degree of the specific vertex.

**Notes**

`outDegree` will return zero (0) if the request is invalid, or if the vertex has no out-edges.




### DirectedGraph.outEdges

        var edgeArray = digraph.outEdges(string);

**Request**

_vertex read request_

**Response**

Array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

    response = [
        { u: string, p: data },
        ...
    ]

**Notes**

`inEdges` will return an empty array if the request is invalid, or if the vertex has no in-edges.



<hr>
above this is v0.5 docs
<hr>


## DirectedGraph edge methods



## jsgraph.DirectedGraph.isEdge

        digraph.isEdge(uid,vid);

**Parameters:**

- uid (required): the unique string identifying the directed edge's source vertex, U.
- vid (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Return true if the edge is part of the graph. Otherwise, false.



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





## jsgraph.DirectedGraph.getEdgeProperty

        var properties = digraph.getEdgePropertyObject(vertexIdU_, vertexIdV);

**Parameters:**

- vertexIdU_ (required): the unqiue string identifying the directed edge's source vertex, U.
- vertexIdV_  (required): the unique string identifying the directed edge's sink vertex, V.

**Return:**

Returns a reference to the property object attached to the specified edge when it was added to the graph.





## jsgraph.DirectedGraph.setEdgeProperty

`setEdgeProperty` is an alias for `addEdge`.





### DirectedGraph.hasEdgeProperty


### DirectedGraph.clearEdgeProperty


## DirectedGraph container methods



## jsgraph.DirectedGraph.verticesCount

        var count = digraph.verticesCount();

**Return:**

Integer indicating the number of vertices in this graph.






## jsgraph.DirectedGraph.getVertices

        vertices = digraph.getVertices();

**Return:**

Returns an array of string vertex identifiers.    






## jsgraph.DirectedGraph.edgesCount

        var count = digraph.edgesCount();

**Return:**

Integer indicating the number of edges in this graph.






## jsgraph.DirectedGraph.getEdges

        var edges = digraph.getEdges()

**Returns:**

Returns an array of edge descriptor objects with `u` and `v` properties set to tail and head vertex identifier strings respectively.





### DirectedGraph.rootVerticesCount





## jsgraph.DirectedGraph.getRootVertices

        var vertices = digraph.getRootVertices();

**Return:**

Returns an array of identifier strings indicating the set of root vertices in the graph (i.e. the set of vertices with in-degree zero).





### DirectedGraph.leafVerticesCount




## jsgraph.Directedgraph.getLeafVertices

        var vertices = digraph.getLeafVertices();

**Return:**

Returns an array of identifier strings indicating the set of leaf vertices in the graph (i.e. the set of vertices with out-degree zero).



### DirectedGraph.toObject



### DirectedGraph.toJSON

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




### DirectedGraph.fromObject



### DirectedGraph.fromJSON





