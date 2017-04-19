// test-create-digraph.js

var testCreateDirectedGraph = require('./fixture/test-runner-create-digraph');

testCreateDirectedGraph({
    testName: "Bogus construction #1", validConfig: false,
    request: "Bull shit",
    expectedResults: {
        error: 'DirectedGraph constructor failed: Exception occurred while parsing JSON: Unexpected token B in JSON at position 0',
        result: ''
    }
});


testCreateDirectedGraph({
    testName: "Bogus construction #2", validConfig: false,
    request: function () {},
    expectedResults: {
        error: 'DirectedGraph constructor failed: Invalid reference to \'[object Function]\' passed instead of expected JSON (or equivalent object) reference.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #3", validConfig: false,
    request: [],
    expectedResults: {
        error: 'DirectedGraph constructor failed: Invalid reference to \'[object Array]\' passed instead of expected JSON (or equivalent object) reference.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #4", validConfig: false,
    request: "[]",
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected top-level object but found \'[object Array]\'.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #5", validConfig: false,
    request: { vlist: "What's up, man?" },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected \'vlist\' (vertices) to be an array but found \'[object String]\'.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #6", validConfig: false,
    request: { vlist: [], elist: "What's up, man?" },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected \'elist\' (edges) to be an array but found \'[object String]\'.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #7", validConfig: false,
    request: { vlist: [ "no way" ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected vertex descriptor object in \'vlist\' array but found \'[object String]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #8", validConfig: false,
    request: { vlist: [ {} ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected vertex descriptor property \'u\' to be a string but found \'[object Undefined]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #9", validConfig: false,
    request: { elist: [ "no way" ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected edge descriptor object in \'elist\' array but found \'[object String]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #10", validConfig: false,
    request: { elist: [ { x: 'test' } ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Edge record in \'elist\' should define edge descriptor object \'e\' but but found \'[object Undefined]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #11", validConfig: false,
    request: { elist: [ { e: "no way" } ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Edge record in \'elist\' should define edge descriptor object \'e\' but but found \'[object String]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #12", validConfig: false,
    request: { elist: [ { e: {} } ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected edge descriptor property \'e.u\' to be a string but found \'[object Undefined]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Bogus construction #13", validConfig: false,
    request: { elist: [ { e: { u: 'foo' } } ] },
    expectedResults: {
        error: 'DirectedGraph constructor failed: JSON semantics error: Expected edge descriptor property \'e.v\' to be a string but found \'[object Undefined]\' instead.',
        result: ''
    }
});

testCreateDirectedGraph({
    testName: "Default construction", validConfig: true,
    expectedResults: {
        error: '',
        result: '{"name":"","description":"","vlist":[],"elist":[]}'
    }
});

testCreateDirectedGraph({
    testName: "More advanced example", validConfig: true,
    request: {
        vlist: [
            { u: 'all', p: "whatever vertex property" },
            { u: 'work', p: { x: 6 }},
            { u: 'and' },
            { u: 'no' },
            { u: 'play' }
        ],
        elist: [
            { e: { u: 'all', v: 'work' }, p: "whatever edge property" },
            { e: { u: 'work', v: 'and' } },
            { e: { u: 'and', v: 'no' } },
            { e: { u: 'no', v: 'play' }, p: "leads to superior code :)" }
        ]
    },
    expectedResults: {
        error: '',
        result: '{"name":"","description":"","vlist":[{"u":"all","p":"whatever vertex property"},{"u":"work","p":{"x":6}}],"elist":[{"e":{"u":"all","v":"work"},"p":"whatever edge property"},{"e":{"u":"work","v":"and"}},{"e":{"u":"and","v":"no"}},{"e":{"u":"no","v":"play"},"p":"leads to superior code :)"}]}'
    }
});


