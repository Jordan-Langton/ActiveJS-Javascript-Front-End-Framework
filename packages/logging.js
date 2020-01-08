/* eslint-disable no-console */
import { BIND } from "./BIND";

export const ERROR = {

  ERRORS: [],

  NEW(_header, _message, _from, _ele=false, _log=false, _view=false) {
    
    let check = true;
    let _key = BIND.getRandowString(5);

    ERROR.ERRORS.forEach(err => {
      if (err.message == _message && err.from == _from) {
        check = false;
      }
    });

    if (check) {
      ERROR.ERRORS.push({
        header: _header, 
        message: _message, 
        from: _from, 
        ele: _ele, 
        log: _log, 
        view: _view, 
        key: _key
      });
    }

    if (_ele == false) {
      
      let ERR = ERROR.ERRORS.filter(err => err.key == _key)[0];

      if (ERR && ERROR.POPUP == true) {
        ERROR.BUILD_POPUP_ERRORS(ERR, true);
      }
    }

  },

  BUILD_INNER_ERROR() {

    //* start building up errors
    ERROR.ERRORS.forEach(error => {
      
      if (error.ele != false) {
        //* get element key
        let eleKey = false;
        for (let index = 0; index < error.ele.attributes.length; index++) {
          const attr = error.ele.attributes[index];

          if (attr.localName.indexOf("qm-") != -1) {
            eleKey = attr.localName;
          }
          
        }
        
        
        if (eleKey != false) {
          document.body.querySelectorAll(`[${eleKey}]`).forEach(element => {
            
            //* start building up the error element
            let eleCopy = document.createElement(element.localName);
            let errorWrapperEle = document.createElement("div");
            let warnIconWrapper = document.createElement("div");

            //* build element copy
            if (element.localName == "input") {              
              if (element.nodeValue == "" || element.nodeValue == null) {
                eleCopy.value = "Error in Element";
                eleCopy.nodeValue = "Error in Element";
              }
              else {
                eleCopy.value = element.value;
                eleCopy.nodeValue = element.nodeValue;
              }
            }
            else {
              if (element.nodeValue == "" || element.nodeValue == null) {
                eleCopy.innerHTML = "Error in Element";
              }
              else {
                eleCopy.innerHTML = element.innerHTML;
              }              
            }

            //* set all attributes onto new element copy
            Object.entries(element.attributes).forEach(attr => {
              let key = attr[1].nodeName;
              let value = attr[1].value;
        
              eleCopy.setAttribute(key, value);
            });


            //* build the warn icon
            warnIconWrapper.id = "systemErrWarnIcon";
            warnIconWrapper.className = "d-flex flex-center flex-align shadow-md";
            warnIconWrapper.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            warnIconWrapper.style = 'cursor: pointer;';
            warnIconWrapper.addEventListener("click", () => { ERROR.SHOW_MODEL(error.key); }); 
            

            //* build wrapper
            errorWrapperEle.id = "systemErrWarnWrapper";
            errorWrapperEle.className = "systemErrWarnWrapper d-flex flex-center flex-align";
            errorWrapperEle.appendChild(eleCopy);
            errorWrapperEle.appendChild(warnIconWrapper);

            element.parentNode.replaceChild(errorWrapperEle, element);
  
          });
        }
      }

    });

  },

  BUILD_POPUP_ERRORS(ERR, autoRender=false) {

    let message = '';
    let wrapperEle = '<div id="systemErrPopupWrapper" class="d-none flex-col flex-align"></div>';

    let arrToUse = (autoRender == false)?ERROR.ERRORS:[ERR];

    //* start looping through all generated system errors
    arrToUse.forEach(currentErr => {

      let check = document.getElementById(`systemErrModel-${currentErr.key}`);      

      //* make sure this error popup hasin't been rendered already
      if (check == null) {

        //* if the error must be logged as well
        if (currentErr.log) {

          let errStyle1 = "background-color: #FA9E7B; color:#000;border-radius:3px 0 0 3px;padding-right: 10px";
          let errStyle2 = "background-color: #C0C0C0; color:#000;padding:0 5px;border-radius:0 3px 3px 0";
  
          console.groupCollapsed("%c Error %c "+currentErr.header+" ", errStyle1, errStyle2);
            console.warn(currentErr.message);
          console.groupEnd();
        }
  
        let autoShow = (currentErr.ele != false)?'d-none':'d-flex';
  
        message += `      
        <div id="systemErrModel-${currentErr.key}" class="${autoShow} flex-col flex-center flex-align">
          <div class="systemErrIcon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="systemErrHeader">${currentErr.header}</div>
          <div class="systemErrContent">${currentErr.message}</div>
          <div class="systemErrActions">
            <div id="systemErrButton-1" onclick="$ERROR.CLOSE_MODEL('${currentErr.key}')">Close Error</div>
            <!-- <div id="systemErrButton-2"></div> -->
          </div>
        </div>`;
      }

    });

    let parser = new DOMParser();
    let POPUP_WRAPPER = parser.parseFromString(wrapperEle, "text/html").body.firstChild;
    let NEW_ERRORS = parser.parseFromString(message, 'text/html').body.childNodes;

    if (autoRender == false) {
      //* add the wrapper ele to the DOM
      document.body.appendChild(POPUP_WRAPPER);
      
      return NEW_ERRORS;
    }
    else {

      //* add the wrapper ele to the DOM
      document.body.appendChild(POPUP_WRAPPER);

      //* render all errors to DOM
      Object.entries(NEW_ERRORS).forEach(popup => {
        
        document.getElementById('systemErrPopupWrapper').classList.remove('d-none');
        document.getElementById('systemErrPopupWrapper').classList.add('d-flex');
        document.getElementById('systemErrPopupWrapper').appendChild(popup[1]);

      });
    }

  },

  SHOW_MODEL(popupKey) {

    if (ERROR.ERRORS.length > 0) {
      //* Show the error popup
      document.getElementById('systemErrPopupWrapper').classList.remove("d-none");
      document.getElementById('systemErrPopupWrapper').classList.add("d-flex");
      document.getElementById(`systemErrModel-${popupKey}`).classList.remove("d-none");
      document.getElementById(`systemErrModel-${popupKey}`).classList.add("d-flex");
    }

  },

  CLOSE_MODEL(popupKey) {

    if (ERROR.ERRORS.length > 0) {
      //* Hide the error popup
      document.getElementById('systemErrPopupWrapper').classList.remove("d-flex");
      document.getElementById('systemErrPopupWrapper').classList.add("d-none");
      document.getElementById(`systemErrModel-${popupKey}`).classList.add("d-none");
      document.getElementById(`systemErrModel-${popupKey}`).classList.remove("d-flex");
    }    

  },

  RENDER() {
    
    if (ERROR.ERRORS.length > 0 && window.$qm["show_errors"] == true) {
      
      //* start the render proccess of displaying an innerHTML error
      ERROR.BUILD_INNER_ERROR();

      //* start building up the individual error popups
      let popups = ERROR.BUILD_POPUP_ERRORS();
      
      //* render all errors to DOM
      Object.entries(popups).forEach(popup => { 

        document.getElementById('systemErrPopupWrapper').appendChild(popup[1]);

      });
     
    }

  },

};

export const SUCCESS = {

  MESSAGES: [],

  NEW(type, header, message, from, params=false, fancy=false) {

    let check = true;
    SUCCESS.MESSAGES.forEach(err => {
      if (err.message == message) {
        check = false;
      }
    });

    if (check) {
      SUCCESS.MESSAGES.push({type: type, header: header, message: message, from: from, params: params, fancy: fancy});
    }

  },

  RENDER() {

    

  }, 

};