// test-module-resolver.js
//
// A little trick to decouple Mocha tests from the location
// of the modules they're testing.
//

var PATH = require('path');

// packageName_ is the npm package name used to publish ARCspace/arc*
// repositories on github and npmjs.org. Note that these names are used
// here to select a subdirectory in the ./BUILD tree to use as the basis
// for further manual selecton of the target require.

module.exports = function(packageName_) {

    basedir = "../src/";
    return function(submoduleName_) {
	var submodulePath = PATH.join(basedir, submoduleName_);
	console.log("> loading module under test '" + submodulePath + "'...");
	return require(submodulePath);
    };
};

