![ActiveJS](./src/images/system/ActiveJS_Logo_Full_Black.png)
# ActiveJS

## Getting Started

`ActiveJS` is a Javasrcipt library built to make your life a whole lot easier when building a user interface. It takes away all the nity grity parts of development, and allows you to play around with the `funs parts of developing!`, Here we will help you understand how to `use ActiveJS to its full potential`, while also covering some of the `core fundamentils`. So what are you waiting for, `lets begin!`.

# Sections
- [Installing ActiveJS](#installing-activeJS)
- [Importing ActiveJS](#importing-activeJS)
  - [Config](#activeJS-(Config)-back-to-top)
  - [State](#activeJS-(State)-back-to-top)
  - [Emit](#activeJS-(Emit)-back-to-top)
  - [Accept](#activeJS-(Accept)-back-to-top)
  - [Component](#activeJS-(Component)-back-to-top)
  - [reqisterComponent](#activeJS-(reqisterComponent)-back-to-top)
  - [saveToCache](#activeJS-(saveToCache)-back-to-top)
  - [getFromCache](#activeJS-(getFromCache)-back-to-top)
  - [createApp](#activeJS-(createApp)-back-to-top)
  - [Router](#activeJS-(Router)-back-to-top)
  - [newController](#activeJS-(newController)-back-to-top)  
  - [use](#activeJS-(use)-back-to-top)  
- [Initializing Your App](#initializing-your-app)
  - [Your Config Options](#your-config-options)
  - [Defining A Route](#defining-a-route)
  - [Passing Data To A View](#passing-data-to-a-view)
- [View Structure](#the-single-file-view)
  - [Template](#the-template)
  - [Style](#the-style)
  - [Script](#the-script)
  - [View Controller](#the-view-controller)
    - [Props Example](#activeJS-props-example)
    - [Observers Example](#activeJS-props-example)
    - [Computed Properties Example](#activeJS-props-example)
    - [Methods Example](#activeJS-methods-example)
- [Data Binding](#data-binding)
- [State Management](#state-management)  
  - [About](#what-is-state)  
  - [Getting Started](#lets-get-started)  
  - [Context Object](#context-object)  
  - [The Model Object](#the-model-object)  
  - [The Getters Object](#the-getters-object)  
  - [The Mutations Object](#the-mutations-object)  
  - [The Actions Object](#the-actions-object)  
  
# Installing ActiveJS
You can add the framework from command line like:
```
$ git clone https://github.com/PostmanPat123/activeJS.git
```
Or you can download the files from Github from [here](https://github.com/PostmanPat123/activeJS/tree/master)

## Installing NPM Packages
  -  Once you have downloaded the `GIT` repo, you will need to run the following. This will install the required `DEV` dependecies to build the project.
  ```
  $ npm install
  ```
  -  Once the install is finnished, run the following to generate the `bundle.js` file which is included inside of your `index.html` file.
  >#### `Note : NPM is only installed to give you the most up to date framework packages on npm, and to help with the dev server and bundling of the js. ActiveJS does not require node to run in the background, just to download the packages.`
  ```
  $ npm run build
  ```

## Starting DEV Server
  -  To start a `DEV` server and start building your application, simply run the following to start up your very wn server.
  ```
  $ npm run dev
  ```

# Importing ActiveJS
In order to access some of the features the ActiveJS provides, you will need to import `ActiveJS` from the packages folder if you are inside of your app entry point. If you are in a view, the `ActiveJS` global variable will be avaliable to you. See example below to see what you can access from the import/global variable:

```js
import * as ActiveJS from "@jordan_langton/activejs";

// or access ActiveJS from a global variable
ActiveJS.(whatever property you want to access)
```

- ### ActiveJS (Config) [back to top](#sections)
    ```js
    import { Config } from "@jordan_langton/activejs";

    // An object with all your initial config data inside
    Config = {
      "name": "TESTING Application",
      "version": "1.0.0",
      "environment": "Development",
      "description": "This is a test application",
      "systemTheme": "project-theme",
      "systemStyles": ['messages', 'anamations', 'views', 'fonts'],
      "interfaces": [],
      "store": Store, // if you passed a global store to ActiveJS
      "routes": []
    }
    ```

- ### ActiveJS (State) [back to top](#sections)
    ```js
    import { State } from "@jordan_langton/activejs";

    // An object with all your State methods and global state
    State = {
      model: {},
      Get(propName="", payload) {},
      Commit(name="", payload) {},
      Dispatch(name="", payload, callback=()=>{}) {}
    }
    ```

- ### ActiveJS (Emit) [back to top](#sections)
    ```js
    import { Emit } from "@jordan_langton/activejs";

    // A method used to 'emit' some sort of data
    Emit(eventName="", payload=true);
    ```

- ### ActiveJS (Accept) [back to top](#sections)
      ```js
      import { Accept } from "@jordan_langton/activejs";

      // A method used to 'accept' data emited from somewhere in your app
      Accept(eventName="");
      ```

- ### ActiveJS (Component) [back to top](#sections)
    ```js
    import { Component } from "@jordan_langton/activejs";

    // A class where you define a new component
    export default class testComp extends Component {

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
        this.render(`<h1>${this.$props.message}</h1>`);
      }

    }
    ```

- ### ActiveJS (reqisterComponent) [back to top](#sections)
    ```js
    import { reqisterComponent } from "@jordan_langton/activejs";

    // A method used to a component to ActiveJS to use in your views
    reqisterComponent(reference="", component={});
    ```

- ### ActiveJS (saveToCache) [back to top](#sections)
    ```js
    import { saveToCache } from "@jordan_langton/activejs";

    // A method used to cache some data on the device
    saveToCache(key="", payload={});
    ```

- ### ActiveJS (getFromCache) [back to top](#sections)
    ```js
    import { getFromCache } from "@jordan_langton/activejs";

    // A method used to get something out of your device cache
    getFromCache(key="");
    ```

- ### ActiveJS (createApp) [back to top](#sections)
    ```js
    import { createApp } from "@jordan_langton/activejs";

    // This is what you call to initialize your ActiveJS application
    createApp(configuration={}, Created=() => {});
    ```

- ### ActiveJS (Router) [back to top](#sections)
    ```js
    import { Router } from "@jordan_langton/activejs";

    // An object with router specific methods
    Router = {
      navBack: () => {},
      removeLastCrumb: () => {},
      route: (path="", params=null) => {},
      addCrumb: (crumb={path: "", params: null}) => {},
    }
    ```

- ### ActiveJS (newController) [back to top](#sections)
    ```js

    // This is what you call to initialize a new controller for a view
    ActiveJS.newController(View_Name="", Controller={
      el: '',
      props: [], 
      Data() {}, 
      _Mounted() {}, 
      _Rendered() {}, 
      _beforeUpdate() {}, 
      _Updated() {}, 
      observers: {}, 
      computed: {}, 
      methods: {}
    });
    ```
- ### ActiveJS (use) [back to top](#sections)
    ```js

    // This is what you call to add a library you want to use in your views
    ActiveJS.use(key="", library={});
    ```

# Initializing Your App
#### [back to top](#sections)
Here we will show you how to build up you app config options and initialize your app. This will be the entry point for you `ActiveJS` application.

## Your Config Options
#### [back to top](#sections)
These options are what helps `ActiveJS` understand the nature of your application. For example, the name of your app or the version. See below what options are avaliable to you.
```js
const configOptions = {
  "name": "ActiveJS Project",
  "version": "1.0.0",
  "environment": "Development",
  "description": "This is a test application",
  "systemTheme": "project-theme",
  "systemStyles": [],
  "componentStyles": [],
  "interfaces": [],
  "store": {},
  // these debug options are here for info about
  // key points in the rendering life cycle
  "debugOptions": {
    ROUTER: false,
    BREADCRUMBS: false,
    ERRORS: false,
    VM_LOADED: false,
    VIEW_TEMPLATE_LOADED: false,
    VM_LOADED_ONTO_WINDOW: false,
    VM_BUILT: false,
    VM_IS_OBSERVED: false,
    VM_ACCESSED_UNDER_SCOPE: false,
    COMPUTED_PROPS_BUILT: false,
    MOUNTED_LIFECYCLE: false,
    RENDER_LIFECYCLE: false,
    RENDER_BEGIN: false,
    RENDER_COMPLETE: false,
    PASSED_PROPS_GENERATED: false,
    TIME_TO_RENDER: false,
    INLINE_ROUTES_CHECKED: false,
    DOM_MINIPULATION: false,
  },
  "routes": []
}
```

## Defining A Route
#### [back to top](#sections)
A `route` is a page in with your application can go to. You need to define a route before your application can understand that it can go there. See below how to create a `route`.
```js
const route = {
  path: '/yourPage', 
  handler: 'theSingleFileView.html', 
  animate: ''
};
```

## Passing Data To A View
#### [back to top](#sections)
if you want your view to accept some parameters/props you would do so inside the 'path' property of your route. Using a colon after your path URL you can define a property that needs to be passed to you view.
```js
const singleProp = {
  path: `/yourPage
            :customData`, 

  handler: 'theSingleFileView.html', 
  animate: ''
};
```

You can define multiple props to pass by just putting another colon after your first param.
```js
const multiProp = {
  path: `/yourPage
            :customData1
            :cunstomData2`,

  handler: 'theSingleFileView.html', 
  animate: ''
};
```

If you want to default your property you are want to to accept to a custom value. Just put a '`=`' after the param name and then your value.
```js
const defaultValProp = {
  path: `/yourPage
            :customData1=false
            :cunstomData2=Hello World`,

  handler: 'theSingleFileView.html', 
  animate: ''
};
```

# The Single File View
In this section, we will teach you all the basics and fundamentals of the ActiveJS `SFV (Single File View)` to enable you to start building amazing and beautiful projects. We will go over the basics of how to structure your `View` and will explain the different parts of it, and what it does. So lets get started! The `SFV` is a `.html` file which will define a page or `View` inside of your application. It must always contin the following to help you define your views the way you want to.

# The Template
#### [back to top](#sections)
This is where you would put all of the mochup for the page in your application. See example below.
```html
<template>  
  <h1>Hello World!</h1>
</template>
```

# The Style
#### [back to top](#sections)
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
#### [back to top](#sections)
This is where you `register your view to ActiveJS` and define all the buisiness logic for your `view`. First you will need to *import* `{newController}` from **ActiveJS** in your packages. then supply a *View Name* and a *Controller*

```html
<!-- You can either have the js in the script tag -->
<script>
  ActiveJS.newController("vewName", {
    el: "#app",
    Data() {
      return {
        message: 'Hello World!'
      }
    },
  })
</script>

<!-- Or you can pull in the js from another JS file -->
<script src="./views/vewName.js"></script>
```

# The View Controller
#### [back to top](#sections)
Your `View Controller` expects at least 2 properties being ( `el and Data` ), but has a few others. See the table below for more info:
Name | Type | Description | (-------)
---- | ---- | ----------- | -------
el|`String`|This is where you want your view to render to|[see above](#the-script)
Data|`Method`|This is a `method` which returns an *object* with all your properties for the view|[see above](#the-script)
components|`Array`|An `array` of strings with the `names of components` you are using in your `template`|[example](#components-example)
observers|`Object`|This is an object of `methods` with names of properties defined in your `Data()` method|[example](#activeJS-observers-example)
computed|`Object`|This is an object of `methods` which will generate properties for you|[example](#computed-example)
methods|`Object`|An object of all your methods for the `view`|[example](#methods-example)
_Mounted|`Method`|A `life cycle` method which is called `before` anything has rendered|[example](#mounted-example)
_Rendered|`Method`|A `life cycle` method which is called `after` anything has rendered|[example](#rendered-example)
_beforeUpdate|`Method`|A `life cycle` method which is called before anything has `updated` in the `DOM`|[example](#rendered-example)
_Update|`Method`|A `life cycle` method which is called `after` anything has `updated` in the `DOM`|[example](#rendered-example)
helpers|`Object`|An object of helper methods that alow you access to ActiveJS|[example](#rendered-example)

- ## ActiveJS Props Example
  #### [back to top](#sections)  
  You can set a property in your view data to the value of one of the props inside of the `_Mounted` using `this.$props` life cycle method. See below example:
  ```js
  ActiveJS.newController("Props", {
    el: "#app",
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
- ## ActiveJS Observers Example
  #### [back to top](#sections)
  An observer is a method which will `watch` for a property in your view data to `change`. Once the data does change, the observer will perform an `action you supplied`. To create an observer, first add the `observers` object to your view controller. Then add a method inside of the object with the method's name being the same as the name of the property you wish to `observe`. See example below:
  ```js
  ActiveJS.newController("Observers", {
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
- ## ActiveJS Computed Properties
  #### [back to top](#sections)
  A computed property is a method which sets a property in your view data to the return value of said computed method. Your create a computed method by first adding the `computed` object to your view controller. Then add a method with the name you wish to access via your controller. Make sure that your computed methods `ALWAYS` return a value. See example below:
  >#### NOTE : As you can see, the computed method uses 2 data properties. If either of these properties change, the computed method will run and update it's computed value.
  ```js
  ActiveJS.newController("Computed_Properties", {
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
- ## ActiveJS Methods Example 
  #### [back to top](#sections)
  This is an object of all the custom methods you would want to call due to user interaction or during a proccess flow. To add a method to your controller, first add the `methods` object to the controller and inside of it, add your method. See example below:
  ```html
  <template>
    <h3>Counter: {{counter}}</h3>
    <button @on:click="addToCounter()">Add</button>
  </template>
  ```
  ```js
  ActiveJS.newController("Methods", {
    el: "#app",
    Data() {
      return {
        counter: 0
      }
    },
    methods: {
      addToCounter() {
        this.counter = this.counter++;
      }
    }
  })
- ## ActiveJS Helpers Example 
  #### [back to top](#sections)
  This is an object of helper functions that ActiveJS reveals to you. These methods are there to help you access something like a library you added to your project. See example below:
  ```js
  ActiveJS.newController("Methods", {
    el: "#app",
    Data() {
      return {
        URL: ""
      }
    },
    methods: {
      addToCounter() {
        const common = this.helpers.getLib("common");
        this.URL = common.getURL();
      }
    }
  })
  ```

  See the avaliable helper methods below:
  Name | Description | (params)
  ---- | ----------- | -------
  getLib|Gets a library that you loaded into ActiveJS|[(key="library name")](#the-script)

# Data Binding
#### [back to top](#sections)
We Know that alot of applications separate markup and logic into separtate files. In ActiveJS we decided to allow both to work side by side. We enable this with `Declerative Expressions`. These expressions make your UI alot easier to read and understand.

## How to Bind a property
#### [back to top](#sections)
In order to bind a variable/property to your template, all you need to do is wrap the property name in `Moustache Braces` and place it anywhere in your template like this.

```html
<template>
  <p>{{message}}</p>
</template>
```
By doing this, ActiveJS will get your property value and place it in the position you placed it in.

## Directives
#### [back to top](#sections)
Directives are special `attributes` prefixed with the `"@"` symbol that ActiveJS has built in out of the box. They are used to make you development alot faster and apply changes to the DOM when your View Controller data is updated or modified.

- ## @if Directive
  The `@if` directive is used when you are wanting to render an element depending on a `truthy` value in your `View Controller`.
  For example, lets say you have a `div` which should be displayed when a user doesn't fill in an input field. We would use `@if`.

  ```html
  <template>
    <div class="errMsg" @if="error">
      Please fill in all required fields
    </div>
  </template>
  ```
  ```js
  ActiveJS.newController("Directives", {
    el: "#app",
    Data() {
      return {
        username: "",
        password: "",
        error: false
      }
    },
    methods: {
      submit() {
        check = this.validateFields();

        if(!check) {
          this.error = true;
        }
      }
      // other methods for view
    }
  })
  ```

  You can also put expressions in the `@if` directive. All you need to do is place "[expression]" inside the quotations of the `@if`.
  Just make sure to use the keyword `this` and then the value that you are trying to access from your view model.
  See below for example.
  ```html
  <template>
    <div class="errMsg" @if="[this.error == false]">
      Please fill in all required fields
    </div>
  </template>
  ```

- ## bind Directive
  #### [back to top](#sections)
  The `@bind` directive is very useful. You can use this directive to bind a property in your View Controller to an `attribute` on an element. For instance, if you want to apply a class to an element if an error occurs. You would use the `@Bind:class` attribute to do so. See the table below for infomation on what you can bind to.

  Binding | Type | Description
  ------- | ---- | -----------
  @bind:id|`String`|Allows you to bind your data property to the `id` of the element
  @bind:class|`String`|Allows you to bind your data property to the `class` of the element
  @bind:disabled|`Boolean`|Will add a `disbaled` attribute to the element depending on the `value` of your data property
  @bind:href|`String`|Will set the `href` attribute to the value of your data property

  ```html
  <template>
    <button @bind:class="submitButton">Submit</button>
  </template>
  ```

- ## @on Directive
  #### [back to top](#sections)
  The `@on` directive is used to bind a users `action` to an element. For example, if you have a button to alert a user's name once it's `clicked`. You would use the `@on:click` directive and this would add a click event listener to that element. See the table below for infomation on what you can bind to.

  Binding | Description
  ------- | -----------
  @on:click|This will add a `click` event to your element
  @on:enter|This enables you to add an `enter` event to your element
  @on:change|This allows you to add an `onchange` event to your element
  @on:submit|This allows you to add a `submit` event to a form
  @on:scroll|This allows you to add a `scroll` event to your element

  ```html
  <template>
    <button @on:click="submit()">Submit</button>

    <!-- you don't need the () -->
    <button @on:click="submit">Submit</button>
  </template>
  ```
  ```js
  ActiveJS.newController("Directives", {
    el: "#app",
    Data() {
      return {
        username: "",
        password: "",
      }
    },
    methods: {
      submit() {
        check = this.validateFields();

        if(!check) {
          this.error = true;
        }
      }
      // other methods for view
    }
  })
  ```
  You can also pass run a JS expression using the `@on` directive. Just use '[ ]' inside the value and place your JS expresion inside the square brakets. Note that the keyword `this` points to the currently loaded View Controller.
  ```html
  <template>
    <button @on:click="[alert('Hello World')]">Submit</button>

    <button @on:click="[alert(this.username)]">Submit</button>
  </template>
  ```
  ```js
  ActiveJS.newController("Directives", {
    el: "#app",
    Data() {
      return {
        username: "Hello World",
      }
    }
  })
  ```

- ## @reflect Directive
  #### [back to top](#sections)
  The `@reflect` directive is a very special attribute. By adding this attribute to an element, you bind the value of that element to the value of your data property in your View Controller. As well as the propery inside your View Controller is bound to the value of the element. This is called `Two way data binding`. Any updates that happen to the `View Controller`, will update the `DOM`, as well as any updates that happen in the `DOM` will update your View Controller

  In the example below, we have an input which is bound to `userInput` in the View Controller. And a heading which is also bound to the same property.

  ```html
  <template>
    // to display the user input
    <p>{{userInput}}</p>
    <input type="text" @reflect="userInput">
  </template>
  ```
  ```js
  ActiveJS.newController("Directives", {
    el: "#app",
    Data() {
      return {
        userInput: "",
      }
    }
  })
  ```
  If you were to type something inside the input field it would set the View Controller property, which would update any other elements in the DOM with the same binding. In this case it would be the paragraph.

- ## @for Directive
  #### [back to top](#sections)
  The `@for` directive can be used to render a list of items based on an `array`. The `@for` directive requires a special syntax in the form of `item in items`, where items is the `source data array` and item is an `alias` for the array element being iterated on.

  Say you want to render a list of users which displays some data. Bellow we created an array of users with some data about each user inside of our View Controller
  ```js
  ActiveJS.newController("Directives", {
    el: "#app",
    Data() {
      return {
        users: [
          {name: "James", age: 15},
          {name: "Fred", age: 34},
          {name: "John", age: 22}
        ],
      }
    }
  })
  ```
  Now we build up the `HTML Mocup` for the list. the `@for` Directive will loop the the element the directive is placed in. For example, if you add the `@for` Directive to an `li` element. the `li` element will be looped over and iterate over the array passed. To display the array data being looped over, start by adding `square brackets` inside the looped element. Then insert the `alias` you passed as an argument.

  ```html
  <template>
    <ul>
      <li @for="user in users">Name: [user.name] | Age: [user.age]</li>
    </ul>
  </template>
  ```
  If you are wanting to get the current `index` of the loop, just add `:key=""` to the loop element and pass it a `reference` you want to use.
  ```html
  <template>
    <ul>
      <li @for="user in users" :key="index">[index] Name: [user.name] | Age: [user.age]</li>
    </ul>
  </template>
  ```

# State Management
#### [back to top](#sections)
## What is State
`State` is a way to mannage the "state" of your application. It is the single source of truth and holds the whole state tree. In truth, it is just an object. To change the state, you must Commit a mutation to it. For instance if you have a username inside your View Controller. And you display it as a heading in your template.

```html
<template>
  <h1>{{username}}</h1>
</template>
```
```js
  ActiveJS.newController("State_Management", {
    el: "#app",
    Data() {
      return {
        username: "John"
      }
    }
  })
```
Now if you update `username` via a method inside your `View Controller`. This is all good, but what happens when you change to another view and come back? The `username` property will now be set back to it's initial value when you load the view. This is where `State` comes into the picture!

## Lets Get Started
#### [back to top](#sections)
Inside the `./public` at the root of the application. you'll find a file called `app.state.js`. In this file you'll find an exported object which contains four properties ( `state, getters, mutations, actions` ). Read more to find out what each of these properties do.
```js
export default {

  "model": {
    // where you store global data
  },
  "getters": {
    // where you store your getters for properties in the model
  },
  "mutations": {
    // where you store your setters for properties in the model
  },
  "actions": {
    // where you store your async methods
  },

};
```

## Context Object
#### [back to top](#sections)
The `context` is an object with access to your properties inside your state object. It is passed to `all methods` inside your `getters, mutations and actions`. The `context object` allows you to get properties out of your state or call a method from your mutations or actions. Below is a table showing every property inside the `context Object`.

Propery | Type | Description | ( --------- )
------- | ---- | ----------- | ------------
$model|`Object`|A reference to the `model` object| [example](#model-example)
$mutaions|`Object`|A reference to the `mutaions` object| [example](#mutaions-example)
$actions|`Object`|A reference to the `actions` object| [example](#actions-example)
Get|`Method`|Allows you to call a method inside your `getters` object| [example](#getters-example)
Commit|`Method`|Allows you to call a method inside your `mutations` object| [example](#getters-example)
Dispatch|`Method`|Allows you to call a method inside your `actions` object| [example](#getters-example)

## The Model Object
#### [back to top](#sections)
The `model` property is the main object of `variables/properties` in which you will be storing and minipulating data. For example you could add a property to the state called users. And this could be an array of user objects.
```js
"model": {
  users: [
    {name: "James", age: 15},
    {name: "Fred", age: 34},
    {name: "John", age: 22}
  ]
}
```
## The Getters Object
#### [back to top](#sections)
The `getters` property will be an object of methods. The method's job is to `get values out of your model`. For example, lets say you want to get the user james out of your array of users we showed you above. You would create a `getter` method. Lets call it `getUser()`. How do we access the model? Well, all getters get passed the [context object](#context-object) and a `payload` that you set when calling a `getter`. See the example below.

```js
"getters": {
  getUser(context, payload) {
    const user = context.$model.users.filter(user => {
      return user.name == payload.name;
    });

    return user;
  }
}
```

```js
// using a 'getter' method in your view
ActiveJS.newController("State_Management", {
  el: "#app",
  Data() {
    return {
      username: "John"
    }
  },
  methods: {
    getUsers() {
      ActiveJS.State.Get("getUser", {name: this.username});
    }
  }
})
```

## The Mutations Object
#### [back to top](#sections)
The `mutations` property holds all your methods that `update or change` your `model`. Just like we explained above, all mutations get passed the [context object](#context-object), and a payload you set.

As an example, lets say you want to update the user within the `model` called `"James"` to a name you pass in your payload. We would then create a `mutation` with a name along the lines of `"updateUser()"` which would do so. As you can see we `decontruct` the context object only to use the `model` from it, See example below.

>#### NOTE : All mutaions need to be synchronous to ensure that the state isn’t dependent on the timing and order of unpredictable (asynchronous) events.

```js
"mutations": {
  updateUser({$model}, payload) {
    $model.users.forEach((user, index) => {
      if(user.name == payload.name) {
         $model.users[index].name = payload.newName;
      }
    });
  }
}
```
```js
// using a 'getter' method in your view
ActiveJS.newController("State_Management", {
  el: "#app",
  Data() {
    return {
      inputValue: "John"
    }
  },
  methods: {
    updateUser() {
      ActiveJS.State.Commit("updateUser", {name: "Fred", newName: this.inputValue});
    }
  }
})
```
## The Actions Object
#### [back to top](#sections)
The `actions` property is very similar to the mutations property, but there is one key difference between a mutation method and an action method. All actions are for `asynchronous` calls and should `NEVER update or change` the model itself. Rather you should call a `mutation` once you have the `asynchronous` data and pass it as a payload.

For example, say we have a table in a database which conatins all our `users`. Now we want to get a user and then insert him/her into our `model`. Here is where an action will come into play. Lets call this action `getUserFromDB()`, and fetch the user from our `database`. Once we get the user, we can call a `mutaion` to insert the user we just got back. See example below.

```js
"actions": {
  getUserFromDB({Commit}) {
    fetch("https://someApi/users")
    .then((response) => {
      if(response.status != 200) {
        console.error("Request failed with a status of : "+response.status);
        return;
      }

      // call mutation to insert user
      Commit("insertUser", JSON.parse(response.result));
    })
    .catch((err) => {
      console.error("Request failed : "+err);
    })
  }
}

