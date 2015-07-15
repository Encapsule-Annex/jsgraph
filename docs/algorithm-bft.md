# Encapsule/jsgraph algorithm reference

[^--- TOP](../README.md)

## jsgraph.directed.breadthFirstTraverse

Please refer to Chapter 23 "Elementary Graph Algorithms" of [Introduction To Algorithms](https://mitpress.mit.edu/books/introduction-algorithms) (MIT Press) for a complete discussion of the classic depth-first search and visit algorithms encapsulated by jsgraph's `depthFirstTraverse` algorithm.

### BFT request and response

`breadthFirstTraverse` is called with a normalized traversal algorithm request object and returns a normalized traversal algorithm response object.

        var response = digraph.directed.breadthFirstTraverse({
            digraph: myDigraph,
            visitor: myBFTVisitor
        });

**See: [Algorithm Reference: Traversal algorithms overview](./algorithms-traversal.md) for details.**

### BFT visitor interface object

A BFT visitor interface is a JavaScript object with zero or more defined function callbacks that you implement with the following semantics:

callback | request | explanation
-------- | ------- | -----------
initializeVertex | { u: string, g: DirectedGraph } | invoked on every vertex of the graph before the start of the graph search
startVertex | { u: string, g: DirectedGraph } | invoked on every vertex of the graph before the start of the graph search
discoverVertex | { u: string, g: DirectedGraph } | invoked on every vertex of the graph before the start of the graph search
examineVertex | { u: string, g: DirectedGraph } | invoked on every vertex of the graph before the start of the graph search
examineEdge | { e: { u: string, v: string }, g: DirectedGraph } | invoked on every out-edge of each vertex after it is discovered
nonTreeEdge | { e: { u: string, v: string }, g: DirectedGraph } | invoked on back or cross edges
grayTarget | { e: { u: string, v: string }, g: DirectedGraph } | invoked on the subset of non-tree edges whose target vertex is colored grat at the time of examination. The color gray indicates that the vertex is currently in the queue.
blackTarget | { e: { u: string, v: string }, g: DirectedGraph } | invoked on a subset of the edges whose target vertex is colored black at the time of examination. The color black indicates that the vertex has been removed from the queue
finishVertex | { u: string, g: DirectedGraph } | invoked on a vertex after all of its out edges have been added to the search tree and all adjacent vertices have been discovered (but before the out-edges of the adjacent vertices have been examined).


Please see the [Boost C++ Graph Library: BFS Visitor Concept](http://www.boost.org/doc/libs/1_55_0/libs/graph/doc/BFSVisitor.html) documentation for a complete discussion of API semantics.

