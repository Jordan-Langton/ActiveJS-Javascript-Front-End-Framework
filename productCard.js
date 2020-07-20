import { Component } from "./packages/ActiveJS.js";

// A class where you define a new component
export default class productCard extends Component {

  constructor(props) {
    // Always call super passing props from the constructor
    super(props, {
      anyExtraData: false
    });
  }

  // this is a life cycle method
  compMounted() {    
    console.log(this.$props);    
    console.log(this.$extraData);    
    this.render(`
    <h1>adwdadw</h1>
    `);
  }

}