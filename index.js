/**
 * Created by daniel.irwin on 6/23/16.
 */

function arupex_object_reference_resolver(references, keysToKeys){

    if(typeof arupex_deep_value == 'undefined' && typeof require !== 'undefined'){
        arupex_deep_value = require('deep-value');
    }

    if(typeof arupex_deep_setter == 'undefined' && typeof require !== 'undefined'){
        arupex_deep_setter = require('deep-setter');
    }

    //keysToKeys
    //  if references === {
    //      people  : { dave : {}, dan : {}, gary : {} },
    //      pets    : { poke : {}, ralph : {}, snowball : {} },
    //      office  : { rochester : {}, boston : {}, nyc : {} }
    //  }
    //  and your obj looks like
    //  {
    //    person_id : 'dave'
    //    pet_id    : 'snowball'
    //    office_id : 'boston'
    //  }
    //
    // Then keysToKeys might look like
    // {
    //      person      : { origin: 'person_id', reference : 'people', sub_reference : 'name', forget_origin : false }
    //      pet         : { origin: 'pet_id',    reference : 'pets',   keep_origin : false }
    //      office      : { origin: 'office_id', reference : 'office', keep_origin : false }
    // }
    //
    return function resolver(obj){
        Object.keys(keysToKeys).forEach(function(key) {

            var origin          = keysToKeys[key].origin;
            var reference       = keysToKeys[key].reference;
            var sub_reference   = keysToKeys[key].sub_reference;
            var forget_origin     = keysToKeys[key].forget_origin;

            var pathToReferenceValue = reference + '.' + arupex_deep_value(obj, origin) + (sub_reference ? '.' + sub_reference : '');

            arupex_deep_setter(obj, key, arupex_deep_value(references, pathToReferenceValue));

            if(forget_origin){
                arupex_deep_setter(obj, origin, undefined);
            }

        });
        return obj;
    }
}

if(typeof module !== 'undefined'){
    module.exports = arupex_object_reference_resolver;
}