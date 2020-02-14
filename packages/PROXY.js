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

      if (_prop in _target) {
        return _target[_prop];        
      }
      else {
        if (_prop != 'then') {
          return ERROR.NEW("Failed to Get Property", `Quantum was unable to get the property "${_prop}" because it is not defined in your View Model`, 'proxy', false, true, false);          
        }
      }

    },

    set(_target, _prop, _val, _reciever) { 

      // if (_prop in _target) {
        Reflect.set(_target, _prop, _val);
        PROXY.PROXY_ONCHANGE_METHOD(_prop);

        //* get watchers out of object
        let watchers = Object.entries(_target.watchers);

        if (watchers.length > 0) {
          //* if the property being updated is in the wathers obj call it
          if (_prop in _target.watchers) _target.watchers[_prop].apply(window.$qm["$scope"]);
          PROXY.PROXY_ONCHANGE_METHOD(_prop);
        }

        return true;
      // }
      // else {
      //   ERROR.NEW("Failed to Set Property", `Quantum was unable to set the property "${_prop}" because is is not defined in your View Model`, 'proxy', false, true, false);
      //   return true;
      // }

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
    if (window.$qm["$scope"]._beforeUpdate) {
      window.$qm["$scope"]._beforeUpdate();
    }

    DOM.applyUpdatesToElements(document.body, window.$qm["$scope"], _property);

    //* call the mounted life cycle method
    if (window.$qm["$scope"]._Updated) {
      window.$qm["$scope"]._Updated();
    }
  },

};