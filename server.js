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