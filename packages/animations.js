/* eslint-disable semi */
/* eslint-disable indent */
export const ANIMATE = {

  ANIMATION_TIMEOUT: 350,
  SLIDE_OVER_TYPE: 'slideOver',
  PUSH_IN_TYPE: 'pushIn',

  //* The slide over animation
  SLIDE_OVER(ANIMATION, HANDLER, BACKPAGE, elements) {

    //* if the previous view is the same as the current view
    if (BACKPAGE.viewName == HANDLER.fileName) {

      //* setup aniation
      elements.lastELE.setAttribute('id', BACKPAGE.last.ele + "_old");
      elements.viewELE.classList.add(ANIMATION);

      //* remove old pages after animation is done
      setTimeout(() => {
        $("#" + BACKPAGE.viewName + "_old").remove();
        elements.viewELE.classList.remove(ANIMATE.PUSH_IN_TYPE);
        // lastELE.parentNode.removeChild(lastELE);
        elements.viewELE.style.zIndex = "0";
      }, ANIMATE.ANIMATION_TIMEOUT);

    } else {

      //* setup aniation
      elements.viewELE.classList.add(ANIMATION);

      //* remove old pages after animation is done
      setTimeout(() => {
        elements.lastELE.parentNode.removeChild(elements.lastELE);
        elements.viewELE.classList.remove(ANIMATE.PUSH_IN_TYPE);
        elements.viewELE.style.zIndex = "0";
      }, ANIMATE.ANIMATION_TIMEOUT);

    }

  },

  SLIDE_OVER_BACK(ANIMATION, HANDLER, BACKPAGE, LASTPAGE) {

    let RENDER_ELE_CHILDREN = document.getElementById(HANDLER.ele.replace("#", "")).children;
    let LEAVING_ELE = false;

    for (let i = 0; i < RENDER_ELE_CHILDREN.length; i++) {
      let child = RENDER_ELE_CHILDREN[i];

      if (child.id != LASTPAGE.id) {
        LEAVING_ELE = child;
      }
    }

    LEAVING_ELE.style.zIndex = "1";
    LASTPAGE.style.left = "0";
    LEAVING_ELE.classList.add("slideOverOut");
    LEAVING_ELE.classList.add("shadow-sm");
    setTimeout(() => {
      LEAVING_ELE.parentNode.removeChild(LEAVING_ELE);
    }, ANIMATE.ANIMATION_TIMEOUT);

  },

  PUSH_IN(ANIMATION, HANDLER, BACKPAGE, elements) {

    return new Promise((resolve, reject) => {

      //* if the previous view is the same as the current view
      if (BACKPAGE.viewName == HANDLER.fileName) {

        //* setup aniation
        elements.lastELE.setAttribute('id', BACKPAGE.viewName + "_old");
        elements.lastELE.classList.remove("pushOutOld");
        elements.lastELE.classList.add(ANIMATION + "Old");
        elements.viewELE.classList.add(ANIMATION);

        //* remove old pages after animation is done
        setTimeout(() => {
          $("#" + BACKPAGE.viewName + "_old").remove();
          elements.viewELE.classList.remove(ANIMATE.SLIDE_OVER_TYPE);
          // lastELE.parentNode.removeChild(lastELE);
          elements.viewELE.style.zIndex = "0";
        }, ANIMATE.ANIMATION_TIMEOUT);

      } else {

        //* setup aniation
        elements.lastELE.classList.remove("pushOutOld");
        if (elements.lastELE.id != elements.viewELE.id) {
          elements.lastELE.classList.add(ANIMATION + "Old");        
        }
        elements.viewELE.classList.add(ANIMATION);

        //* remove old pages after animation is done
        setTimeout(() => {
          if (elements.lastELE.id != elements.viewELE.id) {
            elements.lastELE.parentNode.removeChild(elements.lastELE);
          }
          elements.viewELE.classList.remove(ANIMATE.SLIDE_OVER_TYPE);
          elements.viewELE.style.zIndex = "0";
          resolve();
        }, ANIMATE.ANIMATION_TIMEOUT);

      }

    });

  },

  PUSH_IN_BACK(ANIMATION, HANDLER, BACKPAGE, LASTPAGE) {
    // console.log(LASTPAGE);

    let RENDER_ELE_CHILDREN = document.getElementById(HANDLER.ele.replace("#", "")).children;
    let LEAVING_ELE = false;

    for (let i = 0; i < RENDER_ELE_CHILDREN.length; i++) {
      let child = RENDER_ELE_CHILDREN[i];

      if (child.id != LASTPAGE.id) {
        LEAVING_ELE = child
      }
    }

    LEAVING_ELE.style.zIndex = "1";
    LASTPAGE.classList.add("pushOutOld");
    LEAVING_ELE.classList.remove("pushOutOld");
    LEAVING_ELE.classList.add("pushOut");
    setTimeout(() => {
      LEAVING_ELE.parentNode.removeChild(LEAVING_ELE);
    }, ANIMATE.ANIMATION_TIMEOUT);

  },

}