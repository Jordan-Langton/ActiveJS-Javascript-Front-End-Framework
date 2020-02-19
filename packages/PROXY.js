/* eslint-disable dot-notation */
import { ERROR } from "./logging.js";
import { DOM } from "./DOM.js";

export const PROXY = {

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
        if (_prop != 'then' && window.$qm["computedMethodKey"].intialRun == false) {
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

          for (let j = 0; j < window.$qm["computedMethodKey"].methodKeys[i].dependencies.length; j++) {
            const dependency = window.$qm["computedMethodKey"].methodKeys[i].dependencies[j];
            
            if (dependency == _prop) {   
              window.$qm["$scope"].computed[method.name].apply(window.$qm["$scope"]);
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