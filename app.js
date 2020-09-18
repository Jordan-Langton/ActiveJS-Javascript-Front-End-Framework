import {
  createApp,
  Router
} from "@jordan_langton/activejs";
import Store from "./public/app.state";

//* list of library style sheets
const systemStyles = [
  './src/css/messages.css',
  './src/css/anamations.css',
  './src/css/views.css',
  './src/css/fonts.css',
];

//* custom components css files
const componentStyles = [];

window.loggedIn = false;

//* setup a router life cycle method
Router.beforeEach((to, from, done) => {
  console.log(to);
  if (to.meta.requiresAuth) {
    if (window.loggedIn) done();
    else {
      done({error: true, path: '/login'});
    }
  }
  else {
    done();
  }

});

createApp({
  "name": "ActiveJS Project",
  "version": "1.0.0",
  "environment": "Development",
  "description": "This is a test application",
  "systemTheme": "project-theme",
  "systemStyles": systemStyles,
  "componentStyles": componentStyles,
  "interfaces": [],
  "store": Store,
  "debugOptions": {
    ROUTER: false,
    BREADCRUMBS: false,
    ERRORS: false,
    VM_LOADED: false,
    VIEW_TEMPLATE_LOADED: false,
    VM_LOADED_ONTO_WINDOW: false,
    VM_BUILT: false,
    VM_IS_OBSERVED: false,
    VM_ACCESSED_UNDER_SCOPE: false,
    COMPUTED_PROPS_BUILT: false,
    MOUNTED_LIFECYCLE: false,
    RENDER_LIFECYCLE: false,
    RENDER_BEGIN: false,
    RENDER_COMPLETE: false,
    PASSED_PROPS_GENERATED: false,
    TIME_TO_RENDER: false,
    INLINE_ROUTES_CHECKED: false,
    DOM_MINIPULATION: false,
  },
  "routes": [
    {
      path: '/helloWorld',
      handler: './views/helloWorld.html',
      meta: {
        requiresBrowsing: true
      }
    },
    {
      path: '/login',
      handler: './views/login.html',
      meta: {
        requiresBrowsing: true
      }
    },
    {
      path: '/loggedIn',
      handler: './views/loggedIn.html',
      meta: {
        requiresAuth: true
      }
    },
  ]
}, () => {
  Router.route("/helloWorld");
});