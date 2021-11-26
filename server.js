const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const exerciseSessionSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String
})
const userSchema = new mongoose.Schema({
username: { type: String, required: true },
count: 0,
log: [exerciseSessionSchema]
});

const Session = mongoose.model('Session', exerciseSessionSchema)
const User = mongoose.model('User', userSchema)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
