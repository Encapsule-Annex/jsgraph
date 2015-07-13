// test-digraph-param-vertex-read.js

var testDigraphParams = require('./fixture/test-runner-digraph-in-params');

testDigraphParams({
    testName: "Undefined request",
    validatorFunction: 'verifyVertexReadRequest',
    validConfig: false,
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found when expecting vertex read request. Expected \'[object String]\'.',
    }
});

testDigraphParams({
    testName: "Bad request type",
    validatorFunction: 'verifyVertexReadRequest',
    validConfig: false,
    request: [ "Hey, man!" ],
    expectedResults: {
        error: 'Invalid value type \'[object Array]\' found when expecting vertex read request. Expected \'[object String]\'.',
    }
});

testDigraphParams({
    testName: "Valid request",
    validatorFunction: 'verifyVertexReadRequest',
    validConfig: true,
    request: "vertexID",
    expectedResults: {
        result: true
    }
});

testDigraphParams({
    testName: "Missing request",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: false,
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found when expecting a vertex write request object.'
    }
});

testDigraphParams({
    testName: "Empty request",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: false,
    request: {},
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for vertex ID string property \'u\' in vertex write request object.'
    }
});

testDigraphParams({
    testName: "Bad 'u' type",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: false,
    request: { u: [ "Hey, man!"] },
    expectedResults: {
        error: 'Invalid value type \'[object Array]\' found looking for vertex ID string property \'u\' in vertex write request object.'
    }
});

testDigraphParams({
    testName: "Valid 'u'",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: true,
    request: { u: "Hey, man!" },
    expectedResults: {
        result: true
    }
});

testDigraphParams({
    testName: "Invalid 'p' type",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: false,
    request: { u: "Hey, man!", p: function() {} },
    expectedResults: {
        error: 'Invalid value type \'[object Function] found while inspecting vertex property \'p\' in vertex write request object. Must be serializable to JSON!'
    }
});

testDigraphParams({
    testName: "Valid full request",
    validatorFunction: 'verifyVertexWriteRequest',
    validConfig: true,
    request: { u: "Hey, man!", p: "whatever" },
    expectedResults: {
        result: true
    }
});


testDigraphParams({
    testName: "Missing request",
    validatorFunction: 'verifyEdgeReadRequest',
    validConfig: false,
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found when expecting edge read request object.'
    }
});

testDigraphParams({
    testName: "Bad 'u'",
    validatorFunction: 'verifyEdgeReadRequest',
    validConfig: false,
    request: {},
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for vertex ID string property \'u\' in edge read request object.'
    }
});

testDigraphParams({
    testName: "Bad 'v'",
    validatorFunction: 'verifyEdgeReadRequest',
    validConfig: false,
    request: { u: 'vertexV' },
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for vertex ID string property \'v\' in edge read request object.'
    }
});

testDigraphParams({
    testName: "Valid 'v'",
    validatorFunction: 'verifyEdgeReadRequest',
    validConfig: true,
    request: { u: 'vertexU', v: 'vertexV' },
    expectedResults: {
        result: true
    }
});

testDigraphParams({
    testName: "Missing request",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: false,
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found when expecting edge write request object.'
    }
});

testDigraphParams({
    testName: "Bad 'e'",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: false,
    request: {},
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for edge descriptor object \'e\' in edge write request object.'
    }
});

testDigraphParams({
    testName: "Bad 'e.u'",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: false,
    request: { e: {} },
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for vertex ID string property \'e.u\' in edge write request object.'
    }
});

testDigraphParams({
    testName: "Bad 'e.v'",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: false,
    request: { e: { u: 'vertexU' } },
    expectedResults: {
        error: 'Invalid value type \'[object Undefined]\' found looking for vertex ID string property \'e.v\' in edge write request object.'
    }
});


testDigraphParams({
    testName: "Valid 'e'",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: true,
    request: { e: { u: 'vertexU', v: 'vertexV' } },
    expectedResults: {
        result: true
    }
});

testDigraphParams({
    testName: "Bad 'p'",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: false,
    request: { e: { u: 'vertexU', v: 'vertexV' }, p: function() {} },
    expectedResults: {
        error: 'Invalid value type \'[object Function]\' found while insecting edge property \'p\' in edge write request object. Must be serializable to JSON!'
    }
});

testDigraphParams({
    testName: "Valid full request",
    validatorFunction: 'verifyEdgeWriteRequest',
    validConfig: true,
    request: { e: { u: 'vertexU', v: 'vertexV' }, p: "whatever" },
    expectedResults: {
        result: true
    }
});



    
