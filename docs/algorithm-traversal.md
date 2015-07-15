# Encapsule/jsgraph algorithm reference

[^--- TOP](../README.md)

## Traveral algorithms overview

jsgraph v0.5 exports two _traveral_ algorithms:

- [Algorithm Reference: jsgraph.directed.breadthFirstTraverse](./algorithm-bft.md)
- [Algorithm Reference: jsgraph.directed.depthFirstTraverse](./algorithm-dft.md)

## Traversal request object

Traversal algorithms rely on a common request object structure and shared front-end request parser.

A traveral algorithm request is a JavaScript object that looks like this:

        var traversalRequest = {
            digraph: (required) DirectedGraph container reference
            visitor: (required) visitor interface object reference
            options: (optional) advanced config options object
        };

Pass a traversal request object to either `breadthFirstTraverse` or `depthFirstTraverse` and to initiate a traversal and obtain a response object.

### Request behavior

In versions prior to v0.5, jsgraph algorithms exposed some sharp edges that made them difficult for novices to apply correctly. In v0.5 the API was refactored to hide uncommonly used options, and take reasonable default actions.

Most of the time you'll not need to worry about `request.options`. A few commonly hit exceptions are documented in the subsections below.

For reference, here are the property semantics of the `request.options` object:

property | type | explanation
-------- | ---- | -----------
startVector | string or array of strings | one or more vertex ID string(s). defaults to root vertex set of container
allowEmptyStartVector | Boolean | flag indicating if traversal with empty start vector is an error or not. default is false
signalStart | Boolean | flag indicating if the algorithm should call the `startVertex` visitor interface callback. default is true.
traverseContext | object | traversal context (advanced - see subsection below)

#### Rootless directed graphs

A rootless directed graph has no vertices with in-degree zero (0). That is every vertex in the graph has at least one edge directed at it.

If you pass a rootless directed graph to a traversal algorithm, the call will return an error indicating that the traversal cannot start because the algorithm doesn't know at which vertex to start the traversal.

Depending on what you're doing and what you're trying to learn by invoking the traversal, consider one of the following strategies:

- Specify one or more start vertices explicitly via `request.options.startVector` array.
- Override the empty start vector error via `request.options.allowEmptyStartVector` Boolean flag.

Note that this advice also applies if your digraph is **empty** because a graph with no vertices has no root vertices.

#### Visit vs. search and starting vertex set

In **Introduction to Algorithms** a graph _visit_ starts at a vertex and executes some stateful walk along edges. A _search_ is an ordered sequence of _visits_.

The start or starting vertices for visit and search respectively are called the *start vertex set*.

If the start vertex set contains a single vertex ID string, then the traversal algorithm executes an algorithm-specific graph visit.

If the start vertex set contains more than one vertex ID string, then the traversal algorithm executes an algorithm-specific graph search.

By default, all jsgraph traversal algorithms call `DirectedGraph.getRootVertices` to obtain the start vertex set.

This behavior can be overriden via `request.options.startVector` array.

#### Overriding the default traversal context

Traversal algorithms internally allocate a color map and some other private state used during the execution of the traversal. On success, this "traversal context object" is returned via `response.result`.

In advanced scenarios, and sometimes in cases where you need fine-grained control over the color map values, use jsgraph export `jsgraph.directed.createTraversalContext` to default construct a traversal context, do what you need to it, and then pass it via `request.options.traversalContext`.

## Traversal response object

Traversal algorithms return an error/result response object.

        var response = {
            error: null or string explaining what went wrong
            result: for traversal algorithms always a traversal context object or null if error
        };
        
A traversal context object looks like this:

        var traversalContext = {
            searchStatus: string status
            colorMap: hashtable
            undiscoveredMap: hashtable
        };

It is often useful to determine if a traversal completed or was terminated by a **false** visitor callback response.

Use the `response.searchStatus` string to discriminate the exit status of the traversal as follows:

        var response = jsgraph.directed.exampleTraverse(request);
        if (!response.error) {
            var traversalContext = response.result;
            switch (traversalContext.searchStatus) {
            case 'completed':
                // traversal completed normally
                break;
            case 'terminated':
                // traversal was terminated by a false visitor callback response
                break;
            default:
                // unexpected
                break;
            }
        }





             




