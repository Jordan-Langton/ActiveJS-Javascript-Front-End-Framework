/* eslint-disable dot-notation */
/* eslint-disable no-useless-concat */
/* eslint-disable camelcase */
import { Router } from "./router";
import { ERROR } from "./logging";
import { Quantum } from "./Quantum";
import { Store } from "./store";
import { Breadcrumbs } from "./breadcrumbs";

/* eslint-disable no-console */
export const Initialize = {

  Config: {
		"name": "",
		"version": "",
		"environment": "",
		"description": "",
		"baseView": "",
		"appWrapper": "",
		"systemTheme": "",
		"systemStyles": [],
		"interfaces": [],
		"routes": []
	},

  Start: (config, Created=false) => {

    //* validate the config 
    const isValid = Initialize.validateConfig(config);

    //* if you have a valid config
    if (isValid) {
			
			Quantum.Config = isValid;
			Quantum.State = new Store(isValid.store).Model;

			//* setup the global VM
			window.$qm = {
				Config: isValid,
				DOMBindings: [],
				DOMBoundKeys: [],
				CRUMBS: [],
				lastCrumb: Breadcrumbs.NEW_CRUMB(isValid.baseView),
				...Quantum
			};
			// debugger;
			//* load the enviroment variables
			Initialize.Set_Environment();

			//* initialize the router
			Router.Build();

			//* add system styles
			Initialize.loadSystemStyles();
      
      //* wait for the custom init proccess to finnish
      if (Created != false) {
				Initialize.buildInit(Created);
			}

    }

  },

  buildInit: (Created) => Created(),

  validateConfig: (config) => {

    //* 
    return config;

  },

  Set_Environment: () => {

    switch (Quantum.Config.environment) {
      case "Development":
        Initialize.loadDevSettings();
        break;
      case "Production":
        Initialize.loadProdSettings();
        break;
    
      default:
        ERROR.NEW('Invalid Environment', 'An invalid environment type passed. Please make sure you pass on of the following: ( Development, Production )', 'init', false, true, false);
        break;
    }

  },

  //* Loads the development environment settings
	loadDevSettings: () => {

		try {
			
			//* display a popup containing all errors that occured
			window.$qm["show_errors"] = true;			

			//* log the dev elopment data
			// Initialize.showLogData();

		} 
		catch (err) {
			console.error('Failed to load the Development settings');
		}

	},

	//* Loads the Production environment settings
	loadProdSettings: () => {

		try {
			
			//* display a popup containing all errors that occured
			window.$qm["show_errors"] = false;

			//* settings applied
			console.log('Loaded Development settings');

		} 
		catch (err) {
			console.error('Failed to load the Development settings: '+err);
		}

	},

	loadSystemStyles: () => {

		let systemStyle = document.createElement("style");
    systemStyle.innerHTML = `@import url("src/theme/${window.$qm.Config.systemTheme}.css");`;
    window.$qm.Config.systemStyles.forEach((style) => {
      systemStyle.innerHTML += `@import url("src/css/${style}.css");`;
    });

    document.getElementsByTagName("head")[0].append(systemStyle);

	},

  showLogData: () => {

    const styles1 = "font-size:90%;padding: 2px;color:#fff;background-color:lightslategrey;border-radius: 3px 0 0 3px";
		const styles2 = "font-size:90%;padding: 2px;color:#fff;background-color:lightskyblue;border-radius:0 3px 3px 0;";

		const styles3 = "color:#fff;font-size:90%;padding: 2px;color:#fff;background-color:green;border-radius:3px;";
		const styles4 = "color:green;";
		const styles5 = "color:blue;";    

		console.groupCollapsed("%c "+Quantum.Config.name+" ("+Quantum.Config.environment+") %c V"+Quantum.Config.version+" ", styles1, styles2);

			console.info("%c INFO ", styles3);    

			console.log("%cInitial View: "+"%c ["+Quantum.Config.baseView+"]", styles4,styles5);      

			console.groupCollapsed("%cInterfaces Loaded: "+"%c ("+Quantum.Config.interfaces.length+")", styles4,styles5);
			Quantum.Config.interfaces.forEach(int => {
				console.groupCollapsed("%c- "+int.ref, styles5);
				// eslint-disable-next-line dot-notation
				console.dir(int.interface);
				console.groupEnd();
			});
			console.groupEnd();

			console.groupCollapsed("%cRoutes Loaded: "+"%c ("+Quantum.Config.routes.length+")", styles4,styles5);
			Quantum.Config.routes.forEach(route => {
				console.groupCollapsed("%c- "+route.path, styles5);
				console.dir(new route.handler());
				console.groupEnd();
			});
			console.groupEnd();

			console.groupCollapsed("%cProject Description: ", styles4);
				console.info(Quantum.Config.description);
			console.groupEnd();

			console.groupEnd();
		console.groupEnd(); 

  },

};