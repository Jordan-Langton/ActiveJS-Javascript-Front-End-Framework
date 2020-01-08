/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { ERROR } from "./logging";
import { Common } from "./Common";
import { Breadcrumbs } from "./breadcrumbs";

export const Router = {

  routes: [],
  lastRoute: false,

  Build: () => {

    //* add the routes to the router
		//! Router.addRoutes(window.$qm.Config.routes);

    //* add all router events
    Router.addEvents();

  },

  Search: (route_path, params=null, navBack=false) => {
    
    //* start checking if the path exists a a route
    let matched = window.$qm.Config.routes.filter(route => route.path == route_path)[0];
    
    //* successfully fouch a match
    if (matched) {      

      //* load the VM into the DOM
      Common.LoadVM(
        matched.handler, 
        matched.animate, 
        navBack, 
        params,
        Breadcrumbs.GET_LAST()
      )
      .then(() => {

        //* if you are not routing back add crumb
        if (navBack == false) {

          //* build up breadcrumb
          let CRUMB = Breadcrumbs.NEW_CRUMB();
          CRUMB.path = route_path;
          CRUMB.params = params;
          CRUMB.animation = matched.animate;
          CRUMB.viewName = window.$qm["$scope"].fileName;

          //* add to breadcrumbs
          Breadcrumbs.NEW(CRUMB);

        }

      })
      .catch((err) => console.log(err));
      

    }
    else {
      ERROR.NEW("Invalid Route", "The route you are trying to access has not been setup as a valid route", "router", false, true, false);
    }

    ERROR.RENDER();

  },

  addRoutes: (routes=[]) => Router.routes = routes,

  navBack: () => {
    
    const last = Breadcrumbs.GET_LAST();
    // debugger;
    if (last.path != window.$qm.Config.baseView) {
      Breadcrumbs.BACK();
      Router.Search(last.path, last.params, true);
    }

  },

  addEvents: () => {

    //? detect the back/forward button
    window.onpopstate = (e) => {       
      // this.checkCurrentURL();
    };
    
    //? route Event
    document.addEventListener("checkRoutes", (e) => {      
      // this.checkForRoutes();
    });

  },

  getInlineRoutes: () => {
    
    //* get all elements with the route attr
    let routeAttr = document.body.querySelectorAll('[route]');

    routeAttr.forEach(element => {

      let attrVal = element.attributes.route.value;

      //? If attrVal is a route
      if ( (element.hasAttribute("event") == false) && (attrVal != "back") ) {
        element.setAttribute("event","route-handler");
        element.style = "cursor:pointer;";
        element.addEventListener("click", function() { Router.Search(attrVal); });
      }      

    });

  },
  

};