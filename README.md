#Satnav

##A micro (~1.5kb gzipped) JS routing library.

**Author:** *Joe Harlow* (<joe@f5.io>)

---
`Satnav` provides functionality for Regex-like paths in JavaScript. It is library agnostic and has no dependencies.

###Browser Support
---

`Satnav` is built on the `hashchange` event but also includes support for HTML5 `pushState`.

`Satnav` provides a built-in `hashchange` polyfill for older versions of browsers, however it is currently untested.

`Satnav` will work in the following browsers, plus most mobile browsers.

- Microsoft Internet Explorer 8+
- Mozilla Firefox 3.6+
- Google Chrome 5.0+
- Apple Safari 5.0+
- Opera 10.6+

###Installation
---

`Satnav` can be installed with `bower`, by running:

`bower install satnav`

###Usage
---

`Satnav` can be accessed using either `Satnav` or `sN`. From here on out, we will refer to it as `Satnav`.

####`Satnav`(`config /* Object */`)

`Satnav` itself is a function object. Calling `Satnav`(`config`) will set the global variables and return itself to enable chaining of functionality.

The `config` object can have the following properties:

- #####`html5` (`boolean`)
	Tells `Satnav` to use the HTML5 `pushState` method. Will only work if `pushState` is available.
	
	Default: `false`.
- #####`force` (`boolean`)
	Should a `hashchange` be forced again if it is the same route. Useful if you have a Single Page Website where the user could scroll away from that routes content.
	
	Default: `false`.
- #####`poll` (`int`)
	Interval in ms at which the `hashchange` polyfill should occur.
	
	Default: `25`.

- #####`matchAll` (`boolean`)
	In integrations where a change event should fire every time even if no routes are defined, set this value to `true`.

	Default: `false`.

#####Example

	Satnav({
		html5: true, // use HTML5 pushState
		force: true, // force change event on same route
		poll: 100 // poll hash every 100ms if polyfilled
	});



###Methods (chainable)
---

####`navigate`(`route /* Object */`)

Used to define a route that `Satnav` should respond to. The `route` object should contain a `path` and `directions` property.

- #####`path` (`String`)

	A regex-like string containing the route. Parenthesised tokens in the string will become properties in the route's `params` object, and a value will be required for the route to be matched. Preceding a parenthesised token with a `?` will make the token optional. For eg. `'some/path/{required}/?{optional}'` will match `#some/path/value1` and `#some/path/value1/value2`, but not `#some/path`.

- #####`directions` (`Function`)

	A function callback for when the route is achieved. A `params` object will be passed into the function containing the token/values from the route.

- #####`title` (`String` *OR* `Function`)

	A value which can either be returned from a function or string which will then be set as the documents title. The function receives the routes params object.

#####Example

	Satnav.navigate({
		path: 'some/path/{required}/?{optional}',
		directions: function(params) {
			console.log(params.required); // log value of 'required' token  
			console.log(params.hasOwnProperty('optional')); // check if optional token exists      
		},
		title: function(params) {
			return 'My Awesome route: ' + params.required;
		}
	});

####`otherwise`(`route /* Object OR String * /`)

Used to define the default route that `Satnav` should target if no matching route is found.
route can either be a string or an object with a property of `path`.

#####Example

	Satnav.otherwise('/'); // will route all unmatched paths to #/
	
or

	Satnav.otherwise({
		path: '/some/path/value1'
	});

####`change`(`fn /* Function */`)

A function callback fired on `hashchange`. **This function will be fired before a routes `directions` are fired**.

The function will receive the current `hash`, a `params` object containing the token/values of the new route and another object containing the previous `hashchange` token/values.

#####Example

	Satnav.change(function(hash,params,old) {
		console.log(hash); // log current hash
		console.log(params); // log new route values
		console.log(old); // log previous route values
	});



####`go`()

Called at the end of a chain, `go`() tells `Satnav` to resolve the current route. This is what makes deeplinking possible.

#####Example

	Satnav({
			html5: false, // don't use pushState
			force: true, // force change event on same route
			poll: 100 // poll hash every 100ms if polyfilled
		})
		.navigate({
			path: 'some/path/{required}/?{optional}',
			directions: function(params) {
				console.log(params.required); // log value of 'required' token  
				console.log(params.hasOwnProperty('optional')); // check if optional token exists      
			}
		})
		.navigate({
			path: 'another/path/?{optional}',
			directions: function(params) {  
				console.log(params.hasOwnProperty('optional')); // check if optional token exists      
			}
		})
		.otherwise('/') // will route all unmatched paths to #/
		.change(function(hash,params,old) {
			console.log(hash); // log current hash
			console.log(params); // log new route values
			console.log(old); // log previous route values
		})
		.go()
	

###Deferring Hash Changes
---

`Satnav` includes the ability to defer a routes `directions`. This is extremely useful in builds where an animation off is required to happen before something else animates on for the new route.

####How-to

By returning `Satnav.defer` or `this.defer` in the `change` callback, `Satnav` will wait until the promise is resolved until continuing to the `directions` of the new route.

	Satnav
		.navigate({
			path: 'some/path/{required}/?{optional}',
			directions: function(params) {
				console.log('Fires 4 seconds after change callback');
			}
		})
		.change(function(hash,params,old) {
			console.log('Change callback');
			setTimeout(function() {
				Satnav.resolve(); // we resolve Satnav 4 seconds after the change event is fired
			}, 4000)
			return this.defer; // return promise object
		})
		.go();
		
###License
---

Copyright (C) 2013 Joe Harlow (Fourth of 5 Limited)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.




