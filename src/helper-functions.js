// Encapsule/jsgraph/src/helper-functions.js
//

var getJsType = function(reference_) {
    return Object.prototype.toString.call(reference_);
};

var verifyVisitorResponse = function(response_) {
    var response = { error: null, result: null };
    var type = getJSType(response_);
    if (type !== '[object Boolean]') {
        response.error = "Invalid return type '" + type + "' from graph algorithm visitor. Expected '[object Boolean]'.";
    } else {
        response.result = response_;
    }
    return response;
};

var setValueIfUndefined = function(reference_, valueOrFunction_) {
    var type = getJSType(reference_);
    if (type === '[object Undefined]') {
        type = getJSType(valueOrFunction_);
        if (type !== '[object Function]') {
            reference_ = valueOrFunction_;
        } else {
            reference_ = valueOrFunction_();
        }
        return true;
    }
    return false;
};

module.exports = {
    getJSType: getJSType,
    verifyVisitorResponse: verifyVisitorResponse,
    setValueIfUndefined: setValueIfUndefined
};
