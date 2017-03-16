# Building and Unit Testing an Express Application

## Preamble

In this tutorial, we're going to build and test an Express application from the ground up — using a number of different testing strategies. The goal of the this tutorial is to get super deep into a very small set of things so that you understand how they work.

You can find the original version of this tutorial at [Pizza Express](https://github.com/turingschool-examples/pizza-express). Check out that tutorial to see a straight forward implementation and some different technologies being implemented. It's always good to see a lot of different ways to create a thing.

This is the _extreme_ version... meaning that we will have a few different branches and many different implementations. Things might get a little weird.

## Lessons & Branches

* [Master](https://github.com/rrgayhart/extreme-pizza-express) - has a base level implementation and instructions for how to start the repo from scratch (if you so choose).
* [Server Testing](https://github.com/rrgayhart/extreme-pizza-express/tree/server-testing) - unit tests an initial implementation of the server.

## Unit Testing Our Server

Alright, we have a server and we can test it by visiting the page manually. But, testing by hand gets old pretty fast. It would be nice if we could have some kind of automated testing, right? Yea, I agree. We are going to need to make some modifications to your existing little application, though.

As it stands, whenever `server.js` is run, it fires up the web server. Generally speaking, this is what we want if we're just running `node server.js`. But it's not necessarily what we want if we're trying to grab it from our tests to poke at it.

In that scenario, we _do not_ want it to just start up all on it's own.

What we need to do is to add some introspection and see if our application is being run directly or being required from another file. We can do this by modifying our server slightly.

```js
// server.js

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}
```

If `server.js` is being run directly, then it has no parent and we should fire up the server. But, if it's being required, then the file requiring `server.js` is its parent and we should not spin up the server automatically.

We will also need to make sure we can access the `app` by exporting it at the bottom of the page.

```js
// server.js 

module.exports = app;
```

### Setting Up Testing

We will need to install a few node modules to get ourselves up and running:

```
  npm install mocha chai chai-http --save-dev
```

We're also going to want to make ourselves an npm script so that we can run our tests easily!

Add the following to your `package.json` scripts:

```js
  "test": "node_modules/.bin/mocha ./tests/**.js || true",
```

And create a test folder:

```
  mkdir tests
  touch tests/server-test.js
```

We can make sure everything is working now by running:

```
npm test
```

### Spinning Up Our Test Server

In `tests/server-test.js`, I'm going to write my first test.

```js
  // tests/server-test.js
  const chai = require('chai');
  const expect = chai.expect;

  const app = require('../server.js');
```

Just to keep our spirits up, let's start with the simplest possible test.

```js
const chai = require('chai');
const expect = chai.expect;

const app = require('../server.js');

describe('Server', () => {
  it('should exist', () => {
    expect(app).to.exist;
  });
});
```

### Updating Our Linter

Yay! We wrote some test code. Let's make sure our linter can handle the testing fury.

Remember that we run our linter

```
  npm run lint
```

If you try that now, you'll see that we don't get any errors. I'd like to think I'm just that good at coding, but let's be real here. Most likely, my linter isn't set up to lint the test files.

We can fix that by adding that directory to our linter scripts: `tests/**.js`

```js
// package.json
    "lint": "node_modules/.bin/eslint public/**.js lib/**.js tests/**.js **.js || true",
    "lintf": "node_modules/.bin/eslint public/**.js lib/**.js tests/**.js **.js  --fix || true"
```

Is there a cleaner/better way to do this? Absolutely. PRs accepted :D

Now when I run the linter, I get a bunch of errors.

```bash
   8:1   error  'describe' is not defined                     no-undef
   9:3   error  'it' is not defined                           no-undef
  10:25  error  Missing semicolon                             semi
  13:3   error  'describe' is not defined                     no-undef
  14:5   error  'it' is not defined                           no-undef
```

Well, that's no good. The semi colon error I'm into, but describe and it are part of mocha. What the heck. I guess I can't lint my testing files?

Actually, no, eslint just needs to be told about 'mocha' being a possible environment. [Find the answer in the docs here](http://eslint.org/docs/user-guide/configuring).

In my eslintrc file, I need to add mocha to the env section:

```json
"env": {
        "browser": true,
        "node": true,
        "es6": true,
        "mocha": true
    },
```

### Making Requests to Our Server

Now that we have our server running in our tests. We can make requests to it. We could totally do this using the built-in `http` module but that's pretty low-level. Let's use a library called `chai-http`.

```
  npm install chai-http --save-dev
```

In `tests/server-test.js`, we'll require chai-http.

```js
  const chaiHttp = require('chai-http');
```

We also need to let Chai know that it should be using this package. Do so by adding:

```js
  chai.use(chaiHttp);
```

Alright, we've set everything up. Now, we can write our first test. Our app is pretty simple. So, let's start by making sure that we have a `/` endpoint and that it returns a 200 response.

Nested in our `describe('Server')` section, we'll add a `describe('GET /')` section as well. Our test suite will look something like this:

```js
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../server.js');

chai.use(chaiHttp);

describe('Server', () => {
  it('should exist', () => {
    expect(app).to.exist;
  });

  describe('GET /', function() {
    // test to go here
  });

});
```

> Take a minute right now to skim over the [chai-http documentation](http://chaijs.com/plugins/chai-http/). You'll notice that `chai-http` is kind of like a friendly wrapper powered by something called [superagent](https://github.com/visionmedia/superagent).

> If you are working in a code base where you aren't using Chai, you would want to use superagent or event a library called [Request](https://github.com/request/request) directly instead.

> The original [pizza express](https://github.com/turingschool-examples/pizza-express) project uses Request. So feel free to check that out if you want to see a different way to implement things.

Now, we'll write a test that will send a request to the `/` endpoint on our server and verify that we did in fact receive a 200 and that we received html.

```js
  it('should return html successfully', function(done) {
    chai.request(app)
    .get('/')
    .end(function(err, res) {
      if (err) { done(err); }
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      done();
    });
  });
```

Okay, so what's going on here?

Recall that for asynchronous test maneuvers, we can use `done()` to let Mocha know when we're ready to move on.

In Node, it's common for callback functions to take an error object as their first parameter if anything went wrong so that you can deal with it. So, if there is an error, then we'll end with that error. Otherwise, we'll move on.

#### Quick Experiment

Change the code within your server to create an error. Run the test suite and watch it fail. Now, comment out the error handling we just added and watch it fail. Pay attention to the differences between the two error messages.

### Testing An API

