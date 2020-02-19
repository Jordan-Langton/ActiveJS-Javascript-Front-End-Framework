# The Single File View
In this section, we will teach you all the basics and fundamentals of the ActiveJS `SFV (Single File View)` to enable you to start building amazing and beautiful projects. We will go over the basics of how to structure your `View` and will explain the different parts of it, and what it does. So lets get started!

# Sections
* [Template](#the-template)
* [Style](#the-style)
* [Script](#the-script)

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

```css
<style scoped>
  h1 {
    color: #ffffff;
    padding: 10px 5px;
  }
</style>
```

>#### `warning : The "scope" attribute is still in a beta stage`

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
el|`String`|This is where you want your view to render to|[example](#the-script)
Data|`Method`|This is a `method` which returns an *object* with all your properties for the view|[example](#the-script)
props|`Array`|An `array` of strings telling the controller that it expects some `properties to be passed` to is when `routed` to|[Example](#props-example)
components|`Array`|An `array` of strings with the `names of components` you are using in your `template`|[example](#components-example)
observers|`Object`|This is an object of `methods` with names of properties defined in your `Data()` method|[example](#observers-example)
computed|`Object`|This is an object of `methods` which will generate properties for you|[example](#computed-example)
methods|`Object`|An object of all your methods for the `view`|[example](#methods-example)
_Mounted|`Method`|A `life cycle` method which is called `before` anything has rendered|[example](#mounted-example)
_Rendered|`Method`|A `life cycle` method which is called `after` anything has rendered|[example](#rendered-example)
_beforeUpdate|`Method`|A `life cycle` method which is called before anything has `updated` in the `DOM`|[example](#rendered-example)
_Update|`Method`|A `life cycle` method which is called `after` anything has `updated` in the `DOM`|[example](#rendered-example)