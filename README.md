# object-reference-resolver
Lets you Resolve objects with other objects


[![npm version](https://badge.fury.io/js/object-reference-resolver.svg)](https://badge.fury.io/js/object-reference-resolver) [![dependencies](https://david-dm.org/arupex/object-reference-resolver.svg)](http://github.com/arupex/object-reference-resolver) ![Build Status](https://api.travis-ci.org/arupex/object-reference-resolver.svg?branch=master) <a href='https://pledgie.com/campaigns/31873'><img alt='Pledge To Arupex!' src='https://pledgie.com/campaigns/31873.png?skin_name=chrome' border='0' ></a>


#Install

    npm install object-reference-resolver --save

#Usage

     var obj = {
            person_id: 'dave',
            pet_id: 'snowball',
            office_id: 'boston'
     };

    var objectResolver = new ObjectResolver({
        people: {dave: {name: 'dave ecleston'}, dan: {name: 'dan irwin'}, gary: {name: 'gary johnson'}},
        pets: {poke: {age: 11}, ralph: {age: 7}, snowball: {age: 3}},
        office: {rochester: {zip: 14624}, boston: {zip: 02108}, nyc: {zip: 10001}}
    },
     {
            person: {origin: 'person_id', reference: 'people'},
            pet: {origin: 'pet_id', reference: 'pets'},
            office: {origin: 'office_id', reference: 'office'}
     });

    objectResolver(obj)


Results

      obj === {
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