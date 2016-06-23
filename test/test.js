/**
 * Created by daniel.irwin on 6/23/16.
 */

describe('object-reference-resolver', function () {

    var ObjectResolver = require('../index');

    var assert = require('assert-diff').deepEqual;
    var references = {
        people: {dave: {name: 'dave ecleston'}, dan: {name: 'dan irwin'}, gary: {name: 'gary johnson'}},
        pets: {poke: {age: 11}, ralph: {age: 7}, snowball: {age: 3}},
        office: {rochester: {zip: 14624}, boston: {zip: 02108}, nyc: {zip: 10001}}
    };


    it('readme - simple reference', function () {

        var obj = {
            person_id: 'dave',
            pet_id: 'snowball',
            office_id: 'boston'
        };

        var keysToKeys = {
            person: {origin: 'person_id', reference: 'people'},
            pet: {origin: 'pet_id', reference: 'pets'},
            office: {origin: 'office_id', reference: 'office'}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {
                person_id: 'dave',
                pet_id: 'snowball',
                office_id: "boston",
                person: {name: "dave ecleston"},
                pet: {
                    "age": 3
                },
                office: {
                    zip: 2108
                }
            }
        );

    });

    //object resolver is destructive
    function clone(input) {
        return JSON.parse(JSON.stringify(input));
    }

    it('sub reference', function () {
        var obj = {
            person_id: 'dave',
            pet_id: 'snowball',
            office_id: 'boston'
        };

        var keysToKeys = {
            person: {origin: 'person_id', reference: 'people', sub_reference: 'name'},
            pet: {origin: 'pet_id', reference: 'pets'},
            office: {origin: 'office_id', reference: 'office'}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {
                person_id: 'dave',
                pet_id: 'snowball',
                office_id: "boston",
                person: "dave ecleston",
                pet: {
                    "age": 3
                },
                office: {
                    zip: 2108
                }
            }
        );
    });

    it('forget reference', function () {
        var obj = {
            person_id: 'dave',
            pet_id: 'snowball',
            office_id: 'boston'
        };

        var keysToKeys = {
            person: {origin: 'person_id', reference: 'people', forget_origin: true},
            pet: {origin: 'pet_id', reference: 'pets'},
            office: {origin: 'office_id', reference: 'office', forget_origin: true}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {
                person_id: undefined,
                pet_id: 'snowball',
                office_id: undefined,
                person: {name: "dave ecleston"},
                pet: {
                    "age": 3
                },
                office: {
                    zip: 2108
                }
            }
        );
    });


    it('missing reference', function () {
        var obj = {
            person: {
                id: 'dave'
            },
            pet: {
                id: 'snowball'
            },
            office: {
                id: 'boston'
            }
        };

        var keysToKeys = {
            person: {origin: 'person_id', reference: 'people'},
            pet: {origin: 'pet_id', reference: 'pets'},
            office: {origin: 'office_id', reference: 'office'}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {
                person: {
                    id: 'dave'
                },
                pet: {
                    id: 'snowball'
                },
                office: {
                    id: 'boston'
                },
                person: undefined,
                pet: undefined,
                office: undefined
            }
        );
    });

    it('deep origin reference', function () {
        var obj = {
            person: {
                id: 'dave'
            },
            pet: {
                id: 'snowball'
            },
            office: {
                id: 'boston'
            }
        };

        var keysToKeys = {
            person: {origin: 'person.id', reference: 'people'},
            pet: {origin: 'pet.id', reference: 'pets'},
            office: {origin: 'office.id', reference: 'office'}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {

                person: {
                    name: "dave ecleston"
                },
                pet: {
                    "age": 3
                },
                office: {
                    zip: 2108
                }
            }
        );
    });


    it('deep origin deep end reference', function () {
        var obj = {
            person: {
                id: 'dave'
            },
            pet: {
                id: 'snowball'
            },
            office: {
                id: 'boston'
            }
        };

        var keysToKeys = {
            'person.name': {origin: 'person.id', reference: 'people', sub_reference: 'name'},
            'pet.age': {origin: 'pet.id', reference: 'pets', sub_reference: 'age'},
            'office.zip': {origin: 'office.id', reference: 'office', sub_reference: 'zip'}
        };
        var objectResolver = new ObjectResolver(references, keysToKeys);

        assert(objectResolver(obj), {
                person: {
                    id: 'dave',
                    name: "dave ecleston"
                },
                pet: {
                    id: 'snowball',
                    "age": 3
                },
                office: {
                    id: 'boston',
                    zip: 2108
                }
            }
        );
    });

});