const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);

const mustache = require('mustache-express');
app.engine('html', mustache());
app.set('views', 'www');
app.set('view cache', false);

app.get('/', (req, res) => {
  res.render('index.html', {
    db: DB
  });
});

const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({
  extended: false
});
app.post('/', parser, (req, res) => {
  console.log('Prisli data', req.body);
  let {
    name,
    surname
  } = req.body;
  if (name.length > 0 && surname.length > 0) DB.push({
    name,
    surname
  });

  res.redirect('/');
});

let DB = [{
  name: 'Janko',
  surname: 'Hrasko'
}];

app.use('/', express.static('www'));




server.listen(9000, () => {
  console.log('Listen on port 9000');
});