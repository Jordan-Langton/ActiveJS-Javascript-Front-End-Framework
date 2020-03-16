import test from "./testObj";

export default {

  "model": {
    name: "Markus",
    people: test.cache.people,
    products: test.cache.products
  },
  "getters": {
    getName({$model}) {
      return $model.name;
    },
    getPeople({$model}) {
      return $model.people;
    },
    getProducts({$model}) {
      return $model.products;
    },
  },
  "mutations": {
    setPeople({$model}, payload) {
      $model.people = payload;
    },
    updateName({$model}, payload) {
      $model.name = payload;
    }
  },
  "actions": {},

};