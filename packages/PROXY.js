/* eslint-disable dot-notation */
import { ERROR } from "./logging.js";
import { DOM } from "./DOM.js";
import { Common } from "./Common.js";

export const _PROXY = {

  updateQueueTimer: false,

  //* set the onChangeMethod
  PROXY_ONCHANGE_METHOD: false,

  //* build up the proxy handler
  PROXY_HANDLER : {
    get(_target, _prop, _reciever) {
      
      if (_prop in window.$qm["$scope"] || window.$qm["computedMethodKey"].intialRun) {
        // //* check if computed methods are being setup
        if (window.$qm["computedMethodKey"].intialRun) {
          console.warn("Setting up computed Prop : ["+window.$qm["computedMethodKey"].currentMethodName+"] Dependecy: "+_prop);

          window.$qm["computedMethodKey"].methodKeys.forEach((method, index) => {
            if (method.name == window.$qm["computedMethodKey"].currentMethodName) {
              window.$qm["computedMethodKey"].methodKeys[index].dependencies.push(_prop);
            }
          });

          //* method to run when computed methods are setup
          window.$qm["systemEvents"]["computedPropSetOnVM"] = () => {
            if (window.$qm["computedMethodKey"].cbCalled == false) {
              window.$qm["computedMethodKey"].cbCalled = true;
              window.$qm["systemEvents"]["computedMethodsSetupDone"]();   
            }
          };  

          //* return prop
          return _target[_prop];

        }
        else {
          return _target[_prop];
        } 
         
        
      }
      else {
        if (_prop != 'then' && _prop != 'length' && window.$qm["computedMethodKey"].intialRun == false) {
          return ERROR.NEW("Failed to Get Property", `Quantum was unable to get the property "${_prop}" because it is not defined in your View Model`, 'proxy', false, true, false);          
        }
      }

    },

    set(_target, _prop, _val, _reciever) {
      
      Reflect.set(_target, _prop, _val);
      if (window.$qm["computedMethodKey"].intialRun == false) PROXY.PROXY_ONCHANGE_METHOD(_prop);

      //* call any observers which watch current prop
      let observers = Object.entries(_target.observers);
      if (observers.length > 0) {
        //* if the property being updated is in the wathers obj call it
        if (_prop in _target.observers) _target.observers[_prop].apply(window.$qm["$scope"]);
        if (window.$qm["computedMethodKey"].intialRun == false) PROXY.PROXY_ONCHANGE_METHOD(_prop);
      }

      //* run any computed props which need the current prop's value
      if (window.$qm["computedMethodKey"].methodKeys.length > 0) {
        
        for (let i = 0; i < window.$qm["computedMethodKey"].methodKeys.length; i++) {
          const method = window.$qm["computedMethodKey"].methodKeys[i];

          for (let j = 0; j < method.dependencies.length; j++) {
            const dependency = method.dependencies[j];
            
            if (dependency == _prop) {   
              window.$qm["$scope"][method.name] = window.$qm["$scope"].computed[method.name].apply(window.$qm["$scope"]);
              if (window.$qm["computedMethodKey"].intialRun == false) PROXY.PROXY_ONCHANGE_METHOD(method.name);
            }

          }
          
        }

      }
      
      //* if the initial run is still going, 
      if (window.$qm["computedMethodKey"].intialRun == true && window.$qm["computedMethodKey"].methodsCalled == window.$qm["computedMethodKey"].computedMethodsLength) {
        window.$qm["systemEvents"]["computedPropSetOnVM"]();       
      }

      return true;

    },

    deleteProperty(_target, _prop) {
      Reflect.deleteProperty(_target, _prop);
      PROXY.PROXY_ONCHANGE_METHOD(_prop);
      return true;
    }
  },

  //* returns a proxy object
  NEW_PROXY_OBJ(objToWatch, onChangeMethod) {

    //* set onchange method
    PROXY.PROXY_ONCHANGE_METHOD = onChangeMethod;

    return new Proxy(objToWatch, PROXY.PROXY_HANDLER);

  },

  //* returns a proxy object
  CREATE_DOM_OBSEVER() {

    //* Select the node that will be observed for mutations
    const targetNode = document.getElementById(appConfig.appWrapper.replace("#", ""));    

    //* Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    //* Callback function to execute when mutations are observed
    const callback = function(mutationsList) {
        
      

    };

    //* Create an observer instance linked to the callback function
    const DOM_OBSERVER = new MutationObserver(callback);

    //* Start observing the target node for configured mutations
    DOM_OBSERVER.observe(targetNode, config);

  },

  UPDATED_DOM(_property) {   

    //* call the mounted life cycle method
    if (window.$qm["$scope"]._beforeUpdate && window.$qm["computedMethodKey"].intialRun == false) {
      window.$qm["$scope"]._beforeUpdate();
    }

    DOM.applyUpdatesToElements(document.body, window.$qm["$scope"], _property);
  },

};

export const PROXY = {

  CALLBACK: false,

  helpers: {

    //* returns true if value supplied is an object
    isObject: (object=false) => {

      if (object === false) { return false; }
      if (!(Array.isArray(object)) && (typeof object === 'object') ) {
        return true;
      }

      return false;

    },

    isPropInVM: (key, target) => {

      if (key in target) {
        return true;
      }

      return false;

    },

    isInitialRun: () => {

      if (window.$qm["computedMethodKey"].intialRun) {
        return true;
      }

      return false;

    },

    isInitialRunOver: () => {

      if (window.$qm["computedMethodKey"].intialRun == true && window.$qm["computedMethodKey"].methodsCalled == window.$qm["computedMethodKey"].computedMethodsLength) {
        window.$qm["systemEvents"]["computedPropSetOnVM"]();       
      }

    },

    checkForObservers: (target, key) => {

      let observers = Object.entries(target.observers);
      if (observers.length > 0) {
        //* if the property being updated is in the wathers obj call it
        if (key in target.observers) target.observers[key].apply(window.$qm["$scope"]);
        if (window.$qm["computedMethodKey"].intialRun == false) PROXY.CALLBACK(key);
      }

    },

    checkForComputed: (target, key) => {

      if (window.$qm["computedMethodKey"].methodKeys.length > 0) {
        for (let i = 0; i < window.$qm["computedMethodKey"].methodKeys.length; i++) {
          const method = window.$qm["computedMethodKey"].methodKeys[i];
          
          for (let j = 0; j < method.dependencies.length; j++) {
            const dependency = method.dependencies[j];
            // debugger;
            
            if (dependency == key) {
              window.$qm["$scope"][method.name] = window.$qm["$scope"].computed[method.name].apply(target);
              if (window.$qm["computedMethodKey"].intialRun == false) PROXY.CALLBACK(method.name);
            }

          }
          
        }

      }

    },

    setNestedProxy: (target, key) => {
      target[key]["__isProxy"] = true;
      return PROXY.Observe(target[key], PROXY.handler, (_property) => {
        
        //* call the mounted life cycle method
        if (target._beforeUpdate && window.$qm["computedMethodKey"].intialRun == false) {
          window.$qm["$scope"]._beforeUpdate();
        }

        DOM.applyUpdatesToElements(document.body, window.$qm["$scope"], _property);

      });

    },

    isDataProperty: (target, key) => {

      if ( (key != "computed") || (key != "observers") || (key != "components")) {
        return true;
      }

      return false;

    },

  },

  handler: {

    get: (target, key) => {
      // debugger;
      if (PROXY.helpers.isPropInVM(key, target) || PROXY.helpers.isInitialRun()) {
        //* check if computed methods are being setup
        if (PROXY.helpers.isInitialRun()) {
          console.warn("Setting up computed Prop : ["+window.$qm["computedMethodKey"].currentMethodName+"] Dependecy: "+key);

          //* prepare computed properties
          Common.prepareComputedProperties(target, key);

          //* if the current key is a nested object return new proxy
          if ( (PROXY.helpers.isObject(target[key])) && (PROXY.helpers.isDataProperty(target, key)) && (target[key]["__isProxy"] == undefined) ) {
            return PROXY.helpers.setNestedProxy(target, key);
          }

          //* return prop
          return target[key];

        }
        else {
          //* if the current key is a nested object return new proxy
          if ( (PROXY.helpers.isObject(target[key])) && (PROXY.helpers.isDataProperty(target, key)) ) {
            return PROXY.helpers.setNestedProxy(target, key);
          }

          //* return prop
          return target[key];
        }
      }
      // else {
      //   if (key != 'then' && key != 'length' && window.$qm["computedMethodKey"].intialRun == false) {
      //     return ERROR.NEW("Failed to Get Property", `Quantum was unable to get the property "${key}" because it is not defined in your View Model`, 'proxy', false, true, false);          
      //   }
      // }

    },

    set: (target, key, value) => {
      
      Reflect.set(target, key, value);
      if (window.$qm["computedMethodKey"].intialRun == false) PROXY.CALLBACK(key);

      //* call any observers which watch current prop
      PROXY.helpers.checkForObservers(window.$qm["$scope"], key);

      //* run any computed props which need the current prop's value
      PROXY.helpers.checkForComputed(target, key);
      
      //* if the initial run is still going, 
      PROXY.helpers.isInitialRunOver();

      return true;

    },

    deleteProperty(target, key) {
      Reflect.deleteProperty(target, key);
      PROXY.PROXY_ONCHANGE_METHOD(key);
      return true;
    }

  },

  //* creates the proxy object
  Observe: (object=false, handler=false, callback=false) => {

    if (object != false) {
      
      if (handler != false) {
        
        PROXY.CALLBACK = callback;
        return new Proxy(object, handler);

      }

    }

  },

};