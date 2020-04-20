import { createApp, Router } from "./packages/ActiveJS.js";
import Store from "./public/app.state";

createApp({
  "name": "ActiveJS Project",
	"version": "1.0.0",
	"environment": "Development",
	"description": "This is a test application",
	"systemTheme": "project-theme",
  "systemStyles": ['messages', 'anamations', 'views', 'fonts'],
  "interfaces": [],
  "store": Store,
  "debugOptions": {
    ROUTER: false,
    BREADCRUMBS: false,
    ERRORS: false,
    VM_LOADED: true,
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
    {path: '/default', handler: './views/defaultView.html', animate: ''},
  ]
}, () => {
  Router.route("/default"); 
});
