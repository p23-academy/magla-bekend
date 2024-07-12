const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/magla')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  })

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('disi bekend')
})

require('./users')(app)
require('./categories')(app)
require('./items')(app)
require('./orders')(app)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})