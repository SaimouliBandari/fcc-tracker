require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const testdate = require('./validation').checkDate;

var uri = process.env.MONGO_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(cors())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


let exerciseSessionSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String,
  _id : false
})

let userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [exerciseSessionSchema]
})

let Session = mongoose.model('Session', exerciseSessionSchema)
let User = mongoose.model('User', userSchema)

app.post('/api/users', bodyParser.urlencoded({ extended: false }), (request, response) => {
  let newUser = new User({username: request.body.username})
  newUser.save((error, savedUser) => {
    if(!error){
      let responseObject = {}
      responseObject['username'] = savedUser.username
      responseObject['_id'] = savedUser.id
      response.json(responseObject)
    }
  })
})

app.get('/api/users', (request, response) => {
  
  User.find({}, {_id: 1, username: 1, __v: 1}, (error, arrayOfUsers) => {
    if(!error){
      response.json(arrayOfUsers)
    }
  })
  
})

app.post('/api/users/:_id/exercises', bodyParser.urlencoded({ extended: false }) , (request, response) => {
  
    //console.log(request.body);
  let newSession = new Session({
    description: request.body.description,
    duration: parseInt(request.body.duration),
    date: request.body.date
  })
  
  
    //console.log(testdate(newSession.date));
  
  if(testdate(newSession.date)){
    let date = new Date(newSession.date).toISOString();
    let isValidDate = Date.parse(date);
    console.log(new Date(isValidDate).toDateString());
    if(isNaN(isValidDate)){
        newSession.date = new Date().toDateString();
    }else{
        newSession.date = new Date(newSession.date).toDateString();
    }
  }else{
    newSession.date = new Date().toDateString();
  }
  
  User.findByIdAndUpdate(
    request.params,
    {$push : {log: newSession}},
    {new: true},
    (error, updatedUser)=> {
      if(!error){
        let responseObject = {}
        
        responseObject['username'] = updatedUser.username
        responseObject['description'] = newSession.description
        responseObject['duration'] = newSession.duration
        responseObject['date'] = newSession.date
        responseObject['_id'] = updatedUser.id
       
        
        response.json(responseObject)
      }
    }
  )
})

app.get('/api/users/:_id/logs', (request, response) => {
  
  User.findById({_id : request.params._id}, (error, result) => {
    // console.log(result);
    // console.log(new Date(result.log[0].date).getTime());
    if(!error){
      let responseObject = result
      
      if(request.query.from || request.query.to){
        
        let fromDate = new Date(0).getTime();
        let toDate = new Date().getTime();
        
        if(request.query.from){
          fromDate = new Date(request.query.from).getTime();
        }

        if(request.query.to){
          toDate = new Date(request.query.to).getTime();
        }
        
        console.log(fromDate);
        console.log(toDate);

        responseObject.log = responseObject.log.filter((session) => {
          let sessionDate = new Date(session.date).getTime();

          console.log('sessiontime -> ' + sessionDate);
          
          if(sessionDate >= fromDate && sessionDate <= toDate){
            //session.date = new Date(sessionDate).toDateString();
            return session;
          }
          
        })
        
      }
      
      if(request.query.limit){
        responseObject.log = responseObject.log.slice(0, request.query.limit)
      }

      responseObject.log = responseObject.log.filter((session) => {
        let sessionDate = session.date;
        console.log(sessionDate);
       //   session.date = new Date(sessionDate).toDateString();
      //  console.log(responseObject.date);
          return session;
      })

      responseObject = responseObject.toJSON()
      responseObject['count'] = result.log.length

      response.json({
        username: responseObject.username,
        count: responseObject.count,
        _id: responseObject._id,
        log: responseObject.log
      })
       // response.json(responseObject)
    }
  })
  
})