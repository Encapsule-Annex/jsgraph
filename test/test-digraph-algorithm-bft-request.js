// test-digraph-algorithm-bft-request.js

var DirectedGraph = require('../src/digraph');
var createBFTContext = require('../src/digraph-algorithm-bft-context');

var assert = require('chai').assert;
var testBFTRequestNormalizer = require('./fixture/test-runner-digraph-algorithm-bft-request');

testBFTRequestNormalizer({
    testName: "Bad input: missing request", validConfig: false,
    expectedResults: {
        error: 'Missing request object ~. Found type \'[object Undefined]\'.',
        json: ''
    }
});

testBFTRequestNormalizer({
    testName: "Bad input: empty request", validConfig: false,
    expectedResults: {
        error: 'Missing request object ~. Found type \'[object Undefined]\'.',
        json: ''
    }
});

(function() {
    var digraph = new DirectedGraph({
        elist: [ {e:{u:"VARMIT",v:"RAT"}}, {e:{u:"VARMIT",v:"MOUSE"}},{e:{u:"VARMIT",v:"VOLE"}}]
    });
    
    var nullVisitor = {};
    testBFTRequestNormalizer({
        testName: "Bad input: missing 'visitor'", validConfig: false,
        request: { digraph: digraph },
        expectedResults: {
            error: 'Missing required visitor object reference ~.visitor. Found type \'[object Undefined]\'.',
            json: ''
        }
    });
    
    testBFTRequestNormalizer({
        testName: "Bad input: Bad options object type", validConfig: false,
        request: { digraph: digraph, visitor: nullVisitor, options: "Joe Smith" },
        expectedResults: {
            error: 'Options object ~.options is the wrong type. Found type \'[object String]\'.',
            json: ''
        }
    });

    testBFTRequestNormalizer({
        testName: "Minimum viable input", validConfig: true,
        request: { digraph: digraph, visitor: nullVisitor },
        expectedResults: {
            error: '',
            json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"startVector":["VARMIT"],"signalStart":true,"traverseContext":{"searchStatus":"pending","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}}}}'
        }
    });

    testBFTRequestNormalizer({
        testName: "options.signalStart set explicitly true", validConfig: true,
        request: { digraph: digraph, visitor: nullVisitor, options: { signalStart: true }},
        expectedResults: {
            error: '',
            json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"signalStart":true,"startVector":["VARMIT"],"traverseContext":{"searchStatus":"pending","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}}}}'
        }
    });

    testBFTRequestNormalizer({
        testName: "options.signalStart set explicitly false", validConfig: true,
        request: { digraph: digraph, visitor: nullVisitor, options: { signalStart: false }},
        expectedResults: {
            error: '',
            json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"signalStart":false,"startVector":["VARMIT"],"traverseContext":{"searchStatus":"pending","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}}}}'
        }
    });

    testBFTRequestNormalizer({
        testName: "Bad input: options.startVector overridden with wrong type", validConfig: false,
        request: { digraph: digraph, visitor: nullVisitor, options: { startVector:{ x: "mark's the spot"}}},
        expectedResults: {
            error: 'Options object property ~.options.startVector is the wrong type. Expected either \'[object String]\', \'[object Array]\', or \'[object Undefined]\'. Found type \'[object Object]\'.',
            json: ''
        }
    });

    testBFTRequestNormalizer({
        testName: "options.startVector overridden with string vertex ID", validConfig: true,
        request: { digraph: digraph, visitor: nullVisitor, options: { startVector: "someVertexMayBeInvalid"}},
        expectedResults: {
            error: '',
            json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"startVector":["someVertexMayBeInvalid"],"signalStart":true,"traverseContext":{"searchStatus":"pending","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}}}}'
        }
    });

    testBFTRequestNormalizer({
        testName: "options.startVector overridden with array string vertex ID", validConfig: true,
        request: { digraph: digraph, visitor: nullVisitor, options: { startVector: [ "someVertexMayBeInvalid", "apple", "orange", "RAT" ]}},
        expectedResults: {
            error: '',
            json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"startVector":["someVertexMayBeInvalid","apple","orange","RAT"],"signalStart":true,"traverseContext":{"searchStatus":"pending","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}}}}'
        }
    });

    
    (function() {
        var contextResponse = createBFTContext({ digraph: digraph });
        assert.isNull(contextResponse.error);
        var bftContext = contextResponse.result;
        bftContext.searchStatus = "TEST-VALUE";


        testBFTRequestNormalizer({
            testName: "Bad input: options.traverseContext set explicitly to wrong type", validConfig: false,
            request: { digraph: digraph, visitor: nullVisitor, options: { traverseContext: 'Hey, man!' }} ,
            expectedResults: {
                error: 'Options object property ~.options.traverseContext is the wrong type. Expected either \'[object Object]\' or \'[object Undefined\']. Found type \'[object String]\'.',
                json: ''
            }
        });

        testBFTRequestNormalizer({
            testName: "options.traverseContext overridden explicitly", validConfig: true,
            request: { digraph: digraph, visitor: nullVisitor, options: { traverseContext: bftContext }} ,
            expectedResults: {
                error: '',
                json: '{"digraph":"{\\"vlist\\":[],\\"elist\\":[{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"RAT\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"MOUSE\\"}},{\\"e\\":{\\"u\\":\\"VARMIT\\",\\"v\\":\\"VOLE\\"}}]}","visitor":{},"options":{"traverseContext":{"searchStatus":"TEST-VALUE","colorMap":{"VARMIT":0,"RAT":0,"MOUSE":0,"VOLE":0},"undiscoveredMap":{"VARMIT":true,"RAT":true,"MOUSE":true,"VOLE":true}},"startVector":["VARMIT"],"signalStart":true}}'
            }
        });


    })();
})();


