# Encapsule/jsgraph object reference

[^--- TOP](../README.md)

## DirectedGraph container

jsgraph's `DirectedGraph` container object provides a normalized API for managing in-memory directed graph data structures regardless of the application-specific semantics you ascribe to the data.

Many very important and common data structures are simply specific cases of directed graph structures that may be trivially stored in a `DirectedGraph` container. Consider storing your application-specifc data structures as directed graphs and passing around `DirectedGraph` container references instead of JavaScript object references.

- Elevate the level of abstraction of your design.
- Write less code that's more concise and simpler to read.
- Spend less time in the debugger thanks to helpful error messages.
- Make your codebase uniform, simple to read, refactor, and re-use.
- Have more productive dicussions with your co-workers.
- Accommodate changing requirements by design, not reaction.





## Construction

**See also: [Object reference: JSON I/O](./object-JSON.md)**

jsgraph's directed graph container, `DirectedGraph`, is constructed by calling the `jsgraph.directed.create` factory function export. 

```javascript
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
```

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

```javascript
var jsgraph = require('jsgraph');
var digraph = jsgraph.directed.create().result;
var foundStartVertex = digraph.isVertex("startVertex"); // methods apply to container instances
```

### Method request types

There are currently four (4) unique in-parameter request types leveraged by `DirectedGraph`'s methods:

**vertex read request**

A _vertex read request_ is a string that is interpreted as the unique ID of a vertex in a container.

```javascript
var vertexReadRequest = "vertexID";
```

**vertex write request**

A _vertex write request_ is an object with required string property 'u' and optional data property 'p'.

```javascript
var vertexWriteRequest = {
    u: "vertexID",
    p: { notes: "data to associate with the 'vertexID' vertex in the container" }
};
```

**edge read request**

An _edge read request_ is an object with required string properties 'u' and 'v'.

```javascript
var edgeReadRequest = { u: "Hello", v: "World" };
```

**edge write request**

An _edge write request_ is an object with required sub-object 'e' and optional data property 'p' where sub-object 'e' is a _edge read request_.

```javascript
var edgeWriteRequest = {
    e: { u: "Hello", v: "World" },
    p: { notes: "some data to associate with the edge from 'Hello' to 'World'" }
};
```
        

# DirectedGraph vertex methods


## DirectedGraph.isVertex

```javascript
digraph.isVertex(string);
```

**Request**

_vertex read request_

**Response**

Boolean true iff the vertex exists in the container. Otherwise false.

**Notes**

If you pass the ID of a non-existent vertex, or bad input the response will be false.






## DirectedGraph.addVertex

```javascript
var response = digraph.addVertex({ u: string, p: data});
```

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






## DirectedGraph.removeVertex

```javascript
digraph.removeVertex(string);
```

**Request**

_vertex read request_

**Response**

Returns true to indicate that regardless of initial conditions the specified vertex is not present in the container. Otherwise, false.

**Notes**

If the response is true, then all edges (both in and out-edges) directed towards and away from the removed vertex are automatically removed as well.

If you pass bad input, or the vertex doesn't exist in the container the call returns false.








## DirectedGraph.getVertexProperty

```javascript
var response = digraph.getVertexProperty(string);
```

**Request**

_vertex read request_

**Response**

Returns a reference to data associated with the vertex in the container. If no association exists, the call returns undefined.

**Notes**

`getVertexProperty` will return undefined if passed bad input.





## DirectedGraph.setVertexProperty

`setVertexProperty` is an alias for method `addVertex`.





## DirectedGraph.hasVertexProperty

```javascript
var response = digraph.hasVertexProperty(string);
```

**Request**

_vertex read request_

**Response**

Returns true if the vertex has associated property data. Otherwise, false.

**Notes:**

`hasVertexProperty` will return false if the request is invalid, the vertex does not exist in the graph, or the vertex exists and does not have associated property data.





## DirectedGraph.clearVertexProperty

```javascript
var response = digraph.clearVertexProperty(string);
```

**Request**

_vertex read request_

**Return**

Returns true to indicate that regardless of initial conditions, the vertex now has no property data associated with it. Otherwise, false.

**Notes**

`clearVertexProperty` will return false if the request is invalid, or if the vertex does not exist in the graph.






## DirectedGraph.inDegree

```javascript
var response = digraph.inDegree(string);
```

**Request**

_vertex read request_

**Response**

Integer indicating the in-degree of the specific vertex.

**Notes**

`isDegree` will return zero (0) if the request is invalid, or if the vertex has zero in-degree.





## DirectedGraph.inEdges

```javascript
var response = digraph.inEdges(string);
```

**Request**

_vertex read request_

**Response**

Array of edge descriptor objects specifying the source and sink vertex ID's of each of the specified vertex's in-edges.

```javascript
response = [
    { u: string, p: data },
    //...
];
```

**Notes**

`inEdges` will return an empty array if the request is invalid, or if the vertex has no in-edges.






## DirectedGraph.outDegree

```javascript
var response = digraph.outDegree(string);
```

**Request**

_vertex read request_

**Response**

Integer indicating the out-degree of the specific vertex.

**Notes**

`outDegree` will return zero (0) if the request is invalid, or if the vertex has no out-edges.




## DirectedGraph.outEdges

```javascript
var response = digraph.outEdges(string);
```

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


# DirectedGraph edge methods


## DirectedGraph.addEdge

```javascript
var response = digraph.addEdge({ e: { u: string, v: string }, p: data });
```

**Request**

_edge write request_

**Response**

JavaScript object with the following properties:

- **error**: null or string explaining what went wrong
- **result**: an edge read request object or null if error

**Notes**

If specified, property data should be serializable to JSON. There are ways around this but you _should_ store non-serializable references (e.g. functions) in external hashtables indexed by a concatenation of the edge's vertex identifiers.

If the edge already exists in the container and property data was specified, then `addEdge` updates the edge's property data in the container.

If the edge already exists and no property data was specified, `addEdge` does nothing.

If your intention is to disassociate the edge from property data, call `clearEdgeProperty` method.

The `setEdgeProperty` method is a convenience alias for `addEdge` and their behavior is identical in all respects.






## DirectedGraph.isEdge

```javascript   
    var response = digraph.isEdge({ u: string, v: string });
```    

**Request**

_edge read request_

**Response**

Return true if the edge is part of the graph. Otherwise, false.

**Notes**

`isEdge` will return false if you pass bad input.





## DirectedGraph.removeEdge

```javascript
var response = digraph.removeEdge({ u: string, v: string });
```


**Request**

_edge read request_

**Response**

Returns true to indicate that regardless of initial conditions, the specified edge in not part of the graph. Otherwise false.

**Notes**

Removing an edge has no impact on the edges vertices or their associated property data.

`removeEdge` will return false if you pass bad input.





## DirectedGraph.getEdgeProperty

```javascript
var response = digraph.getEdgePropertyObject({ u: string, v: string });
```

**Request**

_edge read request_

**Response**

Returns a reference to the property data associated with the specified edge in the graph. If no association exists the call returns undefined.

**Notes**

`getEdgeProperty` will return undefined if passed bad input, the edge does not exist, or the edge exists but has no associated property data.






## DirectedGraph.setEdgeProperty

`setEdgeProperty` is an alias for `addEdge`.





## DirectedGraph.hasEdgeProperty

```javascript
var response = digraph.hasEdgeProperty({ u: string, v: string });
```

**Request**

_edge read request_

**Response**

Returns true if the specified edge has associated property data. Otherwise false.

**Notes**

`hasEdgeProperty` will return false if passed input, if the edge does not exist in the graph, or if the edge exists but has no associated property data.




## DirectedGraph.clearEdgeProperty

```javascript
var response = digraph.clearEdgeProperty({ u: string, v: string });
```

**Request**

_edge read request_

**Response**

Returns true to indicate that regardless of initial conditions there is no property data associated with the specified edge in the container. Otherwise false.

**Notes**

`clearEdgeProperty` will return false if passed bad input.




# DirectedGraph container methods



## DirectedGraph.verticesCount

```javascript
var response = digraph.verticesCount();
```

**Response**

Integer indicating the number of vertices in this graph.






## DirectedGraph.getVertices

```javascript
vertices = digraph.getVertices();
```

**Response**

Returns an array of string vertex identifiers.    






## DirectedGraph.edgesCount

```javascript
var response = digraph.edgesCount();
```

**Reponse**

Integer indicating the number of edges in this graph.






## DirectedGraph.getEdges

```javascript
var response = digraph.getEdges();
```

**Response**

Returns an array of edge descriptor objects with `u` and `v` properties set to tail and head vertex identifier strings respectively.





## DirectedGraph.rootVerticesCount

```javascript
var response = digraph.rootVerticesCount();
```

**Response**

Integer count of the number of vertices with in-degree equal to zero (0).



## jsgraph.DirectedGraph.getRootVertices

```javascript
var response = digraph.getRootVertices();
```

**Response**

Returns an array of identifier strings indicating the set of root vertices in the graph (i.e. the set of vertices with in-degree zero).





### DirectedGraph.leafVerticesCount

```javascript
var response = digraph.leafVerticesCount();
```

**Response**

Integer count of the number of vertices with out-degree equal to zero (0).




## Directedgraph.getLeafVertices

```javascript
var response = digraph.getLeafVertices();
```

**Response**

Returns an array of identifier strings indicating the set of leaf vertices in the graph (i.e. the set of vertices with out-degree zero).



### DirectedGraph.toObject

**See also: [Object Reference: data I/O](./docs/object-JSON.md)**

```javascript
var response = digraph.toObject();
```

**Response**

Returns a serialized data object that contains the contents of the directed graph.

**Notes**

`toObject` is typically used to obtain the serialized representation of a container for inclusion in some other structure.

The object returned may be passed to the `DirectedGraph` constructor, or to method `fromObject`.

### DirectedGraph.toJSON

**See also: [Object Reference: data I/O](./docs/object-JSON.md)**

```javscript
var response = digraph.toJSON(replacer,space);
```

**Response**

Returns a `DirectedGraph`'s serialized data object converted to JSON.

**Remarks:**

The JSON string returned may be passed to the `DirectedGraph` constructor, or to method `fromJSON`.


### DirectedGraph.fromObject

**See also: [Object Reference: data I/O](./docs/object-JSON.md)**

```javascript
var response = digraph.fromObject(object);
```

**Request**

JavaScript object returned by `toObject`.

**Response**

JavaScript object with the following properties:

- **error**: null or a string explaining what went wrong
- **result**: true to indicate success or null if error

**Notes**

`fromObject` parses request and uses `addVertex` and `addEdge` container API's to add the additional vertices and edges to the container.



### DirectedGraph.fromJSON

Identical to `fromObject` except that the request is a JSON string instead of a datg object.






<hr>

Copyright &copy; 2014-2015 [Christopher D. Russell](https://github.com/ChrisRus)

