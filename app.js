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
  "routes": [
    {path: '/default', handler: './views/defaultView.html', animate: ''},
  ]
}, () => {
  Router.route("/default");
});
