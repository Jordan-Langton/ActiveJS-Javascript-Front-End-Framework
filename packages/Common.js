/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { Lib } from "./lib.js";
import * as ActiveJS from "./ActiveJS.js";
import { PROXY } from "./PROXY.js";
import { DOM } from "./DOM.js";
import { Initialize } from "./initialize.js";
import { ERROR } from "./logging.js";
import { BIND } from "./BIND.js";
import { ANIMATE } from "./animations.js";

export const Common = {

  VM_LOADED: false,

  LoadVM: (VM_URL, VM_ANIMATION = false, VM_NAVBACK = false, PARAMS = null, BACKPAGE = false) => {

    return new Promise((resolve, reject) => {

      Lib.getFileContents({ url: VM_URL, type: "document" }, (err, html) => {

        if (err) {
          reject(err);
        }
        else {

          //* get JS
          let JS = html.getElementsByTagName("script")[0].innerHTML;

          //* build up a script
          let newScript = document.createElement("script");
          newScript.type = 'module';
          newScript.id = "CURRENT_VM";
          newScript.setAttribute("unsafe-inline", "");
          newScript.setAttribute("hash", "sha256-faJpxnryp8x+/OHMCq6k7GBPfbZistQQYxd02gTcqRw=");

          //* add JS to the script
          let inlineScript = document.createTextNode(JS);

          //* setup the key for this view
          window.$qm["view_key"] = BIND.getRandowString(5);

          //* setup the VM_ANIMATION for this view
          window.$qm["view_animation"] = VM_ANIMATION;

          //* setup the VM_NAVBACK for this view
          window.$qm["view_navBack"] = VM_NAVBACK;

          //* setup the view_backPage for this view
          window.$qm["view_backPage"] = BACKPAGE;

          //* reset bindings
          window.$qm.DOMBindings = [];
          window.$qm.DOMBoundKeys = [];
          //* add template to DOM
          Common.prepareTEMPLATE(html)
            .then((DOCUMENT) => {

              //* add the params to the QM object
              window.$qm["params"] = PARAMS;

              window.$qm["READY_DOCUMENT"] = DOCUMENT;


              //* check if there was a script there already
              let el = document.getElementById("CURRENT_VM");
              if (el != null) {
                el.remove();
                newScript.appendChild(inlineScript);
                document.body.appendChild(newScript);
              }
              else {
                newScript.appendChild(inlineScript);
                document.body.appendChild(newScript);
              }

              //* setup the view_backPage for this view
              window.$qm["VM_LOADED"] = resolve;
            })
            .catch((err) => reject(err));

        }

      });

    });

  },

  buildVM: (VM_NAME, VM) => {

    return new Promise((resolve, reject) => {

      //* set on global VM
      const $VM = {
        el: VM.el,
        fileName: VM_NAME,
        $props: {},
        // _Init: VM._Init,
        _Mounted: VM._Mounted,
        _Rendered: VM._Rendered,
        _beforeUpdate: VM._beforeUpdate,
        _Updated: VM._Updated,
        ...VM.Data(),
        ...VM.methods,
        components: (VM.components) ? VM.components : [],
        computed: { ...VM.computed },
        watchers: { ...VM.watchers },
      };

      //* setup config in the ActiveJS export
      ActiveJS.Config.name = window.$qm.Config.name;
      ActiveJS.Config.version = window.$qm.Config.version;
      ActiveJS.Config.environment = window.$qm.Config.environment;
      ActiveJS.Config.description = window.$qm.Config.description;
      ActiveJS.Config.baseView = window.$qm.Config.baseView;
      ActiveJS.Config.appWrapper = window.$qm.Config.appWrapper;
      ActiveJS.Config.systemTheme = window.$qm.Config.systemTheme;
      ActiveJS.Config.systemStyles = window.$qm.Config.systemStyles;
      ActiveJS.Config.interfaces = window.$qm.Config.interfaces;
      ActiveJS.Config.store = window.$qm.Config.store;
      ActiveJS.Config.routes = window.$qm.Config.routes;

      //* setup state in the ActiveJS export
      ActiveJS.State.state = window.$qm.State.state.state;
      ActiveJS.State.Commit = window.$qm.State.state.Commit;
      ActiveJS.State.Dispatch = window.$qm.State.state.Dispatch;
      ActiveJS.State.Get = window.$qm.State.state.Get;

      //* get all registered components
      window.$qm.registeredComponents.forEach(comp => ActiveJS.registeredComponent.push(comp));

      //* build up the props
      Common.buildProps(VM, $VM).then(($props) => {

        //*setup event to check for when the computed methods have been setup
        document.addEventListener("computedMethodsSetupDone", () => {

          //* tell the PROXY that we are done setting up computed props
          console.warn("intialRun is OVER");
          window.$qm["computedMethodKey"].intialRun = false;

          //* call the mounted life cycle method
          if (window.$qm["$scope"]._Mounted) {
            window.$qm["$scope"]._Mounted($props);
          }

          //* check for binding Reflect
          if (window.$qm["$scope"].components.length > 0) {
            BIND.getComponentsInUse(window.$qm["READY_DOCUMENT"], window.$qm["$scope"], (res) => window.$qm["VM_LOADED"]());
          }
          else {
            //* callback to router
            window.$qm["VM_LOADED"]();
          }


          //* call init life cycle method
          // if (window.$qm["$scope"]._Init) {
          //   window.$qm["$scope"]._Init();
          // }

          DOM.applyUpdatesToElements(window.$qm["READY_DOCUMENT"], window.$qm["$scope"]);


          let wrapper = false;
          let VIEW_WRAPPER = false;
          if (window.$qm["$scope"].hasOwnProperty("el")) {

            wrapper = document.getElementById(window.$qm["$scope"].el.replace("#", ""));
            VIEW_WRAPPER = window.$qm["READY_DOCUMENT"].getElementById("VIEW_PLACEHOLDER");
            VIEW_WRAPPER.id = window.$qm["$scope"].fileName;

          }
          else {
            ERROR.NEW("System Failed During Render", `Property 'el' was not supplied for the view [${window.$qm["$scope"].fileName}]. Please make sure to always pass this property to your View Models`, "render", false, true, false);
          }

          //* start render proccess
          if (wrapper != null) {

            //* animation passed
            if (window.$qm["view_animation"] != false && (window.$qm["view_backPage"].viewName != window.$qm["$scope"].fileName)) {

              switch (window.$qm["view_animation"]) {
                case "slideOver":
                  VIEW_WRAPPER.classList = "view-1";
                  break;
                case "pushIn":
                  VIEW_WRAPPER.classList = "view-2";
                  break;

                default:
                  ERROR.NEW("System Failed During Render", "Invalid view animation type passed with route. Please pass a valid animation with your routes you create", "render", false, true, false);
                  break;
              }

              //* add view to the DOM
              wrapper.appendChild(window.$qm["READY_DOCUMENT"].body.firstChild);

              //* start check for animations
              Common.prepareRenderAnimations(window.$qm["view_animation"], window.$qm["view_navBack"], window.$qm["view_backPage"])
                .then(() => {
                  resolve(window.$qm["$scope"]);
                })
                .catch(() => {

                });

            }
            //* no animation
            else {

              wrapper.innerHTML = window.$qm["READY_DOCUMENT"].body.innerHTML;
              resolve(window.$qm["$scope"]);

              //* call Rendered life cycle method
              if (window.$qm["$scope"]._Rendered) {
                window.$qm["$scope"]._Rendered();
              }


            }

          }
          else {
            ERROR.NEW("System Failed During Render", "App wrapper supplied in your config options does not exist in the DOM. Please make sure it exists and retry.", "render", false, true, false);
          }

        });

        //* setup proxy on the global VM
        window.$qm["$scope"] = PROXY.NEW_PROXY_OBJ($VM, PROXY.UPDATED_DOM);
        window["$scope"] = window.$qm["$scope"];

        //* setup for if you have computed props
        const computed = Object.entries($VM.computed);
        window.$qm["computedMethodKey"] = {
          intialRun: true,
          setupDone: false,
          cbCalled: false,
          methodKeys: [],
          methodsCalled: 0,
          currentMethodName: false,
          computedMethodsLength: computed.length,
        };

        //* if you have computed props        
        if (computed.length != 0) {          

          //* tell the PROXY that we are running computed props
          computed.forEach((comp, index) => {
            window.$qm["computedMethodKey"].currentMethodName = comp[0];
            
            //* push to setupArr
            window.$qm["computedMethodKey"].methodKeys.push({
              name: comp[0],
              dependencies: []
            });
            
            //* check if the loop is done
            // if (count == computed.length) {
              //   window.$qm["computedMethodKey"].setupDone = true;
              // }
              
              //* define a computed property for reference later on
              window.$qm["computedMethodKey"].methodsCalled++;
              window.$qm["$scope"][comp[0]] = new Promise((resolve, reject) => {
                let responce = $VM.computed[comp[0]].apply(window.$qm["$scope"]);
                if (responce == undefined) {
                  resolve(responce);
                  ERROR.NEW("Computed Property Error", `Your computed property resolved to 'undefined'. This may be because you are using asynchronous code within the method. Note you cannot use asynchronous code inside of a computed property`);
                }
                else {
                  resolve(responce);
                }
              });
          });
        }
        else {
          const event = new Event("computedMethodsSetupDone");
          document.dispatchEvent(event);
        }

      })
        .catch((err) => console.error(err));

    });

  },

  wrapExistingMethods: () => {

    // return new Promise((resolve, reject) => {

    const _push = Array.prototype.push;

    Array.prototype.push = (item) => {
      console.log(this);

      _push.apply(window.$qm["$scope"]);
      debugger;
    };

    // });

  },

  buildProps: (VM, newVM) => {

    return new Promise((resolve, reject) => {

      //* setup props
      if (VM.props != undefined && VM.props.length > 0) {
        VM.props.forEach(prop => {
          if (window.$qm["params"] != null) {

            //* params
            let params = Object.entries(window.$qm["params"]);

            //* if you have passed the right params
            if (params.length == VM.props.length) {

              params.forEach(param => {

                if (param[0] == prop) {
                  if (param[1]) {
                    newVM.$props[prop] = param[1];
                  }
                  else {
                    newVM.$props[prop] = "Prop not passed";
                  }
                }

              });

            }
            else {
              ERROR.NEW("Params Miss Match", `${newVM.fileName} Controller expects ${VM.props.length} prop(s). Please make to pass all props to this view: (${VM.props})`);
            }

          }
          else {
            ERROR.NEW("Params Miss Match", `${newVM.fileName} Controller expects ${VM.props.length} prop(s). Please make to pass all props to this view: (${VM.props})`);
          }
        });
      }

      resolve(newVM.$props);

    });

  },

  prepareTEMPLATE: (VIEW) => {

    return new Promise((resolve, reject) => {

      //* get temp and styles
      const VIEW_TEMP = VIEW.getElementsByTagName("template")[0].innerHTML;
      const VIEW_STYLE = VIEW.getElementsByTagName("style")[0];

      let ViewDiv = `<div id="VIEW_PLACEHOLDER" class="view">${VIEW_TEMP}</div>`;


      //* create document
      let parser = new DOMParser();
      let DOCUMENT = parser.parseFromString(ViewDiv, 'text/html');

      if (VIEW_STYLE.attributes["scoped"]) {

        Common.stripSTYLES(VIEW_STYLE.innerHTML, DOCUMENT).then((_STYLE) => {

          //*Add the styles
          let style = document.createElement("style");
          let VIEW_DIV = DOCUMENT.getElementById("VIEW_PLACEHOLDER");
          style.innerHTML = _STYLE;
          VIEW_DIV.prepend(style);

          //* replace all interpolation
          DOM.replaceDirective(DOCUMENT);

          //* get all the interpolation
          DOM.getAllInterpolation(DOCUMENT);


          resolve(DOCUMENT);

        })
          .catch((err) => console.log(err));

      }
      else {
        //*Add the styles
        let style = document.createElement("style");
        let VIEW_DIV = DOCUMENT.getElementById("VIEW_PLACEHOLDER");
        style.innerHTML = VIEW_STYLE.innerHTML;
        VIEW_DIV.prepend(style);

        //* replace all interpolation
        DOM.replaceDirective(DOCUMENT);

        //* get all the interpolation
        DOM.getAllInterpolation(DOCUMENT);


        resolve(DOCUMENT);
      }

    });

  },

  stripSTYLES: (STYLES, VIEW_TEMP) => {

    return new Promise((resolve, reject) => {

      const allStyles = [];
      const attributes = {};
      const foundId = STYLES.replace(/{([^}]*)}/gm, "{}").match(/[#a-zA-Z][a-zA-Z0-9\-\_]+/gmi);
      const foundClass = STYLES.replace(/{([^}]*)}/gm, "{}").match(/[.a-zA-Z][a-zA-Z0-9\-\_]+/gmi);

      //* get valid ids
      if (foundId) {
        foundId.forEach(style => {
          if (((style.indexOf("#") != -1) || (style.indexOf(".") != -1)) && (!allStyles.includes(style))) {
            allStyles.push(style.trim());
          }
        });
      }

      //* get valid classes
      if (foundClass) {
        foundClass.forEach(style => {
          if ((style.indexOf("#") != -1) || (style.indexOf(".") != -1) && (!allStyles.includes(style))) {
            allStyles.push(style.trim());
          }
        });
      }

      //* lists of ids and classes
      let id = [];
      let _class = [];

      //* build up the attributes
      allStyles.forEach(style => {
        if (style.indexOf("#") != -1) {
          id.push(style);

        }

        if (style.indexOf(".") != -1) {
          _class.push(style);
        }
      });

      attributes["id"] = id;
      attributes["class"] = _class;

      Common.replaceAttributesInTemp(VIEW_TEMP, STYLES, attributes).then((_styles) => {

        resolve(_styles);

      })
        .catch((err) => console.log(err));

    });

  },

  replaceAttributesInTemp: (VIEW_TEMP, STYLES, ATTRIBUTES) => {

    return new Promise((resolve, reject) => {
      let newStyle = STYLES;
      //* replace ids
      ATTRIBUTES.id.forEach((attr) => {

        let ele = VIEW_TEMP.getElementById(attr.replace("#", ""));

        if (ele != null) {

          //* replace the id with the id and key
          let rgx = new RegExp(attr, 'g');
          ele.attributes["id"].value = attr.replace("#", "") + "-" + window.$qm["view_key"];
          newStyle = newStyle.replace(rgx, attr + "-" + window.$qm["view_key"]);
          // console.log(newStyle);

        }


      });

      //* replace class
      VIEW_TEMP.body.querySelectorAll("*").forEach((ele) => {

        let newClass = false;

        if (ele.attributes["class"]) newClass = ele.attributes["class"].value;

        ATTRIBUTES.class.forEach((attr) => {

          if (ele.attributes["class"]) {

            let rgx = new RegExp(attr, 'g');
            newClass = newClass.replace(attr.replace(".", ""), attr.replace(".", "") + "-" + window.$qm["view_key"]);
            newStyle = newStyle.replace(rgx, attr + "-" + window.$qm["view_key"]);

          }

        });

        if (newClass != false) ele.setAttribute("class", newClass);

      });

      resolve(newStyle);

    });

  },

  prepareRenderAnimations: (ANIMATION, NAVBACK, BACKPAGE) => {

    return new Promise((resolve, reject) => {

      if (ANIMATION != false || NAVBACK) {

        //* get the view element
        let viewELE = document.getElementById(window.$qm["$scope"].fileName);
        let lastELE = (BACKPAGE.viewName != "") ? document.getElementById(BACKPAGE.viewName) : viewELE;

        //* nav forwards or backwards
        if (NAVBACK) {

          //* choose what animation to use
          switch (BACKPAGE.animation) {
            case ANIMATE.SLIDE_OVER_TYPE:
              ANIMATE.SLIDE_OVER_BACK(BACKPAGE.animation, window.$qm["$scope"], BACKPAGE, lastELE)
                .then(() => {
                  //* have to wait for the animation to finnish
                  resolve();
                })
                .catch(() => {

                });
              break;
            case ANIMATE.PUSH_IN_TYPE:
              ANIMATE.PUSH_IN_BACK(BACKPAGE.animation, window.$qm["$scope"], BACKPAGE, lastELE)
                .then(() => {
                  //* have to wait for the animation to finnish
                  resolve();
                })
                .catch(() => {

                });
              break;

            default:
              break;
          }

        }
        else {

          //* choose what animation to use
          if ("/" + window.$qm["$scope"].fileName != window.$qm["Config"].baseView) {
            switch (ANIMATION) {
              case ANIMATE.SLIDE_OVER_TYPE:
                ANIMATE.SLIDE_OVER(ANIMATION, window.$qm["$scope"], BACKPAGE, { lastELE, viewELE })
                  .then(() => {
                    //* have to wait for the animation to finnish
                    resolve();
                  })
                  .catch(() => {

                  });
                break;
              case ANIMATE.PUSH_IN_TYPE:
                ANIMATE.PUSH_IN(ANIMATION, window.$qm["$scope"], BACKPAGE, { lastELE, viewELE })
                  .then(() => {
                    //* have to wait for the animation to finnish
                    resolve();
                  })
                  .catch(() => {

                  });
                break;

              default:
                break;
            }
          }

        }

      }
      else {
        resolve();
      }

    });

  }

};