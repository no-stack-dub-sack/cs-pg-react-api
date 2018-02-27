const api               = require('./src/api')
const bodyParser        = require('body-parser')
const cors              = require('cors')
const dotenv            = require('dotenv')
const express           = require('express')
const mongoose          = require('mongoose')
dotenv.config()

// some setup stuff
const app = express(),
      production = process.env.NODE_ENV === 'production',
      PORT = production ? process.env.PORT : 5000,
      MONGO_URI = production
        ? process.env.MONGO_PROD_URI
        : process.env.MONGO_DEV_URI

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true })
  .then(() => console.log('Mongoose connected'))
  .catch(err => console.error('Error connecting to MongoDB'))

// server stuff
app.use(cors())
app.use(bodyParser.json())
app.post('/insert-code', api.insertCode)
app.get('/get-code/:api_key/:id', api.getCode)
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'))
app.listen(PORT, () => {
  console.log(`CS-PG-React API listening on port ${PORT}!`)
});
