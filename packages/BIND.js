/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-eval */
/* eslint-disable semi */
/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-cond-assign */
/* eslint-disable no-prototype-builtins */
import { bindDirective, onDirective } from "./directives.js";
import { DOM } from "./DOM.js";
import { ERROR } from "./logging.js";
import { Lib } from "./lib.js";

export const BIND = {

	OPTIONS: {
		reflect: { timer: false, waitTime: 0 },
	},

	//* Checks if any of the elements have a binding of @Reflect
	//? params (TEMPLATE, HANDLER) HTML Document
	Reflect(HANDLER) {
		// let bindKey = binding[0];
		// let bindVal = binding[1];

		document.querySelectorAll("[vm-wOUrX40]").forEach(value => {

			let element = value;
			let inputName = element.localName;
			let attrVal = element.attributes["vm-wOUrX40"].value;

			//? check if of type input
			if ((inputName == "input") || (inputName == "select") || (inputName == "option") || (inputName == "button") || (inputName == "textarea")) {

				element.addEventListener("input", () => {

					//* if the input type is checkbox
					if (element.type == "checkbox") {
						element.value = element.checked;
					}
					
					//* check if a timer has been set and reset it
					if (BIND.OPTIONS.reflect.timer != false) {
						clearTimeout(BIND.OPTIONS.reflect.timer);
					}

					BIND.OPTIONS.reflect.timer = setTimeout(() => {

						if (attrVal.indexOf(".") > 0) {

							BIND.setNestedProp(attrVal, element.value, attrVal, HANDLER);

						}
						else {

							// eslint-disable-next-line no-prototype-builtins
							if (HANDLER.hasOwnProperty(attrVal)) {
								
								BIND.setSingleProperty(element, attrVal, inputName, value, HANDLER);

							}
							else {
								ERROR.NEW(
									'Reflect Directive Error',
									`The property <b>${attrVal}</b> provided to @reflect directive`,
									'reflect',
									element,
									true
								);
							}

						}

					}, BIND.OPTIONS.reflect.waitTime);

				});

			}
			else {
				ERROR.NEW(
					'Reflect Directive Error',
					`You cannot use the @reflect directive on an element type of ${element.localName}. You may use it on the following (input, select, option, button, textarea)`,
					'reflect',
					element,
					true
				);
			}

		});

	},

	//* Checks if any of the elements have a binding of @Bind
	//? params (TEMPLATE, HANDLER) HTML Document
	Bind(HANDLER) {
		
		Object.entries(bindDirective).forEach(binding => {

			let bindKey = binding[0];
			let bindVal = binding[1];

			document.querySelectorAll("[" + bindVal + "]").forEach(value => {
				// debugger;
				let element = value;
				let attrVal = element.attributes[bindVal].value;

				//? checks if the attrVal exists in your data set
				function checkIfAttrValExists(index, val) {
					if (HANDLER[val]) return 1;
					else if (HANDLER[val + "_comp"]) return 2;
					else {
						ERROR.NEW(
							"Bind Directive Error",
							`Unable to bind the ${index} attribute to the property ${val}, because it is not defined on your View Model`,
							'bind',
							true
						);
					}
				}

				let keys = Object.entries(bindDirective);

				//? Check what type of binding
				switch (bindVal) {
					case keys[0][1]:
						if (typeof HANDLER[attrVal] == "string") {
							let check = checkIfAttrValExists(bindKey, attrVal);
							if (check == 1) {
								element.id = HANDLER[attrVal];
							}
						}
						else {
							ERROR.NEW(
								"Bind Directive Error",
								`You cannot bind the attribute ${bindKey} to the property ${attrVal}, because it is not of the type <b>string</b>`,
								'bind',
								element,
								true
							);
						}
						break;
					case keys[1][1]:
						if (typeof HANDLER[attrVal] == "string") {
							let check = checkIfAttrValExists(bindKey, attrVal);
							if (check == 1) {
								element.classList = HANDLER[attrVal];
							}
						}
						else {
							ERROR.NEW(
								"Bind Directive Error",
								`You cannot bind the attribute ${bindKey} to the property ${attrVal}, because it is not of the type <b>string</b>`,
								'bind',
								element,
								true
							);
						}
						break;
					case keys[2][1]:
						if (typeof HANDLER[attrVal] == "boolean") {
							let check = checkIfAttrValExists(bindKey, attrVal);
							if (check == 1) {
								if (
									element.localName == "button" ||
									element.localName == "input" ||
									element.localName == "select"
								) {
									element.disabled = HANDLER[attrVal];
								}
								else {
									ERROR.NEW(
										"Bind Directive Error",
										`You cannot are not able to disable the element ${element.localName}`,
										'bind',
										element,
										true
									);
								}
							}
						}
						else {
							ERROR.NEW(
								"Bind Directive Error",
								`You cannot bind the attribute ${bindKey} to the property ${attrVal}, because it is not of the type <b>boolean</b>`,
								'bind',
								element,
								true
							);
						}

						break;
					case keys[3][1]:
						if (typeof HANDLER[attrVal] == "boolean") {
							let check = checkIfAttrValExists(bindKey, attrVal);
							if (check == 1) {
								element.checked = HANDLER[attrVal];
							}
						}
						else {
							ERROR.NEW(
								"Bind Directive Error",
								`You cannot bind the attribute ${bindKey} to the property ${attrVal}, because it is not of the type <b>boolean</b>`,
								'bind',
								element,
								true
							);
						}

						break;
					case keys[4][1]:
						if (element.localName == "a") {
							let check = checkIfAttrValExists(bindKey, attrVal);
							if (check == 1) {
								element.href = HANDLER[attrVal];
							}
						}
						else {
							ERROR.NEW(
								"Bind Directive Error",
								`You cannot bind the property ${attrVal} to the ${bindKey} attribute on an ${element.localName} tag because it's not an anchor tag`,
								'bind',
								element,
								true
							);
						}
						break;

					default:
						ERROR.NEW(
							"Bind Directive Error",
							`Invalid @bind directive passed. ${bindKey} is an invalid binding and will not work.`,
							'bind',
							element,
							true
						);
						break;
				}

			});

		});

	},

	//* Checks if any of the elements have a binding of @If
	//? params (TEMPLATE, HANDLER) HTML Document
	If(HANDLER) {

		let bindings = document.querySelectorAll("[vm-A2xo7Jy]");
		bindings.forEach(value => {

			//? current element
			let element = value;
			let attrVal = element.attributes['vm-A2xo7Jy'].value;

			//? next element
			let elseEle = null;
			if (element.nextElementSibling != null) {
				if (element.nextElementSibling.hasAttribute("vm-Ajf67Jy")) {
					elseEle = element.nextElementSibling;
				}
			}

			let script;
			let newVal;

			//? Checks for JS expressions
			if (attrVal.indexOf("[") >= 0) {

				//? replaces 'this' with $scope.view
				newVal = attrVal
					.replace("[", "")
					.replace("]", "")
					.replace(/this/g, "$qm['scope']");
				newVal = BIND.escapeString(newVal);

				//? sets the key word 'this' to point to the element
				if (newVal.indexOf("?") >= 0) {
					let found = [];
					let rxp = /\?([^:]+):/g;
					let curMatch;

					while (curMatch = rxp.exec(newVal)) {

						if (found.indexOf(curMatch[1]) < 0) {
							found.push(curMatch[1]);
						}

					}

					newVal = found[0].replace(/\$scope.view/g, 'element');
					newVal = this.escapeString(newVal);

				}

				//? checks if expression is valid
				try {
					script = eval("(" + newVal + ")");
				}
				catch (err) {
					attrVal
						.replace("[", "")
						.replace("]", "");

					ERROR.NEW(
						"If Directive Error",
						`${attrVal} is not a valid JavaScript Expression or the values passed are of not the right format: ${err}`,
						'if',
						element,
						true
					);
				}

				if (elseEle != null) {
					if (script) {
						$(element).show();
						$(elseEle).hide();
					}
					else {
						$(element).hide();
						$(elseEle).show();
					}
				}
				else {
					if (script) {
						$(element).show();
					}
					else {
						$(element).hide();
					}
				}
			}
			//? Checks for object tree
			else if (attrVal.indexOf(".") >= 0) {
				script = eval("(HANDLER." + attrVal + ")");
				if (elseEle != null) {
					if (script) {
						$(element).show();
						$(elseEle).hide();
					}
					else {
						$(element).hide();
						$(elseEle).show();
					}
				}
				else {
					if (script) {
						$(element).show();
					}
					else {
						$(element).hide();
					}
				}
			}
			//? Checks if value is a boolean
			else if (attrVal == "true" || attrVal == "false") {
				if (elseEle != null) {
					if (eval(attrVal)) {
						$(element).show();
						$(elseEle).hide();
					}
					else {
						$(element).hide();
						$(elseEle).show();
					}
				}
				else {
					if (eval(attrVal)) {
						$(element).show();
					}
					else {
						$(element).hide();
					}
				}
			}
			//? Checks if the value exists in your View Controller
			else {

				if (HANDLER.hasOwnProperty(attrVal)) {

					if (typeof HANDLER[attrVal] == 'boolean') {

						if (elseEle != null) {
							if (HANDLER[attrVal]) {
								$(element).show();
								$(elseEle).hide();
							}
							else {
								$(element).hide();
								$(elseEle).show();
							}
						}
						else {
							if (HANDLER[attrVal]) {
								$(element).show();
							}
							else {
								$(element).hide();
							}
						}

					}
					else {
						ERROR.NEW(
							"If Directive Error",
							`The property ${attrVal} in your View Model is not not of type <b>boolean</b>`,
							'if',
							element,
							true
						);
					}


				}
				else {
					ERROR.NEW(
						"If Directive Error",
						`Property <b>${attrVal}</b> is not defined on your View Model. Please make sure to add the property to you Model before using it.`,
						'if',
						element,
						true
					);
				}
			}

		});

	},

	//* Checks if any of the elements have a binding of @On
	//? params (TEMPLATE, HANDLER) HTML Document
	On(HANDLER) {

		Object.entries(onDirective).forEach(binding => {

			let bindKey = binding[0];
			let bindVal = binding[1];

			//? get all elements with the route attr
			let bindings = document.querySelectorAll("[" + bindVal + "]");
			bindings.forEach(value => {
				let element = value;
				let attrVal = element.attributes[bindVal].value;
				let index = attrVal.indexOf("(");
				let funcName = attrVal.slice(0, index);

				//? Getting content between braces
				let found = [];
				let rxp = /\(([^)]+)\)/g;
				let curMatch;

				while (curMatch = rxp.exec(attrVal)) {
					let values = curMatch[1].split(",");

					values.forEach(val => {

						if (isNaN(Number(val))) {
							found.push(val);
						}
						else {
							found.push(Number(val));
						}

					});

				}

				//? set the style
				if (element.localName != "input") {
					element.style.cursor = "pointer";
				}

				let keys = Object.entries(onDirective);
				/*
				"@On:Click": "vm-u67W2a8",
				"@On:Submit": "vm-dIbLGpz",
				"@On:Enter": "vm-rwAaot4",
				"@On:Change": "vm-8ikHgbc",
				"@On:Input": "vm-fbnsI6S",
				"@On:Scroll": "vm-ldN8dke",
				*/

				switch (bindVal) {
					case keys[0][1]:
						element.addEventListener("click", (e) => {
							let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
							if (check == 1) {
								HANDLER[funcName](...found, e);
								ERROR.RENDER();
								//! DOM.applyUpdatesToElements(document, HANDLER);
								// BIND.If(HANDLER);
							}
						});
						break;
					case keys[1][1]:
						if (element.localName == "form") {
							element.addEventListener("submit", (e) => {
								e.preventDefault();
								let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
								if (check == 1) {
									HANDLER[funcName](...found, e);
									ERROR.RENDER();
									//! DOM.applyUpdatesToElements(document, HANDLER);
									// BIND.If(HANDLER);
								}
							});
						}
						else {
							ERROR.NEW(
								"On Directive Error",
								`Invalid use of @on directive. You may only add the @on:${bindKey} directive to a form element.`,
								'on',
								element,
								true
							);
						}
						break;
					case keys[2][1]:
						element.addEventListener("keypress", (e) => {
							let key = e.which || e.keyCode;
							let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
							if (check == 1) {
								if (key === 13) {
									HANDLER[funcName](...found, e);
									ERROR.RENDER();
									//! DOM.applyUpdatesToElements(document, HANDLER);
									// BIND.If(HANDLER);
								}
							}
						});
						break;
					case keys[3][1]:
						if ((element.localName == "input") || (element.localName == "select")) {
							element.addEventListener("change", (e) => {
								let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
								if (check == 1) {
									HANDLER[funcName](...found, e);
									ERROR.RENDER();
									//! DOM.applyUpdatesToElements(document, HANDLER);
									// BIND.If(HANDLER);
								}
							});
						}
						else {
							ERROR.NEW(
								"On Directive Error",
								`Invalid use of @on directive. You may only add the @on:${bindKey} directive to an input element.`,
								'on',
								element,
								true
							);
						}
						break;
					case keys[4][1]:
						if (element.localName == "input") {
							element.addEventListener("input", (e) => {
								let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
								if (check == 1) {
									HANDLER[funcName](...found, e);
									ERROR.RENDER();
									//! DOM.applyUpdatesToElements(document, HANDLER);
									// BIND.If(HANDLER);
								}
							});
						}
						else {
							ERROR.NEW(
								"On Directive Error",
								`Invalid use of @on directive. You may only add the @on:${bindKey} directive to an input element.`,
								'on',
								element,
								true
							);
						}
						break;
					case keys[5][1]:
						element.addEventListener("mousewheel", (e) => {
							let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
							if (check == 1) {
								HANDLER[funcName](...found, e);
								ERROR.RENDER();
								//! DOM.applyUpdatesToElements(document, HANDLER);
								// BIND.If(HANDLER);
							}
						});
						break;
					case keys[11][1]:
						element.addEventListener("mousewheel", (e) => {
							let check = BIND.checkIfFuncExists(funcName, bindKey, HANDLER);
							if (check == 1) {
								HANDLER[funcName](...found, e);
								ERROR.RENDER();
								//! DOM.applyUpdatesToElements(document, HANDLER);
								// BIND.If(HANDLER);
							}
						});
						break;

					default:
						ERROR.NEW(
							"On Directive Error",
							`${bindKey} is an invalid binding and does not exist. Make sure the viewDirectives have support for the it.`,
							'on',
							element,
							true
						);
						break;
				}

			});

		});

	},

	//* Checks if any elements have a @For attr and will loop that element according to the data
	//? params (HANDLER, TEMPLATE)
	For(HANDLER, innerHTML="") {
		document.querySelectorAll("[vm-gtSXBIq]").forEach(FOR_ELEMENT => {

			//? setup values
			let ELE_NAME = FOR_ELEMENT.localName;
			let ELE_PARENT = FOR_ELEMENT.parentElement;
			let ELE_ATTRIBUTES = FOR_ELEMENT.attributes["vm-gtSXBIq"].value;
			let ELE_LOOP_KEY = (FOR_ELEMENT.attributes["qf-key"]) ? FOR_ELEMENT.attributes["qf-key"].value : false;
			//! let ITORATOR = ELE_ATTRIBUTES.split(" in ")[0];
			let MODEL_ARR = ELE_ATTRIBUTES.split(" in ")[1];

			//? check that the MODEL_ARR exists
			if (HANDLER[MODEL_ARR] == undefined) {
				ERROR.NEW(
					"For Directive Error",
					"The value supplied to itorate over, is undefined. Please make sure to set the variable before using it.",
					"for",
					FOR_ELEMENT,
					true,
					false
				);
			}
			else {

				let rgx;
				let rgx2;
				let script;
				let newHTML_TEMP = "";
				let ELEMENT_KEY = BIND.getRandowString(7);
				let TO_LOOP = HANDLER[MODEL_ARR];
				let DYNAMIC_VALS = BIND.getVarsFromString(/(?<=\[).+?(?=\])/g, FOR_ELEMENT.innerHTML, FOR_ELEMENT.attributes, ELE_LOOP_KEY);

				//* if there is something to loop over
				if (TO_LOOP.length > 0) {

					//* start looping through the MODEL DATA
					TO_LOOP.forEach((HANDLER_VAL, index) => {

						//* loop through the DYNAMIC_VALS
						let str = "";
						DYNAMIC_VALS.forEach(DYNAMIC_VAL => {
							
							//* gets all dynamic values
							rgx = new RegExp("\\[" + DYNAMIC_VAL + "\\]", 'g');

							//* check if you are looking inside an array of objects
							if (DYNAMIC_VAL.indexOf(".") > -1) {
								script = HANDLER[MODEL_ARR][index][DYNAMIC_VAL.split(".")[1]];
							}
							//* looping over a 1 dementional array
							else {
								script = HANDLER[MODEL_ARR][index];
							}
							
							//* gets all keys
							rgx2 = new RegExp("\\[" + ELE_LOOP_KEY + "\\]", 'g');

							if (str == "") {

								//* check inside of innerHTML
								let HTML = FOR_ELEMENT.outerHTML;
								str = HTML.replace(rgx2, index).replace(rgx, script);

							}
							else {
								str = str.replace(rgx2, index).replace(rgx, script);
							}

						});

						newHTML_TEMP = str;						

						//* start building up the element
						let parser = new DOMParser();
						let ELE = parser.parseFromString(newHTML_TEMP, "text/html").body.firstChild;
						let ELE_KEY = "qf-" + ELEMENT_KEY;
						ELE.setAttribute(ELE_KEY, index);

						//* build up the update object
						let boundEle = {
							el: ELE,
							binding: MODEL_ARR,
							ref: ELE_KEY,
							type: "for",
							index: index,
							attribute: ELE_ATTRIBUTES,
							interpolation: (FOR_ELEMENT.innerHTML.length > 0)?FOR_ELEMENT.innerHTML:innerHTML,
						};
						DOM.DOMBinding.push(boundEle);

						//* insert elements
						ELE_PARENT.appendChild(ELE);

						//* remove the original ele
						FOR_ELEMENT.remove();

					});

				}
				else {

					//? build up the update object
					let boundEle = {
						binding: MODEL_ARR,
						ref: ELE_NAME,
						type: "for",
						attribute: ELE_ATTRIBUTES,
						interpolation: FOR_ELEMENT.innerHTML,
					};
					DOM.DOMBinding.push(boundEle);

				}
			}

		});

	},

	getComponentsInUse(HTML_TEMP, HANDLER, callback) {

		//* Check that this view is using components
		if (HANDLER.components.length > 0) {

			HANDLER.components.forEach(COMP_NAME => {
				// debugger;
				let compCounter = 1;
				let currentComp = window.$qm.registeredComponents.filter(component => component.ref == COMP_NAME)[0];

				if (currentComp) {
					
					const COMP_LIST = BIND.checkIfInDOM(HTML_TEMP, currentComp.ref);

					let done = (HTML_TEMP) => {

						//* make sure all the components have been updated
						// debugger;
						if (compCounter == COMP_LIST.length) {
							return callback(HTML_TEMP);
						}
						else {
							compCounter++;
						}

					};

					COMP_LIST.forEach((ELE_CONTEXT, ITERATOR) => {

						HANDLER[currentComp.ref + ITERATOR] = new currentComp.component({
							handler: HANDLER,
							handler_temp: HTML_TEMP,
							comp_name: currentComp.ref,
							comp_key: ELE_CONTEXT.key,
							comp_iterator: ITERATOR,
							cb: done
						});

					});

				}

			});

		}
		else {
			callback(HTML_TEMP);
		}

	},


	//? HELPERS =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

	

	checkIfInDOM(handler_temp, comp_name) {

		//* all uses of the component
		let eleList = [];

		handler_temp.querySelectorAll("*").forEach(ELE => {

			let ELE_KEY = `cp-${BIND.getRandowString(5)}`;

			if (ELE.localName == comp_name.toLowerCase()) {

				//* set a unique key on the ele for refference later
				ELE.setAttribute(ELE_KEY, "");

				//* add the ele data to array
				eleList.push({
					key: ELE_KEY
				});
			}

		});

		//* return the array back to manipulation
		return eleList;

	},


	getRandowString(length) {

		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;

	},

	//* Checks if nested prop exists and the updates val
	//? params (str, value, attrVal, HANDLER) 
	setNestedProp(str, value, attrVal, HANDLER) {

		let schema = HANDLER;  // a moving reference to internal objects within obj
		let pList = str.split('.');
		let len = pList.length;
		for (let i = 0; i < len - 1; i++) {
			let elem = pList[i];
			if (!schema[elem]) schema[elem] = {}
			schema = schema[elem];
		}

		if (isNaN(Number(value))) {
			schema[pList[len - 1]] = value;
		}
		else if (!isNaN(Number(value))) {
			schema[pList[len - 1]] = value;
		}
		else {
			schema[pList[len - 1]] = Number(value);
		}

		//? Update the document with the new Value
		DOM.applyUpdatesToElements(document, HANDLER, attrVal);


		// document.querySelectorAll("[qm]").forEach(element => {
		//   let eleAttrVal = element.attributes["qm"].value;
		//   if (eleAttrVal == attrVal) {                  
		//     if (element.localName == "input") {
		//       element.value = value;

		//       //? NOTE* if your state has a global property 'attrVal' it will update it as well
		//       if (HANDLER.$state.state.hasOwnProperty(attrVal)) {                    
		//         HANDLER.$state.state[attrVal] = inputVal;                
		//       }
		//     }
		//     else {
		//       element.innerHTML = value;
		//     }
		//   }
		// });

	},

	getNestedProp(str, addOn, HANDLER) {

		let schema = HANDLER;  // a moving reference to internal objects within obj
		let pList = str.split('.');
		let len = pList.length;
		for (let i = 0; i < len - 1; i++) {
			let elem = pList[i];
			if (!schema[elem]) schema[elem] = {}
			schema = schema[elem];
		}

		if (schema[pList[len - 1]] != undefined) {
			return schema[pList[len - 1]];
		}
		else {
			return schema[pList[len - 1] + addOn];
		}


	},

	setSingleProperty(element, attrVal, inputName, value, HANDLER) {
		
		//? get the input value
		let inputVal = element.value;

		//? if element is of type input
		if (inputName == "input") {
			if (isNaN(Number(inputVal))) {
				HANDLER[attrVal] = inputVal;

				//? NOTE* if your state has a global property 'attrVal' it will update it as well
				// if (HANDLER.$state.state.hasOwnProperty(attrVal)) {
				// 	HANDLER.$state.state[attrVal] = inputVal;
				// }
			}
			else {
				HANDLER[attrVal] = Number(inputVal);

				//? NOTE* if your state has a global property 'attrVal' it will update it as well
				if (HANDLER.$state.state.hasOwnProperty(attrVal)) {
					HANDLER.$state.state[attrVal] = Number(inputVal);
				}
			}
		}
		//? if element is of type select
		else if (inputName == "select") {
			HANDLER[attrVal] = element.value;
		}
		//? if element is of type textarea
		else if (inputName == "textarea") {
			HANDLER[attrVal] = element.value;
		}
		//! element.value = inputVal;

		//? Update the document with the new Value
		// DOM.applyUpdatesToElements(document, HANDLER, attrVal);


		// document.querySelectorAll("[qm]").forEach(element => {
		//   let eleAttrVal = element.attributes["qm"].value;
		//   if (eleAttrVal == attrVal) {                  
		//     if (element.localName == "input") {
		//       element.value = inputVal;
		//       element.defaultValue = inputVal;
		//     }
		//     else {
		//       element.innerHTML = inputVal;
		//     }

		//   }
		// });

	},

	//? make sure the function in in data set
	checkIfFuncExists(name, key, OBJ) {
		if (OBJ[name]) return 1;
		else if (OBJ[name + "_comp"]) return 2;
		else {
			ERROR.NEW(
				"On Directive Error",
				`Invalid Method passed. ${name}() is not defined on your View Controller. Please make sure the methods you pass are in your View Controller.`,
				'on',
				false,
				true,
				OBJ.fileName
			);
			return false;
		}
	},

	//? call a component method
	callCompMethod(name) {

		let methodName = { success: false, name: "" };
		// Object.entries(component_).forEach(key => {
		//   if (typeof key[1] == "function") {              
		//     if (key[0].split("-").pop() == name) {
		//       methodName.name = key[0];
		//       methodName.success = true;
		//     }                                                    
		//   }           
		// });

		if (methodName.name == "") {
			self.error = true;
			methodName.success = false;
			// Message.log(
			// 	"E",
			// 	"Error in Template " + name + " Binding",
			// 	"Method '" + name + "()' is not defined in your component"
			// );
		}

		return methodName;

	},

	escapeString(stringToEscape) {
		if (stringToEscape == '') {
			return stringToEscape;
		}

		return stringToEscape
			.replace(/\\/g, "\\\\")
			.replace(/'/g, "\\'")
			.replace(/"/g, "\\\"")
			.replace(/\n/g, "\\\n")
			.replace(/\r/g, "\\\r")
			.replace(/x00/g, "\\\x00")
			.replace(/x1a/g, "\\\x1a");
	},

	//? Accepts a regex expression and applies it to a string
	getVarsFromString(expresion, template, ATTRIBUTES, ELE_LOOP_KEY) {

		//? Getting content between curly braces
		let found = [];
		let rxp = expresion;
		let curMatch;
		let attributes = [];

		//* get all attributes other than the base @for ones
		for (let i = 0; i < ATTRIBUTES.length; i++) {
			const attr = ATTRIBUTES[i];	
			if (attr.localName != "vm-gtsxbiq" && attr.localName != "qf-key") attributes.push({value: attr.value, attribute: attr});
		}

		if (attributes.length > 0) {
			attributes.forEach(attr => {
				
				while (curMatch = rxp.exec(attr.value)) {

					if (found.indexOf(curMatch[0]) < 0) {
						if (curMatch[0] != ELE_LOOP_KEY && found.indexOf(curMatch[0]) == -1) {
							found.push(curMatch[0]);
						}
					}
		
				}

			});
		}

		while (curMatch = rxp.exec(template)) {

			if (found.indexOf(curMatch[0]) < 0) {
				if (curMatch[0] != ELE_LOOP_KEY && found.indexOf(curMatch[0]) == -1) {
					found.push(curMatch[0]);
				}
			}

		}
		
		return found;

	},

	getVarsFromString_2(expresion, template) {
		//? Getting content between curly braces
		let found = [];
		let rxp = expresion;
		let curMatch;

		while (curMatch = rxp.exec(template)) {

			if (found.indexOf(curMatch[0]) < 0) {
				found.push(curMatch[0]);
			}

		}

		return found;
	}

}