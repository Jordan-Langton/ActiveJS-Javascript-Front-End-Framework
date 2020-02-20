# The Single File View
In this section, we will teach you all the basics and fundamentals of the ActiveJS `SFV (Single File View)` to enable you to start building amazing and beautiful projects. We will go over the basics of how to structure your `View` and will explain the different parts of it, and what it does. So lets get started!

# Sections
* [Template](#the-template)
* [Style](#the-style)
* [Script](#the-script)
* [Back to README](../README.md)

# Overview
The `SFV` is a `.html` file which will define a page or `View` inside of your application. It must always contin the following to help you define your views the way you want to.

# The Template
This is where you would put all of the mochup for the page in your application. See example below.
```html
<template>  
  <h1>Hello World!</h1>
</template>
```

# The Style
The style tage is where you would put all the `styles` for your view. Like below: 
```css
<style>
  h1 {
    color: #ffffff;
    padding: 10px 5px;
  }
</style>
```
The style tag also accepts the `scoped` attribute. This will stop all the style for your view from leaking out to other views. This means you can have two `<div>` tags with the same class, but have different styles.
>#### `warning : The "scope" attribute is still in a beta stage`

```css
<style scoped>
  h1 {
    color: #ffffff;
    padding: 10px 5px;
  }
</style>
```


# The Script
This is where you `register your view to ActiveJS` and define all the buisiness logic for your `view`. First you will need to *import* `{newView}` from **ActiveJS** in your packages. then supply a *View Name* and a *Controller*

```js
<script>

  import { newView } from "./packages/ActiveJS.js";
  newView("vewName", {
    el: "#app",
    Data() {
      return {
        message: 'Hello World!'
      }
    },
  })

</script>
```

# The View Controller
Your `View Controller` expects at least 2 properties being ( `el and Data` ), but has a few others. See the table below for more info:
Name | Type | Description | (-------)
---- | ---- | ----------- | -------
el|`String`|This is where you want your view to render to|[see above](#the-script)
Data|`Method`|This is a `method` which returns an *object* with all your properties for the view|[see above](#the-script)
props|`Array`|An `array` of strings telling the controller that it expects some `properties to be passed` to is when `routed` to|[example](#activeJS-props-example)
components|`Array`|An `array` of strings with the `names of components` you are using in your `template`|[example](#components-example)
observers|`Object`|This is an object of `methods` with names of properties defined in your `Data()` method|[example](#activeJS-observers-example)
computed|`Object`|This is an object of `methods` which will generate properties for you|[example](#computed-example)
methods|`Object`|An object of all your methods for the `view`|[example](#methods-example)
_Mounted|`Method`|A `life cycle` method which is called `before` anything has rendered|[example](#mounted-example)
_Rendered|`Method`|A `life cycle` method which is called `after` anything has rendered|[example](#rendered-example)
_beforeUpdate|`Method`|A `life cycle` method which is called before anything has `updated` in the `DOM`|[example](#rendered-example)
_Update|`Method`|A `life cycle` method which is called `after` anything has `updated` in the `DOM`|[example](#rendered-example)

## ActiveJS Props Example
When routing to a view in ActiveJS, you can pass data between views. If you tell a view that it accepts props, the view will produce an error until you pass it the props needed. See example below on how to tell a view it accepts props:
```js
import { newView } from "./packages/ActiveJS.js";
newView("vewName", {
  el: "#app",
  props: ["prop1", "prop2", "prop3"],
  Data() {
    return {
      message: 'Hello World!'
    }
  },
})
```
You can set a property in your view data to the value of one of the props inside of the `_Mounted` using `this.$props` life cycle method. See below example:
```js
import { newView } from "./packages/ActiveJS.js";
newView("vewName", {
  el: "#app",
  props: ["prop1", "prop2", "prop3"],
  Data() {
    return {
      propData: false
    }
 },
  _Mounted() {    
    this.propData = this.$props.prop1;
    // or
    this.propData = this.$props;
  }
})
```
## ActiveJS Observers Example
An observer is a method which will `watch` for a property in your view data to `change`. Once the data does change, the observer will perform an `action you supplied`. To create an observer, first add the `observers` object to your view controller. Then add a method inside of the object with the method's name being the same as the name of the property you wish to `observe`. See example below:
```js
import { newView } from "./packages/ActiveJS.js";
newView("vewName", {
  el: "#app",
  Data() {
    return {
      message: 'Hello World!'
    }
  },
  observers: {
    message() {
      console.log("the property 'message' has been updated");
    }
  }
})
```
## ActiveJS Computed Properties Example
A computed property is a method which sets a property in your view data to the return value of said computed method. Your create a computed method by first adding the `computed` object to your view controller. Then add a method with the name you wish to access via your controller. Make sure that your computed methods `ALWAYS` return a value. See example below:
>#### NOTE : As you can see, the computed method uses 2 data properties. If either of these properties change, the computed method will run and update it's computed value.
```js
import { newView } from "./packages/ActiveJS.js";
newView("vewName", {
  el: "#app",
  Data() {
    return {
      productPrice_1: 10,
      productPrice_2: 5,
    }
  },
  computed: {
    total() {
      return this.productPrice_1 + this.productPrice_2;
    }
  }
})
```
## ActiveJS Method Examples
Methods are 
