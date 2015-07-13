/* --------------------------------------------------------------------------

The MIT License (MIT)

Copyright (c) 2014-2015 Christopher D. Russell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Encapsule Project: https://github.com/encapsule http://blog.encapsule.org
Please follow @Encapsule on Twitter: https://twitter.com/encapsule

-------------------------------------------------------------------------- */

var jsgraph = module.exports = {

    // Directed graph support
    directed: {

        ////
        // Create a DirectedGraph container object.
        //
        // var response = jsgraph.directed.create(request);
        //
        // request = Undefined, JSON string, or data object [1]
        //
        // response = {
        //     error: null or string explaining why result is null
        //     result: DirectedGraph container object or null if error
        // }
        //
        // Notes:
        //
        // [1] see DirectedGraph.toJSON/toObject methods.
        //
        ////
        create: require('./src/digraph').createDirectedGraph,

        // Directed graph transposition algorithm.
        // Creates a new DirectedGraph container object that's identical
        // to a caller-specified digraph except that the direction of the
        // the edges are reverese in the result digraph. Note that if present,
        // vertex and edge properties in the source digraph are copied by
        // reference to the result digraph.
        transpose: require('./src/digraph-algorithm-transpose'),

        // Directed graph breadth-first traversal visitor algorithm.
        breadthFirstTraverse: require('./src/digraph-algorithm-bft'),

        // Directed graph depth-first traversal visitor algorithm.
        depthFirstTraverse: require('./src/digraph-algorithm-dft'),

        // ADVANCED

        // Color constant hashtable (advanced).
        colors: require('./src/digraph-algorithm-common-colors'),

        // Directed graph traversal context factory (advanced).
        createTraversalContext: require('./src/digraph-algorithm-common-context')

    }
};


