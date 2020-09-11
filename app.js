// ////////////////
// MODULES
// ////////////////

const express = require('express');
const mongoose = require('mongoose');
const dotEnv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const handlebars = require('handlebars');
const eHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const favicon = require('serve-favicon');

dotEnv.config();

// ////////////////
// ROUTES
// ////////////////

const chartRouter = require('./routes/charts');

// ////////////////
// INIT APP
// ////////////////
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.set('view engine', 'hbs');
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.engine('hbs', eHandlebars({
  layoutsDir: `${__dirname}/views/layouts`,
  extname: 'hbs',
  defaultLayout: 'chart',
  partialsDir: `${__dirname}/views/partials/`,
  allowProtoMethodsByDefault: true,
  allowProtoPropertiesByDefault: true,
  handlebars: allowInsecurePrototypeAccess(handlebars),
}));

mongoose.connect(process.env.DATABASEURL,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// ////////////////
// ROUTES
// ////////////////

if (process.env.NODE_ENV !== 'production') {
  const characterRouter = require('./routes/characters');
  const eventRouter = require('./routes/events');
  app.use(characterRouter);
  app.use(eventRouter);
}

app.use(chartRouter);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { layout: "chart", url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// ////////////////
// START APP
// ////////////////

if (process.env.NODE_ENV != 'production') {
  app.listen(3000, () => {
    console.log('Dark timeline testing server running on port 3000!');
  });
} else {
  app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log('Dark timeline production server running!');
  });
}
