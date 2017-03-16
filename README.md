# Building and Unit Testing an Express Application

## Preamble

In this tutorial, we're going to build and test an Express application from the ground up — using a number of different testing strategies. The goal of the this tutorial is to get super deep into a very small set of things so that you understand how they work.

You can find the original version of this tutorial at [Pizza Express](https://github.com/turingschool-examples/pizza-express). Check out that tutorial to see a straight forward implementation and some different technologies being implemented. It's always good to see a lot of different ways to create a thing.

This is the _extreme_ version... meaning that we will have a few different branches and many different implementations. Things might get a little weird.

## Lessons & Branches

* [Master](https://github.com/rrgayhart/extreme-pizza-express) - has a base level implementation and instructions for how to start the repo from scratch (if you so choose).

## Getting Started from Scratch

First things, first: we need to make a directory, right?

```
  mkdir extreme-pizza-express
  cd extreme-pizza-express
```

And also initialize git

```
  git init
```

We know that we're building a Node application, so we can snag a base level Node specific `.gitignore` file from [the internet](https://github.com/github/gitignore/blob/master/Node.gitignore) and keep ourselves from commiting the node_modules folder.

```
  curl -0 https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore > .gitignore  
```

Let's get our `package.json` off to a good start as well.

```
npm init
```

This is how I chose to answer my questions, but you're an adult and you can make your own decisions.

```
name: (extreme-pizza-express)
version: (1.0.0)
description: A place to admire pizzas
entry point: (index.js) server.js
test command: 
git repository: https://github.com/turingschool-examples/extreme-pizza-express
keywords: express, pizza, yum, casserole
author: Romeeka Gayhart
license: (ISC) MIT
```

Let's also go ahead and install some dependencies that we'll need to get things rolling.

```
npm install express body-parser --save
```

### Creating a Little Server

In our `package.json`, we set the entry point to `server.js`. We'll need to create that file.

```
touch server.js
```

We'll get a basic server running using some code I stole from [the Express documentation](http://expressjs.com/starter/hello-world.html) and modified slightly to fit my tastes.

```js
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Extreme Pizza Box';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (request, response) => {
  response.sendfile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
```

In our `server.js`, we render `public/index.html`. We'll need to create that folder and file.

```
mkdir public
touch public/index.html
```

Fire up the server using `node server.js` and visit `http://localhost:3000/` to enjoy in the fruits of your copy and pasting labor.

### Adding BoilerPlate

Not super exciting.

Let's go ahead and wire up CSS, client-side js and boilerplate HTML.

```
touch public/scripts.js public/styles.css
```

Let's drop some boilerplate html in the `public/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="styles.css" />
    <title>Extreme Pizza Express</title>
  </head>
  <body>
    <h1>Pizza Express</h1>
  </body>
  <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
  <script src='scripts.js'></script>
</html>
```

### Linting

Finally, we wrote a little bit of code.. which means that we probably want to set up our linter!

I'm going to be using eslint for this project. First step, let's install eslint

```
  npm install eslint --save-dev
```

You can have eslint walk you through a set up

```
  eslint --init
```

I plan to just copy and paste a `.eslint.json` file that I like using on my own projects

```
  touch .eslint.json
```

In that file, I add the following content;

```json
{
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": 0,
        "indent": [2, 2],
        "linebreak-style": [2, "unix"],
        "quotes": [2, "single"],
        "semi": [2, "always"]
    }
}
```

The `env` options are particularly important to use. [Learn more here](http://eslint.org/docs/user-guide/configuring). You'll also notice that I disabled the `no-console` [rule](http://eslint.org/docs/rules/no-console).

I want to be able to run `eslint .` easily and also `eslint . --fix` so I'll add the following lines to my `package.json`

```
  "scripts": {
    "lint": "node_modules/.bin/eslint public/**.js lib/**.js **.js || true",
    "lintf": "node_modules/.bin/eslint public/**.js lib/**.js **.js  --fix || true"
  },
```

Now I can run my linter by just saying `npm run lint` or `npm run lintf`.

What do those arguments do? 

`node_modules/.bin/eslint`: allows me to use my locally installed version of eslint

`public/**.js lib/**.js **.js`: says lint any JS file in `public/` `lib/` or `/`

`|| true`: prevents those annoying errors that collect at the bottom of any script that npm runs when there is an error

`--fix`: allows eslint to auto-fix any errors that it can figure out how to fix (like add semi-colons)

Try removing some of those arguments and see what happens!