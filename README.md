# ![Encapsule Project](https://encapsule.io/images/blue-burst-encapsule.io-icon-72x72.png "Encapsule Project") Encapsule Project: [GitHub](https://gihub.com/Encapsule) / [Twitter](https://twitter.com/Encapsule)
**Exploration of declarative programming with data models and graph theory using JavaScript, Node.js, and HTML5.**

# Encapsule/jsgraph v0.7.1

[![Build Status](https://travis-ci.org/Encapsule/jsgraph.svg?branch=master)](https://travis-ci.org/Encapsule/jsgraph)

**"Begin at the beginning," the King said very gravely. "and go on till you come to the end: then stop." - Lewis Carroll, Alice in Wonderland**

See also: [Mathematical Graph Theory](https://en.wikipedia.org/wiki/Graph_theory)

**NEW DOCS** for the v0.7.1 release: **[ARCcore.graph](https://encapsule.io/docs/ARCcore/graph)**

## About

**This is a data modeling and algorithms library. It does not draw graphs in your browser!**

[Encapsule/jsgraph](https://github.com/Encapsule/jsgraph) (aka ARCcore.graph) is a JavaScript library for storing and processing in-memory directed graph data sets inspired by [Jeremy Siek's](https://twitter.com/jeremysiek) work on the [Boost C++ Graph Library](http://www.boost.org/doc/libs/1_63_0/libs/graph/doc/table_of_contents.html) (BGL). The library is not a complete port of the BGL but does provide a very useful subset its functionality that is useful for building data-driven JavaScript applications.

Briefly, jsgraph library provides:

- [DirectedGraph](https://encapsule.io/docs/ARCcore/graph/digraph) container class:
  - [Vertex](https://encapsule.io/docs/ARCcore/graph/digraph/vertices) and [edge](https://encapsule.io/docs/ARCcore/graph/digraph/edges) add, remove, enumerate, and existence testing. And, vertex and edge-associated property maps.
  - JSON [serialization and deserialization](https://encapsule.io/docs/ARCcore/graph/digraph/serialize) of the container.
- [Algorithms](https://encapsule.io/docs/ARCcore/graph/algorithms):
  - Directed graph [transpose](https://encapsule.io/docs/ARCcore/graph/algorithms/digraph-transpose) algorithm.
  - Non-recursive visitor pattern implementation of [breadth-first visit and search](https://encapsule.io/docs/ARCcore/graph/algorithms/digraph-bft) algorithms with edge classification.
  - Non-recursive visitor pattern implementation of [depth-first visit and search](https://encapsule.io/docs/ARCcore/graph/algorithms/digraph-dft) algorithm with edge classification.


### Packaging

Encapsule/jsgraph is a stand-alone JavaScript library that may be used directly in Node.js applications. Or in the browser via [webpack](https://webpack.github.io/).

The library is also distributed as part of the [Encapsule/ARCcore](https://encapsule.io/docs/ARCcore) package that contains a number of other libraries for modeling and processing complex in-memory data in JavaScript applications that some of you may find interesting and useful.

### Contributing

This library is used in production applications. And, in ridiculous [derived science projects](https://encapsule.io). So, the bar is pretty high for taking changes (particularly breaking changes). And, PR's need to come with [tests](https://travis-ci.org/Encapsule/jsgraph)! Exceptions made on a case-by-case basis for nice people and important projects with wide benefit.


## Release Notes

**v0.7.1 is a maintenance release**
- [Encapsule/jsgraph](https://github.com/Encapsule/jsgraph) sources are now officially part of the [Encapsule/ARCcore](https://github.com/Encapsule/ARCcore) package.
- Travis CI updated for Node.js v6.10.x LTS and v7.9.0 current releases. Older builds dropped.
- Fixed a single test break caused by latest Node.js increasing verbosity of JSON parse error to include character position of failure.
- Documentation has been revised and is now available on the Encapsule Project website: **[ARCcore.graph](https://encapsule.io/docs/ARCcore/graph)**.


**v0.7 is a breaking API change and documentation release**

- Added new method `DirectedGraph.stringify`
- Changed method semantics of `DirectedGraph.toJSON` to return a serializable object instead of a JSON-encoded string.
- Alias method `DirectedGraph.toObject` to call `DirectedGraph.toJSON`. The `toObject` method is now deprecated and will be removed in a future release.
- Updated documentation:
    - Per above breaking changes to the `DirectedGraph` serialization API.
    - Added additional information on set/get of `DirectedGraph` name and description properties.

**v0.6 is a bug fix release that's API-compatible with v0.5**

- DFT algorithm bug fixes impacting order and identity of client visitor callbacks.
- Better error handling on bad developer-supplied visitor interfaces.
- Better error handling for BFT/DFT algorithm empty start vector case.
- You can now set `name` and `description` string properties on a `DirectedGraph`:

**v0.5 is a breaking upgrade for users of v0.4**

- Stylistic changes are required to v0.4 clients to upgrade.
- No more exceptions. jsgraph now returns error/result response objects.
- Breadth-first * algorithms coalesced into `breadthFirstTraverse`.
- Depth-first * algorithms coalesced into `depthFirstTraverse`.
- Algorithms now support early terminate under client control.
- ~400 new tests added for v0.5 release.
- Documentation and example updates.


---

Copyright &copy; 2014-2017 [Christopher D. Russell](https://github.com/ChrisRus)



