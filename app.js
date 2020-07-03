import { createApp, Router } from "./packages/ActiveJS.js";
import Store from "./public/app.state";

const systemStyles = [
  './src/css/messages.css',
  './src/css/anamations.css',
  './src/css/views.css',
  './src/css/fonts.css',
];
const componentStyles = [];

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
    {path: '/', handler: './views/defaultView.html', animate: ''},
  ]
}, () => {
  Router.route("/", {page: 'defaultView', id: 14726}); 
});
