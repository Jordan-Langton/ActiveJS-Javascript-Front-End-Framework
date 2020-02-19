# Adding ActiveJS To Your Project

## How much you use is up to YOU!

ActiveJS was made to make development a whole lot easier, faster and fun. It brings alot of features to the table, but whether or not you use them is up to you!

## Installing ActiveJS

The first thing you'll need to do is download [ActiveJS]() and and it's contents to your project directory. Once you are done, it should look something like this.

![ActiveJS](/src/images/documentation/installingQuantum.jpg)

## Instatiating AvtiveJS

Now that you have Quantum JS installed in your project directory, you can go into the app.config.js file and see that we do a few things.

![ActiveJS](/src/images/documentation/instantiatingQuantum.jpg)

As you can see we include a few things. We include [App State, Interfaces, Views]() and pass them to the config object. This object is where you setup stuff like the [name of your application or the version](). Have a look through all the different settings and you'll soon realise that it's very easy to follow. Once you have read and understand it, you can feel free you change it up and see what happens.

## Creating Your Routes

Your [routes]() is just an array of objects. Each object being a route in which you can navigate to within your application. Here is how it should look.

![ActiveJS](/src/images/documentation/creatingRoute.jpg)

There 3 properties per route <b>( path, handler, animation )</b>

### Path

The [path]() is the actual route you would like to go to when navigating by a button. For instance if you have a button called [Contact Us](). If you wanted to go to the contact us route, you would pass the path to that button via the [route]() attribute.

### Handler

The <b class="highlight">handler</b> is what you would like to focus on. It is the actaul <b>View Controller</b>. Meaning, the object containing all the infomation about that <b>View</b>. So in order to have a <b>Handler</b>, you would need to have a view in which exports the hanlder. See <link-comp label="Hello World" router="/helloWorld"></link-comp> if you do not know how to create a view for your application.

### Animation

The[animation]() property is an optional one. It tells the system how you would like to animate the view into the [DOM](). It accepts an object with the property [name](), and a string value where you pass the name of the animation. [types: ('slideOver', 'pushIn')]().

## Importing your View Handlers

Now that you have your routes set up, you need to get all your [View Handlers](). To do this, all you need is to make sure on your [View](), you export your [View Controller]() and then import it inside of [app.config.js](). Then pass it to your route's [handler]() like in the above example.

## In Conclusion

So in conclusion, we have a file ["app.js"]() which imports Quantum JS and instantiates it. We setup routes for our application and then passed them to our [config file](). And now we have a fully working app for use to play with and dive deepter into learning!