const http = require('http');
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Extreme Pizza Box';

app.use(express.static(path.join(__dirname, '/public')));

const port = process.env.PORT || 3000;

if (!module.parent) {
  http.createServer(app)
    .listen(port, () => {
      console.log(`Listening on port ${port}.`);
    });
}

app.get('/', (request, response) => {
  response.sendfile(__dirname + '/public/index.html');
});

module.exports = app;