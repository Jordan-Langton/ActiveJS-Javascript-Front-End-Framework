/* eslint-disable dot-notation */
/* eslint-disable arrow-spacing */
/* eslint-disable no-eval */
/* eslint-disable semi */
/* eslint-disable callback-return */
/* eslint-disable indent */
/* eslint-disable no-cond-assign */
import { viewDirectives, bindDirective, ifDirective } from "./directives";
import { BIND } from "./BIND";
import { Lib } from "./lib";
import { ERROR } from "./logging";

export const DOM = {

  ERRORS: [],
  DOMBinding: [],
  DOMBoundKeys: [],

  //* Returns an HTML Document based on a URL or template string
  //? @params (HANDLER_TEMP, HANDLER_NAME, callback)
  //?           - URL or string HTML
  //?           - The name of your view handler
  //?           - a callback function
  getTemplate(HANDLER_TEMP, callback, isComp=false)
  {

    //? URL passed
    if (HANDLER_TEMP.indexOf("<") == -1) {
      
      Lib.getFileContents({url:HANDLER_TEMP, type: "document"}, (err, html) => {

        if (err) {
          DOM.addNewErr(
            "E", 
            "SYSTEM :: Error while getting HTML Document", 
            "Make sure the folder name in your View Controller matches the folder your view is in <error> -> "+html,
            "getTemplate"
          )
        }
        else {
          if (isComp == false) {
            DOM.replaceDirective(html);
          }
          callback(html);
        }

      });

    }
    //? HTML passed
    else {      
      let parser = new DOMParser();
      let HTML_TEMPLATE = parser.parseFromString(HANDLER_TEMP, "text/html");
      if (isComp == false) {
        DOM.replaceDirective(HTML_TEMPLATE);
      }
      callback(HTML_TEMPLATE);

    }

  },

  //* Replaces all viewDirectives with a predifined attributes
  //? @params (template) - HTML Document
  replaceDirective(template)
  {
    /*
    ? loop through the viewDirectives and replace all
    ? accurances of that directive with the value
    */ 

    let allEle = template.body.getElementsByTagName("*");    
    for (let element = 0; element < allEle.length; element++) {
      let ele = allEle[element];
      
      Object.entries(viewDirectives).forEach(directive => {

        let key = directive[0];
        let value = directive[1];

        if (ele.hasAttribute(key)) {       
          //? get attr value
          let attrVal = ele.attributes[key].value;

          //? set new attribute
          ele.removeAttribute(key)
          ele.setAttribute(value, attrVal);

        }
      });

    }
    
  },

  //* Gets all elements with {{variable}} and adds an attribute with 'variable' as it's value
  //? @params (template) - HTML Document
  getAllInterpolation(template)
  {    
    let foundInterpolation = false;
    
    let allEle = template.body.getElementsByTagName("*");
    
    for (let element = 0; element < allEle.length; element++) {
      let ele = allEle[element];
      let REF = BIND.getRandowString(7);

      //* this gets all the Relfect elements with interpolation
      DOM.getAllReflect(ele, REF);

      //* this gets all the Bind elements with interpolation
      DOM.getAllBind(ele, REF);

      //* this gets all the If elements with interpolation
      DOM.getAllIf(ele, REF);

      //* this gets all the elements with interpolation in the attributes
      DOM.getAllAttributeInterpolation(ele, REF);

      //* this gets all the elements with interpolation inside
      if (ele.children.length == 0) {
        DOM.getAllHtmlInterpolation(ele, REF);
      } 
      
    }

    //* set the "qm" attribute with the property as a value
    window.$qm["DOMBindings"].forEach(eleObj => {

      switch (eleObj.type) {
        case "html":
          eleObj.el.setAttribute(eleObj.ref, "");
          break;
        case "attribute":
          eleObj.el.setAttribute(eleObj.ref, "");
          eleObj.el.attributes[eleObj.attrName].value = "";
          break;
        case "bind":
          eleObj.el.setAttribute(eleObj.ref, "");
          break;
        case "if":
          
          break;
        case "for":
          
          break;
      
        default:
          break;
      }

    });
    

    if (foundInterpolation) return true;
    else return false;

  },

  getAllReflect(ELEMENT, REF) {

    let foundInterpolation = false;

    if (ELEMENT.hasAttribute("vm-wOUrX40")) {        
      let attrVal = ELEMENT.attributes["vm-wOUrX40"].value;
      let newEle = {
        el: ELEMENT, 
        binding: attrVal.replace(/ /g,''),
        ref: "qm-"+REF,
        type: "html"
      };

      //* check if element already has a binding
      let check = window.$qm["DOMBoundKeys"].filter(boundKey => {
        let found = ELEMENT.getAttributeNode(boundKey);
        if (found != null) {
          return boundKey
        }
      });
      
      if (check.length == 0) {
        window.$qm["DOMBindings"].push(newEle);
        window.$qm["DOMBoundKeys"].push("qm-"+REF);
        foundInterpolation = true;
      }

      return foundInterpolation;
      
    }

  },

  getAllBind(ELEMENT, REF) {

    let foundInterpolation = false;
    Object.entries(bindDirective).forEach(binding => {
      
      if (ELEMENT.hasAttribute(binding[1])) {        
        let attrVal = ELEMENT.attributes[binding[1]].value;
        let newEle = {
          el: ELEMENT, 
          bindType: binding,
          binding: attrVal.replace(/ /g,''),
          ref: "qm-"+REF,
          type: "bind"
        };
  
        //* check if element already has a binding
        let check = window.$qm["DOMBoundKeys"].filter(boundKey => {
          let found = ELEMENT.getAttributeNode(boundKey);
          if (found != null) {
            return boundKey
          }
        });
        
        if (check.length == 0) {
          window.$qm["DOMBindings"].push(newEle);
          window.$qm["DOMBoundKeys"].push("qm-"+REF);
          foundInterpolation = true;
        }
  
        return foundInterpolation;
        
      }

    });

  },

  getAllIf(ELEMENT, REF) {

    let foundInterpolation = false;

    Object.entries(ifDirective).forEach(binding => {
      
      if (ELEMENT.hasAttribute(binding[1])) {        
        let attrVal = ELEMENT.attributes[binding[1]].value;
        let newEle = {
          el: ELEMENT, 
          binding: attrVal.replace(/ /g,''),
          ref: "qm-"+REF,
          type: "if"
        };
  
        //* check if element already has a binding
        let check = window.$qm["DOMBoundKeys"].filter(boundKey => {
          let found = ELEMENT.getAttributeNode(boundKey);
          if (found != null) {
            return boundKey
          }
        });
        
        if (check.length == 0) {
          window.$qm["DOMBindings"].push(newEle);
          window.$qm["DOMBoundKeys"].push("qm-"+REF);
          foundInterpolation = true;
        }
  
        return foundInterpolation;
        
      }

    });

  },

  getAllFor() {},

  getAllAttributeInterpolation(ELEMENT, REF) {

    let regex = /{{([^}]+)}}/g;
    let rxp = regex;
    let varMatch;
    let foundInterpolation = false;

    Object.entries(ELEMENT.attributes).forEach(attr => {
      while( varMatch = rxp.exec( attr[1].nodeValue ) ) {
        //? make sure the element is not a container
        if (!ELEMENT.firstElementChild) {
          let newEle = {
            el: ELEMENT, 
            binding: varMatch[1].replace(/ /g,''),
            ref: "qm-"+REF,
            type: "attribute",
            attrName: attr[1].nodeName,
            attrValue: attr[1].nodeValue
          };

          //* check if element already has a binding
          let check = window.$qm["DOMBoundKeys"].filter(boundKey => {
            let found = ELEMENT.getAttributeNode(boundKey);
            if (found != null) {
              return boundKey
            }
          });
          
          if (check.length == 0) {
            window.$qm["DOMBindings"].push(newEle);
            window.$qm["DOMBoundKeys"].push("qm-"+REF);
            foundInterpolation = true;
          }
        }

        return foundInterpolation;
      }

    });

  },

  getAllHtmlInterpolation(ELEMENT, REF) {
    
    let regex = /{{([^}]+)}}/g;
    let rxp = regex;
    let varMatch;
    let innerhtml = ELEMENT.innerHTML;
    let foundInterpolation = false;
// debugger;
    while( varMatch = rxp.exec( innerhtml ) ) {
      //? make sure the element is not a container
      let newEle = {
        el: ELEMENT, 
        binding: varMatch[1].replace(/ /g,''),
        ref: "qm-"+REF,
        type: "html",
        html: ELEMENT.innerHTML
      };

      //* check if element already has a binding
      let check = window.$qm["DOMBoundKeys"].filter(boundKey => {
        let found = ELEMENT.getAttributeNode(boundKey);
        if (found != null) {
          return boundKey
        }
      });
      
      if (check.length == 0) {
        window.$qm["DOMBindings"].push(newEle);
        window.$qm["DOMBoundKeys"].push("qm-"+REF);
        foundInterpolation = true;
      } 
    }

    return foundInterpolation;

  },
  
  //* Gets all interpolation and sets an attribute to bind
  //? @params (template, HANDLER) - HTML Document, View Controller
  setBracketVal(attrVal, element, HANDLER, binding, isAttr=false, attribute=false)
  {

    const rgx = new RegExp(`{{${attrVal}}}`, "g");
    if (attrVal.indexOf(".") > -1) {
      
      let script = eval("(HANDLER."+attrVal+")");
      
      if (script != undefined) {

        //* check if its an input
        if (element.localName == "input") {
          //? set inputs value
          if (isAttr == false) {
            element.defaultValue = script;
            element.value = script;
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = script;
          }          
        }
        else if (element.localName == "img") {
          //? set img value
          element.src = script;            
        }
        else if (element.localName == "textarea") {
          //? set img value
          element.defaultValue = script;            
        }
        else {
          //? set elements innerHTML
          if (isAttr == false) {
            let newHTML = binding.html.replace(rgx, script);
            element.innerHTML = newHTML;
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = script;
          }          
        }
        
      }
      else {
        ERROR.NEW(
          "Interpolation Error",
          `Quantum was unable to inject the property ${attrVal.replace(/ /g,'')}, because it is not defined on your View Model. Please make sure the property is in you Model before using it`,
          "buildView",
          element,
          true
        );
      }

    }
    else {
      if (HANDLER[attrVal] != undefined) {
      
        //* check if its an input
        if (element.localName == "input") {
          //? set inputs value
          if (isAttr == false) {
            element.value = HANDLER[attrVal];
            element.defaultValue = HANDLER[attrVal];
            //! element.placeholder = $model.view[attrVal];
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal];
          }
          
        }
        else {
          //* set elements innerHTML
          if (isAttr == false) {

            let computed = Object.entries(HANDLER.computed);

            //* check for a computed prop
            if (computed.length > 0) {
              // debugger;
              if (HANDLER.computed[attrVal]) {
                element.innerHTML = HANDLER.computed[attrVal].call(HANDLER);
              }
              else {
                let newHTML = binding.html.replace(rgx, HANDLER[attrVal]);
                element.innerHTML = newHTML;
              }

            }
            else {
              let newHTML = binding.html.replace(rgx, HANDLER[attrVal]);
              element.innerHTML = newHTML;
            }
            
          }
          else if (isAttr == true) {
            element.attributes[attribute].value = HANDLER[attrVal];
          }          
        }

      }
      else {
        ERROR.NEW(
          "Interpolation Error",
          `Quantum was unable to inject the property <b>${attrVal.replace(/ /g,'')}</b>, because it is not defined on your View Model. Please make sure the property is in you Model before using it`,
          "buildView",
          element,
          true
        );
      }
    }

  },

  setBindVal(attrVal, element, HANDLER, binding) {

    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];

      switch (attr.localName) {
        case bindDirective["@Bind:class"].toLowerCase():
          element.classList = HANDLER[attrVal];
          break;
        case bindDirective["@Bind:id"].toLowerCase():
          element.id = HANDLER[attrVal];
          break;
        case bindDirective["@Bind:checked"].toLowerCase():
          element.checked = HANDLER[attrVal];
          break;
        case bindDirective["@Bind:disabled"].toLowerCase():
          element.disabled = HANDLER[attrVal];
          break;
        case bindDirective["@Bind:href"].toLowerCase():
          element.href = HANDLER[attrVal];
          break;
      
        default:
          break;
      }

    }    

  },

  //* Finds elements with @For attributes and updates them
  //? @params (DOMBinding, element, HANDLER) - Update obj, Element to update, View Controller
  updateForAttribute(DOMBinding, element, HANDLER) {
    
    let NEW_ELE = document.createElement(DOMBinding.el.localName);
    NEW_ELE.innerHTML = DOMBinding.interpolation;

    //? add all attributes to alement
    Object.entries(DOMBinding.el.attributes).forEach(attr => {
      let key = attr[1].nodeName;
      let value = attr[1].value;

      //? make sure that we don't set an element key on the new built up element
      if (key !== DOMBinding.ref) {
        NEW_ELE.setAttribute(key, value);
      }
      
    });     
    
    if (DOMBinding.index <= 0) {
      document.querySelectorAll("["+DOMBinding.ref+"]").forEach(FOR_BINDING => {
        if (FOR_BINDING.attributes[DOMBinding.ref].value > 0) {
          FOR_BINDING.remove();
        }               
      });
      
      window.$qm["DOMBindings"].filter((binding, index) => {
        if (binding.ref == DOMBinding.ref) {
          window.$qm["DOMBindings"].splice(index, 1);
        }
      });      
      
    }
    else {
      document.querySelectorAll("["+DOMBinding.ref+"]").forEach(FOR_BINDING => {        
        FOR_BINDING.parentElement.replaceChild( NEW_ELE, FOR_BINDING );
        FOR_BINDING.remove();        
        BIND.For(HANDLER, HANDLER[DOMBinding.binding]);
      });
    }    

  },

  getDynamicElements(binding, HANDLER) {

    //* get element using the ele key
    document.querySelectorAll("["+binding.ref+"]").forEach(element => {
      
      //* choose how to update element
      switch (binding.type) {
        case "html":
          DOM.setBracketVal(binding.binding, element, HANDLER, binding);
          break;
        case "attribute":
          DOM.setBracketVal(binding.binding, element, HANDLER, binding, true, binding.attrName);
          break;
        case "bind":
          DOM.setBindVal(binding.binding, element, HANDLER, binding);
          break;
        case "if":
          BIND.If(HANDLER);
          break;
        case "for":
          
          break;
      
        default:
          break;
      }

    });

  },

  //* Gets all element bindings in the template and only applies an update to them when the controller value changes
  //? @params (template, HANDLER, updatedProp) - HTML Document, View Controller, Controller Property
  // eslint-disable-next-line no-unused-vars
  applyUpdatesToElements(template, HANDLER, updatedProp=false, callback=false) {

    //? if the updated element was passed
    if (updatedProp) {
 
      //? get element bindings which update "updatedProp"
      const DYNAMIC_ELE = window.$qm["DOMBindings"].filter(DYNAMIC_ELE => DYNAMIC_ELE.binding == updatedProp);
      
      if (DYNAMIC_ELE.length > 0) {
        DYNAMIC_ELE.forEach(binding => {
          //* get element using the ele key
          DOM.getDynamicElements(binding, HANDLER);
        });
      }
      
    }
    //? set all values
    else {

      //? loop through all bindings on the current View
      window.$qm["DOMBindings"].forEach(eleBinding => {

        //? start looping through the View template
        // eslint-disable-next-line no-unused-vars
        template.querySelectorAll("["+eleBinding.ref+"]").forEach(element => {          
          
          if (eleBinding.type == "html") {
            DOM.setBracketVal(eleBinding.binding, eleBinding.el, HANDLER, eleBinding);
          }
          else if (eleBinding.type == "attribute")  {
            DOM.setBracketVal(eleBinding.binding, eleBinding.el, HANDLER, eleBinding, true, eleBinding.attrName);
          }

        });

      });

    }

    //* Done
    // if(callback != false) callback();
  },

}