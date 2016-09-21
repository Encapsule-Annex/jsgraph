# Encapsule/jsgraph object reference

[^--- TOP](../README.md)

## DirectedGraph export object

A `DirectedGraph` export object is a JavaScript object with the following format:

```javascript
var digraphExportObject = {
    vlist: [],
    elist: []
};
```

`vlist` array is order agnostic and contains zero or more **vertex write request** object(s).

`elist` array is order agnostic and contains zero or more **edge write request** object(s).

Recall that vertex write request and edge write request objects are used for calling `DirectedGraph.addVertex` and `DirectedGraph.addEdge` respectively.

## DirectedGraph serialization

Oftentimes it is useful to serialize the contents of a `DirectedGraph` container:

```javscript
var digraphExportObject = digraph.toObject(); // export object response
```

... or to go straight to JSON:

```javascript
var digraphExportJSON = digraph.toJSON(); // accepts standard in-params
```

## DirectedGraph deserialization

To construct a `DirectedGraph` container from an export object or JSON string, pass the exported data to `DirectedGraph`'s constructor:

```javascript
var response = jsgraph.directed.create({
    vlist: [
        { u: 'Bellevue', p: 'city' },
        { u: 'Seattle', p: 'city' }
    ],
    elist: [
        { e: { u: 'Bellevue', v: 'Seattle' }, p: 'I-520 Bridge Westbound' },
        { e: { u: 'Seattle', v: 'Bellevue' }, p: 'I-520 Bridge Eastbound' }
    ]
});
if (!response.error) {
    var digraph = response.result;
    // The container is initialzed
}
```
        
In some scenarious you may find it useful to build the contents of your `DirectedGraph` container up from a collection export objects (serialized off in a database, filesystem, or even generated programmatically by some other process).

`DirectedGraph` methods `fromObject` and `fromJSON` parse an export object or JSON string respectively and add deserialize on top of the existing data in the container using the `addVertex` and `addEdge` methods.

**Vertex write request object**

_`DirectedGraph` export object `vlist` array contains:_

```javascript
var vertexWriteRequest = {
    u: vertex ID string
    p: optional serializable data
};
```

**Edge write request object**

_`DirectedGraph` export object `elist` array contains:_

```javascript
var edgeWriteRequest = {
    e: {
        u: vertex ID string
        v: vertex ID string
    },
    p: optional serializable data
};

<hr>

Copyright &copy; 2014-2016 [Christopher D. Russell](https://github.com/ChrisRus)

