/* eslint-disable dot-notation */
/* eslint-disable no-useless-concat */
/* eslint-disable camelcase */
import {
	router
} from "./router.js";
import {
	ERROR
} from "./logging.js";
import * as ActiveJS from "./ActiveJS.js";
import {
	Store
} from "./store.js";
import {
	Breadcrumbs
} from "./breadcrumbs.js";

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

	//* starts the initialization of ActiveJS
	Start: (config, Created = false) => {

		//* load the enviroment variables
		Initialize.Set_Environment(config);

		//* validate the config 
		const isValid = Initialize.validateConfig(config);

		//* if you have a valid config
		if (isValid) {

			//* setup the config options
			ActiveJS.Config.name = isValid.name;
			ActiveJS.Config.version = isValid.version;
			ActiveJS.Config.environment = isValid.environment;
			ActiveJS.Config.description = isValid.description;
			ActiveJS.Config.baseView = isValid.baseView;
			ActiveJS.Config.appWrapper = isValid.appWrapper;
			ActiveJS.Config.systemTheme = isValid.systemTheme;
			ActiveJS.Config.systemStyles = isValid.systemStyles;
			ActiveJS.Config.interfaces = isValid.interfaces;
			ActiveJS.Config.store = isValid.store;
			ActiveJS.Config.routes = isValid.routes;
			ActiveJS.Config.debugOptions = (isValid.debugOptions)?isValid.debugOptions:{};

			//* setup the state
			ActiveJS.State.model = new Store(isValid.store).Model.model;
			ActiveJS.State.Get = new Store(isValid.store).Model.Get;
			ActiveJS.State.Commit = new Store(isValid.store).Model.Commit;
			ActiveJS.State.Dispatch = new Store(isValid.store).Model.Dispatch;

			//* setup the global VM
			window.$qm = {
				Config: ActiveJS.Config,
				DOMBindings: [],
				DOMBoundKeys: [],
				DOMEventListeners: [],
				CRUMBS: [],
				systemEvents: {
					computedMethodsSetupDone: {},
					computedPropSetOnVM: {},
				},
				lastCrumb: Breadcrumbs.NEW_CRUMB(isValid.baseView),
				registeredComponents: ActiveJS.registeredComponents,
				Component: ActiveJS.Component,
				State: ActiveJS.State,
				emit: ActiveJS.emit,
				accept: ActiveJS.accept,
				navBack: ActiveJS.navBack,
				saveToCache: ActiveJS.saveToCache,
				getFromCache: ActiveJS.getFromCache,
				createApp: ActiveJS.createApp,
				newController: ActiveJS.newController,
				reqisterComponent: ActiveJS.reqisterComponent,
				Router: ActiveJS.Router,
			};

			//* allow global access to the 'ActiveJS' variable
			window.ActiveJS = {
				Config: window.$qm.Config,
				registeredComponents: window.$qm.registeredComponents,
				Component: window.$qm.Component,
				State: window.$qm.State,
				emit: window.$qm.emit,
				accept: window.$qm.accept,
				navBack: window.$qm.navBack,
				saveToCache: window.$qm.saveToCache,
				getFromCache: window.$qm.getFromCache,
				createApp: window.$qm.createApp,
				newController: window.$qm.newController,
				reqisterComponent: window.$qm.reqisterComponent,
				Router: window.$qm.Router,
			};			

			//* initialize the router
			router.Generate_Router();

			//* add system styles
			Initialize.loadSystemStyles();

			//* run the custom init proccess to finnish
			if (Created != false) {
				Initialize.buildInit(Created);
			}

		}

	},

	//* calls the custom init proccess after the DOM has loaded
	buildInit: (Created) => document.addEventListener("DOMContentLoaded", () => {

		Created();

		//* log the dev elopment data
		Initialize.showLogData();
		
	}, false),

	//* this validates the config passed
	validateConfig: (config) => {

		if (!config.name) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [name] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.version) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [version] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.environment) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [environment] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.description) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [description] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.systemTheme) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [systemTheme] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.systemStyles) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [systemStyles] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.interfaces) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [interfaces] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.store) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [store] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.debugOptions) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [debugOptions] for you application", "initialize", false, true, false);
			return;
		}

		if (!config.routes) {
			ERROR.NEW("Missing Config Options", "Please make sure to pass a [routes] for you application", "initialize", false, true, false);
			return;
		}

		//* 
		return config;

	},

	//* Chooses the environment
	Set_Environment: (Config) => {

		switch (Config.environment) {
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

			window.$qm = {
				show_errors: false
			};

			//* display a popup containing all errors that occured
			window.$qm["show_errors"] = true;

		} catch (err) {
			console.error('Failed to load the Development settings : ' + err);
		}

	},

	//* Loads the Production environment settings
	loadProdSettings: () => {

		try {

			//* display a popup containing all errors that occured
			window.$qm["show_errors"] = false;

			//* settings applied
			console.log('Loaded Development settings');

		} catch (err) {
			console.error('Failed to load the Development settings: ' + err);
		}

	},

	//* Loads the system styles and theme
	loadSystemStyles: () => {
		let systemStyle = document.createElement("style");
		systemStyle.innerHTML = `@import url("src/theme/${window.$qm.Config.systemTheme}.css");`;
		window.$qm.Config.systemStyles.forEach((style) => {
			systemStyle.innerHTML += `@import url("src/css/${style}.css");`;
		});

		document.getElementsByTagName("head")[0].append(systemStyle);
	},

	//* displays the log data
	showLogData: () => {

		//* clear the console
		if (console.clear) {
			// console.clear();			
		}

		const styles1 = "font-size:90%;padding: 2px;color:#fff;background-color:lightslategrey;border-radius: 3px 0 0 3px";
		const styles2 = "font-size:90%;padding: 2px;color:#fff;background-color:lightskyblue;border-radius:0 3px 3px 0;";

		const styles3 = "color:#fff;font-size:90%;padding: 2px;color:#fff;background-color:green;border-radius:3px;";
		const styles4 = "color:green;";
		const styles5 = "color:blue;";

		console.groupCollapsed("%c " + ActiveJS.Config.name + " (" + ActiveJS.Config.environment + ") %c V" + ActiveJS.Config.version + " ", styles1, styles2);

		console.info("%c INFO ", styles3);

		console.log("%cActiveJS Version: " + "%c V" + ActiveJS.Config.FrameworkVersion + "", styles4, styles5);

		if (ActiveJS.Config.splashScreen) {
			console.log("%Splash Screen: " + "%c [" + ActiveJS.Config.splashScreen + "]", styles4, styles5);			
		}

		console.groupCollapsed("%cInterfaces Loaded: " + "%c (" + ActiveJS.Config.interfaces.length + ")", styles4, styles5);
		ActiveJS.Config.interfaces.forEach(int => {
			console.groupCollapsed("%c- " + int.ref, styles5);
			// eslint-disable-next-line dot-notation
			console.dir(int.interface);
			console.groupEnd();
		});
		console.groupEnd();

		console.groupCollapsed("%cRoutes Loaded: " + "%c (" + ActiveJS.Config.routes.length + ")", styles4, styles5);
		ActiveJS.Config.routes.forEach(route => {
			console.groupCollapsed("%c- " + route.path, styles5);
			console.log(route.handler);
			console.groupEnd();
		});
		console.groupEnd();

		console.groupCollapsed("%cProject Description: ", styles4);
		console.info(ActiveJS.Config.description);
		console.groupEnd();

		console.groupEnd();
		console.groupEnd();

	},

};