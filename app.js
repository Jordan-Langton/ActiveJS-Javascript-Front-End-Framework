import { Quantum } from "./packages/Quantum";
import Store from "./public/app.state";

const config = {
  "name": "TESTING UNIT",
	"version": "2.0.5",
	"environment": "Development",
	"description": "This is a test application",
	"baseView": "/splash",
	"appWrapper": "#app",
	"systemTheme": "project-theme",
  "systemStyles": ['messages', 'anamations', 'views', 'fonts'],
  "interfaces": [],
  "store": Store,
  "routes": [
    {path: '/home', handler: './views/testView.html', animate: ''},
    {path: '/about', handler: './views/testView2.html', animate: ''},
    {path: '/contact', handler: './views/testView3.html', animate: ''},
    {path: '/contact2', handler: './views/testView4.html', animate: ''},
  ]
};

//* Initial settings and calculation before render
const Created = () => {
  Quantum.Events.route("/home", {test1: "Hello World", test2: "James"});
};

Quantum.Run(config, Created);