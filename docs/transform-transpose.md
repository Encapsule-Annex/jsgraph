# Encapsule/jsgraph tranform reference

## jsgraph.directed.transpose

Transposing a directed graph is the process of flipping the direction of its edges around. jsgraph's `jsgraph.directed.transpose` transform encapsulates this process returning a newly constructed `DirectedGraph` container from an existing instance.

        var transposedDigraph = jsgraph.transpose(originalDigraph);

**Request**

Reference to a `DirectedGraph` container instance.

**Response**

JavaScript object with the following properties:

- **error**: null or a string explaining what went wrong
- **result**: a `DirectedGraph` container reference or null if error

