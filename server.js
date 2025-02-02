const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json())
app.use(express.urlencoded())
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

app.post('/api/users', async function(req, res) {
  let newUser = new User({username: req.body.username, count: 0});
  await newUser.save((error, savedUser) => {
    if (!error) {
      let responseObject = {}
      responseObject['username'] = savedUser.username
      responseObject['_id'] = savedUser._id
      res.json(responseObject)
    }
  });
});

app.get('/api/users', async function(req, res) {
  const response = await User.find();
  res.json(response);
})
app.post('/api/users/:_id/exercises', async function(req, res) {
  var dateVar = new Date;
  if (!req.body.date) {
  dateVar = new Date(Date.now());
} else {
  dateVar = new Date(req.body.date)
}
  dateVar = dateVar.toDateString();
console.log(dateVar)
// Create a new session
let newSession = new Session({
  description: req.body.description,
  duration: req.body.duration,
  date: dateVar
})

try {
  await User.findByIdAndUpdate(req.params._id, {$inc:{count: 1}, $push: {log: newSession}}, {new: 1}, (error, updatedUser) => {
    if (error) return res.status(500);
    let responseObject = {}
    responseObject['username'] = updatedUser.username
    responseObject['description'] = newSession.description
    responseObject['duration'] = newSession.duration
    responseObject['date'] = newSession.date
    responseObject['_id'] = updatedUser._id
    res.json(responseObject);
})

} catch(error) {
  console.log(error);
}

});

app.get('/api/users/:_id/logs', async function(req, res) {
  const id = req.params._id;
  const user = await User.find({_id: id})
  res.json(user)
  console.log(user)

})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
