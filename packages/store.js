/* eslint-disable dot-notation */
/* eslint-disable semi */
/* eslint-disable class-methods-use-this */
/* eslint-disable indent */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import { ERROR } from "./logging.js";

export class Store {

  constructor(storeObj, handler)
  {

    this.store;
    this.getters;
    this.events;
    this.state;
    this.queueTimer;

    this.setupStore(storeObj);    

  } 

  /*
    Sets up the store 
  */
 
  setupStore(store)
  {       
    
    let _this = this;
    
    //? setup getters and setters
    this.state = store.model;
    this.getters = store.getters;

    //? setup events
    this.Context = {
      // eslint-disable-next-line no-undef
      // $events : {...$Events},
      $model: this.state,
      $mutations: store.mutations,
      $actions: store.actions,
      Get(name, payload) {        
        return _this.get(_this.Context, name, payload);
      },
      Commit(name, payload) {        
        return _this.commit(_this.Context, name, payload);
      },
      Dispatch(name, payload, callback) {
        return _this.dispatch(_this.Context, name, payload, callback);
      },
    }

    //? setup store
    this.Model = {
      handler: null,
      model: _this.state,
      Get(propName, payload) {
        return _this.get(_this.Context, propName, payload);
      },
      Commit(name, payload) {        
        return _this.commit(_this.Context, name, payload);
      },
      Dispatch(name, payload, callback) {
        return _this.dispatch(_this.Context, name, payload, callback);
      },
    }
  }

  /*
   ? Notifies the view once the state has been changed
  */
  notifyView()
  {
    
    if (this.Model.handler != null) {
      clearTimeout(this.queueTimer);
      this.queueTimer = setTimeout(() => {

        const event = new Event("StateChange");
        window.$qm.Events.data["stateChange"] = this.Model.state;
        document.dispatchEvent(event);

        // this.Model.handler.loadData(this.Model.state, false, true);
      }, 100);
    }

  }

  /*
   ? Called when you want to exicute a getter
   @params keyName - "nameOfGetter"
  */
  get(previousState, keyName, payload)
  {

    // get getters from store and run it
    let getter = this.checkIfPropExists(keyName, this.getters, "Getters");
    
    try {
      if (typeof getter === "function") {
        return getter(previousState, payload); 
      }
    } 
    catch (err) {
      ERROR.NEW("State Getter Error", `The state ran into the error: [${err}] while trying to run :: ${keyName}`, 'state', false, true, false);
    }
    
    
  }

  /*
   ? Called when you want to exicute a mutation
   @params (payload) - "Name OF Function", {UserId: 5425} 
  */
  commit(context, name, payload)
  {

    // get mutation from store and run it
    let mutation = this.checkIfPropExists(name, this.Context.$mutations, "Mutations");
    let check;

    try {

      if (typeof mutation === "function") {
        check = mutation(context, payload);
        this.notifyView();
      }
  
      return check;
      
    } 
    catch (err) {
      ERROR.NEW("State Mutation Error", `The state ran into the error: [${err}] while trying to run :: ${name}`, 'state', false, true, false);
    }

  }

  /*
   ? Called when you want to exicute a mutation Async
   @params (payload) - "Name OF Function", {UserId: 5425} 
  */
  dispatch(context, name, payload, callback)
  {

    // get mutation from store and run it
    let self = this;
    let dispatch = this.checkIfPropExists(name, this.Context.$actions, "Actions");
    
    try {
      
      if (typeof dispatch === "function") {
        return dispatch(context, payload, callback);
      } 

    } 
    catch (err) {
      ERROR.NEW("State Action Error", `The state ran into the error: [${err}] while trying to run :: ${name}`, 'state', false, true, false);
    }  

  }

  /*
   ? Checks if a method exists inside the store
  */
  checkIfPropExists(prop, obj, type)
  {

    let x;

    if (obj.hasOwnProperty(prop)) {

      x = obj[prop];

    }
    else {
      ERROR.NEW("Undefined Method in State", `The state failed to find the method :: ${prop}() inside your ${type} object. Please make sure to define your methods before calling them. `, 'state', false, true, false);
      
    }

    return x;

  }

}