import test from "./testObj";

export default {

  "state": {
    name: "Markus",
    people: test.cache.people,
    products: test.cache.products
  },
  "getters": {
    getName({$state}) {
      return $state.name;
    },
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
    },
    updateName({$state}, payload) {
      $state.name = payload;
    }
  },
  "actions": {},

};