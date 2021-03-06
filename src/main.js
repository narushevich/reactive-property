var ReactiveProperty = require("./r");
var Events = require("../vendor/events/events");

var OLD = {};
var CHANGE = {};

function determineKey(host, accessor) {
    for (var key in host) {
        if (host[key] === accessor)
            return key;
    }
    throw "Couldn't determine name of reactive property";
}

function accessor(defaultValue, validator) {
    var name = undefined;
    function f(a,b,c,d) {
        if (name === undefined)
            name = accessor.prefix + determineKey(this, f);

        var prop = this[name];

        if(prop === undefined)
            prop = this[name] = new ReactiveProperty(this, defaultValue, validator);

        if (arguments.length === 0) {
            return prop.get();
        } else if (a === CHANGE) {
            if (b instanceof Events.Subscription) {
                return prop.off(b);
            } else {
                return prop.on(b, c, d);
            }
        } else if (a === OLD) {
            return prop.old();
        } else {
            return prop.set(a);
        }
    }

    f.OLD = OLD;
    f.CHANGE = CHANGE;

    return f;
}

accessor.prefix = "__";

module.exports = accessor;