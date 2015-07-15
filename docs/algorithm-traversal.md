# Encapsule/jsgraph algorithm reference

[^--- TOP](../README.md)

## Traveral algorithms overview

jsgraph v0.5 exports two _traveral_ algorithms:

- [Algorithm Reference: jsgraph.directed.breadthFirstTraverse](./algorithm-bft.md)
- [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./algorithm-dft.md)

### Traversal request object

Traversal algorithms rely on a common request object structure and shared front-end request parser.

A traveral algorithm request is a JavaScript object that looks like this:

        var traversalRequest = {
            digraph: (required) reference to in-memory `DirectedGraph` container
            visitor: (required) reference to client-defined, algorithm-specific visitor interface object
            options: (optional) an object containing advanced configuration options (discussed below)
        };

Pass a traversal request object to either `breadthFirstTraverse` or `depthFirstTraverse` and to initiate a traversal and obtain a response object.

### Traversal response object

Traversal algorithms return an error/result response object.

If no error occurred, then `response.error` will be null and `response.result` will be the **traversal context**:

        var traversalContext = {
            searchStatus: string indicating the status of the traversal
            colorMap: an internal hashtable used internally by the algorithm
            undiscoveredMap: an internal hashtable used to keep track of vertices that have not been visited
        };

It is often useful to determine if a traversal has been terminated (i.e. if a visitor interface callback function returned false and terminated the traversal algorithm). This is determined by comparing `response.searchStatus` to "completed" vs. "terminated"

## Advanced options

The traversal `request.options` object is an optional JavaScript object with the following optional properties:

- **startVector**: A vertex ID string or array of vertex ID strings. Defaults to the root vertex set of the container.
- **allowEmptyStartVector**: Boolean flag indicating if traversal with empty start vector is an error or not. Default is false.
- **signalStart**: Boolean flag indicating if the algorithm should call the `startVertex` visitor interface callback. Default is true.
- **traverseContext**: Traversal context object allowing client to pass in pre-colored colormaps etc. (very advanced)







             




