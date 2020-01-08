/* eslint-disable semi */
/* eslint-disable callback-return */
/* eslint-disable indent */
import { ERROR } from "./logging";

export const Lib = {

  /*
   * Gets the contents of a file and returns it
   @params (requestObj) - {url:"", type: ""}
  */
  getFileContents(requestObj, callback) {

    const xhr = new XMLHttpRequest();

    xhr.open("GET", requestObj.url);
    xhr.responseType = requestObj.type;
    xhr.send();

    xhr.onreadystatechange = () => {

      if (xhr.readyState == 4) {

        if (xhr.status == 200) {

          let checkObj;
          if (requestObj.type == "document") {
            checkObj = xhr.responseXML;
          }
          else if (requestObj.type == "text") {
            checkObj = xhr.responseText;
          }

          //? result
          if (checkObj == "" || null) {
            ERROR.NEW("Failed to get File", "The resoponse returned ass <b>null</b>", "lib", false, true, false);
            callback(true, checkObj)
          }
          else {
            callback(false, checkObj)
          }

        }
        else if (xhr.status != 200) {

          //? err
          callback(true, "XHR Request Failed :: Request failed with a status of " + xhr.status)

        }
      }
    }

  },

  /*
   * Creates an XHR Request
   @params (requestObj) - {method:"",url:"",params:"",data: payload}
  */
  XHR(requestObj, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open(requestObj.method, requestObj.url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    let params;
    if (requestObj.data) {
      params = requestObj.params + "&DATA=" + JSON.stringify(requestObj.data);
    }
    else {
      params = requestObj.params;
    }

    xhr.send(params);

    xhr.onreadystatechange = () => {
      //? start loader
      //  this.newLoader('loader-2');

      if (xhr.readyState == 4) {

        //? remove loader
        //  this.removeLoader('loader-2');

        if (xhr.status == 200) {

          // strips out the errors from the php side
          if (xhr.response.charAt(0) == '<') {
            let start = '';
            let data = xhr.response;
            switch (true) {
              case (data.indexOf("Notice") != -1):
                start = xhr.response.indexOf("Notice");
                break;
              case (data.indexOf("Warning") != -1):
                start = xhr.response.indexOf("Warning");
                break;
              case (data.indexOf("Parse") != -1):
                start = xhr.response.indexOf("Parse");
                break;
              case (data.indexOf("Error") != -1):
                start = xhr.response.indexOf("Error");
                break;

              default:
                break;
            }

            let end = start.length;
            let text = xhr.response.substr(start, end);
            let endtext = text.indexOf("</i>");
            let phpError = xhr.response.substr(start, endtext);

            return ERROR.NEW("Ajax Failed", "Error In PHP', phpError + '</i>", "lib", false, true, false);
            
          }

          //? result
          if (xhr.response == "" || null) {
            
            return ERROR.NEW("Ajax Failed", "The resoponse returned as <b>null</b>", "lib", false, true, false);
          }
          else {
            let result = JSON.parse(xhr.response);

            //? ------------ alert data
            if (result[0].type == "A") {
              // eslint-disable-next-line no-alert
              alert(JSON.stringify(result[0].data));
              callback(false, false);
            }

            //? ------------------- error
            if (result[0].type != "S") {
              //? return callback
              callback(true, result[0].description);
            }

            //? ---------------- returned data
            else if (result[0].type == "S") {
              //? show message if avaliable
              if (result[0].showMsg == true) {
                //* show popup
              }

              //? remove the success obj
              result.shift();

              //? return callback
              callback(false, result);
            }
          }

        }
        else {

          //? remove loader
          //  this.removeLoader('loader-2');

          //? err
          
          return ERROR.NEW("Ajax Failed", xhr.response, "lib", false, true, false);

        }
      }
    }
  }

};