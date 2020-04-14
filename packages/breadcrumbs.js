/* eslint-disable no-prototype-builtins */
export const Breadcrumbs = {
  
  SET_LAST: (last) => window.$qm.lastCrumb = last,

  REMOVE_LAST: () => { if (window.$qm.CRUMBS.length > 1) window.$qm.CRUMBS.pop(); },

  ADD_CRUMB: (crumb) => window.$qm.CRUMBS.push(crumb),

  GET_LAST: () => window.$qm.lastCrumb,

  BACK: () => {

    Breadcrumbs.REMOVE_LAST();
    Breadcrumbs.CREATE_LAST();

  },

  NEW_CRUMB: (path="", params=null, animation="", viewName="") => {

    return {
      path, 
      params,
      animation,
      viewName,
    };

  },

  CREATE_LAST: () => {
    
    if (window.$qm.CRUMBS.length > 1) {
      window.$qm.lastCrumb = window.$qm.CRUMBS[window.$qm.CRUMBS.length - 1];
    }
    else if (window.$qm.CRUMBS.length == 1) {
      window.$qm.lastCrumb = window.$qm.CRUMBS[0];
    }

  },

  NEW: (crumb={}) => {

    if (crumb.hasOwnProperty("path") || crumb.hasOwnProperty("params")) {      

      Breadcrumbs.CREATE_LAST();
      window.$qm.CRUMBS.push(crumb);

    }
    else {
      console.log("Breadcrumbs error");
    }   

  },

};