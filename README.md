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
if (!module.parent) {
  http.createServer(app)
    .listen(port, () => {
      console.log(`Listening on port ${port}.`);
    });
}
```

If `server.js` is being run directly, then it has no parent and we should fire up the server. But, if it's being required, then the file requiring `server.js` is its parent and we should not spin up the server automatically.

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
  const assert = require('chai').assert;
  const app = require('../server');
```

Just to keep our spirits up, let's start with the simplest possible test.

```js
const assert = require('chai').assert;
const app = require('../server');

describe('Server', () => {

  it('should exist', () => {
    assert(app);
  });

});
```

Now, we'll want to start our server up before we run our tests. I don't want to worry about my testing version trying to use the same port as my development server. So, I'll pick another port that makes me happy. (You might also consider reading a port from a environment variable or passing one in as a command line argument. I decided not to in the name of not adding too much complexity to this tutorial.)

```js
before(done => {
  this.port = 9876;
  this.server = app.listen(this.port, (err, result) => {
    if (err) { return done(err); }
    done();
  });
});

after(() => {
  this.server.close();
});
```
