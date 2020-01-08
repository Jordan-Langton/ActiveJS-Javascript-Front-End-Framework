import test from "./testObj";

export default {

  "state": {
    people: test.cache.people,
    products: test.cache.products
  },
  "getters": {
    getPeople({$state}) {
      return $state.people;
    },
    getProducts({$state}) {
      return $state.products;
    },
  },
  "mutations": {
    setPeople({$state}, payload) {
      $state.people = payload;
    }
  },
  "actions": {},

};