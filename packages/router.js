/* eslint-disable dot-notation */
/* eslint-disable camelcase */
import { ERROR } from "./logging.js";
import { Common } from "./Common.js";
import { Breadcrumbs } from "./breadcrumbs.js";

export const router = {

  routes: [],
  lastRoute: false,

  Generate_Router: () => {

    //* add the routes to the router
		//! router.addRoutes(window.$qm.Config.routes);

    //* add all router events
    router.addEvents();

  },

  Search: (route_path, params=null, navBack=false) => {
    
    //* start checking if the path exists a a route
    let matched = window.$qm.Config.routes.filter(route => route.path == route_path)[0];
    
    //* successfully fouch a match
    if (matched) {

      //* scroll to top of page
      window.scrollTo(0,0);

      //* destroy all event listeners
      if (window.$qm["DOMEventListeners"].length > 0) {
        let count = 0;
        window.$qm["DOMEventListeners"].forEach(listener => {
          // debugger;
          listener.el.removeEventListener(listener.type, listener.event, true);
          count++
        });
        
        
        if (count == window.$qm["DOMEventListeners"].length) {
          // console.log(window.$qm["DOMEventListeners"]);
          window.$qm["DOMEventListeners"] = [];
        }
      }

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

        //* looks for any inline route attributes
        router.getInlineRoutes();

      })
      .catch((err) => console.error(err));
      

    }
    else {
      ERROR.NEW("System Router Error", `The route '${route_path}' you are trying to access has not been setup as a valid route`, "router", false, true, false);
    }

    ERROR.RENDER();

  },

  navBack: () => {
    
    const last = Breadcrumbs.GET_LAST();
    // debugger;
    if (last.path != window.$qm.Config.baseView) {
      Breadcrumbs.BACK();
      router.Search(last.path, last.params, true);
    }

  },

  addEvents: () => {

    //? detect the back/forward button
    window.onpopstate = (e) => {       
      // console.log(e);
    };
    
    //? route Event
    document.addEventListener("checkRoutes", (e) => {      
      // console.log(e);
    });

  },

  getInlineRoutes: () => {
    
    //* get all elements with the route attr
    let routeAttr = document.body.querySelectorAll('[route]');

    routeAttr.forEach(element => {

      let attrVal = element.attributes.route.value;

      //* If attrVal is a route
      if ( (element.hasAttribute("event") == false) && (attrVal != "back") ) {
        element.setAttribute("event","route-handler");
        element.style = "cursor:pointer;";
        element.addEventListener("click", function() { router.Search(attrVal); });
      }      

    });

  },
  

};