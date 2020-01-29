/* eslint-disable camelcase */
import { DOM } from "./DOM.js";
import { BIND } from "./BIND.js";
import { ERROR } from "./logging.js";

/* eslint-disable indent */
/* eslint-disable no-prototype-builtins */
const COMP_TEMP = Symbol('COMP_TEMP');
const PASSED_DATA = Symbol('PASSED_DATA');
const getPassedProps = Symbol('getPassedProps');
const beginRender = Symbol('beginRender');
const setupPassedData = Symbol('setupPassedData');
const passRenderedTemplateBack = Symbol('passRenderedTemplateBack');
const insertTemplateIntoElement = Symbol('insertTemplateIntoElement');

export class baseComponent {

  constructor(PASSED_PROPS)
  {
    
    this.$props = {};
    this[COMP_TEMP] = false;
    this[PASSED_DATA] = {
      handler: {},
      handler_temp: false,
      comp_name: false,
      comp_key: false,
      comp_iterator: false,
      cb: (HTML_TEMP="") => {}
    };

    this[setupPassedData](PASSED_PROPS);

    this[beginRender]();

  }

  render(HTML_TEMP) {

    this[COMP_TEMP] = HTML_TEMP;

    this[insertTemplateIntoElement](HTML_TEMP);

    this[passRenderedTemplateBack]();

  }

  [setupPassedData](PASSED_PROPS) {

    this[PASSED_DATA].handler = PASSED_PROPS.handler;
    this[PASSED_DATA].handler_temp = PASSED_PROPS.handler_temp;
    this[PASSED_DATA].comp_name = PASSED_PROPS.comp_name;
    this[PASSED_DATA].comp_key = PASSED_PROPS.comp_key;
    this[PASSED_DATA].comp_iterator = PASSED_PROPS.comp_iterator;
    this[PASSED_DATA].cb = PASSED_PROPS.cb;

  }

  [passRenderedTemplateBack]() {

    //* callback to caller
    this[PASSED_DATA].cb(this[PASSED_DATA].handler_temp);
    
  }

  [beginRender]() {

    //* get element to update
    let CURRENT_COMP = this[PASSED_DATA].handler_temp.querySelectorAll(`[${this[PASSED_DATA].comp_key}]`)[0];

    //* strip out props passed and set them on this component
    this[getPassedProps](CURRENT_COMP);

    //* call the has mounted method
    this.compMounted();

  }

  [insertTemplateIntoElement](HTML_TEMP) {

    let newTEMP = "";
    let rgx = new RegExp(`scope.${this[PASSED_DATA].comp_name}`, 'g');
    let CURRENT_COMP = this[PASSED_DATA].handler_temp.querySelectorAll(`[${this[PASSED_DATA].comp_key}]`)[0];

    let found = BIND.getVarsFromString_2(rgx, HTML_TEMP);

    for (let i = 0; i < found.length; i++) {
     
      if (newTEMP == "") {
        newTEMP = HTML_TEMP.replace(rgx, `scope.${this[PASSED_DATA].comp_name}${this[PASSED_DATA].comp_iterator}`);              
      }
      else {
        newTEMP = newTEMP.replace(rgx, `scope.${this[PASSED_DATA].comp_name}${this[PASSED_DATA].comp_iterator}`);         
      }
      
    }

    if (found.length > 0) {
      CURRENT_COMP.innerHTML = newTEMP;
    }
    else {
      CURRENT_COMP.innerHTML = HTML_TEMP;
    }

  }

  [getPassedProps](CURRENT_COMP) {
   
    //* get all attribute from element
    const COMP_ATTR = CURRENT_COMP.attributes;
    const COMP_PROPS_LENGTH = COMP_ATTR.length;

    //* start building up the $props object
    //? build up the components props          
    if (COMP_PROPS_LENGTH > 0) {
      for (let att, i = 0, atts = COMP_ATTR, n = atts.length; i < n; i++)
      {            
        
        att = atts[i];
        if (att.nodeName.indexOf("cp-") == -1) {
          this.$props[att.nodeName] = att.nodeValue;          
        }

      }
    }    

  }

  Component(COMP_OBJ, COMP_NAME, CONTROLLER_TEMP, cb) {
    
    //* Get components template
    DOM.getTemplate(COMP_OBJ.COMP_PROPS.template, (COMP_TEMP) => {
      
      CONTROLLER_TEMP.querySelectorAll("*").forEach(ELE => {
        
        //* get comp ele from controller template
        if (ELE.localName == COMP_NAME.toLowerCase()) {
          const COMP_ATTR = ELE.attributes;
          let NEW_COMP_TEMP = "";
          let REQ_PROPS = "";
          const COMP_PROPS_LENGTH = COMP_OBJ.COMP_PROPS.props.length;
          const PASSED_PROPS_LENGTH = COMP_ATTR.length;
          
          //? build up a string of the required props
          COMP_OBJ.COMP_PROPS.props.forEach(prop => { REQ_PROPS += prop+"|" });          

          //? check that all props are being passed
          if (PASSED_PROPS_LENGTH != COMP_PROPS_LENGTH) {
            ERROR.NEW(
              "Missing Props on Component",
              `Your component was not passed the required props: ( |${REQ_PROPS} )`,
              'comp',
              ELE,
              true,
            );
          }

          //? build up the components props          
          if (COMP_PROPS_LENGTH > 0) {
            for (let att, i = 0, atts = COMP_ATTR, n = atts.length; i < n; i++)
            {            
              
              att = atts[i];            
              let rgx = new RegExp("{{"+att.nodeName+"}}", 'g');
              if (COMP_OBJ.COMP_PROPS.props.includes(att.nodeName)) {

                if (NEW_COMP_TEMP == "") {
                  NEW_COMP_TEMP = COMP_TEMP.body.innerHTML.replace(rgx, att.nodeValue);
                }
                else {
                  NEW_COMP_TEMP = NEW_COMP_TEMP.replace(rgx, att.nodeValue);
                }

              }
              else {
                ERROR.NEW(
                  "Error in Component Props",
                  `${att.nodeName} Is not a registered prop for ${COMP_NAME}. Please make sure your prop names lowercase`,
                  'comp',
                  ELE,
                  true,
                );
              }

            }
          }
          else {
            NEW_COMP_TEMP = COMP_TEMP.body.innerHTML;
          }

          //? set the comp template inside the element
          ELE.innerHTML = NEW_COMP_TEMP;

          //? build up the styles for the component
          let style = document.createElement("style");
          style.innerHTML = `
          @import url("${appConfig.compsFolder}${COMP_NAME}/${COMP_OBJ.COMP_PROPS.style}");`;
          ELE.prepend(style);        

        }

      });
      
      //? Component Rendered
      cb(CONTROLLER_TEMP);

    }, true);
  }

}