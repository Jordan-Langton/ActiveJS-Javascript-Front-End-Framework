/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { Initialize } from "./initialize";
import { Router } from "./router";
import { Common } from "./Common";
import { ERROR } from "./logging";
import { BIND } from "./BIND";
import { Breadcrumbs } from "./breadcrumbs";

export const Quantum = {

  Config: {},

  State: {
    state: {},
    Get(propName="", payload) {},
    Commit(name="", payload) {},
    Dispatch(name="", payload) {}
  },

  Events: {

    data: {
      stateChangeData: false,
    },

    emit: (eventName="", payload=true) => {},
    accept: (eventName="") => {},
    navBack: () => Router.navBack(),
    route: (path="", params=null) => Router.Search(path, params),
    addCrumb: (crumb={path: "", params: null}) => Breadcrumbs.ADD_CRUMB(crumb),
    removeLastCrumb: () => Breadcrumbs.REMOVE_LAST(),
    saveToCache: (key="", payload={}) => {
      let objToCache = {};
      objToCache[key] = payload;
      
      localStorage.setItem("quantumDB", JSON.stringify(objToCache));

      let quantumCache = JSON.parse(localStorage.getItem("quantumDB"));

      return quantumCache;
    },    
    getFromCache: (key="") => {
      let quantumCache = JSON.parse(localStorage.getItem("quantumDB"));
  
      if (quantumCache[key] != undefined) {      
        return quantumCache[key];
      }
      else {
        ERROR.NEW("Failed to get Cache", `Quantum was unable to retrieve ${key} from your storage. Please make sure it is set before trying to get it.`, 'getCache', false, true, false);
      }
    },
  },


  //* Starts the application
  Run: (configuration={}, Created=() => {}) => Initialize.Start(configuration, Created),

  //* builds new view
  newView: (View_Name, Controller) => Common.buildVM(View_Name, Controller)
    .then((VM) => {

      //? check for binding Reflect
      BIND.Reflect(VM);        

      //? check for binding Bind
      BIND.Bind(VM);

      //? check for binding For
      BIND.For(VM);

      //? check for binding If
      BIND.If(VM);

      //? check for binding on
      BIND.On(VM);

      //* check for inline route attr
      Router.getInlineRoutes();

      //* display any errors that occured
      ERROR.RENDER();
      
    }).catch((err) => console.error(err)),


};