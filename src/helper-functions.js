// Encapsule/jsgraph/src/helper-functions.js
//

var JSType = function(reference_) {
    return Object.prototype.toString.call(reference_);
};

/*
  request = {
      ref: reference
      types: string or array of strings (e.g. '[object Object]')
  }
  response = {
      error: null (success) or string (error)
      result: null (failure) or JSType of request.ref (success)
  }

*/
var JSTypeInTypeSet = function(request_) {
    var response = { error: null, result: null };
    var errors = [];
    var allowedTypeSet = {};
    var jstype = JSType(request_.types);
    switch (jstype) {
    case '[object String]':
        allowedTypeSet = [ request_.types ];
        break;
    case '[object Array]':
        allowedTypeSet = request_.types;
        break;
    default:
        errors.unshift("Invalid request.types value type '" + jstype + "'. Expected either '[object String]' or '[object Array]'.");
        break;
    }
    jstype = JSType(request_.description);
    if (jstype !== '[object String]') {
        errors.unshift("Invalid request.description value type '" + jstype + "'. Expected '[object String]'.");
    }
    if (!errors.length) {
        jsType = JSType(request_.ref);
        response.result = (allowedTypeSet.indexOf(jsType) !== -1) && jsType || null;
    }
    if (!response.result) {
        response.guidance = request_.description + " value type '" + jstype + "' is invalid. Expected one of [" + allowedTypeSet.join(',') + "].";
    }
    if (errors.length) {
        errors.unshift("JSTypeInTypeSet failed:");
        response.error = errors.join(' ');
    }
    return response;

};

 var setPropertyValueIfUndefined = function(reference_, propertyName_, valueOrFunction_) {
     var type = JSType(reference_[propertyName_]);
    if (type === '[object Undefined]') {
        type = JSType(valueOrFunction_);
        if (type !== '[object Function]') {
            reference_[propertyName_] = valueOrFunction_;
        } else {
            reference_[propertyName_] = valueOrFunction_();
        }
        return true;
    }
    return false;
};

module.exports = {
    JSType: JSType,
    setPropertyValueIfUndefined: setPropertyValueIfUndefined
};
