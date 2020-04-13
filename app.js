import { createApp, Router } from "./packages/ActiveJS.js";
import Store from "./public/app.state";

createApp({
  "name": "TESTING UNIT",
	"version": "2.1.0",
	"environment": "Development",
	"description": "This is a test application",
	"systemTheme": "project-theme",
  "systemStyles": ['messages', 'anamations', 'views', 'fonts'],
  "interfaces": [],
  "store": Store,
  "routes": [
    {path: '/default', handler: './views/defaultView.html', animate: ''},
    {path: '/home', handler: './views/testView.html', animate: ''},
    {path: '/about', handler: './views/testView2.html', animate: ''},
    {path: '/contact', handler: './views/testView3.html', animate: ''},
    {path: '/contact2', handler: './views/testView4.html', animate: ''},
  ]
}, () => {
  // Router.route("/home", {test1: "Hello World", test2: "James"});
  Router.route("/default");
});
