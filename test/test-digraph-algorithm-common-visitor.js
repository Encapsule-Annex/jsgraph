// test-digraph-algorothm-common-visitor.js

var DirectedGraph = require('../src/digraph').DirectedGraph;
var createTraverseContext = require('../src/digraph-algorithm-common-context');

var assert = require('chai').assert;
var testAlgorithmVisitorCallback = require('./fixture/test-runner-algorithm-common-visitor');


(function() {
    testAlgorithmVisitorCallback({
        testName: "Simple callback, no error, returns true.",
        validConfig: true,
        request: {
            algorithm: "TEST",
            method: 'foo',
            visitor: {
                foo: function(request) {
                    return true;
                }
            },
            request: "whatever"
        },
        expectedResults: {
            error: null,
            result: true,
            callbackCalled: true
        }
    });
})();

(function() {
    testAlgorithmVisitorCallback({
        testName: "Simple callback, no error, returns false.",
        validConfig: true,
        request: {
            algorithm: "TEST",
            method: 'foo',
            visitor: {
                foo: function(request) {
                    return false;
                }
            },
            request: "whatever"
        },
        expectedResults: {
            error: null,
            result: false,
            callbackCalled: true
        }
    });
})();

(function() {
    testAlgorithmVisitorCallback({
        testName: "Simple callback on undefined visitor method, no error.",
        validConfig: true,
        request: {
            algorithm: "TEST",
            method: 'foo',
            visitor: {
            },
            request: "whatever"
        },
        expectedResults: {
            error: null,
            result: true,
            callbackCalled: false
        }
    });
})();

(function() {
    testAlgorithmVisitorCallback({
        testName: "Attempt to callback a visitor method that is not a function.",
        validConfig: false,
        facade: {
            watcher: 5
        },
        request: {
            algorithm: "TEST",
            method: 'foo',
            request: "whatever"
        },
        expectedResults: {
            error: 'TEST visitor interface method \'watcher\' is type \'[object Number]\' instead of \'[object Function]\' as expected.',
            result: null,
            callbackCalled: false
        }
    });
})();


(function() {
    testAlgorithmVisitorCallback({
        testName: "Attempt to callback a visitor method that does not return a Boolean.",
        validConfig: false,
        request: {
            algorithm: "TEST",
            method: 'foo',
            request: "whatever",
            visitor: {
                foo: function(request) {
                    return 5;
                }
            }
        },
        expectedResults: {
            error: 'TEST visitor interface error in callback function \'watcher\'. Function returned type \'[object Number]\' instead of expected \'[object Boolean]\'.',
            result: null,
            callbackCalled: true
        }
    });
})();



        

