const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const cors = require('cors');

const errorHandlers = require('./handlers/errors');

require('./models/User');
require('./models/Post');

const user = require('./routes/user');
const auth = require('./routes/auth');
const post = require('./routes/post');

const app = express();

app.use(cors());

require('dotenv').config({ path: 'variables.env' });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(expressValidator());

app.use(passport.initialize());
require('./handlers/passport')(passport);

// app.use('/', (req, res) => {
//   res.send('Welcome');
// });

app.use('/api/auth/', auth);
app.use('/api/users/', user);
app.use('/api/posts/', post);

app.use(errorHandlers.notFound);
app.use(errorHandlers.handleErrors);

mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});