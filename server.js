const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Extreme Pizza Box';
app.locals.pizzas = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/api/v1/pizzas', (request, response) => {
  response.status(200).json(app.locals.pizzas);
});

app.get('/api/v1/pizza/:id', (request, response) => {
  const { id } = request.params;
  const pizza = app.locals.pizzas.find(p => p.id == id);
  if (!pizza) { return response.sendStatus(404); }
  response.status(200).json(pizza);
});

app.post('/api/v1/pizzas', (request, response) => {
  const pizza = request.body;
  app.locals.pizzas.push(pizza);
  response.status(200).json(pizza);
});

app.use(express.static(__dirname + '/public'));

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;